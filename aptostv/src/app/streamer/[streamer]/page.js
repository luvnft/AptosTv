"use client";
import { checkNFT } from "@/api/checkNFT";
import { getStreams } from "@/api/getPlaybackInfo";
import { transferNFT } from "@/api/transferNFT";
import { getStreamers } from "@/api/userData";
import StreamerContainer from "@/app/components/streamerContainer";
import StreamerContainerStream from "@/app/components/streamerContainerStream";
import { blockchain } from "@/utils/constants";
import { epsilonRound, findIndexByProperty } from "@/utils/utils";
import { Aptos } from "@aptos-labs/ts-sdk";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Button } from "@mui/material";
import { BigNumber } from "ethers";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import "hls-video-element";
import Link from "next/link";
import React, { Fragment, useCallback } from "react";
import { toast } from "react-toastify";

const Msg = ({ hash }) => (
  <Link
    href={`${blockchain.blockExplorer}transaction/${hash}`}
    target="_blank"
    rel="noopener noreferrer"
    style={{
      textDecoration: "underline",
      color: "white",
      textAlign: "justify",
      wordBreak: "break-word",
      width: "100%",
    }}
  >
    Open in explorer: {hash}
  </Link>
);

export default function Streamer({ params }) {
  const provider = new Aptos(blockchain.aptosConfig);
  const { account, connected, signAndSubmitTransaction } = useWallet();
  const [streamer, setStreamer] = React.useState({});
  const [streamers, setStreamers] = React.useState([]);
  const [balancesCharity, setBalancesCharity] = React.useState(
    blockchain.tokens.map(() => BigNumber.from(0))
  );
  const [balances, setBalances] = React.useState(
    blockchain.tokens.map(() => BigNumber.from(0))
  );
  const [amount, setAmount] = React.useState("");
  const [tokenSelected, setTokenSelected] = React.useState(
    blockchain.tokens[0].symbol
  );
  const [loading, setLoading] = React.useState(true);
  const [nftFlag, setNftFlag] = React.useState(false);

  const setup = useCallback(async () => {
    const [users, streams] = await Promise.all([getStreamers(), getStreams()]);
    const streamers = users.map((user) => {
      return {
        ...user,
        online: streams[user.streamID] ?? false,
      };
    });
    const streamer = streamers.find(
      (user) => user.username === params.streamer
    );
    setStreamer(streamer);
    setStreamers(streamers);
  }, []);

  const cryptoSetup = useCallback(async () => {
    const balancesTemp = await Promise.all(
      blockchain.tokens.map((token) =>
        provider.getAccountCoinAmount({
          accountAddress: account.address,
          coinType: token.address,
        })
      )
    );
    const balancesCharityTemp = await Promise.all(
      blockchain.tokens.map((token) =>
        provider.getAccountCoinAmount({
          accountAddress: streamer.publicKey,
          coinType: token.address,
        })
      )
    );
    setBalances(balancesTemp);
    setBalancesCharity(balancesCharityTemp);
    let flag = await checkNFT(account.address);
    setNftFlag(flag);
  }, [provider, streamer, account, setBalances, setBalancesCharity]);

  const donate = useCallback(async () => {
    try {
      const tokenIndex = findIndexByProperty(
        blockchain.tokens,
        "symbol",
        tokenSelected
      );
      const token = blockchain.tokens[tokenIndex];
      const transaction = {
        sender: account.address,
        data: {
          type: "entry_function_payload",
          function:
            token.address === blockchain.tokens[0].address
              ? "0x1::aptos_account::transfer"
              : "0x1::aptos_account::transfer_coins",
          typeArguments:
            token.address === blockchain.tokens[0].address
              ? []
              : [token.address],
          functionArguments: [
            streamer.publicKey,
            parseUnits(amount, token.decimals).toBigInt(),
          ],
        },
      };
      let response = await signAndSubmitTransaction(transaction);
      await provider.waitForTransaction({
        transactionHash: response.hash,
      });
      await transferNFT(account.address);
      toast.success(<Msg hash={response.hash} />);
      await cryptoSetup();
    } catch (e) {
      toast.error(e);
      setLoading(false);
    }
  }, [amount, tokenSelected, provider, streamer, cryptoSetup]);

  React.useEffect(() => {
    setup();
  }, []);

  React.useEffect(() => {
    if (connected && streamers.length > 0) {
      cryptoSetup();
    }
  }, [connected, streamers]);

  React.useEffect(() => {
    if (nftFlag) {
      setLoading(true);
      setTimeout(async () => {
        setLoading(false);
      }, 100);
    } else {
      setLoading(false);
    }
  }, [nftFlag]);

  return (
    <div className="container">
      <div className="side-bar">
        <h5
          style={{
            color: "#ffffff",
            textAlign: "left",
            width: "90%",
            marginBottom: "10px",
            marginTop: "15px",
          }}
        >
          RECOMMENDED CHANNELS
        </h5>
        {streamers.map((streamerKey, i) => {
          return <StreamerContainer key={i} {...streamerKey} />;
        })}
      </div>
      <div className="home-container2">
        {JSON.stringify(streamer) !== "{}" && !loading && (
          <div className="video-container2">
            {streamer.online ? (
              <Fragment>
                {!streamer.nftLock || nftFlag ? (
                  <hls-video
                    src={`https://livepeercdn.studio/hls/${streamer.streamURL}/index.m3u8`}
                    height="auto"
                    width="100%"
                    controls
                  />
                ) : (
                  <video height="auto" width="100%" controls>
                    <source src={"/assets/video.mp4"} />
                  </video>
                )}
              </Fragment>
            ) : (
              <Fragment>
                {!streamer.nftLock || nftFlag ? (
                  <video height="auto" width="100%" controls>
                    <source src={streamer.defaultSession} />
                  </video>
                ) : (
                  <video height="auto" width="100%" controls>
                    <source src={"/assets/video.mp4"} />
                  </video>
                )}
              </Fragment>
            )}
            <StreamerContainerStream {...streamer} />
          </div>
        )}
      </div>
      <div className="side-bar2">
        <h3
          style={{
            color: "#ffffff",
            textAlign: "center",
            width: "90%",
          }}
        >
          <Link
            href={`${blockchain.blockExplorer}account/${streamer.publicKey}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#ffffff" }}
          >
            {streamer?.charity}
          </Link>
        </h3>
        <h4
          style={{
            color: "#ffffff",
            textAlign: "left",
            width: "90%",
          }}
        >
          Amount Raised
        </h4>
        {blockchain.tokens.map((token, i) => (
          <div key={`${token.symbol}1 :` + i} className="token-container2">
            {token.icon}
            <div
              style={{
                color: "#ffffff",
              }}
            >
              {epsilonRound(formatUnits(balancesCharity[i], token.decimals), 4)}{" "}
              {token.symbol}
            </div>
          </div>
        ))}
        <div
          style={{
            borderBottom: "1px solid #ffffff",
            width: "90%",
            paddingTop: "10px",
          }}
        />
        <h4
          style={{
            color: "#ffffff",
            textAlign: "left",
            width: "90%",
            marginBottom: "20px",
            marginTop: "20px",
          }}
        >
          Account Balance
        </h4>
        {blockchain.tokens.map((token, i) => (
          <div
            key={`${token.symbol}2 :` + i}
            onClick={() => setTokenSelected(token.symbol)}
            className="token-container"
          >
            {token.icon}
            <div
              style={{
                color: "#ffffff",
              }}
            >
              {epsilonRound(formatUnits(balances[i], token.decimals), 4)}{" "}
              {token.symbol}
            </div>
          </div>
        ))}
        <div
          style={{
            borderBottom: "1px solid #ffffff",
            width: "90%",
            paddingTop: "10px",
          }}
        />
        <h4
          style={{
            color: "#ffffff",
            textAlign: "left",
            width: "90%",
            marginBottom: "20px",
            marginTop: "20px",
          }}
        >
          Token to Donate {tokenSelected}
        </h4>
        <input
          label="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="input-field"
          type="number"
        />
        <Button
          disabled={(amount === "" && !loading) || !connected}
          onClick={() => donate()}
          variant="contained"
          color="aptos"
          className="buttonStyle"
        >
          Donate
        </Button>
        <div style={{ marginTop: "20px" }} />
      </div>
    </div>
  );
}
