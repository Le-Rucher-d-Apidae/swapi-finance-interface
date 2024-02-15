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
      tokens: [USDC[ChainId.MUMBAI], DAI[ChainId.MUMBAI]],
      rewardToken: SELF_TOKEN[ChainId.MUMBAI],
      stakingRewardAddress: '0x2014F931bb6F2827a4f3EB722e16C10EeD1332D4',
      autocompoundingAddress: ZERO_ADDRESS
    },

    {
      tokens: [USDT[ChainId.MUMBAI], DAI[ChainId.MUMBAI]],
      rewardToken: SELF_TOKEN[ChainId.MUMBAI],
      stakingRewardAddress: '0xd5057bF582eB47b33f4C1D6FaEfF1DC82Aff14a6',
      autocompoundingAddress: ZERO_ADDRESS
    },

    {
      tokens: [USDCE[ChainId.MUMBAI], DAI[ChainId.MUMBAI]],
      rewardToken: SELF_TOKEN[ChainId.MUMBAI],
      stakingRewardAddress: '0x02a2FCF42C09b60E2e7DA95D217C6a0567235446',
      autocompoundingAddress: ZERO_ADDRESS
    },

    {
      tokens: [SELF_TOKEN[ChainId.MUMBAI], WCURRENCY[ChainId.MUMBAI]],
      rewardToken: SELF_TOKEN[ChainId.MUMBAI],
      stakingRewardAddress: '0x9acAa2b2A98384a92e9ef07D2Ae4743FEdDD3135',
      autocompoundingAddress: ZERO_ADDRESS
    },

    //
    // Stake = rewarded single tokens
    //

    {
      tokens: [SELF_TOKEN[ChainId.MUMBAI], UNDEFINED[ChainId.MUMBAI]],
      rewardToken: SELF_TOKEN[ChainId.MUMBAI],
      stakingRewardAddress: '0x6Fba8230Ae8b6210A8E4CEeF9d25f2D60e96390e',
      autocompoundingAddress: ZERO_ADDRESS
    }
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
  // total staked Avax in the pool
  // totalStakedInWavax: TokenAmount
  totalStakedInWcurrency: TokenAmount
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

// const calculateTotalStakedAmountInAvaxFromBag = function(
const calculateTotalStakedAmountInCurrencyFromSelfToken = function(
  chainId: ChainId,
  totalSupply: JSBI,
  // avaxBagPairReserveOfBag: JSBI,
  currencySelfTokenPairReserveOfSelfToken: JSBI,
  // avaxBagPairReserveOfOtherToken: JSBI,
  currencySelfTokenPairReserveOfOtherToken: JSBI,
  stakingTokenPairReserveOfBag: JSBI,
  totalStakedAmount: TokenAmount
): TokenAmount {
  // if (JSBI.equal(totalSupply, JSBI.BigInt(0)) || JSBI.equal(avaxBagPairReserveOfBag, JSBI.BigInt(0)))
  if (JSBI.equal(totalSupply, JSBI.BigInt(0)) || JSBI.equal(currencySelfTokenPairReserveOfSelfToken, JSBI.BigInt(0)))
    // return new TokenAmount(WAVAX[chainId], JSBI.BigInt(0))
    return new TokenAmount(WCURRENCY[chainId], JSBI.BigInt(0))

  const oneToken = JSBI.BigInt(1_000_000_000_000_000_000) // 1e18
  // const avaxBagRatio = JSBI.divide(JSBI.multiply(oneToken, avaxBagPairReserveOfOtherToken), avaxBagPairReserveOfBag)
  // const valueOfBagInAvax = JSBI.divide(JSBI.multiply(stakingTokenPairReserveOfBag, avaxBagRatio), oneToken)
  const currencySelfTokenRatio = JSBI.divide(
    // JSBI.multiply(oneToken, avaxBagPairReserveOfOtherToken),
    JSBI.multiply(oneToken, currencySelfTokenPairReserveOfOtherToken),
    // avaxBagPairReserveOfBag
    currencySelfTokenPairReserveOfSelfToken
  )
  const valueOfSelfTokenInCurrency = JSBI.divide(
    JSBI.multiply(stakingTokenPairReserveOfBag, currencySelfTokenRatio),
    oneToken
  )

  return new TokenAmount(
    // WAVAX[chainId],
    WCURRENCY[chainId],
    JSBI.divide(
      JSBI.multiply(
        JSBI.multiply(totalStakedAmount.raw, valueOfSelfTokenInCurrency),
        JSBI.BigInt(2) // this is b/c the value of LP shares are ~double the value of the wavax they entitle owner to
      ),
      totalSupply
    )
  )
}

