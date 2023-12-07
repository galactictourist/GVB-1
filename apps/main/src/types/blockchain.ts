import { Network } from 'alchemy-sdk';
import { BigNumber, BigNumberish, ethers, TypedDataField } from 'ethers';

export enum BlockchainNetwork {
  POLYGON_MUMBAI = 'POLYGON_MUMBAI',
  // POLYGON = 'POLYGON',
  // ETHEREUM = 'ETHEREUM',
  // BSC = 'BSC',
  BSC_TESTNET = 'BSC_TESTNET',
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
  version?: string;
  types?: Record<string, Array<TypedDataField>>;
}

interface BlockchainConfig {
  enabled: boolean;
  chainId: number;
  alchemyNetwork?: Network;
  name: string;
  endpoints: readonly string[];
  explorer: string;
  constract: {
    erc721: ContractInfo;
    marketplace: ContractInfo;
  };
  currency: { [key in CryptoCurrency]: TokenInfo };
}

export const batchTypes = {
  Batch: [
    {
      name: 'nftContract',
      type: 'address',
    },
    {
      name: 'itemType',
      type: 'uint256',
    },
    {
      name: 'seller',
      type: 'address',
    },
    {
      name: 'artist',
      type: 'address',
    },
    {
      name: 'charityAddress',
      type: 'address',
    },
    {
      name: 'charityShare',
      type: 'uint96',
    },
    {
      name: 'royaltyFee',
      type: 'uint96',
    },
    {
      name: 'deadline',
      type: 'uint256',
    },
    { name: 'salt', type: 'uint256' },
  ],
};

export const BLOCKCHAIN_INFO: {
  [key in BlockchainNetwork]: BlockchainConfig;
} = {
  [BlockchainNetwork.POLYGON_MUMBAI]: {
    enabled: true,
    chainId: 80001,
    alchemyNetwork: Network.MATIC_MUMBAI,
    name: 'Polygon Testnet - Mumbai',
    endpoints: [
      // 'https://polygon-mumbai.g.alchemy.com/v2/2nMHQF5YQQybtCijNX-tNWi9qo7PObMx',
      `https://polygon-mumbai.g.alchemy.com/v2/${process.env.MUMBAI_ALCHEMY_API_KEY}`,
    ],
    explorer: 'https://mumbai.polygonscan.com',
    constract: {
      erc721: {
        address: '0xa3706f2c177d7e32db69a6bd159ae91f83513403',
        name: 'GBCollection',
      } as const,
      marketplace: {
        address: '0xa7536a5C9aA1D93cF0f44eDF4652A56780Bb8477',
        name: 'GBMarketplace',
        version: '1.0.0',
        types: {
          // EIP712Domain: [
          //   {
          //     name: 'name',
          //     type: 'string',
          //   },
          //   {
          //     name: 'version',
          //     type: 'string',
          //   },
          //   {
          //     name: 'chainId',
          //     type: 'uint256',
          //   },
          //   {
          //     name: 'verifyingContract',
          //     type: 'address',
          //   },
          // ],
          OrderItem: [
            {
              name: 'nftContract',
              type: 'address',
            },
            {
              name: 'itemType',
              type: 'uint256',
            },
            {
              name: 'seller',
              type: 'address',
            },
            {
              name: 'artist',
              type: 'address',
            },
            { name: 'isMinted', type: 'bool' },
            {
              name: 'tokenId',
              type: 'uint256',
            },
            {
              name: 'tokenURI',
              type: 'string',
            },
            {
              name: 'quantity',
              type: 'uint256',
            },
            {
              name: 'itemPrice',
              type: 'uint256',
            },
            {
              name: 'charityAddress',
              type: 'address',
            },
            {
              name: 'charityShare',
              type: 'uint96',
            },
            {
              name: 'royaltyFee',
              type: 'uint96',
            },
            {
              name: 'deadline',
              type: 'uint256',
            },
            { name: 'salt', type: 'uint256' },
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
  [BlockchainNetwork.BSC_TESTNET]: {
    enabled: false,
    chainId: 97,
    name: 'BSC Testnet',
    endpoints: [
      'https://data-seed-prebsc-1-s1.binance.org:8545',
      'https://data-seed-prebsc-2-s1.binance.org:8545',
      'https://data-seed-prebsc-1-s2.binance.org:8545',
      'https://data-seed-prebsc-2-s2.binance.org:8545',
      'https://data-seed-prebsc-1-s3.binance.org:8545',
      'https://data-seed-prebsc-2-s3.binance.org:8545',
    ],
    explorer: 'https://testnet.bscscan.com',
    constract: {
      erc721: {
        address: '0x0',
        name: 'GBCollection',
      } as const,
      marketplace: {
        address: '0x0',
        name: 'GBMarketplace',
        version: '1.0.0',
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
        name: 'Binance BNB',
        symbol: 'BNB',
        decimals: 18,
        address: null,
      },
      [CryptoCurrency.ETH]: {
        enabled: true,
        name: 'Ethereum',
        symbol: 'ETH',
        decimals: 18,
        address: '0x0',
      },
      [CryptoCurrency.BNB]: {
        enabled: false,
        name: 'Matic',
        symbol: 'MATIC',
        decimals: 18,
        address: '0x0',
      },
    },
  },
} as const;

export function getAllBlockchainNetworks() {
  return BLOCKCHAIN_INFO;
}

export function getEnabledBlockchainNetworks() {
  const result: {
    [key in BlockchainNetwork]?: BlockchainConfig;
  } = {};
  Object.keys(BLOCKCHAIN_INFO).forEach(
    (key: keyof typeof BlockchainNetwork) => {
      if (BLOCKCHAIN_INFO[key].enabled) {
        result[key] = BLOCKCHAIN_INFO[key];
      }
    },
  );
  return result;
}

export function getNetworkConfig(network: BlockchainNetwork) {
  return BLOCKCHAIN_INFO[network];
}

export function getErc721SmartContract(network: BlockchainNetwork) {
  return BLOCKCHAIN_INFO[network].constract.erc721;
}

export function getMarketplaceSmartContract(network: BlockchainNetwork) {
  return BLOCKCHAIN_INFO[network].constract.marketplace;
}

export function isCryptoCurrencyEnabled(
  network: BlockchainNetwork,
  currency: CryptoCurrency,
) {
  return BLOCKCHAIN_INFO[network].currency[currency].enabled;
}

export function parseCryptoAmount(
  network: BlockchainNetwork,
  currency: CryptoCurrency,
  value: string,
): BigNumber {
  return ethers.utils.parseUnits(
    value,
    BLOCKCHAIN_INFO[network].currency[currency].decimals,
  );
}

export function formatCryptoAmount(
  network: BlockchainNetwork,
  currency: CryptoCurrency,
  value: BigNumberish,
): string {
  return ethers.utils.formatUnits(
    value,
    BLOCKCHAIN_INFO[network].currency[currency].decimals,
  );
}

export function mulCryptoAmount(
  network: BlockchainNetwork,
  currency: CryptoCurrency,
  value: string,
  mul: BigNumberish,
) {
  return formatCryptoAmount(
    network,
    currency,
    parseCryptoAmount(network, currency, value).mul(mul),
  );
}
