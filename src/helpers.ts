import { ethers } from 'ethers';
import { CID } from 'multiformats/cid';
import { MultihashHasher } from 'multiformats/hashes/interface';
import { sha256 } from 'multiformats/hashes/sha2';
import {
  UserPortraitAddress,
  UserPortraitENSName,
  CollectivePortraitName,
  PortraitObject,
} from './types';

/**
 * Error throwing function
 * @param {string} message - The error message
 * @returns Never returns
 * @throws Throws an error with the provided message
 *
 */
export function throwError(message: string): never {
  throw new Error(message);
}

/**
 * Type guard function to check if a string is a valid Ethereum address
 *
 * @remarks
 * This function is used to check if a string is a valid Ethereum address.
 *
 * @param {unknown} value - The value to check
 * @returns True if the value is a valid Ethereum address, false otherwise
 *
 * @example
 * ```typescript
 * // This is a valid User Portrait address
 * const userPortraitAddress: UserPortraitAddress = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045';
 *
 * // This is not a valid User Portrait address
 * const userPortraitAddress: UserPortraitAddress = 'abc';
 * ```
 */
export function isAddress(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    ethers.utils.isAddress(value) &&
    value.length === 42 &&
    value.slice(0, 2) === '0x'
  );
}

/**
 * Type assertion function to ensure that a string is a valid Ethereum address before assigning it to UserPortraitAddress
 *
 * @remarks
 * This function is used to ensure that a string is a valid Ethereum address before assigning it to UserPortraitAddress.
 *
 * @param value - The value to check
 * @returns The value if it is a valid Ethereum address, throws an error otherwise
 * @throws Throws an error if the value is not a valid Ethereum address
 *
 * @example
 * ```typescript
 * // This is a valid User Portrait address
 * const userPortraitAddress: UserPortraitAddress = toUserPortraitAddress('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045');
 *
 * // This is not a valid User Portrait address
 * const userPortraitAddress: UserPortraitAddress = toUserPortraitAddress('abc');
 * ```
 */
export function toUserPortraitAddress(value: unknown): UserPortraitAddress {
  return isAddress(value)
    ? (value as UserPortraitAddress)
    : throwError(`Invalid Ethereum address: ${value}`);
}

/**
 * Type guard function to check if a string is a valid ENS name
 *
 * @remarks
 * This function is used to check if a string is a valid ENS name.
 *
 * @param {string} value - The value to check
 * @returns True if the value is a valid ENS name, false otherwise
 *
 * @example
 * ```typescript
 * // This is a valid ENS name
 * const ensName: string = 'vitalik.eth';
 * const isValid: boolean = isValidName(ensName);
 *
 * // This is not a valid ENS name
 * const ensName: string = 'abc';
 * const isValid: boolean = isValidName(ensName);
 * ```
 */
export function isValidENSName(value: string): value is string {
  return typeof value === 'string' && ethers.utils.isValidName(value);
}

/** Type assertion function to ensure that a string is a valid ENS name before assigning it to UserPortraitENSName
 *
 * @remarks
 * This function is used to ensure that a string is a valid ENS name before assigning it to UserPortraitENSName.
 *
 * @param value - The value to check
 * @returns The value if it is a valid ENS name, throws an error otherwise
 * @throws Throws an error if the value is not a valid ENS name
 *
 * @example
 * ```typescript
 * // This is a valid ENS name
 * const ensName: string = 'vitalik.eth';
 * const userPortraitENSName: UserPortraitENSName = toUserPortraitENSName(ensName);
 *
 * // This is not a valid ENS name
 * const ensName: string = 'abc';
 * const userPortraitENSName: UserPortraitENSName = toUserPortraitENSName(ensName);
 * ```
 */
export function toUserPortraitENSName(value: string): UserPortraitENSName {
  return ethers.utils.isValidName(value)
    ? (value as UserPortraitENSName)
    : throwError(`Invalid ENS name: ${value}`);
}

