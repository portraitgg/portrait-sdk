import { ethers } from 'ethers';
import collectivePortraitRegistryABI from './abi/collectivePortraitRegistryABI';
import userPortraitRegistryABI from './abi/userPortraitRegistryABI';
import betaPassABI from './abi/betaPassABI';

import {
  PortraitObject,
  Identity,
  UserPortraitAddress,
  UserPortraitENSName,
  CollectivePortraitName,
} from './types';

import {
  isAddress,
  isValidENSName,
  isCollectivePortraitName,
  fetchPortrait,
} from './helpers';

export class Portrait {
  /**
   * Initialize the Portrait class, which will be used to interact with the Portrait Protocol.
   *
   * @remarks
   * The Portrait SDK is a wrapper around the Portrait Protocol, which provides helper functions to simplify the process of interacting with the Portrait Protocol.
   * This class is used to interact with the Portrait Protocol. It is recommended to use the default values for the parameters, unless you are deeply familiar with the Portrait Protocol, or for testing purposes.
   * It is recommended to use the Alchemy API key for production, as this is more reliable and secure than using Ethers' default provider.
   * If this SDK is used for backend purposes, or local instances, and the user would like to write to the Portrait Protocol, they will need to pass in their Ethereum private key.
   * If this SDK is used for frontend purposes, the end user will write to the Portrait Protocol, and will need to sign and send transactions. In this case, the functions within the SDK will return the transaction object, and it is up to the user to sign and send the transaction.
   * All of the parameters are optional, and the default values will be used if they are not set. If you are using the default values, you can simply call `new Portrait()`.
   *
   * @param {string} ethereumPrivateKey - The private key of a user's Ethereum wallet, if they would like to sign and send transactions.
   * @param {string} alchemyApiKey - The API key for Alchemy, if the user would like to use Alchemy as their provider. This is recommended for production.
   * @param {string} portraitNetwork - The network that the user would like to use. This is recommended to be set to 'goerli', as Portrait is currently only deployed on the Goerli testnet.
   * @param {any} portraitProvider - The provider that the user would like to use. This is recommended to be set to the Alchemy API key, as it is the most reliable and secure provider. However, if the user would like to use a different provider, they can do so by passing in the provider here. The default provider will be used if this parameter is not set.
   * @param {ethers.utils.Interface} collectivePortraitRegistryABI - The ABI for the Collective Portrait Registry contract. This is recommended to be left as the default value, unless the user is deeply familiar with the Portrait Protocol.
   * @param {ethers.Contract} portraitCollectiveContract - The Collective Portrait Registry contract. This is recommended to be left as the default value, unless the user is deeply familiar with the Portrait Protocol.
   * @param {ethers.utils.Interface} userPortraitRegistryABI - The ABI for the User Portrait Registry contract. This is recommended to be left as the default value, unless the user is deeply familiar with the Portrait Protocol.
   * @param {ethers.Contract} portraitUserContract - The User Portrait Registry contract. This is recommended to be left as the default value, unless the user is deeply familiar with the Portrait Protocol.
   * @param {ethers.utils.Interface} betaPassABI - The ABI for the Beta Pass NFT contract. This is recommended to be left as the default value, unless the user is deeply familiar with the Portrait Protocol.
   * @param {ethers.Contract} portraitBetaNFTContract - The Beta Pass NFT contract. This is recommended to be left as the default value, unless the user is deeply familiar with the Portrait Protocol.
   * @param {ethers.Wallet} portraitWallet - The wallet that the user would like to use to sign and send transactions. This is recommended to be left as the default value, unless the user is deeply familiar with the Portrait Protocol.
   * @param {string} arweaveGraphQLprovider - The GraphQL provider that the user would like to use to interact with Arweave. If the user would like to use a different provider, they can do so by passing in the provider here. The default provider will be used if this parameter is not set.
   * @param {string} arweaveGateway - The gateway that the user would like to use to interact with Arweave.
   * @param {string | string[]} ipfsGateway - The gateway that the user would like to use to interact with IPFS. If the user would like to use one, or multiple gateways, they can do so by passing in the gateway here. The default gateways will be used if this parameter is not set.
   *
   * @returns {Portrait} - The Portrait class, which can be used to interact with the Portrait Protocol.
   *
   * @beta
   */
  ethereumPrivateKey?: string;
  alchemyApiKey?: string;
  portraitNetwork?: string = 'goerli';
  portraitProvider?: any = this.alchemyApiKey
    ? new ethers.providers.AlchemyProvider(
        this.portraitNetwork,
        this.alchemyApiKey,
      )
    : ethers.getDefaultProvider(this.portraitNetwork);
  collectivePortraitRegistryABI?: ethers.utils.Interface =
    new ethers.utils.Interface(collectivePortraitRegistryABI);
  portraitCollectiveContract?: any = new ethers.Contract(
    '0xE745bD3a55B50C2e167980C6438f46e20c906DB3',
    this.collectivePortraitRegistryABI,
    this.portraitProvider,
  );

