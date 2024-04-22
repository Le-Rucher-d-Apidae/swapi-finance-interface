import {
  ChainId,
  JSBI,
  Percent,
  Token,
  WCURRENCY,
  FACTORY_ADDRESS_MAP as SDK_FACTORY_ADDRESS,
  CURRENCY_LABEL as SDK_CURRENCY_LABEL
} from '@swapi-finance/sdk'

import { AbstractConnector } from '@web3-react/abstract-connector'

import { injected } from '../connectors'

export const LANDING_PAGE = 'https://app.swapi.finance/' // TODO: change to landing page
// export const ANALYTICS_PAGE = 'https://info.baguette.exchange/' // TODO: change to analytics page
// export const BRIDGE_PAGE = 'https://bridge.baguette.exchange/' // TODO: change to bridge page

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export const oneToken18 = JSBI.BigInt(1_000_000_000_000_000_000) // 1e18

const QUICKSWAP_DEPLOYMENTS_ROUTER_ADDRESS = '0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff'

export const ROUTER_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.MUMBAI]: QUICKSWAP_DEPLOYMENTS_ROUTER_ADDRESS, // Mumbai router
  [ChainId.POLYGON]: QUICKSWAP_DEPLOYMENTS_ROUTER_ADDRESS // Polygon mainnet Quickswap (UniswapV2 based) router
}

export const CURRENCY_LABEL = SDK_CURRENCY_LABEL
export const USD_LABEL = 'USD'

export const FACTORY_ADDRESS_MAP = SDK_FACTORY_ADDRESS

export const TOKEN_LIST_EXCHANGE_CUSTOM_ASSET_DEFAULT_LOGO_URL =
  'https://raw.githubusercontent.com/Le-Rucher-d-Apidae/swapi-finance-contracts/main/tokenlist/logos/apidae.png'
export const TOKEN_LIST_EXCHANGE_CUSTOM_ASSET_TESTNET_DEFAULT_LOGO_URL =
  'https://raw.githubusercontent.com/Le-Rucher-d-Apidae/swapi-finance-contracts/main/tokenlist/logos/apidae-testnet.png'
export const TOKEN_LIST_ASSET_GENERIC_ADDRESS_DEFAULT_LOGO_URL_BASE =
  'https://raw.githubusercontent.com/trustwallet/assets/main/blockchains/polygon/assets/'
export const TOKEN_LIST_ASSET_GENERIC_ADDRESS_TESTNET_DEFAULT_LOGO_URL_BASE =
  'https://raw.githubusercontent.com/Le-Rucher-d-Apidae/swapi-finance-contracts/main/assets/blockchains/polygonmumbai/assets/'
export const TOKEN_LIST_ASSET_GENERIC_ADDRESS_DEFAULT_LOGO_URL_DEFAULT_LOGO = '/logo.png'

export const HOME_URL_DEFAULT_WARNING_VISIBLE = true

// a list of tokens by chain
type ChainTokenList = {
  readonly [chainId in ChainId]: Token[]
}

const BWS: { [chainId in ChainId]: Token } = {
  [ChainId.MUMBAI]: new Token(ChainId.MUMBAI, '0xA8ba2F145022beF46126BD2160d457cA10C46812', 18, 'BWS', 'BeeWise'),
  [ChainId.POLYGON]: new Token(ChainId.POLYGON, '0x01024b5D8CB02A12966D96A7b1Ea94C34085630B', 18, 'BWS', 'BeeWise')
}

export const SELF_TOKEN = BWS

export const USDT: { [chainId in ChainId]: Token } = {
  [ChainId.MUMBAI]: new Token(
    ChainId.MUMBAI,
    '0x1fdE0eCc619726f4cD597887C9F3b4c8740e19e2',
    6,
    'USDT Coin AAVE Testnet',
    'Tether USD'
  ),
  [ChainId.POLYGON]: new Token(ChainId.POLYGON, '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', 6, 'USDT', 'Tether USD')
}

export const USDCE: { [chainId in ChainId]: Token } = {
  [ChainId.MUMBAI]: new Token(ChainId.MUMBAI, '0x0FA8781a83E46826621b3BC094Ea2A0212e71B23', 6, 'USDC.e', 'USD Coin'),
  [ChainId.POLYGON]: new Token(ChainId.POLYGON, '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', 6, 'USDC.e', 'USD Coin')
}

export const USDC: { [chainId in ChainId]: Token } = {
  [ChainId.MUMBAI]: new Token(
    ChainId.MUMBAI,
    '0x52D800ca262522580CeBAD275395ca6e7598C014',
    6,
    'USDC',
    'USD Coin AAVE Testnet'
  ),
  [ChainId.POLYGON]: new Token(ChainId.POLYGON, '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359', 6, 'USDC', 'USD Coin')
}

export const DAI: { [chainId in ChainId]: Token } = {
  [ChainId.MUMBAI]: new Token(
    ChainId.MUMBAI,
    '0xc8c0Cf9436F4862a8F60Ce680Ca5a9f0f99b5ded',
    18,
    'DAI',
    'DAI AAVE Testnet'
  ),
  [ChainId.POLYGON]: new Token(
    ChainId.POLYGON,
    '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
    18,
    'DAI',
    '(PoS) Dai Stablecoin'
  )
}

export const WBTC: { [chainId in ChainId]: Token } = {
  [ChainId.MUMBAI]: new Token(
    ChainId.MUMBAI,
    '0x2Fa2e7a6dEB7bb51B625336DBe1dA23511914a8A',
    8,
    'WBTC',
    'Wrapped Bitcoin'
  ),
  [ChainId.POLYGON]: new Token(
    ChainId.POLYGON,
    '0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6',
    8,
    'WBTC',
    'Wrapped Bitcoin'
  )
}

