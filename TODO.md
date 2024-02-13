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

src/pages/StakePool/index.tsx

API
https://api.baguette.exchange/bag/circulating-supply
src/utils/computeBagCirculation.ts
process.env.REACT_APP_API_BASE_URL
REACT_APP_API_CIRCULATING_SUPPLY


    string public constant name = 'Baguette Liquidity';
    string public constant symbol = 'BGL';
[BaguetteERC20](contracts/swapi-core/BaguetteERC20.sol)


Links, Token, ...
- README.md

WALLET_TUTORIAL link
src/components/WalletModal/index.tsx

fix TokenBalanceContent (ok?), APD price
[TokenBalanceContent](src/components/Header/TokenBalanceContent.tsx)

remove debug, console.log, console.debug
[useTransactionDeadline](src/hooks/useTransactionDeadline.ts)

constructor
      18,
      'AXP',
      'avaXwap'
[class Pair](sdk/src/entities/pair.ts)

- remove //debugger console.log console.debug

domain =       name: 'Baguette',
removeLiquidityAVAX
removeLiquidityAVAXSupportingFeeOnTransferTokens
removeLiquidity
removeLiquidityAVAXWithPermit
removeLiquidityAVAXWithPermitSupportingFeeOnTransferTokens
removeLiquidityWithPermit
[RemoveLiquidity](src/pages/RemoveLiquidity/index.tsx)

- Tests
sdk/test/*


# Deployment
## Contracts
### Factory
factory deployment: provide address for fees "_feeToSetter"
constructor(address _feeToSetter) public

Update factory address in swapi-finance-sdk/src/constants.ts
Call INIT_CODE_HASH factory getter and update its value in swapi-finance-sdk/src/constants.ts

### Router
router deployment: use factory address and wrapped currency (AVAX, MATIC, WETH/...) address
constructor(address _factory, address _WAVAX) public

Update router address in swapi-finance-interface/src/constants/index.ts