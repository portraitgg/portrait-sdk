import { ethers } from 'ethers';
import { JsonFragment } from '@ethersproject/abi';
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
   * @param {ethers.Wallet} portraitWallet - The wallet that the user would like to use to sign and send transactions. This is recommended to be left as the default value, unless the user is deeply familiar with the Portrait Protocol.
   * @param {any} portraitProvider - The provider that the user would like to use. This is recommended to be set to the Alchemy API key, as it is the most reliable and secure provider. However, if the user would like to use a different provider, they can do so by passing in the provider here. The default provider will be used if this parameter is not set.
   * @param {ethers.utils.Interface} collectivePortraitRegistryABI - The ABI for the Collective Portrait Registry contract. This is recommended to be left as the default value, unless the user is deeply familiar with the Portrait Protocol.
   * @param {ethers.Contract} portraitCollectiveContract - The Collective Portrait Registry contract. This is recommended to be left as the default value, unless the user is deeply familiar with the Portrait Protocol.
   * @param {ethers.utils.Interface} userPortraitRegistryABI - The ABI for the User Portrait Registry contract. This is recommended to be left as the default value, unless the user is deeply familiar with the Portrait Protocol.
   * @param {ethers.Contract} portraitUserContract - The User Portrait Registry contract. This is recommended to be left as the default value, unless the user is deeply familiar with the Portrait Protocol.
   * @param {ethers.utils.Interface} betaPassABI - The ABI for the Beta Pass NFT contract. This is recommended to be left as the default value, unless the user is deeply familiar with the Portrait Protocol.
   * @param {ethers.Contract} portraitBetaNFTContract - The Beta Pass NFT contract. This is recommended to be left as the default value, unless the user is deeply familiar with the Portrait Protocol.
   * @param {string} arweaveGraphQLprovider - The GraphQL provider that the user would like to use to interact with Arweave. If the user would like to use a different provider, they can do so by passing in the provider here. The default provider will be used if this parameter is not set.
   * @param {string} arweaveGateway - The gateway that the user would like to use to interact with Arweave.
   * @param {string | string[]} ipfsGateway - The gateway that the user would like to use to interact with IPFS. If the user would like to use one, or multiple gateways, they can do so by passing in the gateway here. The default gateways will be used if this parameter is not set.
   *
   * @returns {Portrait} - The Portrait class, which can be used to interact with the Portrait Protocol.
   *
   * @beta
   */

  ethereumPrivateKey?: ethers.utils.SigningKey;
  alchemyApiKey?: string;
  portraitNetwork?: string;
  portraitWallet?: ethers.Wallet;
  portraitProvider?: ethers.providers.Provider;
  collectivePortraitRegistryABI?: ethers.utils.Interface;
  portraitCollectiveContract?: any;
  userPortraitRegistryABI?: ethers.utils.Interface;
  portraitUserContract?: ethers.Contract;
  betaPassABI?: ethers.utils.Interface;
  portraitBetaNFTContract?: ethers.Contract;
  arweaveGraphQLprovider?: string;
  arweaveGateway?: string;
  ipfsGateways?: string[];
  defaultProvider?: any;

  constructor(options: {
    ethereumPrivateKey?: ethers.utils.SigningKey;
    alchemyApiKey?: string;
    portraitNetwork?: string;
    portraitWallet?: ethers.Wallet;
    portraitProvider?: ethers.providers.Provider;
    collectivePortraitRegistryABI?: JsonFragment[];
    portraitCollectiveContract?: any;
    userPortraitRegistryABI?: JsonFragment[];
    portraitUserContract?: ethers.Contract;
    betaPassABI?: JsonFragment[];
    portraitBetaNFTContract?: ethers.Contract;
    arweaveGraphQLprovider?: string;
    arweaveGateway?: string;
    ipfsGateways?: string[];
    defaultProvider?: any;
  }) {
    this.ethereumPrivateKey = options?.ethereumPrivateKey;
    this.alchemyApiKey = options?.alchemyApiKey;
    this.portraitNetwork = options?.portraitNetwork ?? 'goerli';
    this.portraitWallet =
      options?.portraitWallet ?? this.ethereumPrivateKey
        ? new ethers.Wallet(this.ethereumPrivateKey, this.portraitProvider)
        : undefined;
    this.portraitProvider =
      options?.portraitProvider ?? this.alchemyApiKey
        ? new ethers.providers.AlchemyProvider(
            this.portraitNetwork,
            this.alchemyApiKey,
          )
        : ethers.getDefaultProvider(this.portraitNetwork);
    this.collectivePortraitRegistryABI = collectivePortraitRegistryABI
      ? new ethers.utils.Interface(collectivePortraitRegistryABI)
      : undefined;
    this.portraitCollectiveContract =
      options?.portraitCollectiveContract ??
      new ethers.Contract(
        '0xA0355346B2DAe8681e5A3a4106fe01f88070038D',
        this.collectivePortraitRegistryABI,
        this.portraitWallet || this.portraitProvider,
      );
    this.userPortraitRegistryABI = userPortraitRegistryABI
      ? new ethers.utils.Interface(userPortraitRegistryABI)
      : undefined;
    this.portraitUserContract =
      options?.portraitUserContract ??
      new ethers.Contract(
        '0xCf39966d2De5d1ee035B66504BcB701adc9DDa47',
        this.userPortraitRegistryABI,
        this.portraitWallet || this.portraitProvider,
      );
    this.betaPassABI = betaPassABI
      ? new ethers.utils.Interface(betaPassABI)
      : undefined;
    this.portraitBetaNFTContract =
      options?.portraitBetaNFTContract ??
      new ethers.Contract(
        '0xCf39966d2De5d1ee035B66504BcB701adc9DDa47',
        this.betaPassABI,
        this.portraitWallet || this.portraitProvider,
      );
    this.arweaveGraphQLprovider =
      options?.arweaveGraphQLprovider ??
      'https://arweave-search.goldsky.com/graphql';
    this.arweaveGateway = options?.arweaveGateway ?? 'https://arweave.net';
    this.ipfsGateways = options?.ipfsGateways ?? [
      'https://ipfs.io/ipfs/',
      'https://cloudflare-ipfs.com/ipfs/',
      'https://ipfs.infura.io/ipfs/',
      'https://ipfs.fleek.co/ipfs/',
      'https://ipfs.dweb.link/ipfs/',
    ];
    this.defaultProvider = options?.alchemyApiKey
      ? new ethers.providers.AlchemyProvider('mainnet', options.alchemyApiKey)
      : ethers.getDefaultProvider('mainnet');
  }

  collective = new Collective(this);
  user = new User(this);
  helpers = new Helpers(this);

  /**
   * Get a Portrait
   * @param {Identity} identity - The identity of the user that the user would like to get a Portrait for.
   * @returns {Promise<PortraitObject>} - The Portrait object, which contains the user's Portrait data.
   *
   * @beta
   */
  async getPortrait(identity: Identity): Promise<PortraitObject> {
    const hash = await this.getPortraitHash(identity);

    return fetchPortrait(
      this.ipfsGateways,
      this.arweaveGateway,
      hash,
      this.arweaveGraphQLprovider,
      (await this.defaultProvider.resolveName(identity))
        ? await this.defaultProvider.resolveName(identity)
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
   * @returns {string} - The hash of the user's Portrait, if the user has a Portrait. If the user does not have a Portrait, this function will return null.
   *
   * @beta
   */
  async getPortraitHash(identity: Identity): Promise<string> {
    return isAddress(identity)
      ? this.user.getPortraitHash(identity)
      : isValidENSName(identity)
      ? this.user.getPortraitHash(this.defaultProvider.resolveName(identity))
      : isCollectivePortraitName(identity)
      ? this.collective.getPortraitHash(identity)
      : null;
  }

  /**
   * Check if a user has access to the beta version of the Portrait Protocol.
   *
   * @remarks
   * This function will return true if the user has access to the beta version of the Portrait Protocol. If the user does not have access to the beta version of the Portrait Protocol, this function will return false.
   * The beta version of the Portrait Protocol is currently in early development. Future versions of the Portrait Protocol will be publicly available.
   * Acquiring a beta pass is the only way to access the beta version of the Portrait Protocol.
   *
   * @param {UserPortraitAddress | UserPortraitENSName} identity - The identity of the user that the user would like to check if they have access to the beta version of the Portrait Protocol.
   * @returns {boolean} - True if the user has access to the beta version of the Portrait Protocol. False if the user does not have access to the beta version of the Portrait Protocol.
   *
   * @beta
   */
  async hasBetaPass(
    identity: UserPortraitAddress | UserPortraitENSName,
  ): Promise<boolean> {
    const address = isAddress(identity)
      ? identity
      : await this.defaultProvider.resolveName(identity);

    return this.portraitBetaNFTContract.balanceOf(address) === 1 ? true : false;
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

  /**
   * Get a Collective Portrait
   * @param {CollectivePortraitName} name - The name of the Collective Portrait that the user would like to get.
   * @returns {Promise<PortraitObject>} - The Portrait object, which contains the Collective Portrait data.
   * @beta
   * @async
   */
  async getPortrait(name: CollectivePortraitName): Promise<PortraitObject> {
    const hash = await this.getPortraitHash(name);
    return fetchPortrait(
      this.portrait.ipfsGateways,
      this.portrait.arweaveGateway,
      hash,
      this.portrait.arweaveGraphQLprovider,
    );
  }

  /**
   * Get a Collective Portrait Hash
   * @param {CollectivePortraitName} name - The name of the Collective Portrait that the user would like to get a hash for.
   * @returns {string} - The hash of the Collective Portrait.
   * @beta
   * @async
   */
  getPortraitHash(name: CollectivePortraitName): Promise<string> {
    return this.portrait.portraitCollectiveContract.getPortraitHash(name);
  }

  /**
   * Check if the Portrait Protocol is active.
   *
   * @remarks
   * This function will return true if the Portrait Protocol is active. If the Portrait Protocol is paused, this function will return false.
   *
   * @returns {boolean} - True if the Portrait Protocol is active. False if the Portrait Protocol is paused.
   * @beta
   * @async
   */
  isProtocolActive(): boolean {
    const paused = this.portrait.portraitCollectiveContract.paused();
    return paused ? false : true;
  }

  /**
   * Get the treasury address of the Collective Portrait Registry contract.
   *
   * @remarks
   * The treasury address is the address that receives the fees from the Collective Portrait Registry contract.
   *
   * @returns {string} - The treasury address of the Collective Portrait Registry contract.
   * @beta
   * @async
   */
  getTreasuryAddress(): string {
    return this.portrait.portraitCollectiveContract.treasury();
  }

  /**
   * Get the block height epoch used by the Collective Portrait Registry contract in setPortraitHashAsDelegate.
   *
   * @remarks
   * The block height epoch is the block height that is used to verify the block height at which the user's Portrait will be set.
   *
   * @returns {number} - The block height epoch used by the Collective Portrait Registry contract in setPortraitHashAsDelegate.
   * @beta
   * @async
   */
  getBlockHeightEpoch(): number {
    return this.portrait.portraitCollectiveContract.getBlockHeightEpoch();
  }

  /**
   * Get the prices for three character names, four character names, and five character names or more.
   *
   * @remarks
   * Although return type is any, the return value is an object with three properties: threeCharprice, fourCharprice, and FiveCharOrMorePrice.
   * Subject to change.
   *
   * @returns {any} - The prices for three character names, four character names, and five character names or more.
   * @beta
   * @async
   */
  getPricesForLength(): any {
    const prices =
      this.portrait.portraitCollectiveContract.getPricesForLength(length);

    const json = {
      threeCharprice: prices[0],
      fourCharprice: prices[1],
      FiveCharOrMorePrice: prices[2],
    };

    return json;
  }

  /**
   * Get the grace period for the Collective Portrait Registry contract.
   *
   * @remarks
   * The grace period is the amount of time that the user has to renew their Portrait after the Portrait has expired.
   * If the user does not renew their Portrait within the grace period, the name will be put up for auction.
   *
   * @returns {number} - The grace period for the Collective Portrait Registry contract.
   * @beta
   * @async
   */
  getGracePeriod(): number {
    return this.portrait.portraitCollectiveContract.getGracePeriod();
  }

  /**
   * Returns the URI of the Collective Portrait.
   * @param {CollectivePortraitName | number} identity - The name of the Collective Portrait that the user would like to get a URI for.
   * @returns {string} - The URI of the Collective Portrait.
   * @beta
   * @async
   */
  getURI(identity: CollectivePortraitName | number): string {
    return typeof identity === 'number'
      ? this.portrait.portraitCollectiveContract.tokenURI(identity)
      : this.portrait.portraitCollectiveContract.tokenURI(
          this.getTokenIdByName(identity),
        );
  }

  /**
   * Get the auction parameters for the Collective Portrait Registry contract.
   *
   * @remarks
   * The auction parameters are the multiplier, percentage, and epoch used by the Collective Portrait Registry contract to calculate the auction price.
   * Although return type is any, the return value is an object with three properties: auctionMultiplier, auctionPercentage, and auctionEpoch.
   * Subject to change.
   *
   * @returns {any} - The auction parameters for the Collective Portrait Registry contract.
   * @beta
   * @async
   */
  getAuctionParameters(): any {
    const parameters =
      this.portrait.portraitCollectiveContract.getAuctionParameters();

    const json = {
      auctionMultiplier: parameters[0],
      auctionPercentage: parameters[1],
      auctionEpoch: parameters[2],
    };

    return json;
  }

  /**
   * Get the total number of Collective Portraits.
   * @returns {number} - The total number of Collective Portraits.
   * @beta
   * @async
   */
  getPortraitCount(): number {
    return this.portrait.portraitCollectiveContract.getPortraitCount();
  }

  /**
   * Get the valid until time of the Collective Portrait.
   *
   * @remarks
   * The valid until time is the time at which the Collective Portrait will expire.
   * If the user does not renew their Collective Portrait before the valid until time + grace period, the Collective Portrait will be put up for auction.
   *
   * @param {CollectivePortraitName | number} identity - The name of the Collective Portrait that the user would like to get the valid until time for.
   * @returns {number} - The valid until time of the Collective Portrait.
   * @beta
   * @async
   */
  getValidUntil(identity: CollectivePortraitName | number): number {
    const id =
      typeof identity !== 'number' ? this.getTokenIdByName(identity) : identity;
    return this.portrait.portraitCollectiveContract.getValidUntil(id);
  }

  /**
   * Check if the Collective Portrait is up for auction.
   *
   * @remarks
   * The Collective Portrait is up for auction if the current time is greater than the valid until time + grace period and less than the valid until time + grace period + auction epoch.
   * This function is written such that it can terminate early if it finds a false.
   *
   * @param {CollectivePortraitName | number} identity - The name of the Collective Portrait that the user would like to check if it is up for auction.
   * @returns {boolean} - Whether the Collective Portrait is up for auction.
   * @beta
   * @async
   */
  async isAuction(identity: CollectivePortraitName | number): Promise<boolean> {
    const validUntil = this.getValidUntil(identity);

    const currentBlock = this.portrait.portraitProvider.getBlockNumber();
    const block = await this.portrait.portraitProvider.getBlock(currentBlock);

    return validUntil > block.timestamp
      ? false
      : this.getAuctionStartTime(identity) > block.timestamp
      ? false
      : this.getAuctionEndTime(identity) > block.timestamp
      ? false
      : true;
  }

  /**
   * Get the auction start time of the Collective Portrait.
   *
   * @remarks
   * The auction start time is the time at which the Collective Portrait will be put up for auction.
   * The auction start time is equal to the valid until time + grace period.
   * It is recommended to use this in conjunction with the timestamp from the block. You can use the Ethers library to get the timestamp from the block.
   *
   * @param {CollectivePortraitName | number} identity - The name of the Collective Portrait that the user would like to get the auction start time for.
   * @returns {number} - The auction start time of the Collective Portrait.
   * @beta
   * @async
   */
  getAuctionStartTime(identity: CollectivePortraitName | number): number {
    const validUntil = this.getValidUntil(identity);
    return validUntil + this.getGracePeriod();
  }

  /**
   * Get the auction end time of the Collective Portrait.
   *
   * @remarks
   * The auction end time is the time at which the Collective Portrait will no longer be up for auction.
   * This means that the price of the Collective Portrait will no longer be the auction price, but the price of the Collective Portrait for 1 year.
   *
   * @param {CollectivePortraitName | number} identity - The name of the Collective Portrait that the user would like to get the auction end time for.
   * @returns {number} - The auction end time of the Collective Portrait.
   * @beta
   * @async
   */
  getAuctionEndTime(identity: CollectivePortraitName | number): number {
    const validUntil = this.getValidUntil(identity);
    return (
      validUntil +
      this.getGracePeriod() +
      1375 * this.getAuctionParameters().auctionEpoch
    );
  }

  /**
   * Get the registration price of the Collective Portrait.
   *
   * @remarks
   * The registration price is the price of the Collective Portrait for a given number of years.
   * If the Collective Portrait is up for auction, the registration price will be the auction price for the first year.
   * If the Collective Portrait is not up for auction, the registration price will be the price of the Collective Portrait for the given number of years.
   *
   * @param {CollectivePortraitName | number} identity - The name of the Collective Portrait that the user would like to get the registration price for.
   * @param {number} years - The number of years that the user would like to register the Collective Portrait for.
   * @returns {number} - The registration price of the Collective Portrait.
   * @beta
   * @async
   */
  getPrice(identity: CollectivePortraitName | number, years: number): number {
    const name =
      typeof identity === 'number' ? this.getNameByTokenId(identity) : identity;
    return this.portrait.portraitCollectiveContract.getPrice(name, years);
  }

  /**
   * Get the auction price of the Collective Portrait.
   *
   * @remarks
   * The auction price is the price of the Collective Portrait for 1 year.
   * If years > 1, the function will only return the price of the Collective Portrait for 1 year + the price of the Collective Portrait for the remaining years.
   * If the Collective Portrait is not up for auction, this function will throw an error.
   *
   * @param {CollectivePortraitName | number} identity - The name of the Collective Portrait that the user would like to get the auction price for.
   * @param {number} years - The number of years that the user would like to register the Collective Portrait for.
   * @returns {number} - The auction price of the Collective Portrait.
   * @beta
   * @async
   */
  getAuctionPrice(
    identity: CollectivePortraitName | number,
    years: number,
  ): number {
    // Requires the auction to be active
    if (!this.isAuction(identity)) {
      throw new Error('Auction is not active');
    }
    return this.getPrice(identity, years);
  }

  /**
   * Get the token ID of the Collective Portrait for a given name.
   *
   * @remarks
   * The token ID is the unique identifier of the Collective Portrait. It is used to identify the Collective Portrait in the contract, as part of ERC-1155.
   *
   * @param {CollectivePortraitName} name - The name of the Collective Portrait that the user would like to get the token ID for.
   * @returns {number} - The token ID of the Collective Portrait.
   * @beta
   * @async
   */
  getTokenIdByName(name: CollectivePortraitName): number {
    return this.portrait.portraitCollectiveContract.getTokenIdByName(name);
  }

  /**
   * Get the name of the Collective Portrait for a given token ID.
   *
   * @remarks
   * The token ID is the unique identifier of the Collective Portrait. It is used to identify the Collective Portrait in the contract, as part of ERC-1155.
   *
   * @param {number} id - The token ID of the Collective Portrait that the user would like to get the name for.
   * @returns {CollectivePortraitName} - The name of the Collective Portrait.
   * @beta
   * @async
   */
  getNameByTokenId(id: number): CollectivePortraitName {
    return this.portrait.portraitCollectiveContract.getNameByTokenId(id);
  }

  /**
   * Checks if the Collective Portrait is available for registration.
   *
   * @remarks
   * The Collective Portrait is available for registration if the valid until time + grace period is greater than the current timestamp.
   * It is recommend to use this in conjunction with the timestamp from the block. You can use the Ethers library to get the timestamp from the block.
   *
   * @param {CollectivePortraitName} identity - The name of the Collective Portrait that the user would like to check if it is available for registration.
   * @returns {Promise<boolean>} - True if the Collective Portrait is available for registration, false otherwise.
   * @beta
   * @async
   */
  async isAvailable(identity: CollectivePortraitName): Promise<boolean> {
    const validUntil = this.getValidUntil(identity);

    const currentBlock = this.portrait.portraitProvider.getBlockNumber();
    const block = await this.portrait.portraitProvider.getBlock(currentBlock);
    return validUntil + this.getGracePeriod() > block.timestamp ? true : false;
  }

  /**
   * Get all shareholders of the Collective Portrait.
   * @param {CollectivePortraitName | number} identity - The name of the Collective Portrait that the user would like to get the shareholders for.
   * @returns {string[]} - An array of addresses of the shareholders of the Collective Portrait.
   * @beta
   * @async
   */
  getShareholders(identity: CollectivePortraitName | number): string[] {
    const id =
      typeof identity === 'number' ? identity : this.getTokenIdByName(identity);

    return this.portrait.portraitCollectiveContract.getShareholdersByTokenId(
      id,
    );
  }

  /**
   * Get the total number of shares of the Collective Portrait.
   * @param {CollectivePortraitName | number} identity - The name of the Collective Portrait that the user would like to get the total number of shares for.
   * @returns {number} - The total number of shares of the Collective Portrait.
   * @beta
   * @async
   */
  getTotalShares(identity: CollectivePortraitName | number): number {
    const id =
      typeof identity === 'number' ? identity : this.getTokenIdByName(identity);

    return this.portrait.portraitCollectiveContract.totalSupply(id);
  }

  /**
   * Get the number of shares of the Collective Portrait that a shareholder has.
   * @param {CollectivePortraitName | number} identity - The name of the Collective Portrait that the user would like to get the number of shares for.
   * @param {UserPortraitAddress | UserPortraitENSName} shareholder - The address or ENS name of the shareholder that the user would like to get the number of shares for.
   * @returns {number} - The number of shares of the Collective Portrait that the shareholder has.
   * @beta
   * @async
   */
  getSharesByShareholder(
    identity: CollectivePortraitName | number,
    shareholder: UserPortraitAddress | UserPortraitENSName,
  ): number {
    const id =
      typeof identity === 'number' ? identity : this.getTokenIdByName(identity);

    const shareholderAddress = isAddress(shareholder)
      ? shareholder
      : this.portrait.defaultProvider.resolveName(shareholder);

    return this.portrait.portraitCollectiveContract.balanceOf(
      id,
      shareholderAddress,
    );
  }

  /**
   * Get the minimum number of shares required to control the Collective Portrait.
   *
   * @remarks
   * The minimum number of shares required to control the Collective Portrait is the number of shares that a shareholder must have to be able to control the Collective Portrait.
   * Control of the Collective Portrait is defined as being able to change the Collective Portrait's hash, minimum control shares, and share split.
   *
   * @param {CollectivePortraitName | number} identity - The name of the Collective Portrait that the user would like to get the minimum number of shares required to control for.
   * @returns {number} - The minimum number of shares required to control the Collective Portrait.
   * @beta
   * @async
   */
  getMinimumControlShares(identity: CollectivePortraitName | number): number {
    const id =
      typeof identity === 'number' ? this.getNameByTokenId(identity) : identity;

    return this.portrait.portraitCollectiveContract.getMinimumControlShares(id);
  }

  /**
   * Checks if a shareholder has the minimum number of shares required to control the Collective Portrait.
   *
   * @remarks
   * The minimum number of shares required to control the Collective Portrait is the number of shares that a shareholder must have to be able to control the Collective Portrait.
   * Control of the Collective Portrait is defined as being able to change the Collective Portrait's hash, minimum control shares, and share split.
   *
   *  @param {UserPortraitAddress | UserPortraitENSName} shareholder - The address or ENS name of the shareholder that the user would like to check if they have the minimum number of shares required to control the Collective Portrait.
   * @param {CollectivePortraitName | number} identity - The name of the Collective Portrait that the user would like to check if the shareholder has the minimum number of shares required to control for.
   * @returns {boolean} - True if the shareholder has the minimum number of shares required to control the Collective Portrait, false otherwise.
   * @beta
   * @async
   */
  hasMinimumControlShares(
    shareholder: UserPortraitAddress | UserPortraitENSName,
    identity: CollectivePortraitName | number,
  ): boolean {
    return (
      this.getMinimumControlShares(identity) <=
      this.getSharesByShareholder(identity, shareholder)
    );
  }

  /**
   * Set the minimum number of shares required to control the Collective Portrait.
   *
   * @remarks
   * Setting the minimum number of shares required to control the Collective Portrait is the number of shares that a shareholder must have to be able to control the Collective Portrait.
   * Control of the Collective Portrait is defined as being able to change the Collective Portrait's hash, minimum control shares, and share split.
   * Setting the minimum number of shares requires to own the minimum number of shares required to control the Collective Portrait.
   *
   * @param {CollectivePortraitName | number} identity - The name of the Collective Portrait that the user would like to set the minimum number of shares required to control for.
   * @param {number} shares - The minimum number of shares required to control the Collective Portrait.
   * @returns {ethers.ContractTransaction} - The transaction object of the transaction that sets the minimum number of shares required to control the Collective Portrait.
   * @beta
   * @async
   */
  setMinimumControlShares(
    identity: CollectivePortraitName | number,
    shares: number,
  ): Promise<ethers.ContractTransaction> {
    const id =
      typeof identity === 'number' ? identity : this.getTokenIdByName(identity);
    return this.portrait.portraitCollectiveContract.setMinimumControlShares(
      id,
      shares,
    );
  }

  /**
   * Split the shares of the Collective Portrait.
   *
   * @remarks
   * Splitting the shares of the Collective Portrait will split the shares of the Collective Portrait by the multiplier.
   * For example, if the multiplier is 2, then the number of shares of the Collective Portrait will be doubled.
   * The multiplier must be greater than 1.
   * The minimum control shares will be updated to be the minimum control shares multiplied by the multiplier.
   *
   * @param {CollectivePortraitName | number} identity - The name of the Collective Portrait that the user would like to split the shares for.
   * @param {number} multiplier - The multiplier to split the shares by.
   * @returns {ethers.ContractTransaction} - The transaction object of the transaction that splits the shares of the Collective Portrait.
   * @beta
   * @async
   */
  shareSplit(
    identity: CollectivePortraitName | number,
    multiplier: number,
  ): Promise<ethers.ContractTransaction> {
    const id =
      typeof identity === 'number' ? identity : this.getTokenIdByName(identity);

    return this.portrait.portraitCollectiveContract.shareSplit(id, multiplier);
  }

  /**
   * Set the Collective Portrait's hash.
   *
   * @remarks
   * Setting the Collective Portrait's hash will update the Collective Portrait's hash to the new hash.
   * Setting the Collective Portrait's hash requires to own the minimum number of shares required to control the Collective Portrait.
   *
   * @param {CollectivePortraitName | number} identity - The name of the Collective Portrait that the user would like to set the hash for.
   * @param {string} hash - The new hash to set the Collective Portrait's hash to.
   * @returns {ethers.ContractTransaction} - The transaction object of the transaction that sets the Collective Portrait's hash.
   * @beta
   * @async
   */
  setPortraitHash(
    identity: CollectivePortraitName | number,
    hash: string,
  ): ethers.ContractTransaction {
    const id =
      typeof identity === 'number' ? identity : this.getTokenIdByName(identity);
    return this.portrait.portraitCollectiveContract.setPortraitHash(id, hash);
  }

  /**
   * Set the Collective Portrait's hash as a delegate.
   *
   * @remarks
   * Setting the Collective Portrait's hash as a delegate will update the Collective Portrait's hash to the new hash.
   * A delegate wallet can set the Collective Portrait's hash as a delegate if the delegate wallet has the minimum number of shares required to control the Collective Portrait.
   *
   * @param {CollectivePortraitName} portraitName - The name of the Collective Portrait that the user would like to set the hash for.
   * @param {number} portraitId - The id of the Collective Portrait that the user would like to set the hash for.
   * @param {UserPortraitAddress} shareholder - The address of the shareholder that the user would like to set the hash for.
   * @param {string} hash - The new hash to set the Collective Portrait's hash to.
   * @param {number} blockNumber - The block number of the transaction that the user would like to set the hash for.
   * @param {string} signature - The signature of the transaction that the user would like to set the hash for.
   * @returns {ethers.ContractTransaction} - The transaction object of the transaction that sets the Collective Portrait's hash.
   * @beta
   * @async
   */
  setPortraitHashAsDelegate(
    portraitName: CollectivePortraitName,
    portraitId: number,
    shareholder: UserPortraitAddress,
    hash: string,
    blockNumber: number,
    signature: string,
  ): ethers.ContractTransaction {
    return this.portrait.portraitCollectiveContract.setPortraitHashAsDelegate(
      portraitName,
      portraitId,
      shareholder,
      hash,
      blockNumber,
      signature,
    );
  }

  /**
   * Renew the Collective Portrait.
   *
   * @remarks
   * Renewing the Collective Portrait will renew the Collective Portrait for the number of years specified.
   * Anyone can renew the Collective Portrait.
   *
   * @param {number} payableAmount - The amount of ether to pay for the renewal.
   * @param {CollectivePortraitName | number} identity - The name of the Collective Portrait that the user would like to renew.
   * @param {number} years - The number of years to renew the Collective Portrait for.
   * @returns {ethers.ContractTransaction} - The transaction object of the transaction that renews the Collective Portrait.
   * @beta
   * @async
   */
  renewPortrait(
    payableAmount: number,
    identity: CollectivePortraitName | number,
    years: number,
  ): Promise<ethers.ContractTransaction> {
    const id =
      typeof identity === 'number' ? this.getNameByTokenId(identity) : identity;
    return this.portrait.portraitCollectiveContract.renewPortrait(
      payableAmount,
      id,
      years,
    );
  }

  /**
   * Register the Collective Portrait.
   *
   * @remarks
   * Registering the Collective Portrait will register the Collective Portrait with the Portrait Protocol.
   *
   * @param {number} payableAmount - The amount of ether to pay for the registration.
   * @param {CollectivePortraitName} identity - The name of the Collective Portrait that the user would like to register.
   * @param {number} shares - The number of shares to register the Collective Portrait with.
   * @param {number} minimumControlshares - The minimum number of shares required to control the Collective Portrait.
   * @param {number} years - The number of years to register the Collective Portrait for.
   * @returns {ethers.ContractTransaction} - The transaction object of the transaction that registers the Collective Portrait.
   * @beta
   * @async
   */
  registerPortrait(
    payableAmount: number,
    identity: CollectivePortraitName,
    shares: number,
    minimumControlshares: number,
    years: number,
  ): Promise<ethers.ContractTransaction> {
    return this.portrait.portraitCollectiveContract.registerPortrait(
      payableAmount,
      identity,
      shares,
      minimumControlshares,
      years,
    );
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

  /**
   * Get a User Portrait
   * @param {UserPortraitAddress | UserPortraitENSName} identity - The identity of the user that the user would like to get a Portrait for.
   * @returns {Promise<PortraitObject>} - The Portrait object, which contains the User Portrait data.
   * @beta
   * @async
   * @throws {Error} - Will throw an error if the identity is not a valid address or ENS name.
   * @throws {Error} - Will throw an error if the user does not have a Portrait.
   * @throws {Error} - Will throw an error if the user's Portrait is not a valid JSON object.
   */
  async getPortrait(
    userAddress: Exclude<Identity, CollectivePortraitName>,
  ): Promise<JSON> {
    const hash = await this.getPortraitHash(userAddress);
    return fetchPortrait(
      this.portrait.ipfsGateways,
      this.portrait.arweaveGateway,
      hash,
      this.portrait.arweaveGraphQLprovider,
      userAddress,
    );
  }

  /**
   * Get a User Portrait Hash
   * @param {UserPortraitAddress | UserPortraitENSName} identity - The identity of the user that the user would like to get a hash for.
   * @returns {Promise<string>} - The hash of the User Portrait.
   * @beta
   * @throws {Error} - Will throw an error if the identity is not a valid address or ENS name.
   */
  async getPortraitHash(identity: Identity): Promise<string> {
    const address = isAddress(identity)
      ? identity
      : await this.portrait.defaultProvider.resolveName(identity);

    return this.portrait.portraitUserContract.getPersonalIpfsCID(address);
  }

  /**
   * Set a User Portrait
   *
   * @remarks
   * Wallet required.
   *
   * @param {string} hash - The hash of the User Portrait that the user would like to set.
   * @returns {Promise<ethers.ContractTransaction>} - The transaction object, which contains the transaction hash.
   * @beta
   */
  setPortraitHash(hash: string): Promise<ethers.ContractTransaction> {
    return this.portrait.portraitUserContract.setPersonalIpfsCIDByOwner(hash);
  }

  /**
   * Set a User Portrait as delegate
   * @param {UserPortraitAddress | UserPortraitENSName} identity - The identity of the user that the user would like to set a Portrait for.
   * @param {string} hash - The hash of the User Portrait that the user would like to set.
   * @param {number} blockNumber - The block number that the user would like to set the Portrait for.
   * @param {string} signature - The signature of the user that the user would like to set a Portrait for.
   *
   * @remarks
   * Wallet required.
   *
   * @returns {Promise<ethers.ContractTransaction>} - The transaction object, which contains the transaction hash.
   *
   * @throws {Error} - Will throw an error if the identity is not a valid address or ENS name.
   * @throws {Error} - Will throw an error if the signature is not valid.
   */
  setPortraitHashAsDelegate(
    identity: UserPortraitAddress | UserPortraitENSName,
    hash: string,
    blockNumber: number,
    signature: string,
  ): Promise<ethers.ContractTransaction> {
    const address = isAddress(identity)
      ? identity
      : this.portrait.defaultProvider.resolveName(identity);

    const wallet = this.portrait.portraitProvider;

    const message = ethers.utils.solidityKeccak256(
      ['address', 'uint256', 'string'],
      [address, blockNumber, hash],
    );

    const recoveredAddress = ethers.utils.verifyMessage(
      ethers.utils.arrayify(message),
      signature,
    );

    if (recoveredAddress !== address) {
      throw new Error('Invalid signature');
    }

    return this.portrait.portraitUserContract.setPersonalIpfsCIDByDelegate(
      address,
      hash,
      blockNumber,
      signature,
    );
  }

  /**
   * Kill a User Portrait - Use with caution: this is a permanent and irreversible action.
   *
   * @param {UserPortraitAddress | UserPortraitENSName} identity - The identity of the user that the user would like to kill their Portrait.
   *
   * @remarks
   * Killing a Portrait is a permanent action. Once a Portrait is killed, it cannot be recovered.
   * Use this function with caution.
   * Only the owner of the Portrait can kill their Portrait.
   * It is recommended to only kill a Portrait if the corresponding private key is compromised.
   *
   * @returns {Promise<ethers.ContractTransaction>} - The transaction object, which contains the transaction hash.
   *
   * @beta
   */
  activateKillSwitch(): Promise<ethers.ContractTransaction> {
    return this.portrait.portraitUserContract.activateKillSwitch();
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
