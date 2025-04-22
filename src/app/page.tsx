//import CustodialWallets from "@/components/CustodialWallets";
import NonCustodialWallets from "@/components/NonCustodialWallets";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
      {/* <CustodialWallets /> */}
      <NonCustodialWallets />
    </main>
  );
}
