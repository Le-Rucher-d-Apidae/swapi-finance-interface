// TODO: Actually calculate price

// import { ChainId, Currency, currencyEquals, JSBI, Price, WAVAX } from '@swapi-finance/sdk'
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
  // const USDC = chainId ? DAI[chainId] : DAI[ChainId.AVALANCHE]
  const USDC = chainId ? DAI[chainId] : DAI[ChainId.POLYGON]
  const tokenPairs: [Currency | undefined, Currency | undefined][] = useMemo(
    () => [
      [
        // chainId && wrapped && currencyEquals(WAVAX[chainId], wrapped) ? undefined : currency,
        chainId && wrapped && currencyEquals(WCURRENCY[chainId], wrapped) ? undefined : currency,
        // chainId ? WAVAX[chainId] : undefined
        chainId ? WCURRENCY[chainId] : undefined
      ],
      // [wrapped?.equals(USDC) ? undefined : wrapped, chainId === ChainId.AVALANCHE ? USDC : undefined],
      // [chainId ? WAVAX[chainId] : undefined, chainId === ChainId.AVALANCHE ? USDC : undefined]
      [wrapped?.equals(USDC) ? undefined : wrapped, chainId === ChainId.POLYGON ? USDC : undefined],
      // [chainId ? WAVAX[chainId] : undefined, chainId === ChainId.POLYGON ? USDC : undefined]
      [chainId ? WCURRENCY[chainId] : undefined, chainId === ChainId.POLYGON ? USDC : undefined]
    ],
    [chainId, currency, wrapped, USDC]
  )
  // const [[avaxPairState, avaxPair], [usdcPairState, usdcPair], [usdcAvaxPairState, usdcAvaxPair]] = usePairs(tokenPairs)
  const [
    [/* avaxPairState */ currencyPairState, /* avaxPair */ currencyPair],
    [usdcPairState, usdcPair],
    [/* usdcAvaxPairState */ usdcCurrencyPairState, /* usdcAvaxPair */ usdcCurrencyPair]
  ] = usePairs(tokenPairs)

  return useMemo(() => {
    if (!currency || !wrapped || !chainId) {
      return undefined
    }
    // handle wavax/avax
    // if (wrapped.equals(WAVAX[chainId])) {
    if (wrapped.equals(WCURRENCY[chainId])) {
      if (usdcPair) {
        // const price = usdcPair.priceOf(WAVAX[chainId])
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

    // const avaxPairAVAXAmount = avaxPair?.reserveOf(WAVAX[chainId])
    // const avaxPairAVAXUSDCValue: JSBI =
    //   avaxPairAVAXAmount && usdcAvaxPair
    //     ? usdcAvaxPair.priceOf(WAVAX[chainId]).quote(avaxPairAVAXAmount).raw
    //     : JSBI.BigInt(0)
    const currencyPairMATICAmount = /* avaxPair */ currencyPair?.reserveOf(WCURRENCY[chainId])
    const currencyPairMATICUSDCValue: JSBI =
      currencyPairMATICAmount && /* usdcAvaxPair */ usdcCurrencyPair
        ? /* usdcAvaxPair.priceOf */ usdcCurrencyPair.priceOf(WCURRENCY[chainId]).quote(currencyPairMATICAmount).raw
        : JSBI.BigInt(0)

    // all other tokens
    // first try the usdc pair
    // if (usdcPairState === PairState.EXISTS && usdcPair && usdcPair.reserveOf(USDC).greaterThan(avaxPairAVAXUSDCValue)) {
    if (
      usdcPairState === PairState.EXISTS &&
      usdcPair &&
      // usdcPair.reserveOf(USDC).greaterThan(avaxPairAVAXUSDCValue)
      usdcPair.reserveOf(USDC).greaterThan(currencyPairMATICUSDCValue)
    ) {
      const price = usdcPair.priceOf(wrapped)
      return new Price(currency, USDC, price.denominator, price.numerator)
    }
    if (
      /* avaxPairState */ currencyPairState === PairState.EXISTS &&
      /* avaxPair */ currencyPair &&
      /* usdcAvaxPairState */ usdcCurrencyPairState === PairState.EXISTS &&
      /* usdcAvaxPair */ usdcCurrencyPair
    ) {
      // if (usdcAvaxPair.reserveOf(USDC).greaterThan('0') && avaxPair.reserveOf(WAVAX[chainId]).greaterThan('0')) {
      if (
        /* usdcAvaxPair.reserveOf */ usdcCurrencyPair.reserveOf(USDC).greaterThan('0') &&
        /* avaxPair */ currencyPair.reserveOf(WCURRENCY[chainId]).greaterThan('0')
      ) {
        // const avaxUsdcPrice = usdcAvaxPair.priceOf(USDC)
        const avaxUsdcPrice = usdcCurrencyPair.priceOf(USDC)
        // const currencyAvaxPrice = avaxPair.priceOf(WAVAX[chainId])
        const currencyAvaxPrice = /* avaxPair */ currencyPair.priceOf(WCURRENCY[chainId])
        const usdcPrice = avaxUsdcPrice.multiply(currencyAvaxPrice).invert()
        return new Price(currency, USDC, usdcPrice.denominator, usdcPrice.numerator)
      }
    }
    return undefined
  }, [
    chainId,
    currency,
    // avaxPair,
    currencyPair,
    // avaxPairState,
    currencyPairState,
    // usdcAvaxPair,
    usdcCurrencyPair,
    // usdcAvaxPairState,
    usdcCurrencyPairState,
    usdcPair,
    usdcPairState,
    wrapped,
    USDC
  ])
}
