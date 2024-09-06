"use server";

import {
  Account,
  AccountAddress,
  Aptos,
  AptosConfig,
  Ed25519PrivateKey,
  Network,
} from "@aptos-labs/ts-sdk";

const privateKeyHex = process.env.NFT_MINTER_PRIVATEKEY;
const minterAddress =
  "0x180183f60d14433fe253ac87d683f23695f3831479241c91f73236a4e5cbf892";
const formattedPrivateKeyHex = privateKeyHex.startsWith("0x")
  ? privateKeyHex.substring(2)
  : privateKeyHex;
const privateKeyBytes = new Uint8Array(
  Buffer.from(formattedPrivateKeyHex, "hex")
);
const privateKey = new Ed25519PrivateKey(privateKeyBytes);
const accountAddress = AccountAddress.from(minterAddress);

// Importing the Aptos account from exported private key
const myAccount = Account.fromPrivateKey({
  privateKey,
  address: accountAddress,
  legacy: true,
});

// Initialize Aptos Client with configuration
const config = new AptosConfig({
  network: Network.MAINNET,
});

const provider = new Aptos(config);

export async function transferNFT(address) {
  const checkUser = await provider.getOwnedDigitalAssets({
    ownerAddress: address,
  });
  const flag = checkUser.filter((asset) => asset.current_token_data.token_name === "AptosTV").length > 0;
  if(flag) return "User own the NFT";
  const digitalAsset = await provider.getOwnedDigitalAssets({
    ownerAddress: minterAddress,
  });
  const nftId = digitalAsset
    .filter((asset) => asset.current_token_data.token_name === "AptosTV")
    .map((asset) => asset.current_token_data.token_data_id)[0];
  const transferTransaction = await provider.transferDigitalAssetTransaction({
    sender: myAccount,
    digitalAssetAddress: nftId,
    recipient: address,
  });
  const committedTxn = await provider.signAndSubmitTransaction({
    signer: myAccount,
    transaction: transferTransaction,
  });
  await provider.waitForTransaction({
    transactionHash: committedTxn.hash,
  });

  return committedTxn.hash;
}
