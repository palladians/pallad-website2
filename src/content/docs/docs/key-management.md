---
title: Key-Management
description: How key-management is designed in Pallad
---

Acknowledgements: significant inspiration from [cardano-js-sdk](https://github.com/input-output-hk/cardano-js-sdk) helped build this package. This package has also benefited from the incredible work of [@paulmillr](https://github.com/paulmillr) who's remarkable open source work has helped realize many of the features in this package.

This package provides comprehensive support for key management across multiple ecosystems networks. It comes with support for Mina and Ethereum. It can be extended to include more as needed. The requirements for adding more networks requires adding a directory to `./src/chains` and defining functionality to derive keys, build compliant credentials, and perform signing operations.

The goal is to build a key-management-system that is compliant with the [W3C Universal Wallet Specification](https://w3c-ccg.github.io/universal-wallet-interop-spec/#Data%20Model). In the package's current state, it is inspired by the W3C specficiation but does follow the same data-model.

## Features

- An in memory key agent (no hardware support is currently available)
- Supports multiple mnemonic lengths (in theory you can define any entropy but the common mnemonic lengths of 12, 18, 21, and 24 words are all supported)
- Supports key derivation and signing operations for Mina and Ethereum eocsystems
- Can derive key credentials for each chain
- Supports encryption and decryption of keys (both child, seed, and root) using an implementation of [EMIP-003](https://github.com/Emurgo/EmIPs/blob/master/specs/emip-003.md)
- Wrapper functions using `@scure/bip39` library

## Usage

This library exposes various types and methods to interact with supported chains.

### KeyAgentBase

`KeyAgentBase` is an abstract class that forms the foundation for chain-specific key agents, which manage tasks such as credential derivation, signing operations, and seed decryption. The `KeyAgentBase` class is an essential component of Pallad's key management. Instances of `KeyAgentBase` require serializable data which are inspirated by the [W3C Universal Wallet Specification](https://w3c-ccg.github.io/universal-wallet-interop-spec/#Data%20Model) and a passphrase retrieval function upon instantiation. This setup allows in memory storage and retrieval of encrypted seed information necessary for generating blockchain-specific credentials. In Pallad's context the `KeyAgentBase` is used to create an `InMemoryKeyAgent` and the serializable data is stored in the `keyAgent` slice of the `vault`, the derived credentials (`GroupedCredentials`) which contain an encrypted child private key are stored in the `credentials` slice of the `vault`, more on this later.

#### Example

```typescript
mnemonic = [
  "habit",
  "hope",
  "tip",
  "crystal",
  "because",
  "grunt",
  "nation",
  "idea",
  "electric",
  "witness",
  "alert",
  "like",
];
seed = bip39.mnemonicToSeed(mnemonic, "");
encryptedSeedBytes = await emip3encrypt(seed, passphrase);
// define the serializable data
const serializableData: SerializableKeyAgentData = {
  __typename: "InMemory",
  encryptedSeedBytes: encryptedSeedBytes,
  id: "http://example.gov/wallet/3732",
  type: ["VerifiableCredential", "EncryptedWallet"],
  issuer: "did:example:123",
  issuanceDate: "2020-05-22T17:38:21.910Z",
  credentialSubject: {
    id: "did:example:123",
    contents: [],
  },
};
// define your passphrase
const params = {
  passphrase: "passphrase",
};
const getPassphrase = () =>
  new Promise<Uint8Array>((resolve) => resolve(Buffer.from(params.passphrase)));
// create an instance of the KeyAgent
const instance = new KeyAgentBase(serializableData, getPassphrase);
// derive your first credential
const derivationArgs: ChainDerivationArgs = {
  network: "Mina",
  accountIndex: 0,
  addressIndex: 0,
};
const credential = instance.deriveCredentials(
  derivationArgs,
  getPassphrase,
  true,
);
```

The derived credential should look something like this:

```typescript

{
    '@context': ['https://w3id.org/wallet/v1'],
    id: 'did:mina:B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb',
    type: 'MinaAddress',
    controller: 'did:mina:B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb',
    name: 'Mina Account',
    description: 'My Mina account.',
    chain: 'Mina',
    accountIndex: 0,
    addressIndex: 0,
    address: 'B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb',
    encryptedPrivateKeyBytes: /* A Uint8Array */
}
```

### KeyDecryptor

Under the hood of the `KeyAgentBase` class is the `KeyDecryptor` which is a class designed to handle the decryption of encrypted keys (both seed and child keys) using the EMIP-003 encryption standard. The class encapsulates complexity associated with decryption operations and error handling, ensuring secure access to sensitive key information required for blockchain operations.

#### Key Components

- **`#getPassphrase`:** This private method retrieves the passphrase necessary for decryption operations. It supports a `noCache` option which, if set to `true`, bypasses any caching mechanisms to ensure that the passphrase is retrieved securely and directly from its source without reuse from temporary storage. This feature is crucial for maintaining high security standards for sensitive keys stored encrypted in memory of an application.

#### Constructor

The constructor accepts a `GetPassphrase` function which is stored privately and used to retrieve the passphrase whenever needed for decryption this means the passphrase does not always need to be provided.

#### Methods

- **`decryptChildPrivateKey(encryptedPrivateKeyBytes, noCache)`:** Decrypts an encrypted child private key. It retrieves the passphrase using the provided function and handles errors specifically related to authentication failures.

- **`decryptSeedBytes(serializableData, noCache)`:** Decrypts the seed bytes stored in the provided serializable data object. This method is essential for accessing the root keys derived from the seed.

- **`decryptSeed(keyPropertyName, serializableData, errorMessage, noCache)`:** A private method that generalizes seed decryption logic. It is used internally by other public methods for different decryption needs, ensuring error handling and passphrase management are consistently applied.

#### Error Handling

`KeyDecryptor` incorporates error handling mechanisms to manage and report decryption failures, which are encapsulated within `AuthenticationError`. This ensures that any issues during the decryption process are clearly communicated to the calling functions, allowing for appropriate responses to security-critical failures.

#### Example Usage

```typescript
const keyDecryptor = new KeyDecryptor(getPassphrase);

const encryptedPrivateKey = await emip3encrypt(seed, passphrase);
const decryptedPrivateKey =
  await keyDecryptor.decryptChildPrivateKey(encryptedPrivateKey);

const serializableData: SerializableKeyAgentData = {
  __typename: "InMemory",
  encryptedSeedBytes: encryptedSeedBytes,
  id: "http://example.gov/wallet/3732",
  type: ["VerifiableCredential", "EncryptedWallet"],
  issuer: "did:example:123",
  issuanceDate: "2020-05-22T17:38:21.910Z",
  credentialSubject: {
    id: "did:example:123",
    contents: [],
  },
};
const decryptedSeed = await keyDecryptor.decryptSeedBytes(serializableData);
```

### InMemoryKeyAgent

The `InMemoryKeyAgent` extends `KeyAgentBase` to manage encrypted seed bytes in memory, facilitating the restoration of a key agent from a mnemonic phrase. It plays a crucial role in the secure handling of sensitive key material, aligning with the W3C Universal Wallet Specification.

#### Usage and Functionality

- **Constructing an Instance**: Initialize a new `InMemoryKeyAgent` by providing the required properties defined in `SerializableInMemoryKeyAgentData`, including encrypted seed bytes and a passphrase function.

- **Restoring a KeyAgent**: This method reinitializes an existing `KeyAgent` by deriving necessary credentials based on blockchain-specific parameters.

- **Creating from Mnemonic Words**: Create a new instance from BIP39 mnemonic words. The process involves validating the mnemonics, generating entropy, deriving a seed, and encrypting the seed with a passphrase. If the mnemonics are invalid or encryption fails, an error is thrown.

#### Example Usage

```typescript
const mnemonicWords = [
  "habit",
  "hope",
  "tip",
  "crystal",
  "because",
  "grunt",
  "nation",
  "idea",
  "electric",
  "witness",
  "alert",
  "like",
];
const getPassphrase = () =>
  new Promise<Uint8Array>((resolve) => resolve(Buffer.from("passphrase")));

const agent = await InMemoryKeyAgent.fromMnemonicWords({
  mnemonicWords,
  getPassphrase,
});
```

Check out the test suite!

### SessionKeyAgent (Experimental)

`SessionKeyAgentBase` is an abstract class designed to facilitate session-based key management for blockchain applications, particularly for smart contract developers. This class allows for the dynamic derivation of non-encrypted private key credentials for a session, which can be used for signing operations without repeated user authorization. This makes it ideal for applications requiring a high frequency of operations within a session, such as those involving smart contracts.

#### Key Concepts

- **Session Keys:** Temporary private keys that are derived for the duration of a session without being encrypted. These keys are used to sign transactions or messages directly, reducing the need for constant user interaction.
- **Smart Contract Constraints:** Developers can specify constraints around the session key's operations, typically by defining what actions the key can perform within the smart contract's methods.

#### Features

- Dynamically generates session-specific private keys for transaction signing.
- Eliminates the need for the end user to sign every transaction, enhancing user experience and application efficiency.
- Supports experimental features such as signing a Merkle root of session parameters to establish session constraints.

#### Experimental Features

Session keys are experimental and introduce new capabilities, such as:

```typescript
export interface OffchainSessionAllowedMethods {
  contractAddress: string;
  method: string;
}

export type RequestOffchainSession = {
  data: {
    sessionKey: string;
    expirationTime: string;
    allowedMethods: OffchainSessionAllowedMethods[];
    sessionMerkleRoot: MinaSignablePayload;
  };
};
```

#### Usage

An application, for example, a zkApp, might use SessionKeyAgentBase to derive a new random private key credential for a session. It can also handle an experimental web-provider listener that receives requests to sign the Merkle root of the session's parameters.

Here's how an application can use SessionKeyAgentBase:

```typescript
class SessionKeyAgentBaseInstance extends SessionKeyAgentBase {}
const networkType = "testnet";
const instance = new SessionKeyAgentBaseInstance();

const args: MinaDerivationArgs = {
  network: Network.Mina,
  accountIndex: Math.floor(Math.random() * 10),
  addressIndex: Math.floor(Math.random() * 10),
};

const sessionCredential = await instance.deriveCredentials(args);
const sessionParams = {
  sessionKey: "B62..flsw",
  expirationTime: "14950204",
  allowedMethods: [
    {
      contractAddress: "B62..dow",
      method: "MoveChessPieces",
    },
  ],
};
const requestedSessionParams = {
  data: sessionParams,
  sessionMerkleRoot: toMerkleTree(sessionParams).getRoot(),
};

// Request wallet to sign the root
const accounts = await window.mina.request({ method: "mina_enable" });
const signedRoot = await window.mina.request({
  method: "experimental_requestSession",
  params: requestedSessionParams,
});

// Commit signedRoot to contract
const tx = await Mina.transaction(accounts[0], async () => {
  await chessZkApp.commitSession(signedRoot, accounts[0]);
});

// Sign many transactions
for (const move of chessGameMoves) {
  const chessMovetx = await Mina.transaction(accounts[0], async () => {
    await chessZkApp.chessMove(move);
  });
  const signedTx = await instance.sign(sessionCredential, chessMovetx, {
    network: Network.Mina,
    networkType: "testnet",
    operation: "mina_signTransaction",
  });
  await submitTxProvider(signedTx);
}
```

#### Note

Smart contract engineers are advised to encapsulate the complexity of constraining the session key's operations within their contract methods. The constraints can be expressed to end-users when asking them to sign the merkle root of permissions.
