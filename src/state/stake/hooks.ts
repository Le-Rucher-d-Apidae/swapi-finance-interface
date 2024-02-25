import { ChainId, CurrencyAmount, JSBI, Token, TokenAmount, WCURRENCY, Pair } from '@swapi-finance/sdk'
import { useMemo } from 'react'
import { SELF_TOKEN, USDCE, USDT, USDC, DAI, UNDEFINED, ZERO_ADDRESS } from '../../constants'
import { STAKING_REWARDS_INTERFACE } from '../../constants/abis/staking-rewards'
import { AUTOCOMPOUND_INTERFACE } from '../../constants/abis/autocompound'
import { PairState, usePair, usePairs } from '../../data/Reserves'
import { useActiveWeb3React } from '../../hooks'
import { NEVER_RELOAD, useMultipleContractSingleData } from '../multicall/hooks'
import { tryParseAmount } from '../swap/hooks'

// UNUSED
// export const STAKING_GENESIS = 1600387200
// export const REWARDS_DURATION_DAYS = 60

// Add staking rewards addresses here
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
    // Stake-Farm = rewarded pairs
    //
    {
      tokens: [SELF_TOKEN[ChainId.MUMBAI], WCURRENCY[ChainId.MUMBAI]], // pair: 0xDAD0B1f17Ad266599D0fB6e568b2dD1C6F3EB33D
      rewardToken: SELF_TOKEN[ChainId.MUMBAI],
      // stakingRewardAddress: '0xa04DC88D7f48a504B4930474853e8e0d401695A7', // optimization: 10 000
      // stakingRewardAddress: '0x75922745B3354EB1e562d5F119B585b8D1Ccac33', // optimization:  1 000
      stakingRewardAddress: '0x555D73C526f7AF2A12a563dd0A14BD151ceb3e75', // optimization:    200 ; verified
      autocompoundingAddress: ZERO_ADDRESS
    },
    {
      tokens: [USDT[ChainId.MUMBAI], WCURRENCY[ChainId.MUMBAI]], // pair: 0xDAD0B1f17Ad266599D0fB6e568b2dD1C6F3EB33D
      rewardToken: SELF_TOKEN[ChainId.MUMBAI],
      stakingRewardAddress: '0xA867c81ecD3C2B1FEe1aDCB81bF8c046E8b82f83', // optimization:    200 ; verified
      autocompoundingAddress: ZERO_ADDRESS
    },
    {
      tokens: [USDT[ChainId.MUMBAI], USDC[ChainId.MUMBAI]], // pair: 0xDAD0B1f17Ad266599D0fB6e568b2dD1C6F3EB33D
      rewardToken: SELF_TOKEN[ChainId.MUMBAI],
      stakingRewardAddress: '0x1EB6C52ba45EFc8cA57818AFFAef93F28645C2F4', // optimization:    200 ; verified
      autocompoundingAddress: ZERO_ADDRESS
    }
    //
    // Stake = rewarded single tokens
    //

    // {
    //   tokens: [SELF_TOKEN[ChainId.MUMBAI], UNDEFINED[ChainId.MUMBAI]],
    //   rewardToken: SELF_TOKEN[ChainId.MUMBAI],
    //   stakingRewardAddress: '0x6Fba8230Ae8b6210A8E4CEeF9d25f2D60e96390e',
    //   autocompoundingAddress: ZERO_ADDRESS
    // }
  ],
  [ChainId.POLYGON]: []
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
  chainId: ChainId,
  usdToken: Token,
  // totalSupply: JSBI,
  currencyUsdTokenPairReserveOfUsd: JSBI,
  currencyUsdTokenPairReserveOfCurrency: JSBI,
  // stakingTokenPairReserveOfUsd: JSBI,
  // totalStakedAmount: TokenAmount
  totalStakedInWcurrency: TokenAmount
): TokenAmount {
  // console.debug(`calculateStakedAmountInUsdFromWcurrencyStakedAmount:`)
  if (
    JSBI.equal(totalStakedInWcurrency.raw, JSBI.BigInt(0)) ||
    JSBI.equal(currencyUsdTokenPairReserveOfUsd, JSBI.BigInt(0))
  )
    return new TokenAmount(usdToken, JSBI.BigInt(0))

  // console.debug('calculateTotalStakedAmountInUsd -------------------------------------')
  // console.debug('currencyUsdTokenPairReserveOfUsd:', currencyUsdTokenPairReserveOfUsd)
  // console.debug('currencyUsdTokenPairReserveOfCurrency:', currencyUsdTokenPairReserveOfCurrency)
  // console.debug('totalStakedInWcurrency', totalStakedInWcurrency.toFixed())

  const oneToken = JSBI.BigInt(1_000_000_000_000_000_000) // 1e18
  // const oneToken = JSBI.BigInt() // 1e18
  // const currencyUsdTokenRatio = JSBI.divide(
  //   JSBI.multiply(oneToken, currencyUsdTokenPairReserveOfCurrency),
  //   currencyUsdTokenPairReserveOfUsd
  // )
  // console.debug(`currencyUsdTokenRatio: ${currencyUsdTokenRatio}`)

  const currencyUsdTokenRatio = JSBI.divide(
    JSBI.multiply(oneToken, currencyUsdTokenPairReserveOfCurrency),
    currencyUsdTokenPairReserveOfUsd
  )
  // console.debug(`currencyUsdTokenRatio: ${currencyUsdTokenRatio}`)

  // const valueOfSelfTokenInCurrency = JSBI.divide(
  //   JSBI.multiply(stakingTokenPairReserveOfUsd, currencyUsdTokenRatio),
  //   oneToken
  // )

  // return new TokenAmount(
  //   WCURRENCY[chainId],
  //   JSBI.divide(
  //     JSBI.multiply(
  //       JSBI.multiply(totalStakedAmount.raw, valueOfSelfTokenInCurrency),
  //       JSBI.BigInt(2) // this is b/c the value of LP shares are ~double the value of the wcurrency they entitle owner to
  //     ),
  //     totalSupply
  //   )
  // )

  // return new TokenAmount(usdToken, JSBI.divide(totalStakedInWcurrency.raw, currencyUsdTokenRatio))

  const resAmount = JSBI.divide(JSBI.multiply(totalStakedInWcurrency.raw, oneToken), currencyUsdTokenRatio)

  // console.debug('res:', resAmount)
  return new TokenAmount(usdToken, resAmount)
}

