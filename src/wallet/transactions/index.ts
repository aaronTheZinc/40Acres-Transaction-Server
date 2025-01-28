import { alchemy } from "../../lib/alchemy";
import { AssetTransfersCategory } from "alchemy-sdk";
// export interface TransactionChain {}

export const getTransactions = async (address: string) => {
  const data = await alchemy.core.getAssetTransfers({
    // fromBlock: "0x0",
    toAddress: address,
    withMetadata: true,
    excludeZeroValue: true,

    category: [
      AssetTransfersCategory.ERC1155,
      AssetTransfersCategory.ERC20,
      AssetTransfersCategory.ERC721,
      AssetTransfersCategory.EXTERNAL,
      AssetTransfersCategory.INTERNAL,
    ],
  });
  return data.transfers;
};

export const getAssets = async (address: string) => {
  const data = await alchemy.nft.getNftsForOwner(address);

  console.log("ASSETS", address, data);
  return data.transfers;
};
