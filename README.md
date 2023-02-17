# Portrait Protocol SDK

The Portrait SDK is a package that provides a simple way to interact with the Portrait Protocol. This package is a wrapper around the Portrait Protocol, which provides helper functions to simplify the process of interacting with the Portrait Protocol.

## Installation

To install this package, run the following command:

```bash
npm install portrait-sdk
```

## Usage

To use the Portrait SDK, you must first import it:

```ts
import { Portrait } from 'portrait-sdk';
```

### Initializing the SDK

After importing the package, you can initialize the `Portrait` class by calling its constructor:

jsCopy code

`const portrait = new Portrait();`

This will initialize the SDK with default values. However, you can also customize the SDK by passing in parameters to the constructor. The available parameters are:

- `ethereumPrivateKey` - The private key of a user's Ethereum wallet, if they would like to sign and send transactions.

- `alchemyApiKey` - The API key for Alchemy, if the user would like to use Alchemy as their provider. This is recommended for production.

- `portraitNetwork` - The network that the user would like to use. This is recommended to be set to 'goerli', as Portrait is currently only deployed on the Goerli testnet.

- `portraitWallet` - The wallet that the user would like to use to sign and send transactions. This is recommended to be left as the default value, unless the user is deeply familiar with the Portrait Protocol.

- `portraitProvider` - The provider that the user would like to use. This is recommended to be set to the Alchemy API key, as it is the most reliable and secure provider. However, if the user would like to use a different provider, they can do so by passing in the provider here. The default provider will be used if this parameter is not set.

- `collectivePortraitRegistryABI` - The ABI for the Collective Portrait Registry contract. This is recommended to be left as the default value, unless the user is deeply familiar with the Portrait Protocol.

- `portraitCollectiveContract` - The Collective Portrait Registry contract. This is recommended to be left as the default value, unless the user is deeply familiar with the Portrait Protocol.

- `userPortraitRegistryABI` - The ABI for the User Portrait Registry contract. This is recommended to be left as the default value, unless the user is deeply familiar with the Portrait Protocol.

- `portraitUserContract` - The User Portrait Registry contract. This is recommended to be left as the default value, unless the user is deeply familiar with the Portrait Protocol.

- `betaPassABI` - The ABI for the Beta Pass NFT contract. This is recommended to be left as the default value, unless the user is deeply familiar with the Portrait Protocol.

- `portraitBetaNFTContract` - The Beta Pass NFT contract. This is recommended to be left as the default value, unless the user is deeply familiar with the Portrait Protocol.

- `arweaveGraphQLprovider` - The GraphQL provider that the user would like to use to interact with Arweave. If the user would like to use a different provider, they can do so by passing in the provider here. The default provider will be used if this parameter is not set.

- `arweaveGateway` - The gateway that the user would like to use to interact with Arweave.

- `ipfsGateway` - The gateway that the user would like to use to interact with IPFS. If the user would like to use one, or multiple gateways, they can do so by passing in the gateway here. The default gateways will be used if this parameter is not set.

### Fetching a Portrait

To fetch a Portrait from the Portrait Protocol, you can use the `getPortrait` function. This function takes in an `Identity` parameter, which can be either an Ethereum address, ENS name, or Collective Portrait name. The function will return a `PortraitObject`, which contains the user's Portrait data.

```ts
const portrait = await portrait.getPortrait('vitalik.eth');
```
