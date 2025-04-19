import { NextRequest, NextResponse } from "next/server";
import { completeTransfer } from "@/actions/non-custodial/delegated-wallets";
import { getRequestData } from "@/lib/iphone-test-utils";

export const POST = async (request: NextRequest) => {
  try {
    const {
      token,
      fromWalletId,
      toAddress,
      amount,
      memo,
      assertion,
      challengeIdentifier,
    } = await getRequestData(request);

    if (!assertion || !challengeIdentifier) {
      console.error("Assertion or challengeIdentifier is missing");
      return NextResponse.json(
        { error: "Assertion or challengeIdentifier is missing" },
        { status: 400 }
      );
    }

    await completeTransfer(
      token,
      assertion,
      challengeIdentifier,
      fromWalletId,
      toAddress,
      amount,
      memo
    );

    return NextResponse.json({ message: "Transfer completed" });
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
  }
};
