// import { ChainId, Currency, CurrencyAmount, CAVAX, Token, TokenAmount, WAVAX } from '@swapi-finance/sdk-local'
import { ChainId, Currency, CurrencyAmount, CURRENCY, Token, TokenAmount, WMATIC } from '@swapi-finance/sdk-local'

export function wrappedCurrency(currency: Currency | undefined, chainId: ChainId | undefined): Token | undefined {
  // return chainId && currency === CAVAX ? WAVAX[chainId] : currency instanceof Token ? currency : undefined
  return chainId && currency === CURRENCY ? WMATIC[chainId] : currency instanceof Token ? currency : undefined
}

export function wrappedCurrencyAmount(
  currencyAmount: CurrencyAmount | undefined,
  chainId: ChainId | undefined
): TokenAmount | undefined {
  const token = currencyAmount && chainId ? wrappedCurrency(currencyAmount.currency, chainId) : undefined
  return token && currencyAmount ? new TokenAmount(token, currencyAmount.raw) : undefined
}

export function unwrappedToken(token: Token): Currency {
  // if (token.equals(WAVAX[token.chainId])) return CAVAX
  if (token.equals(WMATIC[token.chainId])) return CURRENCY
  return token
}
