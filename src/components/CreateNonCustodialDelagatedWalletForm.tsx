"use client";
import { createDelegatedNCW } from "@/actions/non-custodial/delegated-wallets";

const CreateNonCustodialDelegatedWalletForm = () => {
  const handleCreateDelegatedNCWAction = async (formData: FormData) => {
    const userId = formData.get("userId") as string;
    const walletName = formData.get("walletName") as string;
    const network = formData.get("network") as string;
    if (!userId || !walletName || !network) {
      alert("Please fill all the fields");
      return;
    }

    await createDelegatedNCW(userId, walletName, network);
    alert("Now you must reload the page to see the new wallet");
  };

  return (
    <form
      className="flex flex-col items-center align-middle"
      action={handleCreateDelegatedNCWAction}
    >
      <input
        className="w-[500px] p-4"
        type="text"
        placeholder="Enter the id of the final user to delegate the wallet"
        name="userId"
      />

      <input
        className="w-[500px] p-4"
        type="text"
        placeholder="Enter the name of the wallet"
        name="walletName"
      />

      <input
        className="w-[500px] p-4"
        type="text"
        placeholder="Enter the network"
        name="network"
      />
      <button>Create Delegated NCW</button>
    </form>
  );
};

export default CreateNonCustodialDelegatedWalletForm;
