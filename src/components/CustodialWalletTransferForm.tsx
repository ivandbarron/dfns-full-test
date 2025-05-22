import { transfer } from "@/actions/custodial/wallets";

const CustodialWalletTransferForm = () => {
  const handleDoTransferAction = async (formData: FormData) => {
    const fromWalletId = formData.get("fromWalletId") as string;
    const toAddress = formData.get("toAddress") as string;
    const amount = formData.get("amount") as string;

    try {
      await transfer(fromWalletId, toAddress, amount);
      alert("Transfer successful");
    } catch (error) {
      console.error(error);
      alert("Transfer failed");
    }
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

export default CustodialWalletTransferForm;
