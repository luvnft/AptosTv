import { blockchain } from "@/utils/constants";
import { Aptos } from "@aptos-labs/ts-sdk";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Button } from "@mui/material";
import { ethers } from "ethers";
import Link from "next/link";
import { Fragment, useCallback, useEffect, useState } from "react";

const WalletButton = () => {
  const provider = new Aptos(blockchain.aptosConfig);
  const [balance, setBalance] = useState(0);
  const { connect, disconnect, account, connected } = useWallet();

  const handleConnect = useCallback(async () => {
    try {
      // Change below to the desired wallet name instead of "Petra"
      await connect("Petra");
      console.log("Connected to wallet:", account.address);
    } catch (error) {
      console.error("Failed to connect to wallet:", error);
    }
  }, [connect, account]);

  const handleDisconnect = useCallback(async () => {
    try {
      await disconnect();
      console.log("Disconnected from wallet");
    } catch (error) {
      console.error("Failed to disconnect from wallet:", error);
    }
  }, [disconnect]);

  const getBalances = useCallback(async () => {
    const check = await provider.getAccountAPTAmount({
      accountAddress: account.address,
    });
    setBalance(parseFloat(ethers.utils.formatUnits(check, 8)));
  }, [provider, account, setBalance]);

  useEffect(() => {
    if (connected) {
      getBalances();
    }
  }, [connected, getBalances]);

  return (
    <Fragment>
      {connected ? (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: "0.8rem",
          }}
        >
          <Link
            className="linkAddress"
            href={`${blockchain.blockExplorer}account/${account.address}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              textDecoration: "none",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              display: "flex",
              gap: "0.8rem",
            }}
          >
            {blockchain.icon}
            <div
              style={{ color: "#ffffff", fontSize: "1rem", fontWeight: "bold" }}
            >
              {balance.toFixed(2) + ` ${blockchain.token}`}
            </div>
            <div
              style={{
                color: "#ffffff",
                fontSize: "1rem",
                fontWeight: "bold",
                backgroundColor: "#0052FEAA",
                padding: "0.4rem",
                borderRadius: "2rem",
                color: "#ffffff",
                fontSize: "1rem",
                fontWeight: "bold",
              }}
            >
              {account.address.substring(0, 4) +
                "..." +
                account.address.substring(
                  account.address.length - 6,
                  account.address.length
                ) ?? ""}
            </div>
          </Link>
          <Button
            className="buttonStyle"
            onClick={handleDisconnect}
            variant="contained"
            color="aptos"
          >
            Disconnect
          </Button>
        </div>
      ) : (
        <Button
          onClick={handleConnect}
          variant="contained"
          color="aptos"
          className="buttonStyle"
        >
          Connect
        </Button>
      )}
    </Fragment>
  );
};

export default WalletButton;
