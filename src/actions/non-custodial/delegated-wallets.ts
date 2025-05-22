"use server";
import {
  createDelegatedDfnsApiClient,
  createDfnsApiClient,
} from "@/lib/dfns/api-client";
import {
  Fido2Assertion,
  SignUserActionChallengeRequest,
  UserActionChallengeResponse,
} from "@dfns/sdk";
import {
  CreateWalletBody,
  CreateWalletRequest,
  CreateWalletResponse,
  GetWalletAssetsResponse,
  TransferAssetResponse,
  GetWalletResponse,
} from "@dfns/sdk/generated/wallets";
import admin from "@/lib/firebase/firebaseMessaging";

import {
  Connection,
  SystemProgram,
  VersionedTransaction,
  clusterApiUrl,
  PublicKey,
  TransactionMessage,
} from "@solana/web3.js";
import { MEMO_PROGRAM_ID } from "@solana/spl-memo";

export async function sendPushNotification({
  fcmToken,
  title,
  body,
  data,
}: {
  fcmToken: string;
  title: string;
  body: string;
  data?: Record<string, string>;
}) {
  try {
    const message = {
      token: fcmToken,
      notification: {
        title,
        body,
      },
      data: data || {},
    };

    const response = await admin.messaging().send(message);
    console.log("✅ Notificación enviada con ID:", response);
  } catch (error) {
    console.error("❌ Error enviando notificación:", error);
  }
}

export const list = async (authToken: string) => {
  try {
    const delegatedServerClient = createDelegatedDfnsApiClient(authToken);
    const wallets = await delegatedServerClient.wallets.listWallets();
    console.log("Wallets");
    console.debug(wallets);
    return wallets;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
  }
};

export const createWalletCreationChallenge = async (
  authToken: string,
  walletName: string
) => {
  try {
    const delegatedServerClient = createDelegatedDfnsApiClient(authToken);

    const challenge = await delegatedServerClient.wallets.createWalletInit({
      body: { network: "SolanaDevnet", name: walletName } as CreateWalletBody,
    });

    console.log("Challenge created");
    console.debug(challenge);
    return challenge;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
  }
};

export const completeCreation = async (
  authToken: string,
  assertion: Fido2Assertion,
  challengeIdentifier: string,
  walletName: string
) => {
  try {
    const delegatedServerClient = createDelegatedDfnsApiClient(authToken);

    const request: CreateWalletRequest = {
      body: { network: "SolanaDevnet", name: walletName } as CreateWalletBody,
    };
    const signedChallenge: SignUserActionChallengeRequest = {
      challengeIdentifier,
      firstFactor: assertion,
    };

    const response: CreateWalletResponse =
      await delegatedServerClient.wallets.createWalletComplete(
        request,
        signedChallenge
      );

    console.log("Wallet created");
    console.debug(response);
    return response;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
  }
};

export const getBalance = async (authToken: string, walletId: string) => {
  try {
    const delegatedServerClient = createDelegatedDfnsApiClient(authToken);
    const assets: GetWalletAssetsResponse =
      await delegatedServerClient.wallets.getWalletAssets({
        walletId,
      });
    console.log("Assets");
    console.debug(assets);
    if (assets.assets.length === 0) {
      console.log("No assets found");
      return -1;
    }

    const decimals = assets.assets[0].decimals;
    const balance = assets.assets[0].balance;
    // after the assignments, these are the values:
    // decimals: 18
    // balance: 1200000000000000'
    // but the function must return 0.0012
    // so the function must return balance / 10 ** decimals
    return Number(balance) / 10 ** decimals;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
  }
};

const getPaddedAmount = (amount: string, decimals: number) => {
  return (Number(amount) * 10 ** decimals).toString().slice(0, decimals);
};

const createSerializedTransactionMessage = async (
  fromAddress: string,
  toAddress: string,
  amount: string,
  memo: string
) => {
  const fromPubkey = new PublicKey(fromAddress);
  const toPubkey = new PublicKey(toAddress);
  const lamports = BigInt(Number(amount) * 10 ** 9);

  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  const memoInstruction = {
    programId: MEMO_PROGRAM_ID,
    keys: [],
    data: Buffer.from(memo, "utf8"),
  };

  const transferInstruction = SystemProgram.transfer({
    fromPubkey,
    toPubkey,
    lamports,
  });

  const latestBlockhash = await connection.getLatestBlockhash();

  const message = new TransactionMessage({
    payerKey: fromPubkey,
    recentBlockhash: latestBlockhash.blockhash,
    instructions: [memoInstruction, transferInstruction],
  }).compileToV0Message();

  const tx = new VersionedTransaction(message);

  const serializedTxHex = `0x${Buffer.from(tx.serialize()).toString("hex")}`;

  return serializedTxHex;
};

