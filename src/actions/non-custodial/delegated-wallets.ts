"use server";
import {
  createDelegatedDfnsApiClient,
  createDfnsApiClient,
} from "@/lib/dfns/api-client";
import { Fido2Assertion, SignUserActionChallengeRequest } from "@dfns/sdk";
import {
  CreateWalletBody,
  CreateWalletRequest,
  CreateWalletResponse,
  GetWalletAssetsResponse,
  TransferAssetResponse,
} from "@dfns/sdk/generated/wallets";

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

export const createTransferChallenge = async (
  authToken: string,
  fromWalletId: string,
  toAddress: string,
  amount: string,
  memo: string | undefined = undefined
) => {
  try {
    const delegatedServerClient = createDelegatedDfnsApiClient(authToken);
    // from "0.0006" to "600000000000000"
    //const paddedAmount = (Number(amount) * 10 ** 18).toString().slice(0, 18);
    const challenge = await delegatedServerClient.wallets.transferAssetInit({
      walletId: fromWalletId,
      body: {
        to: toAddress,
        amount: amount,
        kind: "Native",
        memo,
      },
    });

    console.log("Transfer challenge created");
    console.debug(challenge);
    return challenge;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
  }
};

export const completeTransfer = async (
  authToken: string,
  assertion: Fido2Assertion,
  challengeIdentifier: string,
  fromWalletId: string,
  toAddress: string,
  amount: string,
  memo: string | undefined = undefined
) => {
  try {
    const delegatedServerClient = createDelegatedDfnsApiClient(authToken);
    const signedChallenge: SignUserActionChallengeRequest = {
      challengeIdentifier,
      firstFactor: assertion,
    };

    // amount: "0.0006"
    // error: Expected big integer string

    // rationale: because previously, in order to get the balance, we had to divide the balance by 10 ** decimals
    // so now we have to multiply the amount by 10 ** decimals
    // so the new amount is: amount * 10 ** decimals
    // and the new amount is: amount * 10 ** 18
    //const paddedAmount = (Number(amount) * 10 ** 18).toString().slice(0, 18);

    const response: TransferAssetResponse =
      await delegatedServerClient.wallets.transferAssetComplete(
        {
          walletId: fromWalletId,
          body: {
            to: toAddress,
            amount: amount,
            kind: "Native",
            memo,
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
