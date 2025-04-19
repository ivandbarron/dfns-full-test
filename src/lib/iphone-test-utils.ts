import { DelegatedLoginResponse } from "@dfns/sdk/generated/auth";
import { NextRequest } from "next/server";
import { login } from "@/actions/non-custodial/delegated-user";
import { Fido2Assertion } from "@dfns/sdk";

export const getRequestData = async (request: NextRequest) => {
  const body = await request.json();
  let assertion: Fido2Assertion | undefined = undefined;
  let challengeIdentifier: string | undefined = undefined;
  if (body.assertion) {
    assertion = body.assertion as Fido2Assertion;
  }
  if (body.challengeIdentifier) {
    challengeIdentifier = body.challengeIdentifier as string;
  }

  const response: DelegatedLoginResponse | undefined = await login(
    "david@iphone.com"
  );
  if (!response) {
    console.error("Login failed");
    throw new Error("Login failed");
  }
  const token = response.token;
  const fromWalletId = "wa-8a6f7-l5uo9-jbba5o8tqt09ajn"; // david@iphone.com SolanaDevnet wallet id
  const toAddress = "FyPefdCQNR3eD8grVpEGyizkC2dSkpSsrdArYcvtC31U"; // mac2 SolanaDevnet wallet address
  const amount = "0.074";
  const memo =
    "Test transfer from delegated wallet to delegated wallet | project example :::: task 1";

  return {
    token,
    fromWalletId,
    toAddress,
    amount,
    memo,
    assertion,
    challengeIdentifier,
  };
};
