import { NextRequest, NextResponse } from "next/server";
import { createDfnsApiClient } from "@/lib/dfns/api-client";
import { Fido2Attestation } from "@dfns/sdk";

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();
    const attestation = body.attestation as Fido2Attestation;
    const tempAuthToken = body.tempAuthToken as string;

    const serverClient = createDfnsApiClient(tempAuthToken);

    const registration = await serverClient.auth.registerEndUser({
      body: {
        firstFactorCredential: attestation,
        wallets: [],
      },
    });

    // Esta respuesta hay que almacenarla ya que alli es donde viene el user id
    console.log("Registration completed");
    console.debug(JSON.stringify(registration, null, 2));

    return NextResponse.json(registration);
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
  }
};
