import CustodialWallets from "@/components/CustodialWallets";
import NonCustodialWallets from "@/components/NonCustodialWallets";
import Eip7702TestForm from "@/components/eip7702TestForm";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
      <CustodialWallets />
      <NonCustodialWallets />
      <Eip7702TestForm />
    </main>
  );
}
