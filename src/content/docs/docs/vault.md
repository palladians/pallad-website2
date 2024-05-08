---
title: The Vault
description: Pallad's core storage
---

# The Vault
Pallad itself manifests almost entirely in the `vault` package, which is the application's backend and exhibits all functional behavior of the wallet, except for the web-provider (apart from the allow-list of websites). The vault is a [Zustand](https://zustand-demo.pmnd.rs/) store made up of smaller Zustand slices. In principle, the `vault` can be re-used by anyone to build another wallet with their own UI.

## Overview

The vault serves as the central hub for all operations within Pallad, coordinating the state and functionalities across various slices such as accounts, credentials, network information, and more. It leverages `zustand` and `immer` to manage state transitions in a clean and predictable manner. This modular state management approach allows each slice to manage its specific domain while contributing to a cohesive global state accessible across the application.

## Core Functionalities

- **State Management:** Zustand provides an intuitive and flexible way to create and manage the application's state with minimal boilerplate. It's configured to integrate multiple slices that handle distinct aspects of the wallet's state.

- **Persistence:** Utilizing the middleware from `zustand/middleware` and secure storage options, the state is persisted across sessions, ensuring data consistency and availability.

- **Wallet Management:** Functions for wallet creation, restoration, and management are core features, with support for generating mnemonics, managing accounts, and syncing wallet states.

- **Transaction Handling:** Includes capabilities for constructing and submitting transactions, along with syncing transaction history and account information, tailored to different network configurations.

- **Network Interactions:** The vault allows switching between networks, managing network-specific data, and interacting with blockchain networks, facilitated by integrated utilities.

- **Security and Encryption:** Key management is handled securely, with operations that require cryptographic functions being tightly integrated into the system's design.

The vault package is an essential component of Pallad, providing a robust backend for managing wallet functionalities. Its design emphasizes modularity, and ease of use, making it an excellent choice for developers looking to integrate a wallet into their applications. Let's go into each slice to talk a little more on what they all do.

# Account Store

The account store in Pallad's vault package plays a critical role in state management using Zustand for streamlined state handling and Immer for immutability. The functionality is divided between two primary files, enhancing maintainability and clarity.

## Overview

### `account-info-state.ts`

This file outlines the structure of the state and actions relevant to account management within Pallad. It includes:

- **Types and Interfaces:**
  - `SingleAccountState`: Manages data for an individual blockchain address.
  - `ChainAddressMapping`: Maps blockchain addresses to their respective account states.
  - `AccountState`: Organizes all accounts by network, encapsulating the complete state.
  - `AccountActions`: Specifies methods to alter the account store dynamically.

### `account-info-store.ts`

Implements the logic specified in `account-info-state.ts`, facilitating various account-related operations such as adding or removing accounts, updating account details, and handling transactions. Key functionalities include:

- **Initial State Setup:** Starts with predefined or empty account states.
- **Account Management Functions:**
  - `ensureAccount`: Verifies or initializes an account for a given network.
  - `setAccountInfo`: Updates details for an existing account.
  - `addAccount`, `removeAccount`: Manages account addition and deletion.
  - `getAccountsInfo`, `getAccountInfo`: Fetches account details and states.
  - `getTransactions`, `getTransaction`: Retrieves transaction data.
  - `clear`: Removes all stored account information.

## Example Usage

```typescript
import createStore from 'zustand';
import { accountSlice } from './account-info-store';

const useAccountStore = createStore(accountSlice);
```

### Methods
Each method defined in account-info-store.ts can be accessed using the store instance created. For example, to ensure an account is initialized, you can use:
```ts
useAccountStore.getState().ensureAccount('Mina - Berkeley', 'B62fjf...');
```

# Key Agent Store

The key agent slice provides a state management store for a key agent's `SerializableKeyAgentData` in memory. This allows Pallad to store many `SerializableKeyAgentData` by `keyAgentName`, making Pallad a mult-mnemonic application -- users can define many key agents for as many different purposes as they desire. While Pallad does not support hardware wallets at the moment, the same applies for hardware wallet users, they will be able to define as many hardware devices as they desire to use in Pallad, the key agent slice is designed to be flexible in this regard. 

