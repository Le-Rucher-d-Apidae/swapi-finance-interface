import { ChainId, CurrencyAmount, JSBI, Token, TokenAmount, WCURRENCY, Pair } from '@swapi-finance/sdk'
import { useMemo } from 'react'
import {
  SELF_TOKEN,
  USDCE,
  USDT,
  USDC,
  DAI,
  UNDEFINED,
  ZERO_ADDRESS,
  WETH,
  WBTC,
  oneToken18,
  BIG_INT_ZERO,
  BIG_INT_ONE,
  BIG_INT_TWO
} from '../../constants'
import { STAKING_REWARDS_INTERFACE } from '../../constants/abis/staking-rewards'
import { AUTOCOMPOUND_INTERFACE } from '../../constants/abis/autocompound'
import { PairState, usePair, usePairs } from '../../data/Reserves'
import { useActiveWeb3React } from '../../hooks'
import { NEVER_RELOAD, useMultipleContractSingleData } from '../multicall/hooks'
import { tryParseAmount } from '../swap/hooks'

// UNUSED
// export const STAKING_GENESIS = 1600387200
// export const REWARDS_DURATION_DAYS = 60

// ----------------------------------------------------------------------------
// For testing purposes only
// import { USDC18, USDC32 } from '../../constants'
// ----------------------------------------------------------------------------

// Add staking rewards addresses here
// Supported : Adding a new staking contract with an EXISTING TOKEN PAIR and a different reward
export const STAKING_REWARDS_INFO: {
  [chainId in ChainId]?: {
    tokens: [Token, Token]
    rewardToken: Token
    stakingRewardAddress: string
    autocompoundingAddress: string
  }[]
} = {
  [ChainId.MUMBAI]: [
    //
    // Stake-Farm = rewarded PAIRS
    //
    // {
    //   tokens: [TOKEN1[ChainId.MUMBAI], TOKEN2[ChainId.MUMBAI]], // pair: 0x...
    //   rewardToken: REWARDTOKEN[ChainId.MUMBAI],
    //   stakingRewardAddress: '0x....', // optimization: 2000
    //   autocompoundingAddress: ZERO_ADDRESS
    // },
    //
    //
    //
    // Stake = rewarded SINGLE tokens
    //
    // {
    //   tokens: [TOKEN1[ChainId.MUMBAI], UNDEFINED[ChainId.MUMBAI]],
    //   rewardToken: REWARDTOKEN[ChainId.MUMBAI],
    //   stakingRewardAddress: '0x....', // optimization: 2000
    //   autocompoundingAddress: ZERO_ADDRESS
    // }
  ],
  [ChainId.POLYGON]: [
    //
    // Stake-Farm = rewarded PAIRS
    //
    // BWS / WMATIC -> BWS
    {
      // 0x01024b5D8CB02A12966D96A7b1Ea94C34085630B / 0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270
      tokens: [SELF_TOKEN[ChainId.POLYGON], WCURRENCY[ChainId.POLYGON]], // pair: 0x42B50F51c57Dc60663679f1Fe9260b89Fa6f88Ae
      rewardToken: SELF_TOKEN[ChainId.POLYGON], // 0x01024b5D8CB02A12966D96A7b1Ea94C34085630B
      stakingRewardAddress: '0x5bAfF3CF8466F98834fF247B6aA13a77Ac8535C6', // optimization: 10000 ; Verified
      autocompoundingAddress: ZERO_ADDRESS
    },
    // BWS / WBTC -> BWS
    {
      // 0x01024b5D8CB02A12966D96A7b1Ea94C34085630B / 0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6
      tokens: [SELF_TOKEN[ChainId.POLYGON], WBTC[ChainId.POLYGON]], // pair: 0xB8971F1aFf1E617aB9fBF2b389d66bC5cc749B75
      rewardToken: SELF_TOKEN[ChainId.POLYGON], // 0x01024b5D8CB02A12966D96A7b1Ea94C34085630B
      stakingRewardAddress: '0x80fc1f627e01a5c625D15d0D269b03373397B90e', // optimization: 10000 ; Verified
      autocompoundingAddress: ZERO_ADDRESS
    },
    // BWS / WETH -> BWS
    {
      // 0x01024b5D8CB02A12966D96A7b1Ea94C34085630B / 0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619
      tokens: [SELF_TOKEN[ChainId.POLYGON], WETH[ChainId.POLYGON]], // pair: 0xB0472D9410FCf4bCeFe1B1BDa082B17c4a1d240e
      rewardToken: SELF_TOKEN[ChainId.POLYGON], // 0x01024b5D8CB02A12966D96A7b1Ea94C34085630B
      stakingRewardAddress: '0x4bD294FF118b13b1a65FC847286effCB9c242E16', // optimization: 10000 ; Verified
      autocompoundingAddress: ZERO_ADDRESS
    },
    //
    // Stake = rewarded SINGLE tokens
    //
    // BWS -> BWS
    {
      // 0x01024b5D8CB02A12966D96A7b1Ea94C34085630B
      tokens: [SELF_TOKEN[ChainId.POLYGON], UNDEFINED[ChainId.POLYGON]],
      rewardToken: SELF_TOKEN[ChainId.POLYGON], // 0x01024b5D8CB02A12966D96A7b1Ea94C34085630B
      stakingRewardAddress: '0x45239C9DeF93b003Fa472A26233B909F7C5b5A96', // optimization: 10000 ; Verified
      autocompoundingAddress: ZERO_ADDRESS
    },
    // BWS -> WETH
    {
      // 0x01024b5D8CB02A12966D96A7b1Ea94C34085630B
      tokens: [SELF_TOKEN[ChainId.POLYGON], UNDEFINED[ChainId.POLYGON]],
      rewardToken: WETH[ChainId.POLYGON], // 0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619
      stakingRewardAddress: '0xc4c68A0CBf111470D102Bb00C7CCAAFF79dF7bBe', // optimization: 10000 ; Verified
      autocompoundingAddress: ZERO_ADDRESS
    },
    // BWS -> WBTC
    {
      // 0x01024b5D8CB02A12966D96A7b1Ea94C34085630B
      tokens: [SELF_TOKEN[ChainId.POLYGON], UNDEFINED[ChainId.POLYGON]],
      rewardToken: WBTC[ChainId.POLYGON], // 0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6
      stakingRewardAddress: '0xC9A90aC1Ba2D787396d46dE1DCAD603A84f94c0b', // optimization: 10000 ; Verified
      autocompoundingAddress: ZERO_ADDRESS
    }
  ]
}

