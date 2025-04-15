"use client";
import { getBalance } from "@/actions/non-custodial/delegated-wallets";
import { useAuthStore } from "@/stores/authStore";
import { useState } from "react";

const NonCustodialWalletBalanceForm = () => {
  const { token } = useAuthStore();
  const [balance, setBalance] = useState<number | undefined>(undefined);

  const handlecheckBalanceAction = async (formData: FormData) => {
    if (!token) {
      alert("You need to be logged in to check balance");
      return;
    }

    const walletId = formData.get("walletId") as string;
    if (!walletId) {
      alert("Wallet id is required");
      return;
    }

    const balance = await getBalance(token, walletId);
    setBalance(balance);
  };

  return (
    <>
      <form action={handlecheckBalanceAction}>
        <input type="text" placeholder="Wallet id" name="walletId" />
        <button type="submit">Check Balance</button>
      </form>
      <div>{balance && <p>Balance: {balance}</p>}</div>
    </>
  );
};

export default NonCustodialWalletBalanceForm;
