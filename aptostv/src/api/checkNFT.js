"use server";

const data = (address) =>
  JSON.stringify({
    query: `{
  current_token_ownerships_v2(
    limit: 100
    offset: 0
    where: {
      owner_address: {
        _eq: "${address}"
      }
    }
  ) {
    amount
    token_data_id
    current_token_data {
      token_name
      current_collection {
        creator_address
      }
    }
  }
}`,
  });

export async function checkNFT(address, returnId = false) {
  const body = data(address);
  const options = {
    body,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  };
  return new Promise((resolve) => {
    fetch(
      `https://aptos-mainnet.nodit.io/${process.env.NODIT_APIKEY}/v1/graphql`,
      options
    )
      .then((response) => response.json())
      .then((response) => {
        const nftsFiltered = response.data.current_token_ownerships_v2
          .filter((asset) => asset.current_token_data.token_name === "AptosTV")
          .filter((asset) => asset.amount > 0);
        if (nftsFiltered.length === 0) resolve(false);
        if (returnId) resolve(nftsFiltered[0].token_data_id);
        resolve(true);
      })
      .catch(() => resolve(false));
  });
}
