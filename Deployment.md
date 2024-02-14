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


Adding a Pool

Requires creating a pair (automatically created when a pool is created) and a pool by calling the factory's createPair and createPool functions.
Easiest way to do this is to use the frontend to create a pool and then copy the pair liquidity  addresse from the pool creation tx (or call getPair on the Factory).

Adding a staking Pool

Requires an existing Pool. Create one before then deploy a StakingRewards contract :
 StakingRewards( rewardTokenAddress, pairAddress )

