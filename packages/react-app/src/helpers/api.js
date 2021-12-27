export function apiRequest({ path, method = "GET", data }) {
  return fetch(path, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    referrerPolicy: "no-referrer",
    redirect: "follow",
    body: data ? JSON.stringify(data) : undefined,
  }).then(res => res.json());
}

export function getWrapped2019({ ownerAddress, limit, offset }) {
  let path = "https://api.opensea.io/api/v1/assets?asset_contract_address=0x5f53f9f5dcf76757f7cbf35c2e47164c65b9b5ed";
  if (ownerAddress) path += `&owner=${ownerAddress}`;
  if (offset) {
    path += `&offset=${offset + 1}`;
    if (limit) path += `&limit=${limit}`;
  } else {
    if (limit) path += `&limit=${limit + 1}`;
  }
  console.log({ path });
  return apiRequest({ path });
}

export function getWrappedCollectionStats() {
  const path = "https://api.opensea.io/api/v1/collection/wrapped-historic-dada/stats";
  return apiRequest({ path });
}

export function getUnwrapped2019({ ownerAddress, limit, offset }) {
  let path = "https://api.opensea.io/api/v1/assets?asset_contract_address=0x34d77a17038491a2a9eaa6e690b7c7cd39fc8392";
  if (ownerAddress) path += `&owner=${ownerAddress}`;
  if (offset) {
    path += `&offset=${offset + 1}`;
    if (limit) path += `&limit=${limit}`;
  } else {
    if (limit) path += `&limit=${limit + 1}`;
  }
  console.log({ path });
  return apiRequest({ path });
}