/*
const calculateTotalStakedAmountInCurrencyFromSelfToken = function(
  chainId: ChainId,
  totalSupply: JSBI,
  currencySelfTokenPairReserveOfSelfToken: JSBI,
  currencySelfTokenPairReserveOfOtherToken: JSBI,
  stakingTokenPairReserveOfBag: JSBI,
  totalStakedAmount: TokenAmount
): TokenAmount {
  if (JSBI.equal(totalSupply, JSBI.BigInt(0)) || JSBI.equal(currencySelfTokenPairReserveOfSelfToken, JSBI.BigInt(0)))
    return new TokenAmount(WCURRENCY[chainId], JSBI.BigInt(0))
  const oneToken = JSBI.BigInt(1_000_000_000_000_000_000) // 1e18
  const currencySelfTokenRatio = JSBI.divide(
    JSBI.multiply(oneToken, currencySelfTokenPairReserveOfOtherToken),
    currencySelfTokenPairReserveOfSelfToken
  )
  const valueOfSelfTokenInCurrency = JSBI.divide(
    JSBI.multiply(stakingTokenPairReserveOfBag, currencySelfTokenRatio),
    oneToken
  )
  return new TokenAmount(
    WCURRENCY[chainId],
    JSBI.divide(
      JSBI.multiply(
        JSBI.multiply(totalStakedAmount.raw, valueOfSelfTokenInCurrency),
        JSBI.BigInt(2) // this is b/c the value of LP shares are ~double the value of the wcurrency they entitle owner to
      ),
      totalSupply
    )
  )
}
*/
const calculateStakedAmountInCurrencyFromSelfToken = function(
  chainId: ChainId,
  // stakingRewardsTotalSupply: JSBI,
  currencySelfTokenPairReserveOfSelfToken: JSBI,
  currencySelfTokenPairReserveOfWCurrencyToken: JSBI,
  stakingTokenPairReserveOfSelfToken: JSBI,
  stakedAmount: TokenAmount,
  // test
  pairTotalSupply: JSBI
): TokenAmount {
  if (
    JSBI.equal(stakedAmount.raw, JSBI.BigInt(0)) ||
    JSBI.equal(currencySelfTokenPairReserveOfSelfToken, JSBI.BigInt(0))
  )
    return new TokenAmount(WCURRENCY[chainId], JSBI.BigInt(0))

  const oneToken = JSBI.BigInt(1_000_000_000_000_000_000) // 1e18
  const currencySelfTokenRatio = JSBI.divide(
    JSBI.multiply(oneToken, currencySelfTokenPairReserveOfWCurrencyToken),
    currencySelfTokenPairReserveOfSelfToken
  )
  const valueOfSelfTokenInCurrency = JSBI.divide(
    JSBI.multiply(stakingTokenPairReserveOfSelfToken, currencySelfTokenRatio),
    oneToken
  )
  // return new TokenAmount(
  //   WCURRENCY[chainId],
  //   JSBI.divide(
  //     JSBI.multiply(
  //       JSBI.multiply(totalStakedAmount.raw, valueOfSelfTokenInCurrency),
  //       JSBI.BigInt(2) // this is b/c the value of LP shares are ~double the value of the wcurrency they entitle owner to
  //     ),
  //     stakingRewardsTotalSupply
  //   )
  // )
  const amount = JSBI.divide(
    JSBI.multiply(
      JSBI.multiply(stakedAmount.raw, valueOfSelfTokenInCurrency),
      JSBI.BigInt(2) // this is b/c the value of LP shares are ~double the value of the wcurrency they entitle owner to
    ),
    // stakingRewardsTotalSupply
    pairTotalSupply
  )

  console.debug(`------------------------------------------`)
  console.debug(`calculateStakedAmountInCurrencyFromSelfToken:`)
  console.debug(`params:`)
  // console.debug(`stakingRewardsTotalSupply`, stakingRewardsTotalSupply.toString())
  console.debug(`currencySelfTokenPairReserveOfSelfToken`, currencySelfTokenPairReserveOfSelfToken.toString())
  console.debug(`currencySelfTokenPairReserveOfWCurrencyToken`, currencySelfTokenPairReserveOfWCurrencyToken.toString())
  console.debug(`stakingTokenPairReserveOfSelfToken`, stakingTokenPairReserveOfSelfToken.toString())
  console.debug('stakedAmount:          ', stakedAmount.toFixed())
  console.debug(`pairTotalSupply:`, pairTotalSupply.toString())
  console.debug(`computed:`)
  console.debug(`currencySelfTokenRatio:     ${currencySelfTokenRatio}`)
  console.debug(`valueOfSelfTokenInCurrency: ${valueOfSelfTokenInCurrency}`)
  console.debug('amount:          ', amount.toString())
  console.debug(`------------------------------------------`)

  return new TokenAmount(WCURRENCY[chainId], amount)
}
/*
const calculateTotalStakedAmountInCurrency = function(
  chainId: ChainId,
  totalSupply: JSBI,
  reserveInWcurrency: JSBI,
  totalStakedAmount: TokenAmount,
): TokenAmount {
  if (JSBI.equal(totalSupply, JSBI.BigInt(0))) return new TokenAmount(WCURRENCY[chainId], JSBI.BigInt(0))
  // take the total amount of LP tokens staked, multiply by CURRENCY value of all LP tokens, divide by all LP tokens
  return new TokenAmount(
    WCURRENCY[chainId],
    JSBI.divide(
      JSBI.multiply(
        JSBI.multiply(totalStakedAmount.raw, reserveInWcurrency),
        JSBI.BigInt(2) // this is b/c the value of LP shares are ~double the value of the wcurrency they entitle owner to
      ),
      totalSupply
    )
  )
}
*/

