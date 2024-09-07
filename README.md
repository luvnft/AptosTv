# AptosTv

<img src="./Images/image1.png" >

 A decentralized streaming platform where creators can create charity-based streams for social, environmental and economic causes. Powered by Aptos Network and Livepeer.

# Watch our demo video:

[![Demo](./Images/image2.png)]()

# Test the product:

## URL: https://aptos-tv.vercel.app/

## Requirements

- Use Aptos Mainnet on Petra Wallet! (or any aptos comptible wallet) 
  - Get it on Petra: https://petra.app/
  - Petra Wallet is set up on Mainnet by default

# Diagram:

<img src="./Images/image3.png" >

## Tech we Use:

- Aptos Network:
  - Coins Donations.
    - APT (Aptos Coin)
    - USDC (USD Coin)
    - USDT (Tether)
    - WETH (Wrapped Ether)
  - NFT
    - Special NFTs to unlock rewards.
- Livepeer:
  - RTMP URL:
    - Url to easily transmit from the OBS and start our transmission.
  - Livestreams and Recordings API:
    - Obtaining the url if a streamer is live.
    - Obtaining the last record of each streamer if he is offline.

# How it's built:

## Aptos Network:

Se utilizo la red de aptos ya que permite mas de 160,000 transacciones por segundo y de nos permite de forma decentralizada realizar campañas de donaciones. Ademas de permitirnos con muy bajos fees realizar estas dinamicas y repartir NFTs con un gas fee muy bajo.

<img src="./Images/image4.png">

In order to obtain the balances of each of the Coins in the Aptos network, utilizamos el Aptos Provider del SDK pata javascript @aptos-labs/ts-sdk.

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

[Complete Code](./aptostv/src/app/streamer/[streamer]/page.js)

Within our platform we have a summary where we can see all the donations in real time.

<img src="./Images/image5.png">

Una de las features mas importantes es un NFT lock que provee a los streamers una herramienta para propiciar que los usuarios realicen donaciones a sus causas, ya sea solo para poder ver el contenido exclusivo que generan, parecido al modelo de youtube, o incluso para obtener otro tipo de rewards enfocados mas en la plataforma.

<img src="./Images/image6.png">

Una vez se hace la donacion configurada por el Streamer, en este caso la plataforma te dara un NFT al realizar cualquier donacion, contemplando que este es un POC, y podras visualizarlo en tu Wallet.

<img src="./Images/image7.png">

Este es uno de los NFTs en mainnet que proveemos a nuestros donadores.

AptosTV NFT - Aptos Explorer: 
https://aptoscan.com/tokenv2/0x7f48203908ef905a0eeaa6de8d18d4ea58a72bb147cc19f4b9efa3660914ea41

El codigo que realiza el chequeo de que la wallet conectada tiene el NFT es el siguiente.

    const checkUser = await provider.getOwnedDigitalAssets({
            ownerAddress: address,
        });
    const flag =
        checkUser.filter(
            (asset) => asset.current_token_data.token_name === "AptosTV"
        ).length > 0;
    return flag;

[Complete Code](./aptostv/src/api/checkNFT.js)

## Livepeer:

<img src="./Images/image8.png">

All the streaming services were done through Livepeer.

<img src="./Images/image9.png">

To manage Streamers, the profiles of each of the Streamers were created within the Livepeer dashboard, with which we were able to provide each Streamer with their keys to perform their Streams.

<img src="./Images/image10.png">

Thanks to the Livepeer APIs it was possible for us to obtain if the Streamers were doing a Live, thanks to this the viewers could always be aware when a live stream is made.

<img src="./Images/image11.png">

The section of code that allows us to obtain the profiles, recordings and states (live or offline) is the following.

Code Snippet:

    export async function getStreams() {
        const result = await livepeer.stream.getAll("<value>");
        let json = {};
        result.data.forEach((streamer) => {
            json[streamer.id] = streamer.isActive;
        });
        return json;
    }

[Complete Code](./aptostv/src/api/userData.js)

# References

https://www.twitch.tv/creatorcamp/en/connect-and-engage/charity-streaming/

https://www.donordrive.com/charity-streaming/

https://www.youtube.com/watch?v=Hh4T4RuK1H8