The key agent slice does not manage the storing of encrypted child keys or their `GroupedCredential`, that is managed by the `credential` slice, the key agent slice is solely responsible for storing the seed key encrypted and its related information like `keyAgentName` and the `keyAgentType`.

## Key Files
- `key-agent-store.ts`: Contains the core logic for the Zustand store slice managing the state of key agents.
- `key-agent-state.ts`: Defines the types and initial states for key agents.

## Features

### State Management
- **Ensure Key Agent**: Ensures a key agent is initialized in the store.
- **Initialize Key Agent**: Initializes a new key agent from BIP39 mnemonic words.
- **Restore Key Agent**: Restores a key agent from serialized data.
- **Remove Key Agent**: Removes a specified key agent from the store.
- **Clear Store**: Clears all key agents from the store.

### Cryptographic Operations
- **Request Signing**: Delegates a signing request to the appropriate key agent.
- **Create Credential**: Creates a new credential for a specified key agent.
- **Get Key Agent**: Retrieves the state of a specified key agent.

## Usage

### Setup Store
To use this module, ensure that you have Zustand and Immer set up in your project. Include the key agent store in your Zustand store setup.

### Example Initialization
```typescript
import { useStore } from './store'; // Assuming your Zustand store setup file is store.ts

// Initialize a key agent
const mnemonicWords = ["habit", "quick", "light", ..., "fox"];
useStore.getState().initialiseKeyAgent("myKeyAgent", KeyAgents.InMemory, {
  mnemonicWords,
  getPassphrase: async () => "yourSecurePassphrase"
});
```

# Credential Store

This credential slice defines a state management slice for handling the credentials (`GroupedCredentials`) derived and generated by key agents in Palld. Note this store is only for key agent credentials (i.e. derived child key credential data) and **NOT** identity credentials. Identity credentials are scoped within the objects slice, which follows almost exactly the same structure as the credentials slice and differs only semantically. The credential store allows Pallad to pair a specific mnemonic with its derived accounts/addresses through the `keyAgentName`, each credential also has a name (`credentialName`) that can be defined by the end-user too.

## Files

- `credential-store.ts`: Contains the Zustand store slice with methods for managing credentials.
- `credential-state.ts`: Defines types and initial states for the credentials managed in the store.

## Key Functions

### ensureCredential
- **Purpose**: Ensures a credential is initialized if it does not already exist.
- **Parameters**:
  - `credentialName`: The unique name for the credential.
  - `keyAgentName`: The name of the key agent associated with the credential.

### setCredential
- **Purpose**: Updates or sets the state of a specific credential.
- **Parameters**:
  - `credentialState`: The state object of the credential.

### getCredential
- **Purpose**: Retrieves a credential by name.
- **Parameters**:
  - `credentialName`: The name of the credential to retrieve.

### removeCredential
- **Purpose**: Removes a credential from the store.
- **Parameters**:
  - `credentialName`: The name of the credential to remove.

### searchCredentials
- **Purpose**: Searches credentials based on a query and optional properties filter.
- **Parameters**:
  - `query`: Search conditions to match credentials.
  - `props`: Optional array of properties to return in the search results.

### clear
- **Purpose**: Clears all credentials from the store.

# Network Information Store

This network information slice manages the storage of network information in Pallad. Specifically, it contains all relevant information the application requires on the network it can interact with. This includes network data end-points, network names, chain-ids, and the current network name Pallad is using. 

## network-info-store.ts

This file contains the main store slice using `zustand` and `immer` for managing the network information related to each blockchain network's providers. The store is designed to handle network configurations dynamically, allowing updates, additions, and deletions of network details at runtime.

### Key Functions

- **setCurrentNetworkName**: Sets the current active network.
- **getCurrentNetworkInfo**: Returns the configuration of the current active network.
- **updateNetworkInfo**: Updates the details of a specified network.
- **setNetworkInfo**: Sets the configuration for a specific network.
- **getNetworkInfo**: Retrieves the configuration for a specific network.
- **removeNetworkInfo**: Removes a network from the store.
- **getChainIds**: Returns a list of all chain IDs available in the network information.
- **allNetworkInfo**: Retrieves all network configurations stored.
- **clear**: Clears all network information from the store.

