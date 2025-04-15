"use server";
import { createDfnsApiClient } from "@/lib/dfns/api-client";

export const createWallet = async () => {
  try {
    const serverClient = createDfnsApiClient();

    const wallet = await serverClient.wallets.createWallet({
      body: {
        name: "ServiceAccountWallet-1",
        network: "Ethereum",
      },
    });
    console.log(JSON.stringify(wallet, null, 2));

    const list = await serverClient.wallets.listWallets({});
    console.log(JSON.stringify(list, null, 2));
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
    }
    console.log(JSON.stringify(err, null, 2));
  }
};