const calculateTotalStakedAmountInCurrency = function(
  chainId: ChainId,
  totalSupply: JSBI,
  reserveInWcurrency: JSBI,
  totalStakedAmount: TokenAmount,
  // test
  pairTotalSupply: JSBI
): TokenAmount {
  console.debug(`calculateTotalStakedAmountInCurrency:`)
  if (JSBI.equal(totalSupply, JSBI.BigInt(0))) return new TokenAmount(WCURRENCY[chainId], JSBI.BigInt(0))

  // take the total amount of LP tokens staked, multiply by CURRENCY value of all LP tokens, divide by all LP tokens
  // TODO: test
  // TODO: test
  // TODO: test
  // TODO: test
  const amount = JSBI.divide(
    JSBI.multiply(
      JSBI.multiply(totalStakedAmount.raw, reserveInWcurrency),
      JSBI.BigInt(2) // this is b/c the value of LP shares are ~double the value of the wcurrency they entitle owner to
    ),
    pairTotalSupply
  )
  console.debug(`------------------------------------------`)
  console.debug(`params:`)
  console.debug(`totalSupply`, totalSupply.toString())
  console.debug(`reserveInWcurrency`, reserveInWcurrency.toString())
  console.debug('totalStakedAmount:          ', totalStakedAmount.toFixed())
  console.debug(`pairTotalSupply:`, pairTotalSupply)
  console.debug(`computed:`)
  console.debug('amount:          ', amount.toString())
  console.debug(`------------------------------------------`)

  return new TokenAmount(WCURRENCY[chainId], amount)
}

