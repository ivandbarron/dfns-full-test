"use client";
import {
  createWalletCreationChallenge,
  completeCreation,
} from "@/actions/non-custodial/delegated-wallets";
import { useAuthStore } from "@/stores/authStore";
import { UserActionChallenge } from "@dfns/sdk";
import { WebAuthnSigner } from "@dfns/sdk-browser";

const CreateNonCustodialWalletForm = () => {
  const { token } = useAuthStore();

  const handleCreateNCWAction = async (formData: FormData) => {
    if (!token) {
      alert("You need to be logged in to create a wallet");
      return;
    }

    const walletName = formData.get("walletName") as string;
    if (!walletName) {
      alert("Wallet name is required");
      return;
    }

    const challenge: UserActionChallenge | undefined =
      await createWalletCreationChallenge(token, walletName);

    if (!challenge) {
      alert("Failed to create wallet: challenge creation failed");
      return;
    }

    const webAuthn = new WebAuthnSigner({
      relyingParty: {
        id: process.env.NEXT_PUBLIC_PASSKEYS_RELYING_PARTY_ID!,
        name: process.env.NEXT_PUBLIC_PASSKEYS_RELYING_PARTY_NAME!,
      },
    });

    const assertion = await webAuthn.sign(challenge);

    await completeCreation(
      token,
      assertion,
      challenge.challengeIdentifier,
      walletName
    );

    alert("Wallet created, reload the page to see it");
  };

  return (
    <form action={handleCreateNCWAction}>
      <input type="text" placeholder="Wallet Name" name="walletName" />
      <button type="submit">Create New Non Custodial Wallet</button>
    </form>
  );
};

export default CreateNonCustodialWalletForm;
