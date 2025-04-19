"use client";
import { useAuthStore } from "@/stores/authStore";
import {
  createTransferChallenge,
  completeTransfer,
} from "@/actions/non-custodial/delegated-wallets";
import { WebAuthnSigner } from "@dfns/sdk-browser";

const NonCustodialWalletTransferForm = () => {
  const { token } = useAuthStore();

  const handleDoTransferAction = async (formData: FormData) => {
    if (!token) {
      alert("You must be logged in to transfer");
      return;
    }

    const fromWalletId = formData.get("fromWalletId") as string;
    const toAddress = formData.get("toAddress") as string;
    const amount = formData.get("amount") as string;

    const { challenge } = await createTransferChallenge(
      token,
      fromWalletId,
      toAddress,
      amount
    );

    if (!challenge) {
      alert("Failed to create transaction: challenge creation failed");
      return;
    }

    const webAuthn = new WebAuthnSigner({
      relyingParty: {
        id: process.env.NEXT_PUBLIC_PASSKEYS_RELYING_PARTY_ID!,
        name: process.env.NEXT_PUBLIC_PASSKEYS_RELYING_PARTY_NAME!,
      },
    });

    const assertion = await webAuthn.sign(challenge);

    await completeTransfer(
      token,
      assertion,
      challenge.challengeIdentifier,
      fromWalletId,
      toAddress,
      amount
    );
  };

  return (
    <form className="flex flex-col" action={handleDoTransferAction}>
      <input type="text" placeholder="From wallet id" name="fromWalletId" />
      <input type="text" placeholder="To address" name="toAddress" />
      <input type="text" placeholder="Amount" name="amount" />
      <button type="submit">Transfer</button>
    </form>
  );
};

export default NonCustodialWalletTransferForm;
