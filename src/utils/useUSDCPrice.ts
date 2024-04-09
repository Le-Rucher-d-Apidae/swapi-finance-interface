import { ChainId, Currency, currencyEquals, JSBI, Price, WCURRENCY } from '@swapi-finance/sdk'
import { useMemo } from 'react'
import { DAI } from '../constants'
import { PairState, usePairs } from '../data/Reserves'
import { useActiveWeb3React } from '../hooks'
import { wrappedCurrency } from './wrappedCurrency'

/**
 * Returns the price in USDC of the input currency
 * @param currency currency to compute the USDC price of
 */
export default function useUSDCPrice(currency?: Currency): Price | undefined {
  const { chainId } = useActiveWeb3React()
  const wrapped = wrappedCurrency(currency, chainId)
  const USDC = chainId ? DAI[chainId] : DAI[ChainId.POLYGON]
  const tokenPairs: [Currency | undefined, Currency | undefined][] = useMemo(
    () => [
      [
        chainId && wrapped && currencyEquals(WCURRENCY[chainId], wrapped) ? undefined : currency,
        chainId ? WCURRENCY[chainId] : undefined
      ],
      [wrapped?.equals(USDC) ? undefined : wrapped, chainId === ChainId.POLYGON ? USDC : undefined],
      [chainId ? WCURRENCY[chainId] : undefined, chainId === ChainId.POLYGON ? USDC : undefined]
    ],
    [chainId, currency, wrapped, USDC]
  )
  const [
    [currencyPairState, currencyPair],
    [usdcPairState, usdcPair],
    [usdcCurrencyPairState, usdcCurrencyPair]
  ] = usePairs(tokenPairs)

  return useMemo(() => {
    if (!currency || !wrapped || !chainId) {
      return undefined
    }
    // handle wcurrency/currency
    if (wrapped.equals(WCURRENCY[chainId])) {
      if (usdcPair) {
        const price = usdcPair.priceOf(WCURRENCY[chainId])
        return new Price(currency, USDC, price.denominator, price.numerator)
      } else {
        return undefined
      }
    }
    // handle usdc
    if (wrapped.equals(USDC)) {
      return new Price(USDC, USDC, '1', '1')
    }

    const currencyPairMATICAmount = currencyPair?.reserveOf(WCURRENCY[chainId])
    const currencyPairMATICUSDCValue: JSBI =
      currencyPairMATICAmount && usdcCurrencyPair
        ? usdcCurrencyPair.priceOf(WCURRENCY[chainId]).quote(currencyPairMATICAmount).raw
        : JSBI.BigInt(0)

    // all other tokens
    // first try the usdc pair
    if (
      usdcPairState === PairState.EXISTS &&
      usdcPair &&
      usdcPair.reserveOf(USDC).greaterThan(currencyPairMATICUSDCValue)
    ) {
      const price = usdcPair.priceOf(wrapped)
      return new Price(currency, USDC, price.denominator, price.numerator)
    }
    if (
      currencyPairState === PairState.EXISTS &&
      currencyPair &&
      usdcCurrencyPairState === PairState.EXISTS &&
      usdcCurrencyPair
    ) {
      if (
        usdcCurrencyPair.reserveOf(USDC).greaterThan('0') &&
        currencyPair.reserveOf(WCURRENCY[chainId]).greaterThan('0')
      ) {
        const avaxUsdcPrice = usdcCurrencyPair.priceOf(USDC)
        const currencyAvaxPrice = currencyPair.priceOf(WCURRENCY[chainId])
        const usdcPrice = avaxUsdcPrice.multiply(currencyAvaxPrice).invert()
        return new Price(currency, USDC, usdcPrice.denominator, usdcPrice.numerator)
      }
    }
    return undefined
  }, [
    chainId,
    currency,
    currencyPair,
    currencyPairState,
    usdcCurrencyPair,
    usdcCurrencyPairState,
    usdcPair,
    usdcPairState,
    wrapped,
    USDC
  ])
}
