"use server";
import { createDfnsApiClient } from "@/lib/dfns/api-client";
import { Fido2Attestation } from "@dfns/sdk";

export const createRegistrationChallenge = async (username: string) => {
  try {
    const serverClient = createDfnsApiClient();
    const challenge =
      await serverClient.auth.createDelegatedRegistrationChallenge({
        body: {
          kind: "EndUser",
          email: username,
        },
      });
    console.log("Challenge created");
    console.debug(challenge);
    return challenge;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
  }
};

export const completeRegistration = async (
  attestation: Fido2Attestation,
  tempAuthToken: string
) => {
  try {
    const serverClient = createDfnsApiClient(tempAuthToken);

    const registration = await serverClient.auth.registerEndUser({
      body: {
        firstFactorCredential: attestation,
        wallets: [
          {
            network: "PolygonAmoy",
            name: "Personal Wallet",
          },
        ],
      },
    });

    // Esta respuesta hay que almacenarla ya que alli es donde viene el user id
    console.log("Registration completed");
    console.debug(JSON.stringify(registration, null, 2));

    return registration;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
  }
};

export const login = async (username: string) => {
  try {
    const serverClient = createDfnsApiClient();
    const loginResponse = await serverClient.auth.delegatedLogin({
      body: { username },
    });
    console.log("Login response");
    console.debug(loginResponse);

    return loginResponse;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
  }
};