export enum StakingType {
  PAIR,
  SINGLE,
  BOTH
}

export interface StakingInfo {
  // the address of the reward contract
  stakingRewardAddress: string
  // the address of the autocompounding contract
  autocompoundingAddress: string
  // the tokens involved in this pair
  tokens: [Token, Token]
  // the token in which rewards are distributed
  rewardToken: Token
  // the amount of token currently staked, or undefined if no account
  stakedAmount: TokenAmount
  // the amount of reward token earned by the active account, or undefined if no account
  earnedAmount: TokenAmount
  // the amount of shares of the autocompounding pool if applicable
  sharesAmount: JSBI
  // the total amount of token staked in the contract
  totalStakedAmount: TokenAmount
  // the amount of token distributed per second to all LPs, constant
  totalRewardRate: TokenAmount
  // the current amount of token distributed to the active account per second.
  // equivalent to percent of total supply * reward rate
  rewardRate: TokenAmount
  // total staked in Wcurrency in the pool
  totalStakedInWcurrency: TokenAmount

  // total staked in USD in the pool // test
  totalPoolDepositsStakedInUsd: TokenAmount
  addressDepositStakedInWcurrency: TokenAmount
  addressDepositStakedInUsd: TokenAmount
  // usdToken: Token

  // use autocompounding
  useAutocompounding: boolean
  // when the period ends
  periodFinish: Date | undefined
  // calculates a hypothetical amount of token distributed to the active account per second.
  getHypotheticalRewardRate: (
    stakedAmount: TokenAmount,
    totalStakedAmount: TokenAmount,
    totalRewardRate: TokenAmount
  ) => TokenAmount
}

