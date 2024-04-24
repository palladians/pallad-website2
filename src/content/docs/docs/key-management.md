---
title: Key-Management
description: How key-management is designed in Pallad
---

# An Agnostic Key Management Package

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
      'habit',
      'hope',
      'tip',
      'crystal',
      'because',
      'grunt',
      'nation',
      'idea',
      'electric',
      'witness',
      'alert',
      'like'
]
seed = bip39.mnemonicToSeed(mnemonic, '')
encryptedSeedBytes = await emip3encrypt(seed, passphrase)
// define the serializable data
const serializableData: SerializableKeyAgentData = {
  __typename: 'InMemory',
  encryptedSeedBytes: encryptedSeedBytes,
  id: 'http://example.gov/wallet/3732',
  type: ['VerifiableCredential', 'EncryptedWallet'],
  issuer: 'did:example:123',
  issuanceDate: '2020-05-22T17:38:21.910Z',
  credentialSubject: {
    id: 'did:example:123',
    contents: []
  }
};
// define your passphrase
const params = {
  passphrase: 'passphrase'
}
const getPassphrase = () => new Promise<Uint8Array>((resolve) => resolve(Buffer.from(params.passphrase)))
// create an instance of the KeyAgent
const instance = new KeyAgentBase(serializableData, getPassphrase);
// derive your first credential
const derivationArgs: ChainDerivationArgs = {
          network: "Mina",
          accountIndex: 0,
          addressIndex: 0,
        }
const credential = instance.deriveCredentials(
        derivationArgs,
        getPassphrase,
        true
      )
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
const decryptedPrivateKey = await keyDecryptor.decryptChildPrivateKey(encryptedPrivateKey);

const serializableData: SerializableKeyAgentData = {
  __typename: 'InMemory',
  encryptedSeedBytes: encryptedSeedBytes,
  id: 'http://example.gov/wallet/3732',
  type: ['VerifiableCredential', 'EncryptedWallet'],
  issuer: 'did:example:123',
  issuanceDate: '2020-05-22T17:38:21.910Z',
  credentialSubject: {
    id: 'did:example:123',
    contents: []
  }
};
const decryptedSeed = await keyDecryptor.decryptSeedBytes(serializableData);
```

### InMemoryKeyAgent

The `InMemoryKeyAgent` is an extension of `KeyAgentBase` that manages the encrypted seed bytes in memory and can restoring a key agent from a mnemonic.

#### Usage and Functionality

To use `InMemoryKeyAgent`, you need to provide a passphrase, which is a function returning a promise that resolves to the passphrase used for seed encryption.

The class provides the following functionalities:

- Constructing a new instance: This requires providing all necessary details to create a `SerializableInMemoryKeyAgentData` type object, including the encrypted seed bytes and the passphrase function.

- Restoring a KeyAgent: This feature can reinitialize a `KeyAgent` instance by deriving the necessary credentials. It takes a payload and arguments specific to the blockchain in use.

- Creating an instance from mnemonic words: This feature creates a new `InMemoryKeyAgent` from a provided list of BIP39 mnemonic words and a passphrase. The passphrase is used to encrypt the seed derived from the mnemonic words.

**Note:** The `fromMnemonicWords` function first validates the provided mnemonic words. It then converts the mnemonic words into entropy, generates a seed from the entropy, and encrypts it using the passphrase. If the mnemonic words are not valid or the encryption fails, the function throws an error.

Here's a simple example of usage:

```ts
const mnemonicWords = [
  'habit',
  'hope',
  'tip',
  'crystal',
  'because',
  'grunt',
  'nation',
  'idea',
  'electric',
  'witness',
  'alert',
  'like'
]
const getPassphrase = new Promise<Uint8Array>((resolve) =>
  resolve(Buffer.from('passphrase'))
)

const agent = await InMemoryKeyAgent.fromMnemonicWords({
  mnemonicWords,
  getPassphrase
})
```

**Important**: When implementing, the passphrase function should be set up in a secure way that's suitable for your application.

With the `InMemoryKeyAgent`, you can handle sensitive key material in a way that conforms to the W3C Universal Wallet Specification. It enables you to derive credentials, sign transactions, and manage seeds for supported blockchain networks, with secure in-memory storage.

Check out the test suite!