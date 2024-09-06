import { AptosConfig, Network } from "@aptos-labs/ts-sdk";

import Image from "next/image";

const w = 50;
const h = 50;

export const iconsBlockchain = {
  apt: (
    <Image
      alt = "APT"
      src={"/assets/apt.png"}
      width={w}
      height={h}
      style={{ borderRadius: 10 }}
    />
  ),
  usdc: (
    <Image
      alt = "USDC"
      src={"/assets/usdc.png"}
      width={w}
      height={h}
      style={{ borderRadius: 10 }}
    />
  ),
  usdt: (
    <Image
      alt = "USDT"
      src={"/assets/usdt.png"}
      width={w}
      height={h}
      style={{ borderRadius: 10 }}
    />
  ),
  weth: (
    <Image
      alt = "WETH"
      src={"/assets/weth.png"}
      width={w}
      height={h}
      style={{ borderRadius: 10 }}
    />
  ),
};

export const blockchain = {
  network: "Aptos",
  token: "APT",
  blockExplorer: "https://aptoscan.com/",
  icon: (
    <Image
      alt = "APT"
      src={"/assets/apt.png"}
      width={30}
      height={30}
      style={{ borderRadius: 10 }}
    />
  ),
  iconSymbol: "apt",
  decimals: 8,
  aptosConfig: new AptosConfig({
    network: Network.MAINNET,
  }),
  tokens: [
    // Updated 05/MAY/2024
    {
      name: "Aptos Coin",
      symbol: "APT",
      address: "0x1::aptos_coin::AptosCoin",
      decimals: 8,
      icon: iconsBlockchain.apt,
      coingecko: "aptos",
    },
    {
      name: "USD Coin",
      symbol: "zUSDC",
      address:
        "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC",
      decimals: 6,
      icon: iconsBlockchain.usdc,
      coingecko: "usd-coin",
    },
    {
      name: "Tether",
      symbol: "zUSDT",
      address:
        "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDT",
      decimals: 6,
      icon: iconsBlockchain.usdt,
      coingecko: "tether",
    },
    {
      name: "Wrapper (Ether)",
      symbol: "zWETH",
      address:
        "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::WETH",
      decimals: 6,
      icon: iconsBlockchain.weth,
      coingecko: "weth",
    },
  ],
};
