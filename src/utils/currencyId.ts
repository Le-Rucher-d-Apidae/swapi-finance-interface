import { Currency, CURRENCY, Fraction, Token } from '@swapi-finance/sdk'

export function currencyId(currency: Currency): string {
  if (currency === CURRENCY) return CURRENCY.symbol || '?'
  if (currency instanceof Token) return currency.address
  throw new Error('invalid currency')
}
