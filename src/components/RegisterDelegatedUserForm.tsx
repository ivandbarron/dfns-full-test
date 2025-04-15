"use client";
import {
  createRegistrationChallenge,
  completeRegistration,
} from "@/actions/non-custodial/delegated-user";
import {
  CreateDelegatedRegistrationChallengeResponse,
  RegisterEndUserResponse,
} from "@dfns/sdk/generated/auth";
import { WebAuthnSigner } from "@dfns/sdk-browser";
import { Fido2Attestation } from "@dfns/sdk";
import { useUserStore } from "@/stores/userStore";

const RegisterDelegatedUserForm = () => {
  const { user, setUser } = useUserStore();

  const handleRegisterUserAction = async (formData: FormData) => {
    const username = formData.get("username") as string;

    // Create challenge for user federated registraion
    const challenge: CreateDelegatedRegistrationChallengeResponse | undefined =
      await createRegistrationChallenge(username);
    if (!challenge) {
      alert("Failed to register user: challenge creation failed");
      return;
    }
    const tempAuthToken: string = challenge.temporaryAuthenticationToken;

    // This is somekind of standard implementation for secure authentication on the browser
    const webAuthn = new WebAuthnSigner({
      relyingParty: {
        id: process.env.NEXT_PUBLIC_PASSKEYS_RELYING_PARTY_ID!,
        name: process.env.NEXT_PUBLIC_PASSKEYS_RELYING_PARTY_NAME!,
      },
    });

    const attestation: Fido2Attestation = await webAuthn.create(challenge);

    // Complete the registration
    const response: RegisterEndUserResponse | undefined =
      await completeRegistration(attestation, tempAuthToken);
    if (!response) {
      alert("Failed to register user: registration failed");
      return;
    }
    setUser(response);
  };

  return (
    <form action={handleRegisterUserAction}>
      <input type="text" placeholder="Email" name="username" />
      <button>Register new user</button>
      {!!user && (
        <div>
          <h1 className="text-2xl font-bold">User registered</h1>
          <pre className="p-4 drop-shadow-lg mt-2 overflow-x-scroll">
            {user.user.id}
          </pre>
        </div>
      )}
    </form>
  );
};

export default RegisterDelegatedUserForm;
