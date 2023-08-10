export function apiRequest({ path, apiKey, method = "GET", data }) {
  return fetch(path, {
    method,
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": apiKey,
    },
    referrerPolicy: "no-referrer",
    redirect: "follow",
    body: data ? JSON.stringify(data) : undefined,
  }).then(res => res.json());
}

const apiKey = process.env.REACT_APP_OPENSEA;

export function getWrapped2019({ ownerAddress, limit, offset }) {
  let path = "https://api.opensea.io/api/v1/assets?asset_contract_address=0x5f53f9f5dcf76757f7cbf35c2e47164c65b9b5ed";
  if (ownerAddress) path += `&owner=${ownerAddress}`;
  if (offset !== null) {
    path += `&cursor=${offset}`;
  }
  if (limit) path += `&limit=${limit}`;
  // console.log({ path });
  return apiRequest({ path, apiKey });
}

export function getWrappedCollectionStats() {
  const path = "https://api.opensea.io/api/v1/collection/wrapped-historic-dada/stats";
  return apiRequest({ path });
}

export function getUnwrapped2019({ ownerAddress, limit, offset }) {
  let path = "https://api.opensea.io/api/v1/assets?asset_contract_address=0x34d77a17038491a2a9eaa6e690b7c7cd39fc8392";
  if (ownerAddress) path += `&owner=${ownerAddress}`;
  if (offset !== null) {
    path += `&cursor=${offset}`;
  }
  if (limit) path += `&limit=${limit}`;
  // console.log({ path });
  return apiRequest({ path, apiKey });
}

export function getUnwrapped2017({ ownerAddress }) {
  if (!ownerAddress) throw new Error("missing address");
  const ownerLower = ownerAddress.toLowerCase();
  // console.log({ ownerLower });
  let path = "https://api.studio.thegraph.com/query/9128/dada-mainnet/v0.0.2";

  const data = {
    // query: `query { d prints (where: {owner: \"${ownerAddress}\" })  { printIndex drawing { drawingId } owner {address}}}`,
    query: `query {  prints (where: {owner: \"${ownerLower}\" })  { printIndex drawing { drawingId } owner {address}}}`,
  };
  // console.log({ data });
  return apiRequest({ path, method: "POST", data });
}

export function get2017Manifest(drawingId, printIndex) {
  const drawingIdPadded = ("00000" + drawingId).slice(-5);
  const printIndexPadded = ("00000" + printIndex).slice(-5);
  const wrappedTokenId = `2017${drawingIdPadded}${printIndexPadded}`;

  const baseUri = "https://dada-metadata.s3.amazonaws.com/tokens/";

  const path = baseUri + wrappedTokenId + ".json";
  // console.log({ path });

  return apiRequest({ path });
}
