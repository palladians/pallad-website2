---
title: Methods
description: Pallad's Web Connector methods.
---

Pallad's Web Provider implementation is based on [RFC-0008: Mina Provider JavaScript API](https://github.com/MinaFoundation/Core-Grants/blob/main/RFCs/rfc-0008-wallet-provider-api.md).

## Authentication

The zkApp gets authenticated (added to trusted apps) after users approves the connection to their wallets after a request. In other words, in Pallad it happens automatically when zkApp requests any Web Connector method.

## Provider instance

In order to use Pallad's provider instance, zkApp can request the announcement of available providers, and then filter the Pallad instance from the list.

```ts
const providers = [];
window.addEventListener("mina:announceProvider", (event) => {
  providers.push(event.detail);
});
window.dispatchEvent(new Event("mina:requestProvider"));
const provider = providers.find((provider) => provider.info.slug === "pallad");
// => { info, provider }
```

## Wallet methods

### mina_accounts

```ts
await provider.request({ method: 'mina_accounts' )
```

```ts
{
  jsonrpc: "1.0",
  result: ["B62..."]
}
```

### mina_chainId

```ts
await provider.request({ method: 'mina_chainId' )
```

```ts
{
  jsonrpc: "1.0",
  result: "29936104443aaf264a7f0192ac64b1c7173198c1ed404c1bcff5e562e05eb7f6"
}
```

### mina_getBalance

```ts
await provider.request({ method: 'mina_getBalance' )
```

```ts
{
  jsonrpc: "1.0",
  result: 256.1
}
```

### mina_requestNetwork

```ts
await provider.request({ method: "mina_requestNetwork" });
```

```ts
{
  jsonrpc: "1.0",
  result: {
    chainId: "29936104443aaf264a7f0192ac64b1c7173198c1ed404c1bcff5e562e05eb7f6",
    networkName: "Devnet"
  }
}
```

### mina_addChain

TBC

### mina_switchChain

TBC

## Signing Methods

### mina_sign

```ts
await provider.request({
  method: "mina_sign",
  params: { message: "Message to sign" },
});
```

```ts
{
  jsonrpc: "1.0",
  result: {
 	  signature: {
  		field: "26688777148479764993896686318312196265329713747492845934030403162209826011969",
  		scalar: "3622081775165555485446094478234519383850142528029688247658006921004458225034"
   	},
   	publicKey: "B62qkYa1o6Mj6uTTjDQCob7FYZspuhkm4RRQhgJg9j4koEBWiSrTQrS",
   	data: "Message to sign"
  }
}
```

### mina_signFields

```ts
await provider.request({
  method: "mina_signFields",
  params: { fields: [0] },
});
```

TBC

## Public Credential Methods
