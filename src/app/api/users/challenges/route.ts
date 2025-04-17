import { NextRequest, NextResponse } from "next/server";
import { createRegistrationChallenge } from "@/actions/non-custodial/delegated-user";

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();
    const email = body.email as string;
    const challenge = await createRegistrationChallenge(email);
    return NextResponse.json(challenge);
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
  }
};
