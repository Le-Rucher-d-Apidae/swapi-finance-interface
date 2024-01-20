// the Baguette Default token list lives here
// export const REACT_APP_DEFAULT_TOKEN_LIST_URL =
//   'https://raw.githubusercontent.com/baguette-exchange/contracts/main/tokenlist/baguette.tokenlist.json' // TODO: change this to the baguette token list
// export const DEFAULT_TOKEN_LIST_URL =
//   'https://raw.githubusercontent.com/Le-Rucher-d-Apidae/swapi-finance-contracts/polygon-port/tokenlist/apidae.tokenlist.json' // TODO: change this to the apidae token list

export const DEFAULT_TOKEN_LIST_URL =
  process.env.REACT_APP_DEFAULT_TOKEN_LIST_URL ||
  'xhttps://raw.githubusercontent.com/Le-Rucher-d-Apidae/swapi-finance-contracts/main/tokenlist/apidae.tokenlist.json'

console.log('process.env.REACT_APP_DEFAULT_TOKEN_LIST_URL', process.env.REACT_APP_DEFAULT_TOKEN_LIST_URL)

export const DEFAULT_LIST_OF_LISTS: string[] = [DEFAULT_TOKEN_LIST_URL]
