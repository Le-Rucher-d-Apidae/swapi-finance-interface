// import { ChainId, Currency, CurrencyAmount, CAVAX, Token, TokenAmount, WAVAX } from '@swapi-finance/sdk'
import { ChainId, Currency, CurrencyAmount, CURRENCY, Token, TokenAmount, WCURRENCY } from '@swapi-finance/sdk'

export function wrappedCurrency(currency: Currency | undefined, chainId: ChainId | undefined): Token | undefined {
  // return chainId && currency === CAVAX ? WAVAX[chainId] : currency instanceof Token ? currency : undefined
  // debugger
  // console.log('wrappedCurrency', currency, chainId)
  // console.log('wrappedCurrency chainId && currency === CURRENCY', chainId && currency === CURRENCY)
  // console.log('wrappedCurrency currency instanceof Token', currency instanceof Token)
  // console.log('wrappedCurrency currency', currency)
  // console.log('wrappedCurrency CURRENCY', CURRENCY)
  // console.log('wrappedCurrency WCURRENCY[chainId]', chainId ? WMATIC[chainId] : 'undefined')
  // return chainId && currency === CURRENCY ? WCURRENCY[chainId] : currency instanceof Token ? currency : undefined
  const res = chainId && currency === CURRENCY ? WCURRENCY[chainId] : currency instanceof Token ? currency : undefined
  // console.log('wrappedCurrency: res=', res)
  return res
  // if (chainId && currency === CURRENCY) {
  //   // console.log('wrappedCurrency WMATIC[chainId]', WMATIC[chainId])
  //   return WMATIC[chainId]
  //   // return new Token(
  //   //   ChainId.MUMBAI,
  //   //   '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889', // WMATIC
  //   //   18,
  //   //   'WMATIC',
  //   //   'Wrapped MATIC'
  //   // )
  // }
  // if (currency instanceof Token) {
  //   // console.log('wrappedCurrency currency', currency)
  //   return currency
  // }
  // return undefined
}

export function wrappedCurrencyAmount(
  currencyAmount: CurrencyAmount | undefined,
  chainId: ChainId | undefined
): TokenAmount | undefined {
  // debugger
  // console.log('wrappedCurrencyAmount', currencyAmount, chainId)
  const token = currencyAmount && chainId ? wrappedCurrency(currencyAmount.currency, chainId) : undefined
  return token && currencyAmount ? new TokenAmount(token, currencyAmount.raw) : undefined
}

export function unwrappedToken(token: Token): Currency {
  // if (token.equals(WAVAX[token.chainId])) return CAVAX
  if (token.equals(WCURRENCY[token.chainId])) return CURRENCY
  return token
}
