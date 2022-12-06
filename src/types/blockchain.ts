export enum BlockchainNetwork {
  // ETHEREUM = 'ETHEREUM',
  // BSC = 'BSC',
  // BSC_TESTNET = 'BSC_TESTNET',
  // POLYGON = 'POLYGON',
  POLYGON_MUMBAI = 'POLYGON_MUMBAI',
}

export enum CryptoCurrency {
  NATIVE_CURRENCY = 'NATIVE_CURRENCY',
  ETH = 'ETH',
  BNB = 'BNB',
}

export interface TokenInfo {
  enabled: boolean;
  name: string;
  symbol: string;
  decimals: number;
  address: string | null;
}

interface BlockchainConfig {
  chainId: number;
  name: string;
  endpoints: readonly string[];
  explorer: string;
  constract: {
    erc721: string;
    marketplace: string;
  };
  currency: { [key in CryptoCurrency]: TokenInfo };
}

export const BLOCKCHAIN_INFO: {
  [key in BlockchainNetwork]: BlockchainConfig;
} = {
  [BlockchainNetwork.POLYGON_MUMBAI]: {
    chainId: 80001,
    name: 'Polygon Testnet - Mumbai',
    endpoints: ['https://rpc-mumbai.maticvigil.com'],
    explorer: 'https://mumbai.polygonscan.com',
    constract: {
      erc721: '0x57baA35a806bDa26B4c3DDc0329804017689d2E7',
      marketplace: '0x2978606902693E7114e45e65CE25504611D5E24C',
    },
    currency: {
      [CryptoCurrency.NATIVE_CURRENCY]: {
        enabled: true,
        name: 'Matic',
        symbol: 'MATIC',
        decimals: 18,
        address: null,
      },
      [CryptoCurrency.ETH]: {
        enabled: false,
        name: 'Ethereum',
        symbol: 'ETH',
        decimals: 18,
        address: '0xabc',
      },
      [CryptoCurrency.BNB]: {
        enabled: false,
        name: 'Binance BNB',
        symbol: 'BNB',
        decimals: 18,
        address: '0xabc',
      },
    },
  },
} as const;
