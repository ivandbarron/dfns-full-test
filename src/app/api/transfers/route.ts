import { NextRequest, NextResponse } from "next/server";
import { completeTransfer } from "@/actions/non-custodial/delegated-wallets";
import { DelegatedLoginResponse } from "@dfns/sdk/generated/auth";
import { Fido2Assertion } from "@dfns/sdk";
import { login } from "@/actions/non-custodial/delegated-user";

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();
    const assertion = body.assertion as Fido2Assertion;
    const challengeIdentifier = body.challengeIdentifier as string;

    const response: DelegatedLoginResponse | undefined = await login(
      "david@iphone.com"
    );
    if (!response) {
      console.error("Login failed");
      return;
    }
    const token = response.token;
    const fromWalletId = "wa-8a6f7-l5uo9-jbba5o8tqt09ajn"; // david@iphone.com SolanaDevnet wallet id
    const toAddress = "FyPefdCQNR3eD8grVpEGyizkC2dSkpSsrdArYcvtC31U"; // mac2 SolanaDevnet wallet address
    const amount = "0.074";
    const decimals = 9; // Solana has 9 decimals
    const paddedAmount = (Number(amount) * 10 ** decimals)
      .toString()
      .slice(0, decimals);
    const memo = "Test transfer from delegated wallet to delegated wallet";

    await completeTransfer(
      token,
      assertion,
      challengeIdentifier,
      fromWalletId,
      toAddress,
      paddedAmount,
      memo
    );

    return NextResponse.json({ message: "Transfer completed" });
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
  }
};