const calculateStakedAmountInUsdFromWcurrencyStakedAmount = function(
  usdToken: Token,
  currencyUsdTokenPairReserveOfUsd: JSBI,
  currencyUsdTokenPairReserveOfCurrency: JSBI,
  amountStakedInWcurrency: TokenAmount
): TokenAmount {
  if (
    JSBI.equal(amountStakedInWcurrency.raw, BIG_INT_ZERO) ||
    JSBI.equal(currencyUsdTokenPairReserveOfUsd, BIG_INT_ZERO)
  ) {
    return new TokenAmount(usdToken, BIG_INT_ZERO)
  }
  const currencyUsdTokenRatio = JSBI.divide(
    JSBI.multiply(oneToken18, currencyUsdTokenPairReserveOfCurrency),
    currencyUsdTokenPairReserveOfUsd
  )
  const resAmount = JSBI.divide(JSBI.multiply(amountStakedInWcurrency.raw, oneToken18), currencyUsdTokenRatio)
  return new TokenAmount(usdToken, resAmount)
}

const calculateStakedAmountInCurrencyFromSelfToken = function(
  chainId: ChainId,
  currencySelfTokenPairReserveOfSelfToken: JSBI,
  currencySelfTokenPairReserveOfWCurrencyToken: JSBI,
  stakingTokenPairReserveOfSelfToken: JSBI,
  stakedAmount: TokenAmount,
  pairTotalSupply: JSBI
): TokenAmount {
  if (JSBI.equal(stakedAmount.raw, BIG_INT_ZERO) || JSBI.equal(currencySelfTokenPairReserveOfSelfToken, BIG_INT_ZERO))
    return new TokenAmount(WCURRENCY[chainId], BIG_INT_ZERO)

  const currencySelfTokenRatio = JSBI.divide(
    JSBI.multiply(oneToken18, currencySelfTokenPairReserveOfWCurrencyToken),
    currencySelfTokenPairReserveOfSelfToken
  )
  const valueOfSelfTokenInCurrency = JSBI.divide(
    JSBI.multiply(stakingTokenPairReserveOfSelfToken, currencySelfTokenRatio),
    oneToken18
  )
  const amount = JSBI.divide(
    JSBI.multiply(
      JSBI.multiply(stakedAmount.raw, valueOfSelfTokenInCurrency),
      BIG_INT_TWO // this is b/c the value of LP shares are ~double the value of the wcurrency they entitle owner to
    ),
    pairTotalSupply
  )

  return new TokenAmount(WCURRENCY[chainId], amount)
}

const calculateStakedAmountInCurrency = function(
  chainId: ChainId,
  totalSupply: JSBI,
  reserveInWcurrency: JSBI,
  totalStakedAmount: TokenAmount,
  // test
  pairTotalSupply: JSBI
): TokenAmount {
  if (JSBI.equal(totalSupply, BIG_INT_ZERO)) return new TokenAmount(WCURRENCY[chainId], BIG_INT_ZERO)
  // take the total amount of LP tokens staked, multiply by CURRENCY value of all LP tokens, divide by all LP tokens
  const amount = JSBI.divide(
    JSBI.multiply(
      JSBI.multiply(totalStakedAmount.raw, reserveInWcurrency),
      BIG_INT_TWO // this is b/c the value of LP shares are ~double the value of the wcurrency they entitle owner to
    ),
    pairTotalSupply
  )

  return new TokenAmount(WCURRENCY[chainId], amount)
}

const calculateTotalStakedAmountInCurrencyFromToken = function(
  stakingType: StakingType,
  chainId: ChainId,
  currencyTokenPairReserveOfCurrency: JSBI,
  currencyTokenPairReserveOfToken: JSBI,
  totalStakedAmount: TokenAmount
): TokenAmount {
  if (JSBI.equal(currencyTokenPairReserveOfToken, BIG_INT_ZERO))
    return new TokenAmount(WCURRENCY[chainId], BIG_INT_ZERO)

  const currencySelfTokenRatio = JSBI.divide(
    JSBI.multiply(oneToken18, currencyTokenPairReserveOfCurrency),
    currencyTokenPairReserveOfToken
  )
  // const amount = JSBI.divide(JSBI.multiply(totalStakedAmount.raw, currencySelfTokenRatio), oneToken18)
  const amount = JSBI.multiply(
    JSBI.divide(JSBI.multiply(totalStakedAmount.raw, currencySelfTokenRatio), oneToken18),
    stakingType === StakingType.PAIR ? BIG_INT_TWO : BIG_INT_ONE
  ) // this is b/c the value of LP shares are ~double the value of the wcurrency they entitle owner to

  return new TokenAmount(WCURRENCY[chainId], amount)
}

