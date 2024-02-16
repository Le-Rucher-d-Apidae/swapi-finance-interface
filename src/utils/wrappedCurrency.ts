import { ChainId, Currency, CurrencyAmount, CURRENCY, Token, TokenAmount, WCURRENCY } from '@swapi-finance/sdk'

export function wrappedCurrency(currency: Currency | undefined, chainId: ChainId | undefined): Token | undefined {
  const res = chainId && currency === CURRENCY ? WCURRENCY[chainId] : currency instanceof Token ? currency : undefined
  return res
}

export function wrappedCurrencyAmount(
  currencyAmount: CurrencyAmount | undefined,
  chainId: ChainId | undefined
): TokenAmount | undefined {
  const token = currencyAmount && chainId ? wrappedCurrency(currencyAmount.currency, chainId) : undefined
  return token && currencyAmount ? new TokenAmount(token, currencyAmount.raw) : undefined
}

export function unwrappedToken(token: Token): Currency {
  if (token.equals(WCURRENCY[token.chainId])) return CURRENCY
  return token
}
