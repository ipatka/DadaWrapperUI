const DadaCollectibleABI = [
  {
    constant: false,
    inputs: [
      {
        name: "drawingId",
        type: "uint256",
      },
      {
        name: "printIndex",
        type: "uint256",
      },
      {
        name: "minSalePriceInWei",
        type: "uint256",
      },
      {
        name: "toAddress",
        type: "address",
      },
    ],
    name: "offerCollectibleForSaleToAddress",
    outputs: [],
    payable: false,
    type: "function",
  },
];

const DadaNFTABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_collectibleId",
        type: "uint256",
      },
    ],
    name: "collectibleInfo",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "",
        type: "string",
      },
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    name: "isApprovedForAll",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
const DadaWrapperABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_dadaCollectibleAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "_dadaNftAddress",
        type: "address",
      },
      {
        internalType: "string",
        name: "baseURI_",
        type: "string",
      },
      {
        internalType: "string",
        name: "_contractURI",
        type: "string",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "approved",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "_2017DrawingId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "_2017PrintIndex",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_wrappedTokenId",
        type: "uint256",
      },
    ],
    name: "Unwrapped2017",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "_2019TokenId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "_2019TokenNumber",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_wrappedTokenId",
        type: "uint256",
      },
    ],
    name: "Unwrapped2019",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "_2017DrawingId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "_2017PrintIndex",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_wrappedTokenId",
        type: "uint256",
      },
    ],
    name: "Wrapped2017",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "_2019TokenId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "_2019TokenNumber",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_wrappedTokenId",
        type: "uint256",
      },
    ],
    name: "Wrapped2019",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "contractURI",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_2017DrawingId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_2017PrintIndex",
        type: "uint256",
      },
    ],
    name: "get2017TokenId",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_2019TokenId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_2019TokenNumber",
        type: "uint256",
      },
    ],
    name: "get2019TokenId",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "getApproved",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    name: "isApprovedForAll",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "baseURI_",
        type: "string",
      },
    ],
    name: "setBaseURI",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_contractURI",
        type: "string",
      },
    ],
    name: "setContractURI",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "tokenURI",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_2017DrawingId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_2017PrintIndex",
        type: "uint256",
      },
    ],
    name: "unwrap2017",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_2019TokenNumber",
        type: "uint256",
      },
    ],
    name: "unwrap2019",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_2017DrawingId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_2017PrintIndex",
        type: "uint256",
      },
    ],
    name: "wrap2017",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_2019TokenNumber",
        type: "uint256",
      },
    ],
    name: "wrap2019",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

// Mainnet DAI, Optimism and Arbitrium Rollup Contracts with local addresses
module.exports = {
  1: {
    contracts: {
      DadaCollectible: {
        address: "0x068696A3cf3c4676B65F1c9975dd094260109d02",
        abi: DadaCollectibleABI,
      },
      DadaNFT: {
        address: "0x34d77a17038491a2a9eaa6e690b7c7cd39fc8392",
        abi: DadaNFTABI,
      },
      DadaWrapper: {
        address: "0x5F53f9f5DcF76757f7CbF35C2e47164C65b9b5eD",
        abi: DadaWrapperABI,
      },
    },
  },
  4: {
    contracts: {
      DadaCollectible: {
        address: "0xAaDDe94e690EC67CD9AaE3f9D7bF38E065810111",
        abi: DadaCollectibleABI,
      },
      DadaNFT: {
        address: "0x7A8671a0b3b29268eED685da9CbF193157D85aF9",
        abi: DadaNFTABI,
      },
      DadaWrapper: {
        address: "0x5F53f9f5DcF76757f7CbF35C2e47164C65b9b5eD",
        abi: DadaWrapperABI,
      },
    },
  },
};
