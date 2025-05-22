import { NextRequest, NextResponse } from "next/server";
import { completeTransfer } from "@/actions/non-custodial/delegated-wallets";
import { Fido2Assertion } from "@dfns/sdk";
import { getRequestData } from "@/lib/iphone-test-utils";

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { fromWalletId, toAddress, amount } = await getRequestData();

    const token = body.token as string;
    //const serializedTxHex = body.serializedTxHex as string;
    const assertion = body.assertion as Fido2Assertion;
    const challengeIdentifier = body.challengeIdentifier as string;

    await completeTransfer(
      token,
      assertion,
      challengeIdentifier,
      fromWalletId,
      toAddress,
      amount
    );

    return NextResponse.json({ message: "Transfer completed" });
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
  }
};
