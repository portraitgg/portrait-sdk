/**
 * PortraitObject is the generic type representing a Portrait Protocol object. It can be either a User Portrait or a Collective Portrait in JSON format. It represents the data of a decentralized website, governed by a single user or a collective of users, registered on the Portrait Protocol.
 *
 * @remarks
 * PortraitObject is the generic type representing a Portrait Protocol object. It can be either a User Portrait or a Collective Portrait in JSON format. It represents the data of a decentralized website, governed by a single user or a collective of users, registered on the Portrait Protocol.
 *
 * @beta
 */
export type PortraitObject = JSON;

/**
 * Identity is the generic type representing a Portrait Protocol identity. It can be either a User Portrait or a Collective Portrait.
 *
 * @remarks
 * A Portrait Protocol identity is either a User Portrait or a Collective Portrait.
 *
 * @example
 * ```typescript
 * // This is a valid Identity
 * const identity: Identity = 'vitalik.eth';
 *
 * // This is a valid Identity
 * const identity: Identity = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045';
 *
 * // This is a valid Identity
 * const identity: Identity = 'abc';
 *
 * // This is not a valid Identity
 * const identity: Identity = 'abc_123';
 * ```
 */
export type Identity =
  | UserPortraitAddress
  | UserPortraitENSName
  | CollectivePortraitName;

/**
 * A User Portrait Address is the Ethereum address representing a decentralized website, governed by a single user, registered on the Portrait Protocol.
 *
 * @remarks
 * A User Portrait address must be a valid Ethereum address.
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
export type UserPortraitAddress = string & { _isAddress: true };

/**
 * A User Portrait ENS Name is the ENS name representing a decentralized website, governed by a single user, registered on the Portrait Protocol.
 *
 * @remarks
 * A User Portrait ENS name must be a valid ENS name.
 *
 * @example
 * ```typescript
 * // This is a valid User Portrait ENS name
 * const userPortraitENSName: UserPortraitENSName = 'vitalik.eth';
 *
 * // This is not a valid User Portrait ENS name
 * const userPortraitENSName: UserPortraitENSName = 'abc';
 * ```
 */
export type UserPortraitENSName = string & { _isENSName: true };

/**
 * A Collective Portrait Name is the name representing a decentralized website, governed by a group of users, registered on the Portrait Protocol.
 *
 * @remarks
 * A Collective Portrait name can only contain lowercase letters and numbers, and must be between 3 and 64 characters long.
 * It cannot contain any special characters, spaces, or uppercase letters.
 * It cannot be an Ethereum address or an ENS name.
 *
 * @example
 * ```typescript
 * // This is a valid Collective Portrait name
 * const collectivePortraitName: CollectivePortraitName = 'testdao';
 *
 * // This is not a valid Collective Portrait name
 * const collectivePortraitName: CollectivePortraitName = 'testDAO';
 *
 * // This is not a valid Collective Portrait name
 * const collectivePortraitName: CollectivePortraitName = 'test-dao';
 *
 * // This is not a valid Collective Portrait name
 * const collectivePortraitName: CollectivePortraitName = 'ab';
 *
 * // This is not a valid Collective Portrait name
 * const collectivePortraitName: CollectivePortraitName = 'vitalik.eth';
 * ```
 *
 * // This is not a valid Collective Portrait name
 * const collectivePortraitName: CollectivePortraitName = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045';
 * ```
 */
export type CollectivePortraitName = string & {
  _isCollectivePortraitName: true;
};
