"use client";
import { createWallet } from "@/actions/custodial/wallets";
import CustodialWalletBalanceForm from "./CustodialWalletBalanceForm";
import CustodialWalletTransferForm from "./CustodialWalletTransferForm";
import Eip7702TestForm from "./eip7702TestForm";

const CustodialWallets = () => {
  return (
    <>
      <section>
        <h1 className="text-blue-600">Custodial Wallets</h1>
        <form action={createWallet}>
          <button>Create Custodial Wallet</button>
        </form>
      </section>
      <CustodialWalletBalanceForm />
      <CustodialWalletTransferForm />
      <section>
        <h1 className="text-blue-600">EIP 7702 Test</h1>
        <Eip7702TestForm />
      </section>
    </>
  );
};

export default CustodialWallets;
