# AptosTv

<img src="./Images/image1.png" >

 A decentralized streaming platform where creators can create charity-based streams for social, environmental and economic causes. Powered by Aptos Network and Livepeer.

# Watch our demo video:

[![Demo](./Images/image2.png)]()

# Test the product:

## URL: https://aptos-tv.vercel.app/

## Requirements

- Use Aptos Mainnet on Petra Wallet! (or any Aptos compatible wallet) 
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

Se utilizo la red de aptos ya que permite mas de 160,000 transacciones por segundo, tiene bajas gas fees y ademas de forma decentralizada realizar campañas de donaciones sin intermediarios y sobe todo poder relizar la distribucion y recomoensas por NFTs facilmente.

<img src="./Images/image4.png">

Para poder habilitar la red de Aptos y la interaccion con las wallets primero la pagina debe de tener configurado algun Wallet Provider dentro de la aplicacion, en este caso utilizamos el [@aptos-labs/wallet-adapter-react](https://www.npmjs.com/package/@aptos-labs/wallet-adapter-react).

    <AptosWalletAdapterProvider
        plugins={wallets}
        autoConnect={true}
        dappConfig={{
            network: Network.MAINNET,
        }}
        onError={(error) => {
            console.log(error);
        }}
    >
        {children}
        ...
    </AptosWalletAdapterProvider>

La implementacion tecnica completa esta en el siguiente link:

[**Complete code**](./aptostv/src/app/components/web3modal.js)

Finalmente para poder interactuar con el Wallet Provider de forma sencilla para el usuario, creamos desde cero un boton de "Connect" el cual es ya caracteristico de las dApps de cualquier chain.

<img src="./Images/button.png" width="100%">

Este boton nos provee una forma sencilla de conectarse a Aptos desde el Wallet Provider ademas de darnos nuestro balance y al hacerle clic nos abrira el Explorer para visualizar nuestra wallet on-chain.

La implementacion tecnica completa esta en el siguiente link:

[**Complete code**](./aptostv/src/app/components/walletButton.js)

In order to obtain the balances of each of the Coins in the Aptos network, utilizamos el Aptos Provider del SDK para javascript [@aptos-labs/ts-sdk](https://www.npmjs.com/package/@aptos-labs/ts-sdk).

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

La implementacion tecnica completa esta en el siguiente link:

[**Complete code**](./aptostv/src/app/streamer/[streamer]/page.js)

Within our platform we have a summary where we can see all the donations in real time.

<img src="./Images/image5.png">

Para relizar una donacion, generamos una transferencia desde nuestra wallet a la wallet de la caridad o streamer que deamos apoyar, esto se realiza, seleccionando el token que vamos a donar, poniendo la cantidad y presionando el boton de Donate.

<img src="./Images/donate.png" height="400px"> <img src="./Images/wallet.png" height="400px">

El code snippet que realiza la signature request al presionar el boton es el siguiente.

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

La implementacion tecnica completa esta en el siguiente link:

[**Complete code**](./aptostv/src/app/streamer/[streamer]/page.js)

Una de las features mas importantes es un NFT lock que provee a los streamers una herramienta para propiciar que los usuarios realicen donaciones a sus causas, ya sea solo para poder ver el contenido exclusivo que generan, parecido al modelo de youtube, o incluso para obtener otro tipo de rewards enfocados mas en la plataforma.

<img src="./Images/image6.png">

Una vez se hace la donacion configurada por el Streamer, en este caso la plataforma te dara un NFT al realizar cualquier donacion, contemplando que este es un POC, y podras visualizarlo en tu Wallet.

<img src="./Images/image7.png">

Este es uno de los NFTs en mainnet que proveemos a nuestros donadores.

AptosTV NFT - Aptos Explorer: 
https://aptoscan.com/tokenv2/0x7f48203908ef905a0eeaa6de8d18d4ea58a72bb147cc19f4b9efa3660914ea41

El code snippet que realiza el chequeo si la wallet conectada tiene el NFT es el siguiente.

    const checkUser = await provider.getOwnedDigitalAssets({
            ownerAddress: address,
        });
    const flag =
        checkUser.filter(
            (asset) => asset.current_token_data.token_name === "AptosTV"
        ).length > 0;
    return flag;

La implementacion tecnica completa esta en el siguiente link:

[**Complete code**](./aptostv/src/api/checkNFT.js)

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

La implementacion tecnica completa esta en el siguiente link:
[**Complete code**](./aptostv/src/api/userData.js)

# References

https://www.twitch.tv/creatorcamp/en/connect-and-engage/charity-streaming/

https://www.donordrive.com/charity-streaming/

https://www.youtube.com/watch?v=Hh4T4RuK1H8