const calculateTotalStakedAmountInCurrencyFromToken = function(
  chainId: ChainId,
  currencyTokenPairReserveOfCurrency: JSBI,
  currencyTokenPairReserveOfToken: JSBI,
  totalStakedAmount: TokenAmount
): TokenAmount {
  console.debug(`calculateTotalStakedAmountInCurrencyFromToken: TODO TEST`)
  if (JSBI.equal(currencyTokenPairReserveOfToken, JSBI.BigInt(0)))
    return new TokenAmount(WCURRENCY[chainId], JSBI.BigInt(0))

  const oneToken = JSBI.BigInt(1_000_000_000_000_000_000) // 1e18
  const currecnySelfTokenRatio = JSBI.divide(
    JSBI.multiply(oneToken, currencyTokenPairReserveOfCurrency),
    currencyTokenPairReserveOfToken
  )

  return new TokenAmount(
    WCURRENCY[chainId],
    JSBI.divide(JSBI.multiply(totalStakedAmount.raw, currecnySelfTokenRatio), oneToken)
  )
}

const isUSD = function(token: Token, chainId: ChainId): boolean {
  return (
    token.equals(USDCE[chainId]) ||
    token.equals(USDT[chainId]) ||
    token.equals(USDC[chainId]) ||
    token.equals(DAI[chainId])
  )
}

