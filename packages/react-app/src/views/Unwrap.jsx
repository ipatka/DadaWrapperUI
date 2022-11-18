import React, { useEffect, useState } from "react";
import { Button, Card, List, Spin, Popover, Form, Switch } from "antd";
import { Address, AddressInput } from "../components";
import { getWrappedCollectionStats, getWrapped2019 } from "../helpers/api";

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
    const encoded = await contract.interface.encodeFunctionData("unwrap2019(uint256)", [tokenNumber]);
    console.log({ encoded });
    const txCur = await tx(contract.unwrap2019(tokenNumber));
    await txCur.wait();
  }
};

function WrappedTokens({
  readContracts,
  mainnetProvider,
  blockExplorer,
  writeContracts,
  tx,
  address,
  wrapperContract,
}) {
  const [allWrappedTokens, setAllWrappedTokens] = useState({});
  const [loadingWrappedTokens, setLoadingWrappedTokens] = useState(true);
  const [mine, setMine] = useState(false);
  const perPage = 25;
  const [page, setPage] = useState(0);
  const [totalSupply, setTotalSupply] = useState(0);

  const fetchMetadataAndUpdate = async () => {
    let ownerAddress;
    if (mine) ownerAddress = address;
    try {
      const assetsResponse = await getWrapped2019({ ownerAddress, limit: perPage, offset: page * perPage });
      console.log({ assetsResponse });
      setAllWrappedTokens(assetsResponse.assets);
      try {
        const statsResponse = await getWrappedCollectionStats();
        console.log({ statsResponse });
        setTotalSupply(statsResponse.stats.total_supply);
      } catch (e) {
        console.log(e);
      }
      setLoadingWrappedTokens(false);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchMetadataAndUpdate();
  }, [readContracts[wrapperContract], page, mine]);

  const onFinishFailed = errorInfo => {
    console.log("Failed:", errorInfo);
  };

  const [form] = Form.useForm();
  const sendForm = id => {
    const [sending, setSending] = useState(false);

    return (
      <div>
        <Form
          form={form}
          layout={"inline"}
          name="sendOE"
          initialValues={{ tokenId: id }}
          onFinish={async values => {
            setSending(true);
            try {
              const txCur = await tx(
                writeContracts[wrapperContract]["safeTransferFrom(address,address,uint256)"](address, values["to"], id),
              );
              await txCur.wait();
              fetchMetadataAndUpdate();
              setSending(false);
            } catch (e) {
              console.log("send failed", e);
              setSending(false);
            }
          }}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            name="to"
            rules={[
              {
                required: true,
                message: "Which address should receive this NFT?",
              },
            ]}
          >
            <AddressInput ensProvider={mainnetProvider} placeholder={"to address"} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={sending}>
              Send
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  };

  let filteredOEs = Object.values(allWrappedTokens);
  // let filteredOEs = Object.values(allWrappedTokens).filter(
  //   a => a.owner.address !== "0x0000000000000000000000000000000000000000",
  // );

  console.log({ allWrappedTokens, filteredOEs });

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
            <Switch
              disabled={loadingWrappedTokens}
              style={{ marginLeft: 5 }}
              value={mine}
              onChange={() => {
                setMine(!mine);
              }}
              checkedChildren="mine"
              unCheckedChildren="all"
            />
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
              total: mine ? filteredOEs.length : totalSupply,
              defaultPageSize: perPage,
              defaultCurrent: page,
              onChange: currentPage => {
                setPage(currentPage - 1);
              },
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${mine ? filteredOEs.length : totalSupply} items`,
            }}
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
                        readContracts[wrapperContract] && readContracts[wrapperContract].address
                      }?a=${id}`}
                      target="_blank"
                    >
                      <img src={item.image_url && item.image_url} alt={"WrappedTokens #" + id} width="100" />
                    </a>
                    {item.owner && (
                      <div>
                        Creator:
                        <Address
                          address={item.creator.address}
                          ensProvider={mainnetProvider}
                          blockExplorer={blockExplorer}
                          fontSize={16}
                        />
                      </div>
                    )}
                    {address && item.owner.address == address.toLowerCase() && (
                      <>
                        <Button
                          type="primary"
                          onClick={async () => {
                            try {
                              await handleUnwrap(item.token_id, writeContracts[wrapperContract], tx);
                            } catch (e) {
                              console.log("wrap failed", e);
                            }
                          }}
                        >
                          Unwrap
                        </Button>
                        <Popover
                          content={() => {
                            return sendForm(id);
                          }}
                          title="Transfer:"
                        >
                          <Button type="primary">Transfer</Button>
                        </Popover>
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

export default WrappedTokens;
