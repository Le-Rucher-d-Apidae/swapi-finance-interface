import { JSBI, Token, TokenAmount } from '@swapi-finance/sdk-local'

// export async function computeBagCirculation(
//   bag: Token,
// ): Promise<TokenAmount> {
//   return fetch(`https://api.baguette.exchange/bag/circulating-supply`)
//     .then(res => res.text())
//     .then(res => new TokenAmount(bag, JSBI.BigInt(res)))
//     .catch(() => {
//       console.log("Failed to get circulating supply from Baguette API")
//       return new TokenAmount(bag, JSBI.BigInt(0))
//     })
// }
export async function computeBagCirculation(token: Token): Promise<TokenAmount> {
  const url = `${process.env.REACT_APP_API_BASE_URL}${process.env.REACT_APP_API_CIRCULATING_SUPPLY}`
  console.debug('computeBagCirculation url=', url)
  return fetch(`${process.env.REACT_APP_API_BASE_URL}${process.env.REACT_APP_API_CIRCULATING_SUPPLY}`)
    .then(res => res.text())
    .then(res => new TokenAmount(token, JSBI.BigInt(res)))
    .catch(() => {
      console.log(`Failed to get circulating supply from ${process.env.REACT_APP_TITLE} API`)
      return new TokenAmount(token, JSBI.BigInt(0))
    })
}
