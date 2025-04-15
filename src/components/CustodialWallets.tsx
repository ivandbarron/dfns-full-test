import { createWallet } from "@/actions/custodial/wallets";

const CustodialWallets = () => {
  return (
    <section>
      <h1 className="text-blue-600">Custodial Wallets</h1>
      <form action={createWallet}>
        <button>Create Custodial Wallet</button>
      </form>
    </section>
  );
};

export default CustodialWallets;
