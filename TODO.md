# Update:

- tokenlist.json
./src/constants/lists.ts

- pages addresses, router, factory, default pairs
./src/constants/index.ts

- [FACTORY_ADDRESS, INIT_CODE_HASH](./sdk/src/constants.ts)
https://www.google.com/search?q=swap+factory+INIT_CODE_HASH

(social) links
src/components/Menu/index.tsx

WALLET_TUTORIAL
src/components/WalletModal/index.tsx

computeBagCirculation
src/utils/computeBagCirculation.ts

src/pages/Mill/index.tsx

API
https://api.baguette.exchange/bag/circulating-supply
src/utils/computeBagCirculation.ts
process.env.REACT_APP_API_BASE_URL
REACT_APP_API_CIRCULATING_SUPPLY


toV2LiquidityToken
Pair.getAddress(tokenA, tokenB, chainId), 18, 'BGL', 'Baguette Liquidity'
src/state/user/hooks.tsx


Links, Token, ...
- README.md

WALLET_TUTORIAL link
src/components/WalletModal/index.tsx

fix TokenBalanceContent (ok?), APD price
[TokenBalanceContent](src/components/Header/TokenBalanceContent.tsx)

remove debug, console.log, console.debug
[useTransactionDeadline](src/hooks/useTransactionDeadline.ts)

- remove //debugger console.log console.debug

- Tests
sdk/test/*