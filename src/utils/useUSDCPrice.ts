// TODO: Actually calculate price

// import { ChainId, Currency, currencyEquals, JSBI, Price, WAVAX } from '@swapi-finance/sdk-local'
import { ChainId, Currency, currencyEquals, JSBI, Price, WMATIC } from '@swapi-finance/sdk-local'
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
        chainId && wrapped && currencyEquals(WMATIC[chainId], wrapped) ? undefined : currency,
        // chainId ? WAVAX[chainId] : undefined
        chainId ? WMATIC[chainId] : undefined
      ],
      // [wrapped?.equals(USDC) ? undefined : wrapped, chainId === ChainId.AVALANCHE ? USDC : undefined],
      // [chainId ? WAVAX[chainId] : undefined, chainId === ChainId.AVALANCHE ? USDC : undefined]
      [wrapped?.equals(USDC) ? undefined : wrapped, chainId === ChainId.POLYGON ? USDC : undefined],
      // [chainId ? WAVAX[chainId] : undefined, chainId === ChainId.POLYGON ? USDC : undefined]
      [chainId ? WMATIC[chainId] : undefined, chainId === ChainId.POLYGON ? USDC : undefined]
    ],
    [chainId, currency, wrapped, USDC]
  )
  // const [[avaxPairState, avaxPair], [usdcPairState, usdcPair], [usdcAvaxPairState, usdcAvaxPair]] = usePairs(tokenPairs)
  const [
    [/* avaxPairState */ maticPairState, /* avaxPair */ maticPair],
    [usdcPairState, usdcPair],
    [/* usdcAvaxPairState */ usdcMaticPairState, /* usdcAvaxPair */ usdcMaticPair]
  ] = usePairs(tokenPairs)

  return useMemo(() => {
    if (!currency || !wrapped || !chainId) {
      return undefined
    }
    // handle wavax/avax
    // if (wrapped.equals(WAVAX[chainId])) {
    if (wrapped.equals(WMATIC[chainId])) {
      if (usdcPair) {
        // const price = usdcPair.priceOf(WAVAX[chainId])
        const price = usdcPair.priceOf(WMATIC[chainId])
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
    const maticPairMATICAmount = /* avaxPair */ maticPair?.reserveOf(WMATIC[chainId])
    const maticPairMATICUSDCValue: JSBI =
      maticPairMATICAmount && /* usdcAvaxPair */ usdcMaticPair
        ? /* usdcAvaxPair.priceOf */ usdcMaticPair.priceOf(WMATIC[chainId]).quote(maticPairMATICAmount).raw
        : JSBI.BigInt(0)

    // all other tokens
    // first try the usdc pair
    // if (usdcPairState === PairState.EXISTS && usdcPair && usdcPair.reserveOf(USDC).greaterThan(avaxPairAVAXUSDCValue)) {
    if (
      usdcPairState === PairState.EXISTS &&
      usdcPair &&
      // usdcPair.reserveOf(USDC).greaterThan(avaxPairAVAXUSDCValue)
      usdcPair.reserveOf(USDC).greaterThan(maticPairMATICUSDCValue)
    ) {
      const price = usdcPair.priceOf(wrapped)
      return new Price(currency, USDC, price.denominator, price.numerator)
    }
    if (
      /* avaxPairState */ maticPairState === PairState.EXISTS &&
      /* avaxPair */ maticPair &&
      /* usdcAvaxPairState */ usdcMaticPairState === PairState.EXISTS &&
      /* usdcAvaxPair */ usdcMaticPair
    ) {
      // if (usdcAvaxPair.reserveOf(USDC).greaterThan('0') && avaxPair.reserveOf(WAVAX[chainId]).greaterThan('0')) {
      if (
        /* usdcAvaxPair.reserveOf */ usdcMaticPair.reserveOf(USDC).greaterThan('0') &&
        /* avaxPair */ maticPair.reserveOf(WMATIC[chainId]).greaterThan('0')
      ) {
        // const avaxUsdcPrice = usdcAvaxPair.priceOf(USDC)
        const avaxUsdcPrice = usdcMaticPair.priceOf(USDC)
        // const currencyAvaxPrice = avaxPair.priceOf(WAVAX[chainId])
        const currencyAvaxPrice = /* avaxPair */ maticPair.priceOf(WMATIC[chainId])
        const usdcPrice = avaxUsdcPrice.multiply(currencyAvaxPrice).invert()
        return new Price(currency, USDC, usdcPrice.denominator, usdcPrice.numerator)
      }
    }
    return undefined
  }, [
    chainId,
    currency,
    // avaxPair,
    maticPair,
    // avaxPairState,
    maticPairState,
    // usdcAvaxPair,
    usdcMaticPair,
    // usdcAvaxPairState,
    usdcMaticPairState,
    usdcPair,
    usdcPairState,
    wrapped,
    USDC
  ])
}