/** Type guard function to check if a string is a valid Collective Portrait name
 *
 * @remarks
 * This function is used to check if a string is a valid Collective Portrait name.
 * A Collective Portrait name can only contain lowercase letters and numbers, and must be between 3 and 64 characters long.
 * It cannot contain any special characters, spaces, or uppercase letters.
 * It cannot be an Ethereum address or an ENS name.
 *
 * @param {unknown} value - The value to check
 * @returns True if the value is a valid Collective Portrait name, false otherwise
 *
 * @example
 * ```typescript
 * // This is a valid Collective Portrait name
 * const collectivePortraitName: string = 'testdao';
 * const isValid: boolean = isCollectivePortraitName(collectivePortraitName);
 *
 * // This is not a valid Collective Portrait name
 * const collectivePortraitName: string = 'testDAO';
 * const isValid: boolean = isCollectivePortraitName(collectivePortraitName);
 *
 * // This is not a valid Collective Portrait name
 * const collectivePortraitName: string = 'test-dao';
 * const isValid: boolean = isCollectivePortraitName(collectivePortraitName);
 *
 * // This is not a valid Collective Portrait name
 * const collectivePortraitName: string = 'ab';
 * const isValid: boolean = isCollectivePortraitName(collectivePortraitName);
 *
 * // This is not a valid Collective Portrait name
 * const collectivePortraitName: string = 'vitalik.eth';
 * const isValid: boolean = isCollectivePortraitName(collectivePortraitName);
 *
 * // This is not a valid Collective Portrait name
 * const collectivePortraitName: string = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045';
 * const isValid: boolean = isCollectivePortraitName(collectivePortraitName);
 * ```
 */

export function isCollectivePortraitName(
  value: unknown,
): value is CollectivePortraitName {
  return (
    typeof value === 'string' &&
    /^[a-z0-9]+$/.test(value) &&
    length >= 3 &&
    length <= 64 &&
    !isAddress(value) &&
    !isValidENSName(value)
  );
}

/** Type assertion function to ensure that a string is a valid Collective Portrait name before assigning it to CollectivePortraitName
 *
 * @remarks
 * This function is used to ensure that a string is a valid Collective Portrait name before assigning it to CollectivePortraitName.
 * A Collective Portrait name can only contain lowercase letters and numbers, and must be between 3 and 64 characters long.
 * It cannot contain any special characters, spaces, or uppercase letters.
 * It cannot be an Ethereum address or an ENS name.
 *
 * @param {string} value - The value to check
 * @returns {CollectivePortraitName} - The value if it is a valid Collective Portrait name, throws an error otherwise
 * @throws Throws an error if the value is not a valid Collective Portrait name
 *
 * @example
 * ```typescript
 * // This is a valid Collective Portrait name
 * const collectivePortraitName: string = 'testdao';
 * const collectivePortraitName: CollectivePortraitName = toCollectivePortraitName(collectivePortraitName);
 *
 * // This is not a valid Collective Portrait name
 * const collectivePortraitName: string = 'testDAO';
 * const collectivePortraitName: CollectivePortraitName = toCollectivePortraitName(collectivePortraitName);
 *
 * // This is not a valid Collective Portrait name
 * const collectivePortraitName: string = 'test-dao';
 * const collectivePortraitName: CollectivePortraitName = toCollectivePortraitName(collectivePortraitName);
 *
 * // This is not a valid Collective Portrait name
 * const collectivePortraitName: string = 'ab';
 * const collectivePortraitName: CollectivePortraitName = toCollectivePortraitName(collectivePortraitName);
 *
 * // This is not a valid Collective Portrait name
 * const collectivePortraitName: string = 'vitalik.eth';
 * const collectivePortraitName: CollectivePortraitName = toCollectivePortraitName(collectivePortraitName);
 *
 * // This is not a valid Collective Portrait name
 * const collectivePortraitName: string = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045';
 * const collectivePortraitName: CollectivePortraitName = toCollectivePortraitName(collectivePortraitName);
 * ```
 */
export function toCollectivePortraitName(
  value: string,
): CollectivePortraitName {
  return isCollectivePortraitName(value)
    ? (value as CollectivePortraitName)
    : throwError(`Invalid Collective Portrait name: ${value}`);
}

