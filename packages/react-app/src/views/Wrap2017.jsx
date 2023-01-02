import React, { useEffect, useState } from "react";
import { Button, Card, List, Spin, Popover, Form, Switch } from "antd";
import { Address, AddressInput } from "../components";
import { get2017Manifest, getUnwrapped2017 } from "../helpers/api";

const handleUnwrap = async (tokenId, contract, tx) => {
  const vintage = tokenId.slice(0, 4);
  if (vintage === "2017") {
    const drawingId = parseInt(tokenId.slice(4, 9));
    const printIndex = parseInt(tokenId.slice(9, 14));
    const txCur = await tx(contract.unwrap2017(drawingId, printIndex));
    await txCur.wait();
  }
  if (vintage === "2019") {
    const tokenNumber = parseInt(tokenId.slice(9, 14));
    const txCur = await tx(contract.unwrap2019(tokenNumber));
    await txCur.wait();
  }
};

function Wrap2017({
  readContracts,
  mainnetProvider,
  blockExplorer,
  writeContracts,
  tx,
  address,
  wrapperContract,
  dadaContract,
}) {
  const [allTokens, setAllTokens] = useState({});
  const [loadingTokens, setLoadingTokens] = useState(true);
  const perPage = 12;
  const [page, setPage] = useState(0);

  const fetchMetadataAndUpdate = async (drawingId, printIndex) => {
    // console.log({ drawingId, printIndex });
    try {
      const jsonManifest = await get2017Manifest(drawingId, printIndex);
      console.log({ jsonManifest });
      jsonManifest.image = "https://ipfs.io/ipfs/" + jsonManifest.image.split("/").at(-1);
      const collectibleUpdate = {};
      const offered = await readContracts[dadaContract].OfferedForSale(printIndex);
      let wrapable = false;
      if (offered[0] && offered[5].toLowerCase() === readContracts[wrapperContract].address.toLowerCase())
        wrapable = true;
      console.log({ offered });
      collectibleUpdate[printIndex] = { drawingId, printIndex, wrapable, ...jsonManifest };

      setAllTokens(i => ({ ...i, ...collectibleUpdate }));
    } catch (e) {
      console.log(e);
    }
  };

  const updateAllTokens = async () => {
    if (address) {
      try {
        const tokenInfo = await getUnwrapped2017({ ownerAddress: address });
        setLoadingTokens(true);
        let numberSupply = tokenInfo.data.prints.length;

        let tokenList = Array(numberSupply).fill(0);

        tokenList.forEach((_, i) => {
          const token = tokenInfo.data.prints[i];
          console.log({ token });
          const drawingId = token.drawing.drawingId;
          const print = token.printIndex;
          fetchMetadataAndUpdate(drawingId, print);
        });

        setLoadingTokens(false);
      } catch (e) {
        console.log(e);
      }
    } else {
      setLoadingTokens(false);
    }
  };

  useEffect(() => {
    updateAllTokens();
  }, [readContracts[wrapperContract], page]);

  let filteredOEs = Object.values(allTokens);

  return (
    <div style={{ width: "auto", margin: "auto", paddingBottom: 25, minHeight: 800 }}>
      {false ? (
        <Spin style={{ marginTop: 100 }} />
      ) : (
        <div>
          <div style={{ marginBottom: 5 }}>
            <Button
              onClick={() => {
                return fetchMetadataAndUpdate();
              }}
            >
              Refresh
            </Button>
          </div>
          <List
            grid={{
              gutter: 16,
              xs: 1,
              sm: 2,
              md: 4,
              lg: 4,
              xl: 6,
              xxl: 4,
            }}
            locale={address ? { emptyText: `waiting for tokens...` } : { emptyText: `connect your wallet...` }}
            pagination={{
              total: filteredOEs.length,
              defaultPageSize: perPage,
              defaultCurrent: page,
              onChange: currentPage => {
                setPage(currentPage - 1);
              },
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${filteredOEs.length} items`,
            }}
            loading={loadingTokens}
            dataSource={filteredOEs ? filteredOEs : []}
            renderItem={item => {
              const id = item.printIndex;

              return (
                <List.Item key={id}>
                  <Card
                    title={
                      <div>
                        <span style={{ fontSize: 18, marginRight: 8 }}>{item.name ? item.name : `Token #${id}`}</span>
                      </div>
                    }
                  >
                    <a
                      href={`${blockExplorer}token/${
                        readContracts[dadaContract] && readContracts[dadaContract].address
                      }`}
                      target="_blank"
                    >
                      <img src={item.image && item.image} alt={"2017 Dada #" + id} width="100" />
                    </a>
                    <div style={{ position: "relative", top: "0.5em" }}>
                      {address && item.wrapable && (
                        <>
                          <Button
                            type="primary"
                            onClick={async () => {
                              try {
                                const txCur = await tx(
                                  writeContracts[wrapperContract].wrap2017(item.drawingId, item.printIndex),
                                );
                                await txCur.wait();
                              } catch (e) {
                                console.log("wrap failed failed", e);
                              }
                            }}
                          >
                            Wrap
                          </Button>
                        </>
                      )}
                      {address && !item.wrapable && (
                        <>
                          <Button
                            type="primary"
                            onClick={async () => {
                              try {
                                const txCur = await tx(
                                  writeContracts[dadaContract].offerCollectibleForSaleToAddress(
                                    item.drawingId,
                                    item.printIndex,
                                    0,
                                    readContracts[wrapperContract].address,
                                  ),
                                );
                                await txCur.wait();
                              } catch (e) {
                                console.log("approve failed", e);
                              }
                            }}
                          >
                            Approve
                          </Button>
                        </>
                      )}
                    </div>
                  </Card>
                </List.Item>
              );
            }}
          />
        </div>
      )}
    </div>
  );
}

export default Wrap2017;
