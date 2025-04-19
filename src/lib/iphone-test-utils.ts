export const getRequestData = async () => {
  const fromWalletId = "wa-8a6f7-l5uo9-jbba5o8tqt09ajn"; // david@iphone.com SolanaDevnet wallet id
  const toAddress = "FyPefdCQNR3eD8grVpEGyizkC2dSkpSsrdArYcvtC31U"; // mac2 SolanaDevnet wallet address
  const amount = "0.074";
  const memo =
    "Test transfer from delegated wallet to delegated wallet | project example :::: task 1";

  return {
    fromWalletId,
    toAddress,
    amount,
    memo,
  };
};