/**
 * Helper function to fetch a Portrait from IPFS or Arweave.
 *
 * @remarks
 * This function is used to fetch a Portrait from IPFS or Arweave.
 * We use concurrent requests to both IPFS and Arweave to fetch the Portrait by using Promise.any.
 * This means that if one of the functions succeeds, the other one will be cancelled.
 * If both fail, the function will throw an error.
 *
 * @param {string[]} ipfsGateways - An array of IPFS gateways to use to fetch the Portrait from IPFS
 * @param {string} arweaveGateway - The Arweave gateway to use to fetch the Portrait from Arweave
 * @param {string} ipfsHash - The IPFS hash of the Portrait
 * @param {string} arweaveGraphQLprovider - The Arweave GraphQL provider to use to fetch the Portrait from Arweave
 * @param {string} ethereumAddress - The Ethereum address of the user. This is optional. Only relevant for User Portraits.
 * @returns {Promise<PortraitObject>} A Promise that resolves to the Portrait object
 * @throws {Error} Throws an error if the function fails to fetch the Portrait from IPFS or Arweave
 *
 * @beta
 */
export function fetchPortrait(
  ipfsGateways: string[],
  arweaveGateway: string,
  ipfsHash: string,
  arweaveGraphQLprovider: string,
  ethereumAddress?: string,
): Promise<PortraitObject> {
  return Promise.any([
    fetchPortraitFromIPFS(ipfsGateways, ipfsHash),
    fetchPortraitFromArweave(
      arweaveGateway,
      arweaveGraphQLprovider,
      ipfsHash,
      ethereumAddress ? ethereumAddress : null,
    ),
  ]);
}

/**
 * Internal function to fetch a Portrait from IPFS
 *
 * @remarks
 * This function is used to fetch a Portrait from IPFS.
 * Multiple IPFS gateways can be provided, and the function will try to fetch the Portrait from each of them.
 * It will use Promise.any to fetch the Portrait from the IPFS gateways concurrently.
 * This means that if one of the functions succeeds, the other ones will be cancelled.
 * If all fail, the function will throw an error.
 *
 * @param {string[]} ipfsGateways - An array of IPFS gateways to use to fetch the Portrait from IPFS
 * @param {string} ipfsHash - The IPFS hash of the Portrait
 * @returns {Promise<PortraitObject>} A Promise that resolves to the Portrait object
 *
 * @beta
 * */
function fetchPortraitFromIPFS(
  ipfsGateways: string[],
  ipfsHash: string,
): Promise<PortraitObject> {
  const ipfs = Promise.any(
    ipfsGateways.map((ipfsGateway) =>
      fetchPortraitFromIPFSGateway(ipfsGateway, ipfsHash),
    ),
  );
  return Promise.any([ipfs]);
}

/**
 * Internal function to fetch a Portrait from IPFS using a gateway
 *
 * @remarks
 * This function is used to fetch a Portrait from IPFS using a gateway.
 * It will first fetch the Portrait from the IPFS gateway, and then check that the IPFS hash of the Portrait matches the IPFS hash provided.
 * If the IPFS hash does not match, it will throw an error.
 * This mitigates the risk of a malicious IPFS gateway returning a different Portrait than the one that was requested.
 *
 * @param {string} ipfsGateway - The IPFS gateway to use
 * @param {string} ipfsHash - The IPFS hash of the Portrait to fetch
 * @returns {Promise<PortraitObject>} The Portrait fetched from IPFS
 * @throws Throws an error if the IPFS hash does not match the IPFS hash of the Portrait fetched from the IPFS gateway
 *
 * @beta
 */
async function fetchPortraitFromIPFSGateway(
  ipfsGateway: string,
  ipfsHash: string,
): Promise<PortraitObject> {
  return fetch(`${ipfsGateway}${ipfsHash}`)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(
          `Failed to fetch Portrait from IPFS gateway ${ipfsGateway}: ${response.status} ${response.statusText}`,
        );
      }
    })
    .then((portrait) => {
      if (ipfsHashCollision(ipfsHash, JSON.stringify(portrait))) {
        return portrait;
      } else {
        throw new Error(
          `Failed to fetch Portrait from IPFS gateway ${ipfsGateway}: IPFS hash mismatch`,
        );
      }
    });
}

