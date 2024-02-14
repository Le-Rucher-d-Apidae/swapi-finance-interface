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