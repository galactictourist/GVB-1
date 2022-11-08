export enum BlockchainNetwork {
  // ETHEREUM = 'ETHEREUM',
  // BSC = 'BSC',
  // POLYGON = 'POLYGON',
  POLYGON_MUMBAI = 'POLYGON_MUMBAI',
}

interface BlockchainConfig {
  chainId: number;
  name: string;
  endpoints: readonly string[];
  explorer: string;
  constract: {
    erc721: string;
  };
}

export const BLOCKCHAIN_INFO: {
  [key in BlockchainNetwork]: BlockchainConfig;
} = {
  [BlockchainNetwork.POLYGON_MUMBAI]: {
    chainId: 80001,
    name: 'Matic Testnet - Mumbai',
    endpoints: ['https://rpc-mumbai.maticvigil.com'],
    explorer: 'https://mumbai.polygonscan.com',
    constract: {
      erc721: '0x9980A88ca5a2197B9A95d582cF3C0839f51ff287',
    },
  },
} as const;
