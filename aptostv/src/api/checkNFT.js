"use server";

import {
  Aptos,
  AptosConfig,
  Network
} from "@aptos-labs/ts-sdk";

// Initialize Aptos Client with configuration
const config = new AptosConfig({
  network: Network.MAINNET,
});

const provider = new Aptos(config);

export async function checkNFT(address) {
  const checkUser = await provider.getOwnedDigitalAssets({
    ownerAddress: address,
  });
  const flag =
    checkUser.filter(
      (asset) => asset.current_token_data.token_name === "AptosTV"
    ).length > 0;
  return flag;
}