## network-info-state.ts

This file defines TypeScript types for the state and actions of the network information store.

### Types

- **NetworkInfoState**: Contains the state shape of the network information, including a record of network configurations and the current network name.
- **NetworkInfoActions**: Lists all the actions available in the network information store.
- **NetworkInfoStore**: A combination of `NetworkInfoState` and `NetworkInfoActions` providing a complete type for the store.

## Usage

### Initializing the Store
You can integrate the store into your application by importing and initializing it like is done in `vault`:
```ts
import { networkInfoSlice } from './path/to/network-info-store';
import create from 'zustand';

const useNetworkInfoStore = create(networkInfoSlice);
```

### Accessing and Modifying the Store
Here's how you can interact with the store:
```ts
// Set the current network name
useNetworkInfoStore.setState(setCurrentNetworkName('testnet'));

// Get current network configuration
const currentNetworkInfo = useNetworkInfoStore.getState().getCurrentNetworkInfo();

// Update network information
useNetworkInfoStore.getState().updateNetworkInfo('testnet', { chainId: 'new-chain-id' });

// Add a new network configuration
useNetworkInfoStore.getState().setNetworkInfo('newnet', {
  nodeEndpoint: { providerName: 'mina-node', url: 'http://mina-node.com' },
  archiveNodeEndpoint: { providerName: 'mina-explorer', url: 'http://mina-explorer.com' },
  networkName: 'Mina - Berkeley',
  networkType: 'testnet',
  chainId: '3c41383994b87449625df91769dff7b507825c064287d30fada9286f3f1cb15e'
});

// Remove a network
useNetworkInfoStore.getState().removeNetworkInfo('Mina - Berkeley');

// Clear all network information
useNetworkInfoStore.getState().clear();
```

# Token Info Store

The token info slice is a module designed to manage and store token information for various Pallad networks. This store is responsible for setting, retrieving, and deleting token information by network and token identifier. Hollistically, this slice allows Pallad users to define which token account information they wish for Pallad to display.

## Files

- `token-info-store.ts`: Implements the store logic using Zustand and Immer.
- `token-info-state.ts`: Defines TypeScript types for token information and store structure.

## Features

- **Set Token Information**: Add or update token information for a specific network.
- **Get Token Information**: Retrieve the token ID for a specific ticker and network.
- **Get Tokens Information**: Retrieve all token information for a given network.
- **Remove Token Information**: Remove specific token information for a given network and ticker.
- **Clear Token Information**: Clear all token information in the store.

## Usage

### Setting Token Info

```typescript
setTokenInfo(networkName, { ticker, tokenId });
```

# Web Provider Store

The web provider store manages and stores the websites that have various permissions in Pallad, allowing Pallad users to blacklist/block specific webpages from sending requests to the wallet and setting a set of applications that are allowed to connect and make requests to Pallad.

# Vault Store

## Overview
The Pallad Vault is the gloabl storage system for the Pallad browser extension which is made up of the above slices. It provides a single means to manage various aspects of a the wallet including accounts, transactions, credentials, and network configurations.

## Features
- Multi-network Support: Compatible with different blockchain networks.
- Credential Management: Secure storage for wallet credentials.
- Dynamic Account Management: Functions to manage and switch between multiple accounts.
- Transaction Management: Tools to construct, sign, and submit transactions.
- Synchronization Utilities: Sync account information and transactions automatically.

## Key Components
- `GlobalVaultStore`: The main interface for all vault operations.
- `GlobalVaultState`: Stores the state of the vault including current network, wallet information, and known accounts.

## Key Methods
- `createWallet()`: Create a new wallet with a mnemonic.
- `restoreWallet()`: Restore a wallet from a mnemonic.
- `switchNetwork()`: Change the active blockchain network.
- `sign()`: Sign a transaction or message.
- `submitTx()`: Submit a transaction to the blockchain.

For more detailed usage, checkout the `valut`.