// const calculateTotalStakedAmountInAvax = function(
const calculateTotalStakedAmountInCurrency = function(
  chainId: ChainId,
  totalSupply: JSBI,
  reserveInWavax: JSBI,
  totalStakedAmount: TokenAmount
): TokenAmount {
  // if (JSBI.equal(totalSupply, JSBI.BigInt(0))) return new TokenAmount(WAVAX[chainId], JSBI.BigInt(0))
  if (JSBI.equal(totalSupply, JSBI.BigInt(0))) return new TokenAmount(WCURRENCY[chainId], JSBI.BigInt(0))

  // take the total amount of LP tokens staked, multiply by AVAX value of all LP tokens, divide by all LP tokens
  return new TokenAmount(
    // WAVAX[chainId],
    WCURRENCY[chainId],
    JSBI.divide(
      JSBI.multiply(
        JSBI.multiply(totalStakedAmount.raw, reserveInWavax),
        JSBI.BigInt(2) // this is b/c the value of LP shares are ~double the value of the wavax they entitle owner to
      ),
      totalSupply
    )
  )
}

// const calculateTotalStakedAmountInAvaxFromToken = function(
const calculateTotalStakedAmountInCurrencyFromToken = function(
  chainId: ChainId,
  avaxTokenPairReserveOfAvax: JSBI,
  avaxTokenPairReserveOfToken: JSBI,
  totalStakedAmount: TokenAmount
): TokenAmount {
  // if (JSBI.equal(avaxTokenPairReserveOfToken, JSBI.BigInt(0))) return new TokenAmount(WAVAX[chainId], JSBI.BigInt(0))
  if (JSBI.equal(avaxTokenPairReserveOfToken, JSBI.BigInt(0)))
    return new TokenAmount(WCURRENCY[chainId], JSBI.BigInt(0))

  const oneToken = JSBI.BigInt(1_000_000_000_000_000_000) // 1e18
  // const avaxTokenRatio = JSBI.divide(JSBI.multiply(oneToken, avaxTokenPairReserveOfAvax), avaxTokenPairReserveOfToken)
  const currecnySelfTokenRatio = JSBI.divide(
    JSBI.multiply(oneToken, avaxTokenPairReserveOfAvax),
    avaxTokenPairReserveOfToken
  )

  // return new TokenAmount(WAVAX[chainId], JSBI.divide(JSBI.multiply(totalStakedAmount.raw, avaxTokenRatio), oneToken))
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
  // console.log(`useStakingInfo: chainId=${chainId} pairToFilterBy=${pairToFilterBy}`)
  // console.log('useStakingInfo: info=', info)
  const oneToken = JSBI.BigInt(1_000_000_000_000_000_000) // 1e18
  // const bag = BAG[chainId ? chainId : ChainId.AVALANCHE]
  const selfToken = SELF_TOKEN[chainId ? chainId : ChainId.POLYGON]
  const rewardsAddresses = useMemo(() => info.map(({ stakingRewardAddress }) => stakingRewardAddress), [info])
  const autocompoundingAddresses = useMemo(() => info.map(({ autocompoundingAddress }) => autocompoundingAddress), [
    info
  ])
  const rewardTokens = useMemo(() => info.map(({ rewardToken }) => rewardToken), [info])
  const accountArg = useMemo(() => [account ?? undefined], [account])

  // get all the info from the staking rewards contracts
  const tokens = useMemo(() => info.map(({ tokens }) => tokens), [info])
  const balances = useMultipleContractSingleData(rewardsAddresses, STAKING_REWARDS_INTERFACE, 'balanceOf', accountArg)
  // console.log(`useStakingInfo: balances=${JSON.stringify(balances)} accountArg=${accountArg}`)
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
  // console.log(`useStakingInfo: earnedAmounts=`, earnedAmounts)
  // console.log(`useStakingInfo: totalSupplies`, totalSupplies)
  const pairs = usePairs(tokens)
  // console.log(`useStakingInfo: tokens`, tokens)
  // console.log(`useStakingInfo: pairs`, pairs)
  // const avaxPairs = usePairs(tokens.map(pair => [WAVAX[chainId ? chainId : ChainId.AVALANCHE], pair[0]]))
  // const [avaxBagPairState, avaxBagPair] = usePair(WAVAX[chainId ? chainId : ChainId.AVALANCHE], bag)
  // const currencyPairs = usePairs(tokens.map(pair => [WCURRENCY[chainId ? chainId : ChainId.POLYGON], pair[0]]))
  const currencyPairs = usePairs(tokens.map(pair => [WCURRENCY[chainId ? chainId : ChainId.POLYGON], pair[0]]))
  // console.log(`useStakingInfo: currencyPairs`, currencyPairs)

  // Adds a warning if the pair is not found
  let wcurrencyPairNotFound = false
  currencyPairs?.forEach((pair, index) => {
    if (pair[0] === PairState.NOT_EXISTS && !pair[1]) {
      wcurrencyPairNotFound = true
      console.warn(
        `useStakingInfo: PAIR NOT FOUND (${index})  `,
        WCURRENCY[chainId ? chainId : ChainId.POLYGON],
        tokens[index][0]
      )
    }
  })

  const [currencySelfTokenPairState, currencySelfTokenPair] = usePair(
    WCURRENCY[chainId ? chainId : ChainId.POLYGON],
    selfToken
  )
  // console.log(`useStakingInfo: currencySelfTokenPairState`, currencySelfTokenPairState)
  // console.log(`useStakingInfo: currencySelfTokenPair`, currencySelfTokenPair)
  // tokens per second, constants
  const rewardRates = useMultipleContractSingleData(
    rewardsAddresses,
    STAKING_REWARDS_INTERFACE,
    'rewardRate', // TODO: update this !
    undefined,
    NEVER_RELOAD
  )
  const periodFinishes = useMultipleContractSingleData(
    rewardsAddresses,
    STAKING_REWARDS_INTERFACE,
    'periodFinish', // TODO: update this !
    undefined,
    NEVER_RELOAD
  )

  return useMemo(() => {
    // if (!chainId || !bag) return []
    // debugger
    // if (!chainId || !selfToken) console.log(`useStakingInfo: return []`)
    if (!chainId || !selfToken) return []
    // console.log(`useStakingInfo: rewardsAddresses`, rewardsAddresses)
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

      const tokens = info[index].tokens
      // const [avaxTokenPairState, avaxTokenPair] = maticPairs[index]
      const [currencyTokenPairState, currencyTokenPair] = currencyPairs[index]

      // Adds a warning if the pair is not found
      // console.log(`currencyTokenPair =`, currencyTokenPair)
      // if (currencyTokenPairState == PairState.NOT_EXISTS && !currencyTokenPair) {
      //   console.error(`useStakingInfo: PAIR NOT FOUND currencyTokenPairState=${currencyTokenPairState} currencyTokenPair=`, currencyTokenPair)
      // }
      const isPair = tokens[1] !== UNDEFINED[tokens[1].chainId]
      const [pairState, pair] = pairs[index]
      // console.log(`useStakingInfo: pairState=${pairState} pair=`, pair)
      if ((isPair && stakingType === StakingType.SINGLE) || (!isPair && stakingType === StakingType.PAIR)) {
        // console.log(`useStakingInfo: skipping pairState=${pairState} pair=`, pair)
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
        /* avaxBagPair */ currencySelfTokenPair &&
        currencySelfTokenPairState !== PairState.LOADING
      ) {
        if (
          balanceState?.error ||
          earnedAmountState?.error ||
          totalSupplyState.error ||
          rewardRateState.error ||
          periodFinishState.error ||
          (isPair && (pairState === PairState.INVALID || pairState === PairState.NOT_EXISTS)) ||
          currencySelfTokenPairState === PairState.INVALID ||
          currencySelfTokenPairState === PairState.NOT_EXISTS
        ) {
          return memo
        }

        const totalSupply = JSBI.BigInt(totalSupplyState.result?.[0])
        // let totalStakedInWavax: TokenAmount
        let totalStakedInWcurrency: TokenAmount
        let stakedAmount: TokenAmount
        let totalRewardRate: TokenAmount
        let totalStakedAmount: TokenAmount
        let sharesAmount = JSBI.BigInt(0)
        if (isPair && pair) {
          // const wavax = tokens[0].equals(WAVAX[tokens[0].chainId]) ? tokens[0] : tokens[1]
          const wcurrency = tokens[0].equals(WCURRENCY[tokens[0].chainId]) ? tokens[0] : tokens[1]
          // console.log(`useStakingInfo: isPair=${isPair} pair=${pair} wcurrency=`)
          // console.dir(wcurrency)
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
          totalRewardRate = new TokenAmount(/* bag */ selfToken, JSBI.BigInt(rewardRateState.result?.[0]))
          // const isUSDPool =
          //   (tokens[0].equals(USDCE[tokens[0].chainId]) && tokens[1].equals(USDTE[tokens[1].chainId])) ||
          //   (tokens[0].equals(USDTE[tokens[0].chainId]) && tokens[1].equals(USDCE[tokens[1].chainId]))
          // console.debug(`useStakingInfo: isUSD=${isUSD(tokens[0], tokens[0].chainId)}`)

          const isUSDPool = isUSD(tokens[0], tokens[0].chainId) && isUSD(tokens[1], tokens[1].chainId)
          if (isUSDPool && /* avaxTokenPair */ currencyTokenPair) {
            // totalStakedInWavax = calculateTotalStakedAmountInAvaxFromToken(
            totalStakedInWcurrency = calculateTotalStakedAmountInCurrencyFromToken(
              chainId,
              // avaxTokenPair.reserveOf(WAVAX[tokens[0].chainId]).raw,
              // avaxTokenPair.reserveOf(WMATIC[tokens[0].chainId]).raw,
              // avaxTokenPair.reserveOf(tokens[0]).raw,
              currencyTokenPair.reserveOf(WCURRENCY[tokens[0].chainId]).raw,
              currencyTokenPair.reserveOf(tokens[0]).raw,
              totalStakedAmount
            )
          } else {
            // const isAvaxPool = tokens[0].equals(WAVAX[tokens[0].chainId])
            const isCurrencyPool = tokens[0].equals(WCURRENCY[tokens[0].chainId])
            // totalStakedInWavax = isAvaxPool
            // console.debug(`useStakingInfo: isCurrencyPool=${isCurrencyPool}`)
            // console.debug(`useStakingInfo: isCurrencyPool=${isCurrencyPool}`)
            // console.debug(`tokens[0]=`)
            // console.dir(tokens[0])
            // console.debug(`tokens[1]=`)
            // console.dir(tokens[1])
            totalStakedInWcurrency = isCurrencyPool
              ? // calculateTotalStakedAmountInAvax(
                calculateTotalStakedAmountInCurrency(
                  chainId,
                  totalSupply,
                  // pair.reserveOf(wavax).raw,
                  pair.reserveOf(wcurrency).raw,
                  totalStakedAmount
                )
              : // calculateTotalStakedAmountInAvaxFromBag(
              wcurrencyPairNotFound
              ? new TokenAmount(WCURRENCY[chainId], JSBI.BigInt(0))
              : calculateTotalStakedAmountInCurrencyFromSelfToken(
                  chainId,
                  totalSupply,
                  // avaxBagPair.reserveOf(bag).raw,
                  currencySelfTokenPair.reserveOf(selfToken).raw,
                  // avaxBagPair.reserveOf(WAVAX[tokens[1].chainId]).raw,
                  currencySelfTokenPair.reserveOf(WCURRENCY[tokens[1].chainId]).raw, // Error: Invariant failed: TOKEN
                  // pair.reserveOf(bag).raw,
                  pair.reserveOf(selfToken).raw,
                  totalStakedAmount
                )
          }
        } else {
          // const isTokenAvax = tokens[0].equals(WAVAX[tokens[0].chainId])
          const isTokenCurrency = tokens[0].equals(WCURRENCY[tokens[0].chainId])

          if (
            // !isTokenAvax &&
            !isTokenCurrency &&
            // (avaxTokenPairState === PairState.INVALID || avaxTokenPairState === PairState.NOT_EXISTS)
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
          totalRewardRate = new TokenAmount(/* bag */ selfToken, JSBI.BigInt(rewardRateState.result?.[0]))
          // totalStakedInWavax = isTokenAvax
          totalStakedInWcurrency = isTokenCurrency
            ? totalStakedAmount
            : /* avaxTokenPair */ currencyTokenPair
            ? // calculateTotalStakedAmountInAvaxFromToken(
              calculateTotalStakedAmountInCurrencyFromToken(
                chainId,
                // avaxTokenPair.reserveOf(WAVAX[tokens[0].chainId]).raw,
                currencyTokenPair.reserveOf(WCURRENCY[tokens[0].chainId]).raw,
                // avaxTokenPair.reserveOf(tokens[0]).raw,
                currencyTokenPair.reserveOf(tokens[0]).raw,
                totalStakedAmount
              )
            : // : new TokenAmount(WAVAX[tokens[0].chainId], JSBI.BigInt(0))
              new TokenAmount(WCURRENCY[tokens[0].chainId], JSBI.BigInt(0))
        }

        const getHypotheticalRewardRate = (
          stakedAmount: TokenAmount,
          totalStakedAmount: TokenAmount,
          totalRewardRate: TokenAmount
        ): TokenAmount => {
          return new TokenAmount(
            /* bag */ selfToken,
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
          earnedAmount: new TokenAmount(/* bag */ selfToken, JSBI.BigInt(earnedAmountState?.result?.[0] ?? 0)),
          sharesAmount: sharesAmount,
          rewardRate: individualRewardRate,
          totalRewardRate: totalRewardRate,
          stakedAmount: stakedAmount,
          totalStakedAmount: totalStakedAmount,
          // totalStakedInWavax: totalStakedInWavax,
          totalStakedInWcurrency: totalStakedInWcurrency,
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
    // avaxcBagPairState,
    currencySelfTokenPairState,
    pairs,
    // bag,
    selfToken,
    // avaxBagPair,
    currencySelfTokenPair,
    // avaxPairs,
    currencyPairs,
    stakingType,
    oneToken,
    wcurrencyPairNotFound
  ])
}

// export function useTotalBagEarned(): TokenAmount | undefined {
export function useTotalSelfTokenEarned(): TokenAmount | undefined {
  const { chainId } = useActiveWeb3React()
  // const bag = chainId ? BAG[chainId] : undefined
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
