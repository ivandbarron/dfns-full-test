import LoginDelegatedUserForm from "./LoginDelegatedUserForm";
import RegisterDelegatedUserForm from "./RegisterDelegatedUserForm";
import NonCustodialWalletList from "./NonCustodialWalletList";
import CreateNonCustodialWalletForm from "./CreateNonCustodialWalletForm";
import NonCustodialWalletBalanceForm from "./NonCustodialWalletBalanceForm";
import NonCustodialWalletTransferForm from "./NonCustodialWalletTransferForm";
import NonCustodialWalletTransferFormMobile from "./NonCustodialWalletTransferFormMobile";
import CreateNonCustodialDelegatedWalletForm from "./CreateNonCustodialDelagatedWalletForm";

const NonCustodialWallets = () => {
  return (
    <section>
      <h1 className="text-blue-600">Non Custodial Wallets</h1>
      <RegisterDelegatedUserForm />
      <LoginDelegatedUserForm />
      <NonCustodialWalletList />
      <CreateNonCustodialWalletForm />
      <NonCustodialWalletBalanceForm />
      <NonCustodialWalletTransferForm />
      <NonCustodialWalletTransferFormMobile />
      <CreateNonCustodialDelegatedWalletForm />
    </section>
  );
};

export default NonCustodialWallets;
