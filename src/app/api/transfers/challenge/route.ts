import { NextRequest, NextResponse } from "next/server";
import { createTransferChallenge } from "@/actions/non-custodial/delegated-wallets";
import { getRequestData } from "@/lib/iphone-test-utils";

export const POST = async (request: NextRequest) => {
  try {
    const { token, fromWalletId, toAddress, amount, memo } =
      await getRequestData(request);
    const challenge = await createTransferChallenge(
      token,
      fromWalletId,
      toAddress,
      amount,
      memo
    );
    return NextResponse.json(challenge);
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
  }
};
