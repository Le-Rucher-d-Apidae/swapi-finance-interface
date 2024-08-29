// UNUSED
import { JSBI, Token, TokenAmount } from '@swapi-finance/sdk'

export async function computeSelfTokenCirculation(token: Token): Promise<TokenAmount> {
  const url = `${process.env.REACT_APP_API_BASE_URL}${process.env.REACT_APP_API_CIRCULATING_SUPPLY}`
  // console.debug('computeSelfTokenCirculation url=', url)
  return fetch(url)
    .then(res => res.text())
    .then(res => new TokenAmount(token, JSBI.BigInt(res)))
    .catch(() => {
      console.log(`Failed to get circulating supply from ${process.env.REACT_APP_TITLE} API`)
      return new TokenAmount(token, JSBI.BigInt(0))
    })
}
