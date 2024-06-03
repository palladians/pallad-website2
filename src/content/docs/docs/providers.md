---
title: Providers
description: Providers and how Pallad uses them
---

In any Web3 application, providers are essential components that can "provide" the data necessary for the application to accurately reflect the network state as well as submit data to the network for mutating on-chain states. Together many providers can create end-user specifc views of the protocol like the do in Pallad. This means enhancing the visibility of system status and matching the system to the user's mental model of the network.

Pallad revolves around several core providers in its first release and include providers for account inforamtion (token balances, nonces, staking information), chain history (transaction history), and transaction submission. These providers exist for both Mina and EVM networks as well as for different companies that provide access to their APIs such as Obscura, Blockberry, Etherscan, and others. While there are other types of providers that we have created and exist in Pallad's codebase such as ones for querying transaction status and listening for blocks, their implementation is largely dependent on specific API access.

## `AccountInfoProvider`

The `AccountInfoProvider` specifically deals with fetching and relaying account-related information, crucial for Pallad to display accurate and timely account status to the user. This provider is tailored to the needs of applications requiring detailed account information such as balances, transaction counts (nonces), and current staking delegations.

## `ChainHistoryProvider`

The `ChainHistoryProvider` serves to obtain and relaying an account's historical information, this allows Pallad to display a public key's past transactions and their type (incoming, outgoing, staking). There currently exists only one provider of this API for Mina (MinaExplorer), we hope more people will provide open access to historical APIs on Mina in the future. Ethereum chains allow wallet users to access limited public bandwith in this regard and we thank the teams and ecosystems doing so as a public good as it creates a toolkit for applications like Pallad to iterate quickly in end-user solution-spaces.

## `TransactionSubmitProvider`

The `TransactionSubmitProvider` is for sending well-formed and signed transactions to the network for mutating on-chain states.

## `NodeStatusProvider`

The `NodeStatusProvider` is Pallad's means of querying network information to see if the node APIs the wallet is interacting with are healthy.

## An Agnostic Implementation

Pallad is a multi-chain wallet and has taken significant engineering effort to create an chain-agnostic implementation of these providers together under a single `UnifiedChainProvider`.

### `UnifiedChainProvider`

Pallad's `UnifiedChainProvider` integrates multiple blockchain providers into a cohesive interface, enabling seamless interaction with different aspects of blockchain data management. This approach ensures that Pallad remains chain-agnostic, providing robust functionality across multiple blockchain networks.

#### Capabilities of UnifiedChainProvider

- **Account Information**: Fetches detailed information about blockchain accounts, such as balances, transaction counts, and staking delegations, through the `AccountInfoProvider`.
- **Chain History**: Retrieves historical transactions of an account, allowing users to view past activities and transaction types via the `ChainHistoryProvider`.
- **Transaction Submission**: Submits signed transactions to the network, facilitating the mutation of on-chain states through the `TransactionSubmitProvider`.
- **Node Status**: Monitors the health and status of the blockchain node APIs with which the wallet interacts, using the `NodeStatusProvider`.
- **Comprehensive Health Checks**: Ensures the overall health of the blockchain infrastructure by performing a series of health checks across various components.

#### Implementation

The `UnifiedChainProvider` leverages individual provider modules, each specialized in a different aspect of blockchain interaction:

- `createAccountInfoProvider`: Manages retrieval of account-specific information.
- `createChainHistoryProvider`: Handles fetching of transaction histories.
- `createNodeStatusProvider`: Monitors and reports the status of node APIs.
- `createTxSubmitProvider`: Manages the submission of transactions to the blockchain.

These providers are configured and orchestrated to ensure that data flows seamlessly through Pallad's interfaces, providing a unified view of the network that is critical for user interactions and decision-making.

#### Example Usage

To utilize the `UnifiedChainProvider`, one would typically configure it with specific network details and then use the provided methods to interact with the blockchain:

```typescript
// define the provider's configuration
const config: ProviderConfig = {
  nodeEndpoint: {
    providerName: 'mina-node'
    url: 'https://your-mina-node-url.com'
  }
  archiveNodeEndpoint: {
    providerName: 'mina-node'
    url: 'https://your-mina-archive-node-url.com'
  }
  networkName: 'mina-network-name'
  networkType: 'testnet'
  chainId: '888'
}
const chainProvider = createChainProvider(config);

// Fetch account information
const accountInfo = await chainProvider.getAccountInfo({ publicKey: 'B62..fj' });

// Retrieve transaction history
const transactions = await chainProvider.getTransactions({ address: 'B62..fj' });

// Submit a transaction
const submitResponse = await chainProvider.submitTransaction({ transactionData: '0x...' });

// Check node status
const nodeStatus = await chainProvider.getNodeStatus();

// Perform a comprehensive health check
const healthStatus = await chainProvider.healthCheck();
```

#### A Note on `ProviderConfig`

The `ProviderConfig` is an interface that allows both Pallad users and applications interacting with Pallad to define specific network configurations. Overall a `ProviderConfig` object allows Pallad to switch between different known networks. the `providerName` field has a few possibilities:

- `mina-node` will allow Pallad to establish connections with a Mina node API for fetching account inforamtion and submitting transactions
- `mina-explorer` will allow Pallad to establish connections with the current Mina Explorer chain history API for fetching transaction histories
- `evm-rpc` will allow Pallad to establish connectiosn to a standard EVM network RPC for fetching account inforamtion and submitting transactions
- `evm-explorer` will allow Pallad to establish connections to an Etherscan instance for fetching transaction histories

It is important for both Pallad users and applications interacting with Pallad to define this configuration properly in a well formed request.

## Inside Pallad

Pallad doesn't store a provider specifically but it stores the provider configuration. Users defining a provider configuration can allow pallad to agnostically connect to any Mina network; currently that includes Berkeley, Devnet, Zeko-Devnet. When Pallad needs to get network data or send transactions to the network it uses the stored provider configurations for the current network the user is interacting with the create a new provider and fetch or submit the necessary information for the user's desired operation or interaction. If you want to check out how this is done in Pallad the `network-info` slice of the `vault` is where these provider configurations are stored. On the topic of custom tokens, Pallad also supports fetching the custom token balances of a user, and this information is stored in the `token-info` slice of the `vault`, much like in other Web3 wallets, end-users can define the address and token ticker for the custom tokens they wish Pallad to fetch account information for.
