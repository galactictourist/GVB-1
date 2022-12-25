import { BigNumber, BigNumberish, ethers, TypedDataField } from 'ethers';

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
  enable: boolean;
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
    enable: true,
    chainId: 80001,
    name: 'Polygon Testnet - Mumbai',
    endpoints: ['https://rpc-mumbai.maticvigil.com'],
    explorer: 'https://mumbai.polygonscan.com',
    constract: {
      erc721: {
        address: '0x713e7ac007277644e778FD77d7C8DcD2629B5bE4',
        // address: '0xC954AF5Cf0D34DC5B827a2Dc5B3f8055c862DC42', // '0x57baA35a806bDa26B4c3DDc0329804017689d2E7',
        name: 'GBCollection',
      } as const,
      marketplace: {
        address: '0xEc2BC804AA4872d4dc57D21d68b060bD2cBC2205', // '0x2978606902693E7114e45e65CE25504611D5E24C',
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
