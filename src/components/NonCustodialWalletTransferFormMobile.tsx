"use client";
import { useAuthStore } from "@/stores/authStore";
import { sendTransactionNotification } from "@/actions/non-custodial/delegated-wallets";

const NonCustodialWalletTransferFormMobile = () => {
  const { token } = useAuthStore();

  const handleDoTransferAction = async (formData: FormData) => {
    if (!token) {
      alert("You must be logged in to transfer");
      return;
    }
    const fcmToken = formData.get("fcmToken") as string;

    await sendTransactionNotification(fcmToken);
  };

  return (
    <form className="flex flex-col" action={handleDoTransferAction}>
      <input type="text" placeholder="Firebase token" name="fcmToken" />
      <input type="text" placeholder="From wallet id" name="fromWalletId" />
      <input type="text" placeholder="To address" name="toAddress" />
      <input type="text" placeholder="Amount" name="amount" />
      <button type="submit">Request Transfer to mobile</button>
    </form>
  );
};

export default NonCustodialWalletTransferFormMobile;
