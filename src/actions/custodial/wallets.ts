"use server";
import { createDfnsApiClient } from "@/lib/dfns/api-client";
import { GetWalletAssetsResponse } from "@dfns/sdk/generated/wallets";
import { ethers } from "ethers";

export const getBalance = async (walletId: string): Promise<string> => {
  try {
    const serverClient = createDfnsApiClient();
    const assetsResponse: GetWalletAssetsResponse =
      await serverClient.wallets.getWalletAssets({
        walletId,
      });

    if (assetsResponse.assets.length === 0) {
      console.log("No assets found");
      return "-1";
    }

    const decimals = assetsResponse.assets[0].decimals;
    const balance = assetsResponse.assets[0].balance;

    return ethers.formatUnits(balance, decimals);
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
    }
    console.log(JSON.stringify(err, null, 2));
    return "-1";
  }
};

export const createWallet = async () => {
  try {
    const serverClient = createDfnsApiClient();

    const wallet = await serverClient.wallets.createWallet({
      body: {
        name: "CustodialWalletSponsorTestEip7702",
        network: "EthereumHolesky",
      },
    });
    console.log(JSON.stringify(wallet, null, 2));

    //const list = await serverClient.wallets.listWallets({});
    //console.log(JSON.stringify(list, null, 2));
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
    }
    console.log(JSON.stringify(err, null, 2));
  }
};

export const transfer = async (
  fromWalletId: string,
  toAddress: string,
  amount: string
) => {
  try {
    const serverClient = createDfnsApiClient();

    const sourceAssetsResponse: GetWalletAssetsResponse =
      await serverClient.wallets.getWalletAssets({
        walletId: fromWalletId,
      });

    if (sourceAssetsResponse.assets.length === 0) {
      console.log("No assets found");
      return;
    }

    const transferResponse = await serverClient.wallets.transferAsset({
      walletId: fromWalletId,
      body: {
        kind: "Native",
        to: toAddress,
        amount: ethers
          .parseUnits(amount, sourceAssetsResponse.assets[0].decimals)
          .toString(),
      },
    });

    console.log(JSON.stringify(transferResponse, null, 2));
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
    }
    console.log(JSON.stringify(err, null, 2));
  }
};