  userPortraitRegistryABI?: ethers.utils.Interface = new ethers.utils.Interface(
    userPortraitRegistryABI,
  );
  portraitUserContract?: ethers.Contract = new ethers.Contract(
    '0xCf39966d2De5d1ee035B66504BcB701adc9DDa47',
    this.userPortraitRegistryABI,
    this.portraitProvider,
  );

  betaPassABI?: ethers.utils.Interface = new ethers.utils.Interface(
    betaPassABI,
  );
  portraitBetaNFTContract?: ethers.Contract = new ethers.Contract(
    '0xCf39966d2De5d1ee035B66504BcB701adc9DDa47',
    this.betaPassABI,
    this.alchemyApiKey
      ? new ethers.providers.AlchemyProvider('mainnet', this.alchemyApiKey)
      : ethers.getDefaultProvider('mainnet'),
  );

  wallet?: ethers.Wallet = new ethers.Wallet(
    this.ethereumPrivateKey,
    this.portraitProvider,
  );

  arweaveGraphQLprovider?: string =
    'https://arweave-search.goldsky.com/graphql';
  arweaveGateway?: string = 'https://arweave.net';
  ipfsGateways?: string[] = [
    'https://ipfs.io/ipfs/',
    'https://cloudflare-ipfs.com/ipfs/',
    'https://ipfs.infura.io/ipfs/',
    'https://ipfs.fleek.co/ipfs/',
    'https://ipfs.dweb.link/ipfs/',
  ];

  defaultProvider?: any = this.alchemyApiKey
    ? new ethers.providers.AlchemyProvider('mainnet', this.alchemyApiKey)
    : ethers.getDefaultProvider('mainnet');

  collective = new Collective(this);
  user = new User(this);
  helpers = new Helpers(this);

  /**
   * Get a Portrait
   * @param {Identity} identity - The identity of the user that the user would like to get a Portrait for.
   *
   * @returns {Promise<PortraitObject>} - The Portrait object, which contains the user's Portrait data.
   *
   * @beta
   */
  getPortrait(identity: Identity): Promise<PortraitObject> {
    const hash = this.getPortraitHash(identity);

    return fetchPortrait(
      this.ipfsGateways,
      this.arweaveGateway,
      hash,
      this.arweaveGraphQLprovider,
      this.defaultProvider.resolveName(identity)
        ? this.defaultProvider.resolveName(identity)
        : isAddress(identity)
        ? identity
        : null,
    );
  }

