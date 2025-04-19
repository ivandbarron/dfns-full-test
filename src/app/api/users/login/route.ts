import { NextRequest, NextResponse } from "next/server";
import { login } from "@/actions/non-custodial/delegated-user";
import { DelegatedLoginResponse } from "@dfns/sdk/generated/auth";

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();
    const email = body.email as string;

    const response: DelegatedLoginResponse | undefined = await login(email);

    if (!response) {
      console.error("Login failed");
      throw new Error("Login failed");
    }
    return NextResponse.json(response);
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
  }
};