// gets the staking info from the network for the active chain id
export function useStakingInfo(stakingType: StakingType, pairToFilterBy?: Pair | null): StakingInfo[] {
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
              : pairToFilterBy.involvesToken(stakingRewardInfo.tokens[0]) &&
                pairToFilterBy.involvesToken(stakingRewardInfo.tokens[1])
          ) ?? []
        : [],
    [chainId, pairToFilterBy]
  )
  const oneToken = JSBI.BigInt(1_000_000_000_000_000_000) // 1e18
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
  // console.debug(`useStakingInfo rewardsAddresses:`, rewardsAddresses, `totalSupplies:`, totalSupplies)
  const pairs = usePairs(tokens)

  const pairsAddresses = useMemo(() => pairs.map(pair => pair[1]?.liquidityToken.address), [pairs])
  console.debug(`useStakingInfo pairsAddresses:`, pairsAddresses)

  const pairTotalSupplies = useMultipleContractSingleData(pairsAddresses, STAKING_REWARDS_INTERFACE, 'totalSupply')

  pairTotalSupplies.forEach(pairTotalSupply => {
    console.debug(`useStakingInfo pairTotalSupplies:`, pairTotalSupply?.result?.toString())
  })
  // pairs.map((pair, index) => {
  //   // pairAddresses[index] = pair[1]?.address
  //   console.debug(`useStakingInfo pairs:`, pair[1]?.liquidityToken.address)
  // })

  // const pairAddresses = pairs.map((pair, index) => {
  //   Pair.getAddress(pair. [0]?.address, pair[1]?.address, CHAINID)

  // }

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
      const isPair = tokens[1] !== UNDEFINED[tokens[1].chainId]
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
          (isPair && (pairState === PairState.INVALID || pairState === PairState.NOT_EXISTS)) ||
          currencySelfTokenPairState === PairState.INVALID ||
          currencySelfTokenPairState === PairState.NOT_EXISTS ||
          // Additional states
          currencyUSDTokenPairState === PairState.INVALID ||
          currencyUSDTokenPairState === PairState.NOT_EXISTS ||
          pairTotalSupplyState?.error
          // pairTotalSupplyState !== PairState.LOADING || pairTotalSupplyState === PairState.NOT_EXISTS
        ) {
          return memo
        }

        const totalSupply = JSBI.BigInt(totalSupplyState.result?.[0])
        // // Additional fields: pairTotalSupply, addressBalance
        console.debug(`useStakingInfo pairTotalSupplyState:`, pairTotalSupplyState)
        const pairTotalSupply = JSBI.BigInt(pairTotalSupplyState.result?.[0])
        const addressBalance = JSBI.BigInt(balanceState.result?.[0])
        console.debug(`useStakingInfo totalSupply: ${totalSupply}`)
        console.debug(`useStakingInfo balanceState:`, balanceState?.result?.toString())

        let totalStakedInWcurrency: TokenAmount
        // Additional fields: addressDepositStakedInWcurrency, addressDepositStakedInUsd
        let addressDepositStakedInWcurrency: TokenAmount
        let addressDepositStakedInUsd: TokenAmount

        let stakedAmount: TokenAmount
        let totalRewardRate: TokenAmount
        let totalStakedAmount: TokenAmount
        let sharesAmount = JSBI.BigInt(0)
        if (isPair && pair) {
          const wcurrency = tokens[0].equals(WCURRENCY[tokens[0].chainId]) ? tokens[0] : tokens[1]
          const dummyPair = new Pair(new TokenAmount(tokens[0], '0'), new TokenAmount(tokens[1], '0'), chainId)
          totalStakedAmount = new TokenAmount(dummyPair.liquidityToken, totalSupply)

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
            stakedAmount = new TokenAmount(dummyPair.liquidityToken, JSBI.BigInt(0))
          }
          totalRewardRate = new TokenAmount(selfToken, JSBI.BigInt(rewardRateState.result?.[0]))

          const isUSDPool = isUSD(tokens[0], tokens[0].chainId) && isUSD(tokens[1], tokens[1].chainId)
          if (isUSDPool && currencyTokenPair) {
            totalStakedInWcurrency = calculateTotalStakedAmountInCurrencyFromToken(
              chainId,
              currencyTokenPair.reserveOf(WCURRENCY[tokens[0].chainId]).raw,
              currencyTokenPair.reserveOf(tokens[0]).raw,
              totalStakedAmount
            )
            // TODO: test
            addressDepositStakedInWcurrency = calculateTotalStakedAmountInCurrencyFromToken(
              chainId,
              currencyTokenPair.reserveOf(WCURRENCY[tokens[0].chainId]).raw,
              currencyTokenPair.reserveOf(tokens[0]).raw,
              stakedAmount
            )
            // TODO: test
            addressDepositStakedInUsd = calculateTotalStakedAmountInCurrencyFromToken(
              chainId,
              currencyTokenPair.reserveOf(WCURRENCY[tokens[0].chainId]).raw,
              currencyTokenPair.reserveOf(tokens[0]).raw,
              new TokenAmount(currencySelfTokenPair.liquidityToken, addressBalance)
            )
          } else {
            // TODO: check it is always working
            // const isCurrencyPool = tokens[0].equals(WCURRENCY[CHAINID])
            const isCurrencyPool = tokens[0].equals(WCURRENCY[CHAINID]) || tokens[1].equals(WCURRENCY[CHAINID])
            console.debug(`currencySelfTokenPair:`, currencySelfTokenPair)
            console.debug(`tokens[1].chainId:`, tokens[1].chainId)
            console.debug(`WCURRENCY[CHAINID]:`, WCURRENCY[CHAINID])
            console.debug(`selfToken:`, selfToken)
            // console.debug(
            //   `currencySelfTokenPair.reserveOf(selfToken).raw:`,
            //   currencySelfTokenPair.reserveOf(selfToken).raw.toString()
            // )
            // console.debug(
            //   `currencySelfTokenPair.reserveOf(WCURRENCY[CHAINID]).raw:`,
            //   currencySelfTokenPair.reserveOf(WCURRENCY[CHAINID]).raw.toString()
            // )
            // console.debug(`pair.reserveOf(selfToken).raw:`, pair.reserveOf(selfToken).raw.toString())

            // Total in pool
            totalStakedInWcurrency = isCurrencyPool
              ? // ? calculateTotalStakedAmountInCurrency(
                //     chainId,
                //     totalSupply,
                //     pair.reserveOf(wcurrency).raw,
                //     totalStakedAmount,
                //     pairTotalSupply
                //   )
                calculateTotalStakedAmountInCurrency(
                  chainId,
                  totalSupply,
                  pair.reserveOf(wcurrency).raw,
                  totalStakedAmount,
                  pairTotalSupply
                )
              : wcurrencyPairNotFound
              ? new TokenAmount(WCURRENCY[chainId], JSBI.BigInt(0)) // wcurrencyPairNotFound ? test avoids : Error: Invariant failed: TOKEN
              : // : calculateTotalStakedAmountInCurrencyFromSelfToken(
                //     chainId,
                //     totalSupply,
                //     currencySelfTokenPair.reserveOf(selfToken).raw,
                //     currencySelfTokenPair.reserveOf(WCURRENCY[tokens[1].chainId]).raw,
                //     pair.reserveOf(selfToken).raw,
                //     totalStakedAmount,
                //   )
                calculateStakedAmountInCurrencyFromSelfToken(
                  chainId,
                  currencySelfTokenPair.reserveOf(selfToken).raw,
                  currencySelfTokenPair.reserveOf(WCURRENCY[CHAINID]).raw,
                  pair.reserveOf(selfToken).raw,
                  totalStakedAmount,
                  pairTotalSupply
                )
            // User deposit in pool
            addressDepositStakedInWcurrency = isCurrencyPool
              ? calculateTotalStakedAmountInCurrency(
                  // TODO: TEST
                  chainId,
                  totalSupply,
                  pair.reserveOf(wcurrency).raw,
                  totalStakedAmount,
                  pairTotalSupply
                )
              : wcurrencyPairNotFound
              ? new TokenAmount(WCURRENCY[chainId], JSBI.BigInt(0)) // wcurrencyPairNotFound ? test avoids : Error: Invariant failed: TOKEN
              : calculateStakedAmountInCurrencyFromSelfToken(
                  // TESTED OK
                  chainId,
                  currencySelfTokenPair.reserveOf(selfToken).raw,
                  currencySelfTokenPair.reserveOf(WCURRENCY[CHAINID]).raw,
                  pair.reserveOf(selfToken).raw,
                  new TokenAmount(currencySelfTokenPair.liquidityToken, addressBalance),
                  pairTotalSupply
                )
            console.debug(`addressDepositStakedInWcurrency:`, addressDepositStakedInWcurrency.toFixed())
          }
        } else {
          const isTokenCurrency = tokens[0].equals(WCURRENCY[tokens[0].chainId])

          if (
            !isTokenCurrency &&
            (currencyTokenPairState === PairState.INVALID || currencyTokenPairState === PairState.NOT_EXISTS)
          ) {
            console.error('Invalid pair requested')
            return memo
          }

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
            stakedAmount = new TokenAmount(tokens[0], JSBI.BigInt(0))
          }
          totalRewardRate = new TokenAmount(selfToken, JSBI.BigInt(rewardRateState.result?.[0]))
          totalStakedInWcurrency = isTokenCurrency
            ? totalStakedAmount
            : currencyTokenPair
            ? calculateTotalStakedAmountInCurrencyFromToken(
                chainId,
                currencyTokenPair.reserveOf(WCURRENCY[tokens[0].chainId]).raw,
                currencyTokenPair.reserveOf(tokens[0]).raw,
                totalStakedAmount
              )
            : new TokenAmount(WCURRENCY[tokens[0].chainId], JSBI.BigInt(0))

          // TODO: compute amount
          addressDepositStakedInWcurrency = new TokenAmount(WCURRENCY[tokens[0].chainId], JSBI.BigInt(0))
        }

        const totalPoolDepositsStakedInUsd = calculateStakedAmountInUsdFromWcurrencyStakedAmount(
          chainId,
          usdToken,
          // totalSupply,
          currencyUSDTokenPair.reserveOf(usdToken).raw,
          currencyUSDTokenPair.reserveOf(WCURRENCY[tokens[1].chainId]).raw,
          // currencyUSDTokenPair.reserveOf(usdToken).raw,
          // totalStakedAmount
          totalStakedInWcurrency
        )
        // TODO: test
        addressDepositStakedInUsd = calculateStakedAmountInUsdFromWcurrencyStakedAmount(
          chainId,
          usdToken,
          // totalSupply,
          currencyUSDTokenPair.reserveOf(usdToken).raw,
          currencyUSDTokenPair.reserveOf(WCURRENCY[tokens[1].chainId]).raw,
          // currencyUSDTokenPair.reserveOf(usdToken).raw,
          // totalStakedAmount
          addressDepositStakedInWcurrency // TODO: test
        )

        const getHypotheticalRewardRate = (
          stakedAmount: TokenAmount,
          totalStakedAmount: TokenAmount,
          totalRewardRate: TokenAmount
        ): TokenAmount => {
          return new TokenAmount(
            selfToken,
            JSBI.greaterThan(totalStakedAmount.raw, JSBI.BigInt(0))
              ? JSBI.divide(JSBI.multiply(totalRewardRate.raw, stakedAmount.raw), totalStakedAmount.raw)
              : JSBI.BigInt(0)
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
    wcurrencyPairNotFound,
    // Additional dependencies
    currencyUSDTokenPair,
    currencyUSDTokenPairState,
    usdToken,
    pairTotalSupplies
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
