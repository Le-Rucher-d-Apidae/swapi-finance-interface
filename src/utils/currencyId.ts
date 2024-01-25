import { Currency, /* CAVAX */ CURRENCY, Token } from '@swapi-finance/sdk-local'

export function currencyId(currency: Currency): string {
  if (currency === /* CAVAX */ CURRENCY) return /* 'AVAX' */ CURRENCY.symbol || '?'
  if (currency instanceof Token) return currency.address
  throw new Error('invalid currency')
}
