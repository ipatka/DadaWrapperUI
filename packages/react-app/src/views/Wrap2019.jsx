import React, { useEffect, useState } from "react";
import { Button, Card, List, Spin, Popover, Form, Switch } from "antd";
import { Address, AddressInput } from "../components";
import { getUnwrapped2019 } from "../helpers/api";

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
  const [page, setPage] = useState(0);

  const fetchMetadataAndUpdate = async () => {
    try {
      const assetsResponse = await getUnwrapped2019({ ownerAddress: address, limit: perPage, offset: page * perPage });
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
  };

  useEffect(() => {
    fetchMetadataAndUpdate();
  }, [readContracts[wrapperContract], page]);

  let filteredOEs = Object.values(allWrappedTokens).filter(
    a => a.owner.address !== "0x0000000000000000000000000000000000000000",
  );

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
            locale={{ emptyText: `waiting for tokens...` }}
            pagination={{
              total: filteredOEs.length,
              defaultPageSize: perPage,
              defaultCurrent: page,
              onChange: currentPage => {
                setPage(currentPage - 1);
              },
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${filteredOEs.length} items`,
            }}
            loading={loadingWrappedTokens}
            dataSource={filteredOEs ? filteredOEs : []}
            renderItem={item => {
              const id = item.token_id;

              console.log({ approved });
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
                        readContracts[wrapperContract] && readContracts[wrapperContract].address
                      }?a=${id}`}
                      target="_blank"
                    >
                      <img src={item.image_url && item.image_url} alt={"WrappedTokens #" + id} width="100" />
                    </a>
                    {item.owner && (
                      <div>
                        <Address
                          address={item.owner.address}
                          ensProvider={mainnetProvider}
                          blockExplorer={blockExplorer}
                          fontSize={16}
                        />
                      </div>
                    )}
                    {address && item.owner.address == address.toLowerCase() && !approved && (
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
                    {address && item.owner.address == address.toLowerCase() && approved && (
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

export default Wrap2019;
