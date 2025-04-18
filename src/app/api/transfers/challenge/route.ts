import { NextResponse } from "next/server";
import { createTransferChallenge } from "@/actions/non-custodial/delegated-wallets";
import { login } from "@/actions/non-custodial/delegated-user";
import { DelegatedLoginResponse } from "@dfns/sdk/generated/auth";

export const POST = async () => {
  try {
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
    const challenge = await createTransferChallenge(
      token,
      fromWalletId,
      toAddress,
      paddedAmount,
      memo
    );
    return NextResponse.json(challenge);
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
  }
};
