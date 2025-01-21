"use server";

import {
  Account,
  AccountAddress,
  Aptos,
  AptosConfig,
  Ed25519PrivateKey,
  Network,
} from "@aptos-labs/ts-sdk";
import { checkNFT } from "./checkNFT";

const privateKeyHex = process.env.NFT_MINTER_PRIVATEKEY;
const minterAddress =
  "0x0d620f2ff38f89941787a72b8bcbec160a0360605ce1cdbd7d65ef376ef4c022";
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
  const flag = await checkNFT(address);
  if (flag) return "User own the NFT";
  const nftId = await checkNFT(minterAddress, true);
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
