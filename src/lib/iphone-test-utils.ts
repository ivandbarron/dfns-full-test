export const getRequestData = async () => {
  const fromWalletId = "wa-75rui-iboo7-9m0pmekn4kffelar"; // david2@iphone.com PolygonAmoy
  const toAddress = "0xcf5fa1d2c450a14789ba120099f79cf3a5fbe951"; // david@iphone.com PolygonAmoy
  const amount = "0.05";
  const memo =
    "Test transfer from delegated wallet to delegated wallet | project example :::: task 1";

  return {
    fromWalletId,
    toAddress,
    amount,
    memo,
  };
};