  /**
   * Get a Portrait Hash
   *
   * @remarks
   * This function will return the hash of the user's Portrait, if the user has a Portrait. If the user does not have a Portrait, this function will return null.
   *
   * @param {Identity} identity - The identity of the user that the user would like to get a Portrait hash for.
   *
   * @returns {string} - The hash of the user's Portrait, if the user has a Portrait. If the user does not have a Portrait, this function will return null.
   *
   * @beta
   */
  getPortraitHash(identity: Identity): string {
    return isAddress(identity)
      ? this.user.getPortraitHash(identity)
      : isValidENSName(identity)
      ? this.user.getPortraitHash(this.defaultProvider.resolveName(identity))
      : isCollectivePortraitName(identity)
      ? this.collective.getPortraitHash(identity)
      : null;
  }
}

/**
 * Initialize the Collective class, which can be used to interact with the Collective Portrait Registry contract.
 *
 * @remarks
 * The Collective Portrait logic is currently in early development. Future versions of the Portrait Protocol will include more functionality.
 * As such, the Collective Portrait Registry contract is deployed on the Goerli testnet, and is not yet deployed on an EVM mainnet.
 *
 * @param {Portrait} portrait - The Portrait class, which can be used to interact with the Portrait Protocol.
 * @returns {Collective} - The Collective class, which can be used to interact with the Collective Portrait Registry contract.
 *
 * @beta
 */
class Collective {
  portrait: Portrait;
  constructor(portrait: Portrait) {
    this.portrait = portrait;
  }

  getPortrait(name: CollectivePortraitName): Promise<PortraitObject> {
    const hash = this.getPortraitHash(name);
    return fetchPortrait(
      this.portrait.ipfsGateways,
      this.portrait.arweaveGateway,
      hash,
      this.portrait.arweaveGraphQLprovider,
    );
  }

  getPortraitHash(name: CollectivePortraitName): string {
    const collectivePortraitHash =
      this.portrait.portraitCollectiveContract.getPortraitHash(name);
    return collectivePortraitHash;
  }
}

/**
 * Initialize the User class, which can be used to interact with the User Portrait Registry contract.
 *
 * @remarks
 * The User Portrait logic is currently in early development. Future versions of the Portrait Protocol will include more functionality.
 * As such, the User Portrait Registry contract is deployed on the Goerli testnet, and is not yet deployed on an EVM mainnet.
 *
 * @param {Portrait} portrait - The Portrait class, which can be used to interact with the Portrait Protocol.
 * @returns {User} - The User class, which can be used to interact with the User Portrait Registry contract.
 *
 * @beta
 */
class User {
  portrait: Portrait;
  constructor(portrait: Portrait) {
    this.portrait = portrait;
  }

  getPortrait(
    userAddress: Exclude<Identity, CollectivePortraitName>,
  ): Promise<JSON> {
    const hash = this.getPortraitHash(userAddress);
    return fetchPortrait(
      this.portrait.ipfsGateways,
      this.portrait.arweaveGateway,
      hash,
      this.portrait.arweaveGraphQLprovider,
      userAddress,
    );
  }

  getPortraitHash(addressOrENS: Identity): string {
    if (!isAddress(addressOrENS)) {
      throw new Error('Invalid address or ENS name.');
    }
    const portraitHash =
      this.portrait.portraitUserContract.getPersonalIpfsCID(addressOrENS);
    return portraitHash;
  }
}

/**
 * Initialize the Helpers class, which can be used to interact with the Portrait Protocol.
 *
 * @remarks
 * The Helpers class contains helper functions that can be used to interact with the Portrait Protocol.
 * These helper functions abstract away the complexity of interacting with the Portrait Protocol, and can be used to simplify the process of interacting with the Portrait Protocol.
 * To optimize the Smart Contract, the Portrait Protocol does not include helper functions. Instead, helper functions are provided by the Portrait SDK.
 *
 * @param {Portrait} portrait - The Portrait class, which can be used to interact with the Portrait Protocol.
 * @returns {Helpers} - The Helpers class, which can be used to interact with helper functions for the Portrait Protocol.
 *
 * @beta
 */
class Helpers {
  portrait: Portrait;
  constructor(portrait: Portrait) {
    this.portrait = portrait;
  }
}
