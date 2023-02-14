import { ethers } from 'ethers';
import collectivePortraitRegistryABI from './abi/collectivePortraitRegistryABI';
import userPortraitRegistryABI from './abi/userPortraitRegistryABI';
import betaPassABI from './abi/betaPassABI';

export class Portrait {
  portraitNetwork?: string = 'goerli';
  alchemyApiKey?: string;
  portraitProvider?: any = this.alchemyApiKey
    ? new ethers.AlchemyProvider(this.portraitNetwork, this.alchemyApiKey)
    : ethers.getDefaultProvider(this.portraitNetwork);
  // TO-DO: Add the correct Collective Portrait contract address
  collectivePortraitRegistryABI?: ethers.InterfaceAbi =
    collectivePortraitRegistryABI;
  portraitCollectiveContract?: any = new ethers.Contract(
    '0xE745bD3a55B50C2e167980C6438f46e20c906DB3',
    this.collectivePortraitRegistryABI,
    this.portraitProvider,
  );

  userPortraitRegistryABI?: ethers.InterfaceAbi = userPortraitRegistryABI;
  portraitUserContract?: ethers.ContractInterface = new ethers.Contract(
    '0xCf39966d2De5d1ee035B66504BcB701adc9DDa47',
    this.userPortraitRegistryABI,
    this.portraitProvider,
  );

  betaPassABI?: ethers.InterfaceAbi = betaPassABI;
  portraitBetaNFTContract?: ethers.ContractInterface = new ethers.Contract(
    '0xCf39966d2De5d1ee035B66504BcB701adc9DDa47',
    this.betaPassABI,
    this.alchemyApiKey
      ? new ethers.AlchemyProvider('mainnet', this.alchemyApiKey)
      : ethers.getDefaultProvider('mainnet'),
  );

  arweaveGraphQLprovider?: string =
    'https://arweave-search.goldsky.com/graphql';
  arweaveGateway?: string = 'https://arweave.net';
  ipfsGateway?: string | string[] = [
    'https://ipfs.io/ipfs/',
    'https://cloudflare-ipfs.com/ipfs/',
    'https://ipfs.infura.io/ipfs/',
    'https://ipfs.fleek.co/ipfs/',
    'https://ipfs.dweb.link/ipfs/',
  ];

  async hasBetaAccess(address: string): Promise<boolean> {
    const balance = this.portraitBetaNFTContract.balanceOf(address);
    return (await balance) === 1;
  }
}
