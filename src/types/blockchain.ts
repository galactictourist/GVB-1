import { TypedDataField } from 'ethers';

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

export interface ContractInfo {
  name: string;
  address: string;
  types?: Record<string, Array<TypedDataField>>;
}

interface BlockchainConfig {
  chainId: number;
  name: string;
  endpoints: readonly string[];
  explorer: string;
  constract: {
    erc721: ContractInfo;
    marketplace: ContractInfo;
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
      erc721: {
        address: '0x57baA35a806bDa26B4c3DDc0329804017689d2E7',
        name: 'GBCollection',
      } as const,
      marketplace: {
        address: '0x2978606902693E7114e45e65CE25504611D5E24C',
        name: 'GBMarketplace',
        types: {
          AddSingleItem: [
            { type: 'address', name: 'account' },
            { type: 'address', name: 'collection' },
            { type: 'uint256', name: 'tokenId' },
            { type: 'uint96', name: 'royaltyFee' },
            { type: 'string', name: 'tokenURI' },
            { type: 'uint256', name: 'deadline' },
            { type: 'uint256', name: 'nonce' },
          ],
          BuyItem: [
            { type: 'address', name: 'account' },
            { type: 'address', name: 'collection' },
            { type: 'address', name: 'seller' },
            { type: 'uint256', name: 'tokenId' },
            { type: 'uint256', name: 'itemPrice' },
            { type: 'uint256', name: 'additionalPrice' },
            { type: 'address', name: 'charityAddress' },
            { type: 'uint96', name: 'charityFee' },
            { type: 'uint256', name: 'deadline' },
            { type: 'uint256', name: 'nonce' },
          ],
          UpdateTokenURI: [
            { type: 'address', name: 'account' },
            { type: 'address', name: 'collection' },
            { type: 'uint256', name: 'tokenId' },
            { type: 'string', name: 'tokenURI' },
            { type: 'uint256', name: 'deadline' },
            { type: 'uint256', name: 'nonce' },
          ],
        } as Record<string, Array<TypedDataField>>,
      },
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
        enabled: true,
        name: 'Ethereum',
        symbol: 'ETH',
        decimals: 18,
        address: '0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa',
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

export function getErc721SmartContract(network: BlockchainNetwork) {
  return BLOCKCHAIN_INFO[network].constract.erc721;
}
