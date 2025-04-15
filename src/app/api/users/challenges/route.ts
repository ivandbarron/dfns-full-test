import { NextRequest, NextResponse } from "next/server";
import { createDfnsApiClient } from "@/lib/dfns/api-client";

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();
    const email = body.email as string;
    const serverClient = createDfnsApiClient();
    const challenge =
      await serverClient.auth.createDelegatedRegistrationChallenge({
        body: {
          kind: "EndUser",
          email,
        },
      });
    console.log("Challenge created");
    console.debug(challenge);
    return NextResponse.json(challenge);
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
  }
};