export const isSelfToken = function(token: Token, chainId: ChainId): boolean {
  return token.equals(SELF_TOKEN[chainId])
}

export const isWethOrWbtcToken = function(token: Token, chainId: ChainId): boolean {
  return token.equals(WETH[chainId]) || token.equals(WBTC[chainId])
}

export const isUSDtoken = function(token: Token, chainId: ChainId): boolean {
  return (
    token.equals(USDCE[chainId]) ||
    token.equals(USDT[chainId]) ||
    token.equals(USDC[chainId]) ||
    token.equals(DAI[chainId])
  )
}

// gets the staking info from the network for the active chain id
export function useStakingInfo(
  stakingType: StakingType,
  pairToFilterBy?: Pair | null,
  rewardToken?: Token | null
): StakingInfo[] {
  const { chainId, account } = useActiveWeb3React()
  const CHAINID = chainId ? chainId : ChainId.POLYGON
  const info = useMemo(
    () =>
      chainId
        ? STAKING_REWARDS_INFO[chainId]?.filter(stakingRewardInfo =>
            pairToFilterBy === undefined
              ? true
              : pairToFilterBy === null
              ? false
              : rewardToken
              ? pairToFilterBy.involvesToken(stakingRewardInfo.tokens[0]) &&
                pairToFilterBy.involvesToken(stakingRewardInfo.tokens[1]) &&
                stakingRewardInfo.rewardToken.equals(rewardToken)
              : pairToFilterBy.involvesToken(stakingRewardInfo.tokens[0]) &&
                pairToFilterBy.involvesToken(stakingRewardInfo.tokens[1])
          ) ?? []
        : [],
    [chainId, pairToFilterBy, rewardToken]
  )
  const oneToken = oneToken18
  const selfToken = SELF_TOKEN[CHAINID]
  const rewardsAddresses = useMemo(() => info.map(({ stakingRewardAddress }) => stakingRewardAddress), [info])
  const autocompoundingAddresses = useMemo(() => info.map(({ autocompoundingAddress }) => autocompoundingAddress), [
    info
  ])
  const rewardTokens = useMemo(() => info.map(({ rewardToken }) => rewardToken), [info])
  const accountArg = useMemo(() => [account ?? undefined], [account])

  // get all the info from the staking rewards contracts
  const tokens = useMemo(() => info.map(({ tokens }) => tokens), [info])
  const balances = useMultipleContractSingleData(rewardsAddresses, STAKING_REWARDS_INTERFACE, 'balanceOf', accountArg)
  const autocompounderShares = useMultipleContractSingleData(
    autocompoundingAddresses,
    AUTOCOMPOUND_INTERFACE,
    'balanceOf',
    accountArg
  )
  const autocompounderShareTokenRatios = useMultipleContractSingleData(
    autocompoundingAddresses,
    AUTOCOMPOUND_INTERFACE,
    'getDepositTokensForShares',
    ['1000000000000000000'] // 1e18
  )
  const earnedAmounts = useMultipleContractSingleData(rewardsAddresses, STAKING_REWARDS_INTERFACE, 'earned', accountArg)
  const totalSupplies = useMultipleContractSingleData(rewardsAddresses, STAKING_REWARDS_INTERFACE, 'totalSupply')
  const pairs = usePairs(tokens)

  const pairsAddresses = useMemo(() => pairs.map(pair => pair[1]?.liquidityToken.address), [pairs])

  const pairTotalSupplies = useMultipleContractSingleData(pairsAddresses, STAKING_REWARDS_INTERFACE, 'totalSupply')

  const currencyPairs = usePairs(tokens.map(pair => [WCURRENCY[CHAINID], pair[0]]))

  // Adds a warning if the pair is not found
  let wcurrencyPairNotFound = false
  currencyPairs?.forEach((pair, index) => {
    if (pair[0] === PairState.NOT_EXISTS && !pair[1]) {
      wcurrencyPairNotFound = true
      console.warn(`useStakingInfo: PAIR NOT FOUND (${index})  `, WCURRENCY[CHAINID], tokens[index][0])
    }
  })

  const [currencySelfTokenPairState, currencySelfTokenPair] = usePair(WCURRENCY[CHAINID], selfToken)
  // USD token in use for computing $USD values
  const usdToken = USDC[CHAINID] // USD Token in use ; WCurrency / USD token must exist to be able to calculate price !
  const [currencyUSDTokenPairState, currencyUSDTokenPair] = usePair(WCURRENCY[CHAINID], usdToken)
  // tokens per second, constants
  const rewardRates = useMultipleContractSingleData(
    rewardsAddresses,
    STAKING_REWARDS_INTERFACE,
    'rewardRate',
    undefined,
    NEVER_RELOAD
  )
  const periodFinishes = useMultipleContractSingleData(
    rewardsAddresses,
    STAKING_REWARDS_INTERFACE,
    'periodFinish',
    undefined,
    NEVER_RELOAD
  )

  return useMemo(() => {
    if (!chainId || !selfToken) return []
    return rewardsAddresses.reduce<StakingInfo[]>((memo, rewardsAddress, index) => {
      const autocompoundingAddress = autocompoundingAddresses[index]
      const rewardToken = rewardTokens[index]
      let useAutocompounding = false

      // these two are dependent on account
      const balanceState = balances[index]
      const earnedAmountState = earnedAmounts[index]
      const autocompounderSharesState = autocompounderShares[index]
      const autocompounderShareTokenRatioState = autocompounderShareTokenRatios[index]

      // these get fetched regardless of account
      const totalSupplyState = totalSupplies[index]
      const rewardRateState = rewardRates[index]
      const periodFinishState = periodFinishes[index]
      // test
      const pairTotalSupplyState = pairTotalSupplies[index]

      const tokens = info[index].tokens
      const [currencyTokenPairState, currencyTokenPair] = currencyPairs[index]

      // Adds a warning if the pair is not found
      // const isPair = tokens[1] !== UNDEFINED[tokens[1].chainId]
      const isPair = tokens[1] !== UNDEFINED[CHAINID]
      const [pairState, pair] = pairs[index]
      if ((isPair && stakingType === StakingType.SINGLE) || (!isPair && stakingType === StakingType.PAIR)) {
        return memo
      }
      if (
        // these may be undefined if not logged in
        !balanceState?.loading &&
        !earnedAmountState?.loading &&
        // always need these
        totalSupplyState &&
        !totalSupplyState.loading &&
        rewardRateState &&
        !rewardRateState.loading &&
        periodFinishState &&
        !periodFinishState.loading &&
        ((isPair && pair && pairState !== PairState.LOADING) || !isPair) &&
        currencySelfTokenPair &&
        currencySelfTokenPairState !== PairState.LOADING &&
        // Additional states
        currencyUSDTokenPair &&
        currencyUSDTokenPairState !== PairState.LOADING &&
        !pairTotalSupplyState?.loading
      ) {
        if (
          balanceState?.error ||
          earnedAmountState?.error ||
          totalSupplyState.error ||
          rewardRateState.error ||
          periodFinishState.error ||
          // Additional states
          (isPair && pairTotalSupplyState?.error) ||
          (isPair && (pairState === PairState.INVALID || pairState === PairState.NOT_EXISTS)) ||
          currencySelfTokenPairState === PairState.INVALID ||
          currencySelfTokenPairState === PairState.NOT_EXISTS ||
          // Additional states
          // (isPair &&
          currencyUSDTokenPairState === PairState.INVALID ||
          currencyUSDTokenPairState === PairState.NOT_EXISTS
          // )
        ) {
          return memo
        }
        const totalSupply = JSBI.BigInt(totalSupplyState.result?.[0])
        // // Additional fields: pairTotalSupply, addressBalance
        const addressBalance = JSBI.BigInt(balanceState.result?.[0])

        let totalStakedInWcurrency: TokenAmount
        // Additional fields: addressDepositStakedInWcurrency, addressDepositStakedInUsd
        let addressDepositStakedInWcurrency: TokenAmount
        let addressDepositStakedInUsd: TokenAmount

        let stakedAmount: TokenAmount
        let totalRewardRate: TokenAmount
        let totalStakedAmount: TokenAmount
        let sharesAmount = BIG_INT_ZERO
        if (isPair && pair) {
          const wcurrency = tokens[0].equals(WCURRENCY[tokens[0].chainId]) ? tokens[0] : tokens[1]
          const dummyPair = new Pair(new TokenAmount(tokens[0], '0'), new TokenAmount(tokens[1], '0'), chainId)
          totalStakedAmount = new TokenAmount(dummyPair.liquidityToken, totalSupply)

          // // Additional fields: pairTotalSupply, addressBalance
          const pairTotalSupply = JSBI.BigInt(pairTotalSupplyState.result?.[0])

          if (balanceState && balanceState.result && balanceState.result[0] > 0) {
            stakedAmount = new TokenAmount(dummyPair.liquidityToken, JSBI.BigInt(balanceState.result[0]))
          } else if (
            autocompounderSharesState &&
            autocompounderSharesState.result &&
            autocompounderSharesState.result[0] > 0 &&
            autocompounderShareTokenRatioState &&
            autocompounderShareTokenRatioState.result &&
            autocompounderShareTokenRatioState.result[0] > 0
          ) {
            sharesAmount = JSBI.BigInt(autocompounderSharesState.result[0])
            stakedAmount = new TokenAmount(
              dummyPair.liquidityToken,
              JSBI.divide(
                JSBI.multiply(JSBI.BigInt(autocompounderShareTokenRatioState.result[0]), sharesAmount),
                oneToken
              )
            )
            useAutocompounding = true
          } else {
            stakedAmount = new TokenAmount(dummyPair.liquidityToken, BIG_INT_ZERO)
          }
          totalRewardRate = new TokenAmount(selfToken, JSBI.BigInt(rewardRateState.result?.[0]))

          const isUSDPool = isUSDtoken(tokens[0], tokens[0].chainId) && isUSDtoken(tokens[1], tokens[1].chainId)
          if (isUSDPool && currencyTokenPair) {
            totalStakedInWcurrency = calculateTotalStakedAmountInCurrencyFromToken(
              stakingType,
              chainId,
              currencyTokenPair.reserveOf(WCURRENCY[tokens[0].chainId]).raw,
              currencyTokenPair.reserveOf(tokens[0]).raw,
              totalStakedAmount
            )
            addressDepositStakedInWcurrency = calculateTotalStakedAmountInCurrencyFromToken(
              stakingType,
              chainId,
              currencyTokenPair.reserveOf(WCURRENCY[tokens[0].chainId]).raw,
              currencyTokenPair.reserveOf(tokens[0]).raw,
              stakedAmount
            )
            addressDepositStakedInUsd = calculateTotalStakedAmountInCurrencyFromToken(
              stakingType,
              chainId,
              currencyTokenPair.reserveOf(WCURRENCY[tokens[0].chainId]).raw,
              currencyTokenPair.reserveOf(tokens[0]).raw,
              new TokenAmount(currencySelfTokenPair.liquidityToken, addressBalance)
            )
          } else {
            const isCurrencyPool = tokens[0].equals(WCURRENCY[CHAINID]) || tokens[1].equals(WCURRENCY[CHAINID])
            // Total in pool
            totalStakedInWcurrency = isCurrencyPool
              ? calculateStakedAmountInCurrency(
                  chainId,
                  totalSupply,
                  pair.reserveOf(wcurrency).raw,
                  totalStakedAmount,
                  pairTotalSupply
                )
              : wcurrencyPairNotFound
              ? new TokenAmount(WCURRENCY[chainId], BIG_INT_ZERO) // wcurrencyPairNotFound ? test avoids : Error: Invariant failed: TOKEN
              : calculateStakedAmountInCurrencyFromSelfToken(
                  chainId,
                  currencySelfTokenPair.reserveOf(selfToken).raw,
                  currencySelfTokenPair.reserveOf(WCURRENCY[CHAINID]).raw,
                  pair.reserveOf(selfToken).raw,
                  totalStakedAmount,
                  pairTotalSupply
                )

            // User deposit in pool
            addressDepositStakedInWcurrency = isCurrencyPool
              ? calculateStakedAmountInCurrency(
                  chainId,
                  totalSupply,
                  pair.reserveOf(wcurrency).raw,
                  new TokenAmount(pair.liquidityToken, addressBalance),
                  pairTotalSupply
                )
              : wcurrencyPairNotFound
              ? new TokenAmount(WCURRENCY[chainId], BIG_INT_ZERO) // wcurrencyPairNotFound ? test avoids : Error: Invariant failed: TOKEN
              : calculateStakedAmountInCurrencyFromSelfToken(
                  chainId,
                  currencySelfTokenPair.reserveOf(selfToken).raw,
                  currencySelfTokenPair.reserveOf(WCURRENCY[CHAINID]).raw,
                  pair.reserveOf(selfToken).raw,
                  new TokenAmount(currencySelfTokenPair.liquidityToken, addressBalance),
                  pairTotalSupply
                )
          }
        } else {
          // Single token staking
          const isTokenCurrency = tokens[0].equals(WCURRENCY[tokens[0].chainId])

          if (
            !isTokenCurrency &&
            (currencyTokenPairState === PairState.INVALID || currencyTokenPairState === PairState.NOT_EXISTS)
          ) {
            console.error('Single token staking: Invalid pair requested')
            return memo
          }
          // Total in single asset staking contract
          // totalSupply = amount of tokens deposited in the staking contract
          totalStakedAmount = new TokenAmount(tokens[0], totalSupply)

          if (balanceState && balanceState.result && balanceState.result[0] > 0) {
            stakedAmount = new TokenAmount(tokens[0], JSBI.BigInt(balanceState.result[0]))
          } else if (
            autocompounderSharesState &&
            autocompounderSharesState.result &&
            autocompounderSharesState.result[0] > 0 &&
            autocompounderShareTokenRatioState &&
            autocompounderShareTokenRatioState.result &&
            autocompounderShareTokenRatioState.result[0] > 0
          ) {
            sharesAmount = JSBI.BigInt(autocompounderSharesState.result[0])
            stakedAmount = new TokenAmount(
              tokens[0],
              JSBI.divide(
                JSBI.multiply(JSBI.BigInt(autocompounderShareTokenRatioState.result[0]), sharesAmount),
                oneToken
              )
            )
            useAutocompounding = true
          } else {
            stakedAmount = new TokenAmount(tokens[0], BIG_INT_ZERO)
          }
          totalRewardRate = new TokenAmount(selfToken, JSBI.BigInt(rewardRateState.result?.[0]))
          totalStakedInWcurrency = isTokenCurrency
            ? totalStakedAmount
            : currencyTokenPair
            ? calculateTotalStakedAmountInCurrencyFromToken(
                stakingType,
                chainId,
                currencyTokenPair.reserveOf(WCURRENCY[tokens[0].chainId]).raw,
                currencyTokenPair.reserveOf(tokens[0]).raw,
                totalStakedAmount
              )
            : new TokenAmount(WCURRENCY[tokens[0].chainId], BIG_INT_ZERO)

          addressDepositStakedInWcurrency = isTokenCurrency
            ? stakedAmount
            : currencyTokenPair
            ? calculateTotalStakedAmountInCurrencyFromToken(
                stakingType,
                chainId,
                currencyTokenPair.reserveOf(WCURRENCY[tokens[0].chainId]).raw,
                currencyTokenPair.reserveOf(tokens[0]).raw,
                stakedAmount
              )
            : new TokenAmount(WCURRENCY[tokens[0].chainId], BIG_INT_ZERO)
        }

        const totalPoolDepositsStakedInUsd = calculateStakedAmountInUsdFromWcurrencyStakedAmount(
          usdToken,
          currencyUSDTokenPair.reserveOf(usdToken).raw, // USD token reserve
          currencyUSDTokenPair.reserveOf(WCURRENCY[tokens[0].chainId]).raw, // WCurrency reserve
          totalStakedInWcurrency
        )
        addressDepositStakedInUsd = calculateStakedAmountInUsdFromWcurrencyStakedAmount(
          usdToken,
          currencyUSDTokenPair.reserveOf(usdToken).raw,
          currencyUSDTokenPair.reserveOf(WCURRENCY[tokens[0].chainId]).raw,
          addressDepositStakedInWcurrency // TODO: test
        )
        const getHypotheticalRewardRate = (
          stakedAmount: TokenAmount,
          totalStakedAmount: TokenAmount,
          totalRewardRate: TokenAmount
        ): TokenAmount => {
          return new TokenAmount(
            selfToken,
            JSBI.greaterThan(totalStakedAmount.raw, BIG_INT_ZERO)
              ? JSBI.divide(JSBI.multiply(totalRewardRate.raw, stakedAmount.raw), totalStakedAmount.raw)
              : BIG_INT_ZERO
          )
        }

        const individualRewardRate = getHypotheticalRewardRate(stakedAmount, totalStakedAmount, totalRewardRate)

        const periodFinishMs = periodFinishState.result?.[0]?.mul(1000)?.toNumber()

        memo.push({
          stakingRewardAddress: rewardsAddress,
          autocompoundingAddress: autocompoundingAddress,
          useAutocompounding: useAutocompounding,
          tokens: tokens,
          rewardToken: rewardToken,
          periodFinish: periodFinishMs > 0 ? new Date(periodFinishMs) : undefined,
          earnedAmount: new TokenAmount(selfToken, JSBI.BigInt(earnedAmountState?.result?.[0] ?? 0)),
          sharesAmount: sharesAmount,
          rewardRate: individualRewardRate,
          totalRewardRate: totalRewardRate,
          stakedAmount: stakedAmount,
          totalStakedAmount: totalStakedAmount,
          totalStakedInWcurrency: totalStakedInWcurrency,

          // Additional fields
          totalPoolDepositsStakedInUsd: totalPoolDepositsStakedInUsd,
          addressDepositStakedInWcurrency: addressDepositStakedInWcurrency,
          addressDepositStakedInUsd: addressDepositStakedInUsd,

          getHypotheticalRewardRate
        })
      }

      return memo
    }, [])
  }, [
    balances,
    chainId,
    earnedAmounts,
    info,
    periodFinishes,
    rewardRates,
    rewardTokens,
    rewardsAddresses,
    autocompoundingAddresses,
    autocompounderShareTokenRatios,
    autocompounderShares,
    totalSupplies,
    currencySelfTokenPairState,
    pairs,
    selfToken,
    currencySelfTokenPair,
    currencyPairs,
    stakingType,
    oneToken,
    // Additional dependencies
    wcurrencyPairNotFound,
    currencyUSDTokenPair,
    currencyUSDTokenPairState,
    usdToken,
    pairTotalSupplies,
    CHAINID
  ])
}