type TCreateTransferChallengeResponse = {
  challenge: UserActionChallengeResponse;
  serializedTxHex: string | undefined;
};

export const createTransferChallenge = async (
  authToken: string,
  fromWalletId: string,
  toAddress: string,
  amount: string,
  memo: string | undefined = undefined
): Promise<TCreateTransferChallengeResponse> => {
  try {
    if (!memo) {
      const delegatedServerClient = createDelegatedDfnsApiClient(authToken);
      const challenge = await delegatedServerClient.wallets.transferAssetInit({
        walletId: fromWalletId,
        body: {
          to: toAddress,
          amount: getPaddedAmount(amount, 9),
          kind: "Native",
        },
      });

      console.log("Transfer challenge created");
      console.debug(challenge);
      return { challenge, serializedTxHex: undefined };
    } else {
      const delegatedServerClient = createDelegatedDfnsApiClient(authToken);
      const wallet: GetWalletResponse =
        await delegatedServerClient.wallets.getWallet({
          walletId: fromWalletId,
        });

      const serializedTxHex = await createSerializedTransactionMessage(
        wallet.address!,
        toAddress,
        amount,
        memo
      );

      const challenge =
        await delegatedServerClient.wallets.broadcastTransactionInit({
          walletId: fromWalletId,
          body: {
            kind: "Transaction",
            transaction: serializedTxHex,
          },
        });

      return {
        challenge,
        serializedTxHex,
      };
    }
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    throw error;
  }
};

export const completeTransferTx = async (
  authToken: string,
  fromWalletId: string,
  serializedTxHex: string,
  assertion: Fido2Assertion,
  challengeIdentifier: string
) => {
  const delegatedServerClient = createDelegatedDfnsApiClient(authToken);

  const signedChallenge: SignUserActionChallengeRequest = {
    challengeIdentifier,
    firstFactor: assertion,
  };

  const response =
    await delegatedServerClient.wallets.broadcastTransactionComplete(
      {
        walletId: fromWalletId,
        body: {
          kind: "Transaction",
          transaction: serializedTxHex,
        },
      },
      signedChallenge
    );

  console.log("Transfer completed");
  console.log(JSON.stringify(response, null, 2));
};

export const completeTransfer = async (
  authToken: string,
  assertion: Fido2Assertion,
  challengeIdentifier: string,
  fromWalletId: string,
  toAddress: string,
  amount: string
) => {
  try {
    const delegatedServerClient = createDelegatedDfnsApiClient(authToken);
    const signedChallenge: SignUserActionChallengeRequest = {
      challengeIdentifier,
      firstFactor: assertion,
    };

    const response: TransferAssetResponse =
      await delegatedServerClient.wallets.transferAssetComplete(
        {
          walletId: fromWalletId,
          body: {
            to: toAddress,
            amount: getPaddedAmount(amount, 9),
            kind: "Native",
          },
        },
        signedChallenge
      );

    console.log("Transfer completed");
    console.log(JSON.stringify(response, null, 2));
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
  }
};

export const createDelegatedNCW = async (
  userId: string,
  walletName: string,
  network: string
) => {
  try {
    const serverClient = createDfnsApiClient();
    const response = await serverClient.wallets.createWallet({
      body: {
        network,
        name: walletName,
        delegateTo: userId,
      } as CreateWalletBody,
    });
    console.log("Delegated wallet created");
    console.debug(response);
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
  }
};

export const sendTransactionNotification = async (fcmToken: string) => {
  try {
    // We will need to get the fcm from the user, somehow,
    // also before sending the message we need to create a kind
    // of notification in the database, so we can track it
    // and send the user the notification id, so we can carry the
    // user in the mobile to the notification screen and the
    // notification then will be marked as read and the user
    // will be taken to the appropriate screen

    sendPushNotification({
      fcmToken,
      title: "Transaction request in process",
      body: "You need to sign the requested transaction.",
      data: {
        notificationID: "...some id from the db...",
      },
    });
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
  }
};
