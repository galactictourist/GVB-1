import { BigNumberish, Contract, providers, Wallet } from 'ethers';
import { Interface } from 'ethers/lib/utils';
import { BlockchainNetwork, BLOCKCHAIN_INFO } from '~/main/types/blockchain';

interface Overrides {
  from?: string;
  gasPrice?: BigNumberish;
  gasLimit?: BigNumberish;
  value?: BigNumberish;
  nonce?: BigNumberish;
  blockTag?: any;
}

export abstract class BaseSmartContractService {
  protected abi: Interface;

  protected getContract(network: BlockchainNetwork, contractAddress: string) {
    return new Contract(
      contractAddress,
      this.abi,
      new providers.JsonRpcProvider(BLOCKCHAIN_INFO[network].endpoints[0]),
    );
  }

  protected abstract getContractAddress(network: BlockchainNetwork): string;

  protected getSignerContract(
    network: BlockchainNetwork,
    contractAddress: string,
    privateKey: string,
  ) {
    return new Contract(
      contractAddress,
      this.abi,
      new Wallet(
        privateKey,
        new providers.JsonRpcProvider(BLOCKCHAIN_INFO[network].endpoints[0]),
      ),
    );
  }

  protected async read(
    contract: Contract,
    method: string,
    args: any[],
    options: Overrides = {},
  ) {
    const result = (await contract[method](...args, options)) as any;
    return result;
  }

  protected async write(
    signerContract: Contract,
    method: string,
    args: any[],
    options: Overrides = {},
    cb?: (hash: string) => void,
  ) {
    const receipt = (await signerContract[method](
      ...args,
      options,
    )) as providers.TransactionResponse;
    if (cb) {
      cb(receipt.hash);
    }
    await receipt.wait();
    console.log(`Tx successful with hash: ${receipt.hash}`);
  }
}