export const WETH: { [chainId in ChainId]: Token } = {
  [ChainId.MUMBAI]: new Token(
    ChainId.MUMBAI,
    '0xc199807AF4fEDB02EE567Ed0FeB814A077de4802',
    18,
    'WETH',
    'Wrapped Ether'
  ),
  [ChainId.POLYGON]: new Token(
    ChainId.POLYGON,
    '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
    18,
    'WETH',
    'Wrapped Ether'
  )
}

export const UNDEFINED: { [chainId in ChainId]: Token } = {
  [ChainId.MUMBAI]: new Token(ChainId.MUMBAI, ZERO_ADDRESS, 0),
  [ChainId.POLYGON]: new Token(ChainId.POLYGON, ZERO_ADDRESS, 0)
}

const WCURRENCY_ONLY: ChainTokenList = {
  [ChainId.MUMBAI]: [WCURRENCY[ChainId.MUMBAI]],
  [ChainId.POLYGON]: [WCURRENCY[ChainId.POLYGON]]
}
// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
  [ChainId.MUMBAI]: [
    WCURRENCY[ChainId.MUMBAI],
    SELF_TOKEN[ChainId.MUMBAI],
    USDT[ChainId.MUMBAI],
    USDC[ChainId.MUMBAI],
    USDC[ChainId.MUMBAI],
    DAI[ChainId.MUMBAI]
  ],
  [ChainId.POLYGON]: [
    WCURRENCY[ChainId.POLYGON],
    SELF_TOKEN[ChainId.POLYGON],
    USDT[ChainId.POLYGON],
    USDC[ChainId.POLYGON]
  ]
}

/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 */
export const CUSTOM_BASES: { [chainId in ChainId]?: { [tokenAddress: string]: Token[] } } = {
  [ChainId.POLYGON]: {}
}

// used for display in the default list when adding liquidity
export const SUGGESTED_BASES: ChainTokenList = {
  [ChainId.MUMBAI]: [...WCURRENCY_ONLY[ChainId.MUMBAI]],
  [ChainId.POLYGON]: [...WCURRENCY_ONLY[ChainId.POLYGON]]
}

// used to construct the list of all pairs we consider by default in the frontend
export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
  [ChainId.MUMBAI]: [SELF_TOKEN[ChainId.MUMBAI]],
  [ChainId.POLYGON]: [...WCURRENCY_ONLY[ChainId.POLYGON]]
}

export const PINNED_PAIRS: { readonly [chainId in ChainId]?: [Token, Token][] } = {
  [ChainId.MUMBAI]: [[WCURRENCY[ChainId.MUMBAI], SELF_TOKEN[ChainId.MUMBAI]]],
  [ChainId.POLYGON]: [[WCURRENCY[ChainId.POLYGON], SELF_TOKEN[ChainId.POLYGON]]]
}

// token contracts that should not be used with EIP712
export const NO_EIP712_SUPPORT: [Token] = [UNDEFINED[ChainId.POLYGON]] // add tokens that should not be used with EIP712

export interface WalletInfo {
  connector?: AbstractConnector
  name: string
  iconName: string
  description: string
  href: string | null
  color: string
  primary?: true
  mobile?: true
  mobileOnly?: true
}

export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
  INJECTED: {
    connector: injected,
    name: 'Injected',
    iconName: 'arrow-right.svg',
    description: 'Injected web3 provider.',
    href: null,
    color: '#010101',
    primary: true
  },
  METAMASK: {
    connector: injected,
    name: 'MetaMask',
    iconName: 'metamask.png',
    description: 'Easy-to-use browser extension.',
    href: null,
    color: '#E8831D'
  },
  RABBY: {
    connector: injected,
    name: 'Rabby',
    iconName: 'rabby.png',
    description: 'A better extension wallet for DeFi users.',
    href: null,
    color: '#8697FF'
  }
}

export const NetworkContextName = 'NETWORK'

// default allowed slippage, in bips
export const INITIAL_ALLOWED_SLIPPAGE = 50
// 60 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 60 * 60

export const BIG_INT_ZERO = JSBI.BigInt(0)
export const BIG_INT_ONE = JSBI.BigInt(1)
export const BIG_INT_TWO = JSBI.BigInt(2)

// one basis point
export const ONE_BIPS = new Percent(JSBI.BigInt(1), JSBI.BigInt(10000))
export const BIPS_BASE = JSBI.BigInt(10000)
// used for warning states
export const ALLOWED_PRICE_IMPACT_LOW: Percent = new Percent(JSBI.BigInt(100), BIPS_BASE) // 1%
export const ALLOWED_PRICE_IMPACT_MEDIUM: Percent = new Percent(JSBI.BigInt(300), BIPS_BASE) // 3%
export const ALLOWED_PRICE_IMPACT_HIGH: Percent = new Percent(JSBI.BigInt(500), BIPS_BASE) // 5%
// if the price slippage exceeds this number, force the user to type 'confirm' to execute
export const PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN: Percent = new Percent(JSBI.BigInt(1000), BIPS_BASE) // 10%
// for non expert mode disable swaps above this
export const BLOCKED_PRICE_IMPACT_NON_EXPERT: Percent = new Percent(JSBI.BigInt(1500), BIPS_BASE) // 15%

// used to ensure the user doesn't send so much ETH so they end up with <.01
export const MIN_ETH: JSBI = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(16)) // .01 ETH
export const BETTER_TRADE_LINK_THRESHOLD = new Percent(JSBI.BigInt(75), JSBI.BigInt(10000))
export { ChainId }
