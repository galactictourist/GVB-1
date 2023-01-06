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
    enabled: true,
    chainId: 80001,
    name: 'Polygon Testnet - Mumbai',
    endpoints: ['https://rpc-mumbai.maticvigil.com'],
    explorer: 'https://mumbai.polygonscan.com',
    constract: {
      erc721: {
        address: '0x4AEc07e38a5a045c3f65bA2bbF4d2BcEb2b77d36',
        // address: '0xC954AF5Cf0D34DC5B827a2Dc5B3f8055c862DC42', // '0x57baA35a806bDa26B4c3DDc0329804017689d2E7',
        name: 'GBCollection',
      } as const,
      marketplace: {
        address: '0x415F1AeB524f445C96800D513F60Dc59185b3b39', // '0x2978606902693E7114e45e65CE25504611D5E24C',
        name: 'GBMarketplace',
        version: '1.0.0',
        types: {
          OrderItem: [
            {
              name: 'nftContract',
              type: 'address',
            },
            {
              name: 'seller',
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
