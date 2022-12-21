import { BigNumberish, ethers } from 'ethers';
import { TokenInfo } from '~/types/blockchain';

export function numberStringToTokenAmount(float: string, tokenInfo: TokenInfo) {
  return ethers.utils.parseUnits(float, tokenInfo.decimals);
}

export function tokenAmountToNumberString(
  amount: BigNumberish,
  tokenInfo: TokenInfo,
) {
  return ethers.utils.formatUnits(amount, tokenInfo.decimals);
}
