import { NextRequest, NextResponse } from "next/server";
import { Fido2Attestation } from "@dfns/sdk";
import { completeRegistration } from "@/actions/non-custodial/delegated-user";

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();
    const attestation = body.attestation as Fido2Attestation;
    const tempAuthToken = body.tempAuthToken as string;

    const registration = await completeRegistration(attestation, tempAuthToken);

    return NextResponse.json(registration);
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
  }
};
