import { Interface } from '@ethersproject/abi'
import { abi as STAKING_REWARDS_ABI } from '@swapi-finance/contracts/hardhat-artifacts/src/contracts/StakingRewards2.sol/StakingRewards2.json'

const STAKING_REWARDS_INTERFACE = new Interface(STAKING_REWARDS_ABI)

export { STAKING_REWARDS_INTERFACE }
