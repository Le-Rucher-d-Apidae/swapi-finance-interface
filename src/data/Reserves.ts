import { JSBI, TokenAmount, Pair, Currency, ChainId } from '@swapi-finance/sdk'
import { useMemo } from 'react'
// import { abi as IBaguettePairABI } from '@swapi-finance/contracts/artifacts/contracts/swapi-core/interfaces/IBaguettePair.sol/IBaguettePair.json'
import { abi as IUniswapV2PairABI } from '@uniswap/v2-core/build/IUniswapV2Pair.json'
import { Interface } from '@ethersproject/abi'
import { useActiveWeb3React } from '../hooks'

import { useMultipleContractSingleData } from '../state/multicall/hooks'
import { wrappedCurrency } from '../utils/wrappedCurrency'
import { UNDEFINED } from '../constants'

const PAIR_INTERFACE = new Interface(IUniswapV2PairABI)

export enum PairState {
  LOADING,
  NOT_EXISTS,
  EXISTS,
  INVALID
}

export function usePairs(currencies: [Currency | undefined, Currency | undefined][]): [PairState, Pair | null][] {
  const { chainId } = useActiveWeb3React()
  // console.log('usePairs: chainId=', chainId)
  // console.log('usePairs: currencies=', currencies)
  const tokens = useMemo(
    () =>
      currencies.map(([currencyA, currencyB]) => [
        wrappedCurrency(currencyA, chainId),
        wrappedCurrency(currencyB, chainId)
      ]),
    [chainId, currencies]
  )

  // const pairAddresses = useMemo(
  //   () =>
  //     tokens.map(([tokenA, tokenB]) => {
  //       return tokenA && tokenB && !tokenA.equals(tokenB) && !tokenB.equals(UNDEFINED[chainId ? chainId : ChainId.AVALANCHE]) ?
  //           Pair.getAddress(tokenA, tokenB, chainId ? chainId : ChainId.AVALANCHE) : undefined
  //     }),
  //   [tokens, chainId]
  // )

  const pairAddresses = useMemo(
    () =>
      tokens.map(([tokenA, tokenB]) => {
        return tokenA &&
          tokenB &&
          !tokenA.equals(tokenB) &&
          !tokenB.equals(UNDEFINED[chainId ? chainId : ChainId.POLYGON])
          ? Pair.getAddress(tokenA, tokenB, chainId ? chainId : ChainId.POLYGON)
          : undefined
      }),
    [tokens, chainId]
  )

  // console.debug(`usePairs: pairAddresses=`, pairAddresses)

  const results = useMultipleContractSingleData(pairAddresses, PAIR_INTERFACE, 'getReserves')
  // console.log('usePairs: results=', results)
  return useMemo(() => {
    return results.map((result, i) => {
      const tokenA = tokens[i][0]
      const tokenB = tokens[i][1]
      if (!tokenA || !tokenB || tokenA.equals(tokenB)) return [PairState.INVALID, null]

      // If second token is UNDEFINED, then we are staking a single token
      // if (tokenB?.equals(UNDEFINED[chainId ? chainId : ChainId.AVALANCHE])) {
      //   return [
      //     PairState.EXISTS,
      //     new Pair(
      //       new TokenAmount(tokenA, JSBI.BigInt(0)),
      //       new TokenAmount(tokenB, JSBI.BigInt(0)),
      //       chainId ? chainId : ChainId.AVALANCHE
      //     )
      //   ]
      // }
      if (tokenB?.equals(UNDEFINED[chainId ? chainId : ChainId.POLYGON])) {
        return [
          PairState.EXISTS,
          new Pair(
            new TokenAmount(tokenA, JSBI.BigInt(0)),
            new TokenAmount(tokenB, JSBI.BigInt(0)),
            chainId ? chainId : ChainId.POLYGON
          )
        ]
      }

      const { result: reserves, loading } = result
      if (loading) return [PairState.LOADING, null]
      if (!reserves) return [PairState.NOT_EXISTS, null]
      const { reserve0, reserve1 } = reserves
      const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA]
      return [
        PairState.EXISTS,
        // new Pair(
        //   new TokenAmount(token0, reserve0.toString()),
        //   new TokenAmount(token1, reserve1.toString()),
        //   chainId ? chainId : ChainId.AVALANCHE
        // )
        new Pair(
          new TokenAmount(token0, reserve0.toString()),
          new TokenAmount(token1, reserve1.toString()),
          chainId ? chainId : ChainId.POLYGON
        )
      ]
    })
  }, [results, tokens, chainId])
}

export function usePair(tokenA?: Currency, tokenB?: Currency): [PairState, Pair | null] {
  return usePairs([[tokenA, tokenB]])[0]
}
