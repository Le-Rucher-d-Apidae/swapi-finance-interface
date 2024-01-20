# Baguette Interface

An open source interface for Swapi -- a community-backed decentralized exchange for Polygon assets, tasting like honey.

## Project Introduction

Swapi is a Uniswap based AMM forked from [baguette-exchange](https://github.com/baguette-exchange?tab=repositories) running on Polygon with APD rewards for a few selected LPs and single-token staking
pools for those who want to avoid being exposed to impermanent loss. No one can deny most DEX/AMM projects are subject
to high inflation. The goal of Swapi with $APD is to reward users while keeping inflation under control and avoid
sharp depreciation of the token price.

APD tokens are at the heart of Swapi's ecosystem which connects investor and producer.
Buy them, earn them, spend them, use them for yield farming or staking all while contributing to a good cause.

## APD Token

The Apidae token (APD) is an electronic representation of an apiary in order to contribute to the
preservation of bees. The token was created in 2022 to change the status into a sole proprietorship and
to allow local actions on the objective.

- Issue Time : ????/??/??
- Total Supply : ????,????,????
- Circulating Supply : ????,????,????

## Links

- Website: [baguette.exchange](https://swapi.finance/)
- Token Contract : [Polygon Explorer](https://cchain.explorer.avax.network/address/0xa1144a6A1304bd9cbb16c800F7a867508726566E/transactions)
- White Paper: [whitepaper](https://drive.google.com/file/d/1dxIxYjNvkzPFuN9SZtDWgVFCJ03SDljR/view)
- Interface: [app.swapi.finance](https://app.swapi.finance)
- Analytics: [info.swapi.finance](https://info.swapi.finance)
- Telegram: [Swapi](https://t.me/+_ZM8urn-6FQ4MWU0)
- Twitter: [@Swapi](https://twitter.com/ApidaeToken)

## Accessing the Swapi Interface

Visit [app.swapi.finance](https://app.swapi.finance).

## Development

### Install Dependencies

```bash
yarn
```

### Run

```bash
yarn start
```

### Configuring the environment (optional)

To have the interface default to a different network when a wallet is not connected:

1. Make a copy of `.env` named `.env.local`
2. Change `REACT_APP_NETWORK_ID` to `"{YOUR_NETWORK_ID}"`
3. Change `REACT_APP_NETWORK_URL` to your JSON-RPC provider

Note that the interface only works on testnets where both
[Swapi contracts](https://github.com/Le-Rucher-d-Apidae/swapi-finance-contracts) and
[multicall](https://github.com/makerdao/multicall) are deployed.
The interface will not work on other networks.

## Attribution
This code was adapted from this Uniswap repo: [uniswap-interface](https://github.com/Uniswap/uniswap-interface).
