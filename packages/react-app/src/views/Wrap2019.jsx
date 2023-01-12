import React, { useEffect, useState } from "react";
import { Button, Card, List, Spin } from "antd";
import { Address } from "../components";
import { getUnwrapped2019 } from "../helpers/api";

function Wrap2019({
  readContracts,
  mainnetProvider,
  blockExplorer,
  writeContracts,
  tx,
  address,
  wrapperContract,
  nftContract,
}) {
  const [allWrappedTokens, setAllWrappedTokens] = useState({});
  const [approved, setApproved] = useState({});
  const [loadingWrappedTokens, setLoadingWrappedTokens] = useState(true);
  const perPage = 12;
  const [page, setPage] = useState({ prev: null, next: null });

  const fetchMetadataAndUpdate = async isNextQuery => {
    if (address) {
      try {
        const assetsResponse =
          isNextQuery === null
            ? await getUnwrapped2019({
                ownerAddress: address,
                limit: perPage,
                offset: null,
              })
            : await getUnwrapped2019({
                ownerAddress: address,
                limit: perPage,
                offset: isNextQuery ? page.next : page.prev,
              });
        console.log({ assetsResponse });
        setPage({ prev: assetsResponse.previous, next: assetsResponse.next });
        const isApproved = await readContracts[nftContract].isApprovedForAll(
          address,
          readContracts[wrapperContract].address,
        );
        setApproved(isApproved);
        setAllWrappedTokens(assetsResponse.assets);
        setLoadingWrappedTokens(false);
      } catch (e) {
        console.log(e);
      }
    } else {
      setLoadingWrappedTokens(false);
    }
  };

  useEffect(() => {
    fetchMetadataAndUpdate();
  }, [readContracts[wrapperContract]]);

  let filteredOEs = Object.values(allWrappedTokens);

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
            loading={loadingWrappedTokens}
            dataSource={filteredOEs ? filteredOEs : []}
            renderItem={item => {
              const id = item.token_id;

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
                        readContracts[nftContract] && readContracts[nftContract].address
                      }?a=${id}`}
                      target="_blank"
                    >
                      <img src={item.image_url && item.image_url} alt={"WrappedTokens #" + id} width="100" />
                    </a>
                    <div style={{ position: "relative", top: "0.5em" }}>
                      {!approved && (
                        <>
                          <Button
                            type="primary"
                            onClick={async () => {
                              try {
                                const txCur = await tx(
                                  writeContracts[nftContract].setApprovalForAll(
                                    readContracts[wrapperContract].address,
                                    true,
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
                      {approved && (
                        <>
                          <Button
                            type="primary"
                            onClick={async () => {
                              try {
                                const txCur = await tx(writeContracts[wrapperContract].wrap2019(item.token_id));
                                await txCur.wait();
                              } catch (e) {
                                console.log("wrap failed", e);
                              }
                            }}
                          >
                            Wrap
                          </Button>
                        </>
                      )}
                    </div>
                  </Card>
                </List.Item>
              );
            }}
          />
          <div>
            <Button onClick={() => fetchMetadataAndUpdate(null)} disabled={!page.prev}>
              First Page
            </Button>
            <Button
              onClick={() => {
                fetchMetadataAndUpdate(false);
              }}
              disabled={!page.prev}
            >
              Previous Page
            </Button>
            <Button
              onClick={() => {
                fetchMetadataAndUpdate(true);
              }}
              disabled={!page.next}
            >
              Next Page
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Wrap2019;
