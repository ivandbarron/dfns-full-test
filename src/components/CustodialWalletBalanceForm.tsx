import React, { useState } from "react";
import { getBalance } from "@/actions/custodial/wallets";

const CustodialWalletBalanceForm = () => {
  const [balance, setBalance] = useState<string | undefined>(undefined);

  const handlecheckBalanceAction = async (formData: FormData) => {
    const walletId = formData.get("walletId") as string;
    if (!walletId) {
      alert("Wallet id is required");
      return;
    }

    const balance = await getBalance(walletId);

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

export default CustodialWalletBalanceForm;
