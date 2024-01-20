import { Currency, /* CAVAX */ CMATIC, Token } from '@swapi-finance/sdk-local'

export function currencyId(currency: Currency): string {
  if (currency === /* CAVAX */ CMATIC) return /* 'AVAX' */ CMATIC.symbol || '?'
  if (currency instanceof Token) return currency.address
  throw new Error('invalid currency')
}
