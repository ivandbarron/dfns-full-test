"use client";
import { useEffect, useState } from "react";
import { list } from "@/actions/non-custodial/delegated-wallets";
import { ListWalletsResponse } from "@dfns/sdk/generated/wallets";
import { useAuthStore } from "@/stores/authStore";

const NonCustodialWalletList = () => {
  const { token } = useAuthStore();
  const [wallets, setWallets] = useState<ListWalletsResponse | undefined>(
    undefined
  );

  useEffect(() => {
    const fetchWallets = async () => {
      if (!token) {
        return;
      }
      const wallets = await list(token);
      setWallets(wallets);
    };

    fetchWallets();
  }, [token]);

  return (
    <>
      <h2 className="text-blue-600">
        Wallet List {wallets && `(${wallets.items.length}) elemets`}
      </h2>
      {wallets ? (
        <ul>
          {wallets.items.map((wallet) => (
            <li key={wallet.id}>
              <textarea
                className="p-4 drop-shadow-lg mt-2 overflow-x-scroll w-[500px]"
                readOnly
                value={JSON.stringify(wallet, null, 2)}
              />
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
};

export default NonCustodialWalletList;