/**
 * Internal function to fetch a Portrait from Arweave using GraphQL
 *
 * @remarks
 * This function is used to fetch a Portrait from Arweave using GraphQL.
 * It will fetch the first 10 transactions (default) that match the IPFS hash and, if an author is provided, the author's Ethereum address.
 * If there are more than 10 transactions, it will fetch the next 10 transactions and so on until it finds a match.
 * If no match is found, it will throw an error.
 *
 *
 * @param {string} arweaveGateway - The Arweave gateway to use to fetch the Portrait by transaction ID
 * @param {string} arweaveGraphQLprovider - The Arweave GraphQL provider to use to fetch the Portrait by IPFS hash
 * @param {string} ipfsHash - The IPFS hash of the Portrait
 * @param {string} [author] - The Ethereum address of the author of the Portrait. Optional. Only relevant if the Portrait is a User Portrait.
 * @param {string} [cursor] - The cursor to use to fetch the next 10 transactions. Optional.
 * @returns {Promise<PortraitObject>} The Portrait object as a JSON object
 * @throws Throws an error if the Portrait cannot be fetched from Arweave
 *
 * @beta
 */
async function fetchPortraitFromArweave(
  arweaveGateway: string,
  arweaveGraphQLprovider: string,
  ipfsHash: string,
  author?: string,
  cursor?: string,
): Promise<PortraitObject> {
  const query = fetch(arweaveGraphQLprovider, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query:
        `query {
        transactions(
          ` +
        (cursor ? `first: 10, after: "${cursor}",` : null) +
        `
          sort: HEIGHT_ASC,
          tags: [
            {
              name: "IPFS-Add",
              values: [],
            },
            {
              name: "Protocol",
              values: ["Portrait"],
            },
            {
              name: "IPFS-Add",
              values: ["${ipfsHash}"]
            },
            ` +
        (author ? `{ name: "Author", values: ["${author}"] },` : null) +
        `
           ]
        ) {
          edges {
            cursor
            node {
              id
              
              tags {
                name
                value
              }
            }
          }
        }
      }`,
    }),
  });

  const jsonResponse = await query.then((res) => res.json());

  for (const transaction of jsonResponse.data.transactions.edges) {
    const transactionId = transaction.node.id;
    const arweaveRequest = fetch(`${arweaveGateway}/${transactionId}`);

    const arweaveResponse = await arweaveRequest.then((res) => res.text());

    const isCorrectFile = await ipfsHashCollision(ipfsHash, arweaveResponse);

    if (isCorrectFile) {
      return JSON.parse(arweaveResponse);
    }
  }

  if (jsonResponse.data.transactions.edges.length === 10) {
    return fetchPortraitFromArweave(
      arweaveGateway,
      arweaveGraphQLprovider,
      ipfsHash,
      author ? author : null,
      jsonResponse.data.transactions.edges[9].cursor,
    );
  }

  throw new Error(`Failed to fetch Portrait from Arweave: IPFS hash not found`);
}

/**
 * Internal function to check if an IPFS hash matches a JSON string
 *
 * @remarks
 * This function is used to check if an IPFS hash matches a JSON string.
 * It will generate a new IPFS hash from the JSON string and compare it to the provided IPFS hash.
 *
 * @param {string} ipfsHash - The IPFS hash to compare
 * @param {string} json - The JSON string to compare
 * @returns {Promise<boolean>} True if the IPFS hash matches the JSON string, false otherwise
 *
 * @beta
 */
async function ipfsHashCollision(
  ipfsHash: string,
  json: string,
): Promise<boolean> {
  const jsonUint8Array = new TextEncoder().encode(json);
  const digest = await sha256.digest(jsonUint8Array);
  const generatedHash = CID.createV1(0x55, digest);
  return CID.equals(generatedHash, ipfsHash);
}