export function useTotalSelfTokenEarned(): TokenAmount | undefined {
  const { chainId } = useActiveWeb3React()
  const selfToken = chainId ? SELF_TOKEN[chainId] : undefined
  const stakingInfos = useStakingInfo(StakingType.BOTH)

  return useMemo(() => {
    if (!selfToken) return undefined
    return (
      stakingInfos?.reduce(
        (accumulator, stakingInfo) => accumulator.add(stakingInfo.earnedAmount),
        new TokenAmount(selfToken, '0')
      ) ?? new TokenAmount(selfToken, '0')
    )
  }, [stakingInfos, selfToken])
}

// based on typed value
export function useDerivedStakeInfo(
  typedValue: string,
  stakingToken: Token,
  userLiquidityUnstaked: TokenAmount | undefined
): {
  parsedAmount?: CurrencyAmount
  error?: string
} {
  const { account } = useActiveWeb3React()

  const parsedInput: CurrencyAmount | undefined = tryParseAmount(typedValue, stakingToken)

  const parsedAmount =
    parsedInput && userLiquidityUnstaked && JSBI.lessThanOrEqual(parsedInput.raw, userLiquidityUnstaked.raw)
      ? parsedInput
      : undefined

  let error: string | undefined
  if (!account) {
    error = 'Connect Wallet'
  }
  if (!parsedAmount) {
    error = error ?? 'Enter an amount'
  }

  return {
    parsedAmount,
    error
  }
}

// based on typed value
export function useDerivedUnstakeInfo(
  typedValue: string,
  stakingAmount: TokenAmount
): {
  parsedAmount?: CurrencyAmount
  error?: string
} {
  const { account } = useActiveWeb3React()

  const parsedInput: CurrencyAmount | undefined = tryParseAmount(typedValue, stakingAmount.token)

  const parsedAmount = parsedInput && JSBI.lessThanOrEqual(parsedInput.raw, stakingAmount.raw) ? parsedInput : undefined

  let error: string | undefined
  if (!account) {
    error = 'Connect Wallet'
  }
  if (!parsedAmount) {
    error = error ?? 'Enter an amount'
  }

  return {
    parsedAmount,
    error
  }
}
