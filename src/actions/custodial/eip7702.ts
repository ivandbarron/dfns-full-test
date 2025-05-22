"use server";
import { createWalletClient, erc20Abi, http } from "viem";

import { eip7702Actions } from "viem/experimental";
//import { walletActions } from "viem";

import { encodeFunctionData, parseEther } from "viem";
import { holesky } from "viem/chains";
import { Signature } from "ethers";

import { DfnsApiClient } from "@dfns/sdk";
import { AsymmetricKeySigner } from "@dfns/sdk-keysigner";
import { DfnsWallet } from "@dfns/lib-viem";
import { toAccount } from "viem/accounts";
import {
  getPayloadAndDataToSign,
  MetaTransaction,
  multiSendAbi,
} from "@/lib/eip7702/accountContract";

const pectra = holesky;
const tokenAddress = "0xF56636F7eD43068BEbe9D5Dc7486e70D10bCa5ac";
const contractAddress = "0x18655A180a4F954BE49E2A5f84b19a7D2101020f";

const sponsorWalletId = "wa-2nn66-crnfh-93f8969bjoujh0m0";
const sourceWalletId = "wa-1gejm-fv3s2-96rrmkpsfehttkoh";
const destinationAddress = "0xd7e0f61486d85db239c6758bf704f357b6ba169b";

const initDfnsWallet = (walletId: string) => {
  const signer = new AsymmetricKeySigner({
    credId: process.env.DFNS_CRED_ID!,
    privateKey: process.env.DFNS_PRIVATE_KEY!,
  });

  const dfnsClient = new DfnsApiClient({
    appId: process.env.DFNS_APP_ID!,
    authToken: process.env.DFNS_AUTH_TOKEN!,
    baseUrl: process.env.DFNS_API_URL!,
    signer,
  });

  const wallet = DfnsWallet.init({ walletId, dfnsClient });

  // Right now we do not support signing set code transaction type, so we
  // pretend it is not an EVM blockchain to sign the hash of the serialized transaction
  //(wallet as any).metadata.boundToEvmNetwork = false

  return wallet;
};

export const transfer = async () => {
  // The sponsor wallet will pay for the gas
  const sponsorWallet: DfnsWallet = await initDfnsWallet(sponsorWalletId);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (sponsorWallet as any).metadata.boundToEvmNetwork = false;

  const sponsorWalletClient = createWalletClient({
    account: toAccount(sponsorWallet),
    chain: pectra,
    transport: http(),
  }).extend((client) => eip7702Actions(client)); // UPDATED

  // The account wallet in this example will transfer some ERC20 without paying gas
  const accountWallet: DfnsWallet = await initDfnsWallet(sourceWalletId);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (accountWallet as any).metadata.boundToEvmNetwork = false;

  const accountWalletClient = createWalletClient({
    account: toAccount(accountWallet),
    chain: pectra,
    transport: http(),
  }).extend((client) => eip7702Actions(client)); // UPDATED

  // UPDATED
  const authorization = await accountWalletClient.signAuthorization({
    contractAddress,
    executor: sponsorWalletClient.account.address,
  });

  // This is what we want the account to do, make a transfer of 0.5 token to the address
  const transactions: MetaTransaction[] = [
    {
      to: tokenAddress,
      value: parseEther("0"),
      data: encodeFunctionData({
        abi: erc20Abi,
        functionName: "transfer",
        args: [destinationAddress, parseEther("0.5")],
      }),
      operation: 0,
    },
  ];
  console.log("Transactions created");

  // This is the nonce from the smart contract, different from the EOA account nonce
  const nonce: number = 0;

  // We retrieve the data to sign and the encoded transaction
  const { dataToSign, encodedTx } = getPayloadAndDataToSign(
    accountWalletClient.account.address,
    transactions,
    nonce,
    pectra.id
  );
  console.log("Payload and data to sign retrieved");

  // Generate the signature
  const signatureResult = await accountWalletClient.signTypedData(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dataToSign as any
  );
  console.log("Signature generated");
  const signature = Signature.from(signatureResult);
  console.log("Signature converted");

  // This transaction is a set code transaction:
  // the `authorizationList` field will point the EOA to a smart contract address and change its behaviour
  // it then contain a normal smart contract call:
  // the smart contract address is the EOA account address (now pointing to a real 'contract')
  // We pass the encoded transactions and the signature to the smart contract that will verify
  // and execute them in the context of the EOA.
  //
  // In this demo an ERC20 transfer will be done from the account address, but the gas will be payed by the sponsor
  const hash = await sponsorWalletClient.sendTransaction({
    authorizationList: [authorization],
    data: encodeFunctionData({
      abi: multiSendAbi,
      functionName: "multiSend",
      args: [encodedTx, signature.r, signature.yParityAndS],
    }),
    to: accountWalletClient.account.address,
    value: parseEther("0"),
  });
  console.log("Transaction sent");
  console.log("Transaction hash: ", hash);
};
