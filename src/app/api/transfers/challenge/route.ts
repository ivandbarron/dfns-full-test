import { NextRequest, NextResponse } from "next/server";
import { createTransferChallenge } from "@/actions/non-custodial/delegated-wallets";
import { getRequestData } from "@/lib/iphone-test-utils";

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();
    const token = body.token as string;

    const { fromWalletId, toAddress, amount } = await getRequestData();

    const { challenge, serializedTxHex } = await createTransferChallenge(
      token,
      fromWalletId,
      toAddress,
      amount
    );
    return NextResponse.json({
      challenge,
      serializedTxHex,
    });
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
  }
};
