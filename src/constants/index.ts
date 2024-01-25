// import { ChainId, JSBI, Percent, Token, WAVAX } from '@swapi-finance/sdk-local'
import { ChainId, JSBI, Percent, Token, WMATIC, FACTORY_ADDRESS as SDK_FACTORY_ADDRESS } from '@swapi-finance/sdk-local'

import { AbstractConnector } from '@web3-react/abstract-connector'

import { injected } from '../connectors'

// export const GAS_PRICE = 225

export const LANDING_PAGE = 'https://app.swapi.finance/' // TODO: change to landing page
// export const ANALYTICS_PAGE = 'https://info.baguette.exchange/' // TODO: change to analytics page
// export const BRIDGE_PAGE = 'https://bridge.baguette.exchange/' // TODO: change to bridge page

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export const ROUTER_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.MUMBAI]: '0xFb89BAD7ee7Db9B8F8d3546D3cB361F3C2f6C3Ef', // mumbai router
  [ChainId.POLYGON]: '0xF7b1e993d1b4F7348D64Aa55A294E4B74512F7f2' // TODO: change to polygon router
}

// export const FACTORY_ADDRESS: { [chainId in ChainId]: string } = {
//   // [ChainId.MUMBAI]: '0x15a34fd98dbf1c0116bdf740d501f735fca2891b', // TODO: change to mumbai factory
//   // [ChainId.POLYGON]: '0x3587B8c0136c2C3605a9E5B03ab54Da3e4044b50' // TODO: change to polygon factory
//   [ChainId.MUMBAI]: SDK_FACTORY_ADDRESS[ChainId.MUMBAI], // TODO: change to mumbai factory
//   [ChainId.POLYGON]: SDK_FACTORY_ADDRESS[ChainId.POLYGON] // TODO: change to polygon factory
// }
export const FACTORY_ADDRESS = SDK_FACTORY_ADDRESS

export const TOKEN_LIST_EXCHANGE_CUSTOM_ASSET_DEFAULT_LOGO_URL =
  'https://raw.githubusercontent.com/Le-Rucher-d-Apidae/swapi-finance-contracts/main/tokenlist/logos/apidae.png'
export const TOKEN_LIST_EXCHANGE_CUSTOM_ASSET_TESTNET_DEFAULT_LOGO_URL =
  'https://raw.githubusercontent.com/Le-Rucher-d-Apidae/swapi-finance-contracts/main/tokenlist/logos/apidae-testnet.png'
export const TOKEN_LIST_ASSET_GENERIC_ADDRESS_DEFAULT_LOGO_URL_BASE =
  'https://raw.githubusercontent.com/trustwallet/assets/main/blockchains/polygon/assets/'
export const TOKEN_LIST_ASSET_GENERIC_ADDRESS_TESTNET_DEFAULT_LOGO_URL_BASE =
  'https://raw.githubusercontent.com/trustwallet/assets/main/blockchains/polygon/assets/'
export const TOKEN_LIST_ASSET_GENERIC_ADDRESS_DEFAULT_LOGO_URL_DEFAULT_LOGO = '/logo.png'

// a list of tokens by chain
type ChainTokenList = {
  readonly [chainId in ChainId]: Token[]
}

// export const BAG: { [chainId in ChainId]: Token } = {
//   [ChainId.MUMBAI]: new Token(ChainId.MUMBAI, '0x5eb9f3D24fe25C582fCec2a32aEb774Ea8D47ae8', 18, 'BAG', 'Baguette'),
//   [ChainId.POLYGON]: new Token(ChainId.POLYGON, '0xa1144a6A1304bd9cbb16c800F7a867508726566E', 18, 'BAG', 'Baguette')
// }
/* export */ const APD: { [chainId in ChainId]: Token } = {
  [ChainId.MUMBAI]: new Token(ChainId.MUMBAI, '0xCB120D92f6F5eb076579598487976b6BBC1963f7', 18, 'APD01', 'APIDAE01'), // TODO: change to mumbai APD
  [ChainId.POLYGON]: new Token(ChainId.POLYGON, '0x5d47bAbA0d66083C52009271faF3F50DCc01023C', 18, 'APD', 'Apidae') // TODO: change to polygon APD // currently: ApeSwapFinance Banana (BANANA)
}
export const SELF_TOKEN = APD

// export const PNG: { [chainId in ChainId]: Token } = {
//   [ChainId.MUMBAI]: new Token(ChainId.MUMBAI, ZERO_ADDRESS, 18, 'PNG', 'Pangolin'),
//   [ChainId.POLYGON]: new Token(ChainId.POLYGON, '0x60781C2586D68229fde47564546784ab3fACA982', 18, 'PNG', 'Pangolin')
// }

// export const ETH: { [chainId in ChainId]: Token } = {
//   [ChainId.MUMBAI]: new Token(ChainId.MUMBAI, '0x89B2eC9b2fB0CDdd09954dbEE07DB48F8cc934e3', 18, 'ETH', 'Ether'),
//   [ChainId.POLYGON]: new Token(ChainId.POLYGON, '0xf20d962a6c8f70c731bd838a3a388D7d48fA6e15', 18, 'ETH', 'Ether')
// }

export const BAGTEST: { [chainId in ChainId]: Token } = {
  [ChainId.MUMBAI]: new Token(
    ChainId.MUMBAI,
    '0x6dc9e2C3Fb8330075B36AE6100ebAA2d5bB1B482',
    18,
    'BAGTST',
    'BaguetteTest'
  ), // TODO: change to mumbai BAGTST
  [ChainId.POLYGON]: new Token(ChainId.POLYGON, ZERO_ADDRESS, 18, 'BAGTST', 'BaguetteTest') // TODO: change to polygon BAGTST
}

export const USDT: { [chainId in ChainId]: Token } = {
  [ChainId.MUMBAI]: new Token(ChainId.MUMBAI, ZERO_ADDRESS, 6, 'USDT', 'Tether USD'),
  [ChainId.POLYGON]: new Token(ChainId.POLYGON, '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', 6, 'USDT', 'Tether USD')
}

export const WBTC: { [chainId in ChainId]: Token } = {
  [ChainId.MUMBAI]: new Token(ChainId.MUMBAI, ZERO_ADDRESS, 8, 'WBTC', 'Wrapped Bitcoin'),
  [ChainId.POLYGON]: new Token(
    ChainId.POLYGON,
    '0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6',
    8,
    'WBTC',
    'Wrapped Bitcoin'
  )
}

export const LINK: { [chainId in ChainId]: Token } = {
  [ChainId.MUMBAI]: new Token(ChainId.MUMBAI, ZERO_ADDRESS, 18, 'LINK', 'ChainLink Token'),
  [ChainId.POLYGON]: new Token(
    ChainId.POLYGON,
    '0x53E0bca35eC356BD5ddDFebbD1Fc0fD03FaBad39',
    18,
    'LINK',
    'ChainLink Token'
  )
}

export const DAI: { [chainId in ChainId]: Token } = {
  [ChainId.MUMBAI]: new Token(ChainId.MUMBAI, ZERO_ADDRESS, 18, 'DAI', 'Dai Stablecoin'),
  [ChainId.POLYGON]: new Token(
    ChainId.POLYGON,
    '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
    18,
    'DAI',
    'Dai Stablecoin'
  )
}

// export const UNI: { [chainId in ChainId]: Token } = {
//   [ChainId.MUMBAI]: new Token(ChainId.MUMBAI, ZERO_ADDRESS, 18, 'UNI', 'Uniswap'),
//   [ChainId.POLYGON]: new Token(ChainId.POLYGON, '0xf39f9671906d8630812f9d9863bBEf5D523c84Ab', 18, 'UNI', 'Uniswap')
// }

// export const SUSHI: { [chainId in ChainId]: Token } = {
//   [ChainId.MUMBAI]: new Token(ChainId.MUMBAI, ZERO_ADDRESS, 18, 'SUSHI', 'SushiToken'),
//   [ChainId.POLYGON]: new Token(ChainId.POLYGON, '0x39cf1BD5f15fb22eC3D9Ff86b0727aFc203427cc', 18, 'SUSHI', 'SushiToken')
// }

export const AAVE: { [chainId in ChainId]: Token } = {
  [ChainId.MUMBAI]: new Token(ChainId.MUMBAI, ZERO_ADDRESS, 18, 'AAVE', 'Aave Token'),
  [ChainId.POLYGON]: new Token(ChainId.POLYGON, '0xf329e36C7bF6E5E86ce2150875a84Ce77f477375', 18, 'AAVE', 'Aave Token')
}

// export const YFI: { [chainId in ChainId]: Token } = {
//   [ChainId.MUMBAI]: new Token(ChainId.MUMBAI, ZERO_ADDRESS, 18, 'YFI', 'yearn.finance'),
//   [ChainId.POLYGON]: new Token(
//     ChainId.POLYGON,
//     '0x99519AcB025a0e0d44c3875A4BbF03af65933627',
//     18,
//     'YFI',
//     'yearn.finance'
//   )
// }

// export const XAVA: { [chainId in ChainId]: Token } = {
//   [ChainId.MUMBAI]: new Token(ChainId.MUMBAI, ZERO_ADDRESS, 18, 'XAVA', 'Avalaunch'),
//   [ChainId.POLYGON]: new Token(ChainId.POLYGON, '0xd1c3f94de7e5b45fa4edbba472491a9f4b166fc4', 18, 'XAVA', 'Avalaunch')
// }

// export const SHIBX: { [chainId in ChainId]: Token } = {
//   [ChainId.MUMBAI]: new Token(ChainId.MUMBAI, ZERO_ADDRESS, 18, 'SHIBX', 'SHIBAVAX'),
//   [ChainId.POLYGON]: new Token(ChainId.POLYGON, '0x440abbf18c54b2782a4917b80a1746d3a2c2cce1', 18, 'SHIBX', 'SHIBAVAX')
// }

// export const LYD: { [chainId in ChainId]: Token } = {
//   [ChainId.MUMBAI]: new Token(ChainId.MUMBAI, ZERO_ADDRESS, 18, 'LYD', 'LydiaFinance'),
//   [ChainId.POLYGON]: new Token(ChainId.POLYGON, '0x4C9B4E1AC6F24CdE3660D5E4Ef1eBF77C710C084', 18, 'LYD', 'LydiaFinance')
// }

// export const QI: { [chainId in ChainId]: Token } = {
//   [ChainId.MUMBAI]: new Token(ChainId.MUMBAI, ZERO_ADDRESS, 18, 'QI', 'BENQI'),
//   [ChainId.POLYGON]: new Token(ChainId.POLYGON, '0x8729438eb15e2c8b576fcc6aecda6a148776c0f5', 18, 'QI', 'BENQI')
// }

// export const USDTE: { [chainId in ChainId]: Token } = {
//   [ChainId.MUMBAI]: new Token(ChainId.MUMBAI, ZERO_ADDRESS, 6, 'USDT.e', 'Tether USD'),
//   [ChainId.POLYGON]: new Token(ChainId.POLYGON, '0xc7198437980c041c805a1edcba50c1ce5db95118', 6, 'USDTE', 'Tether USD')
// }

// export const LINKE: { [chainId in ChainId]: Token } = {
//   [ChainId.MUMBAI]: new Token(ChainId.MUMBAI, ZERO_ADDRESS, 18, 'LINK.e', 'Chainlink Token'),
//   [ChainId.POLYGON]: new Token(
//     ChainId.POLYGON,
//     '0x5947bb275c521040051d82396192181b413227a3',
//     18,
//     'LINK.e',
//     'Chainlink Token'
//   )
// }

export const WETHE: { [chainId in ChainId]: Token } = {
  [ChainId.MUMBAI]: new Token(ChainId.MUMBAI, ZERO_ADDRESS, 18, 'WETH', 'Wrapped Ether'),
  [ChainId.POLYGON]: new Token(
    ChainId.POLYGON,
    '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
    18,
    'WETH',
    'Wrapped Ether'
  )
}

// export const WET: { [chainId in ChainId]: Token } = {
//   [ChainId.MUMBAI]: new Token(ChainId.MUMBAI, ZERO_ADDRESS, 18, 'WET', 'Weble Ecosystem Token'),
//   [ChainId.POLYGON]: new Token(
//     ChainId.POLYGON,
//     '0xb1466d4cf0dcfc0bcddcf3500f473cdacb88b56d',
//     18,
//     'WET',
//     'Weble Ecosystem Token'
//   )
// }

// export const YAK: { [chainId in ChainId]: Token } = {
//   [ChainId.MUMBAI]: new Token(ChainId.MUMBAI, ZERO_ADDRESS, 18, 'YAK', 'Yak Token'),
//   [ChainId.POLYGON]: new Token(ChainId.POLYGON, '0x59414b3089ce2af0010e7523dea7e2b35d776ec7', 18, 'YAK', 'Yak Token')
// }

// export const KLO: { [chainId in ChainId]: Token } = {
//   [ChainId.MUMBAI]: new Token(ChainId.MUMBAI, ZERO_ADDRESS, 18, 'KLO', 'Kalao Token'),
//   [ChainId.POLYGON]: new Token(ChainId.POLYGON, '0xb27c8941a7df8958a1778c0259f76d1f8b711c35', 18, 'KLO', 'Kalao Token')
// }

// export const XSLR: { [chainId in ChainId]: Token } = {
//   [ChainId.MUMBAI]: new Token(ChainId.MUMBAI, ZERO_ADDRESS, 18, 'XSLR', 'NovaXSolarEnergy'),
//   [ChainId.POLYGON]: new Token(
//     ChainId.POLYGON,
//     '0xe6ee049183b474ecf7704da3f6f555a1dcaf240f',
//     18,
//     'XSLR',
//     'NovaXSolarEnergy'
//   )
// }

// export const XMTL: { [chainId in ChainId]: Token } = {
//   [ChainId.MUMBAI]: new Token(ChainId.MUMBAI, ZERO_ADDRESS, 18, 'XMTL', 'NovaXMetal'),
//   [ChainId.POLYGON]: new Token(ChainId.POLYGON, '0x4c1057455747e3ee5871d374fdd77a304ce10989', 18, 'XMTL', 'NovaXMetal')
// }

// export const XCRS: { [chainId in ChainId]: Token } = {
//   [ChainId.MUMBAI]: new Token(ChainId.MUMBAI, ZERO_ADDRESS, 18, 'XCRS', 'NovaXCrystal'),
//   [ChainId.POLYGON]: new Token(
//     ChainId.POLYGON,
//     '0x70b4ae8eb7bd572fc0eb244cd8021066b3ce7ee4',
//     18,
//     'XCRS',
//     'NovaXCrystal'
//   )
// }

export const USDCE: { [chainId in ChainId]: Token } = {
  [ChainId.MUMBAI]: new Token(ChainId.MUMBAI, ZERO_ADDRESS, 6, 'USDC.e', 'USD Coin'),
  [ChainId.POLYGON]: new Token(ChainId.POLYGON, '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', 6, 'USDC.e', 'USD Coin')
}

export const USDC: { [chainId in ChainId]: Token } = {
  [ChainId.MUMBAI]: new Token(ChainId.MUMBAI, ZERO_ADDRESS, 6, 'USDC', 'USD Coin'),
  [ChainId.POLYGON]: new Token(ChainId.POLYGON, '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359', 6, 'USDC', 'USD Coin')
}

// export const VOID: { [chainId in ChainId]: Token } = {
//   [ChainId.MUMBAI]: new Token(ChainId.MUMBAI, ZERO_ADDRESS, 18, 'VOID', 'https://twitter.com/AvalancheVoid'),
//   [ChainId.POLYGON]: new Token(
//     ChainId.POLYGON,
//     '0x02fe8adc1b58a63ccb1bb8c39930dcedd7cef4db',
//     18,
//     'VOID',
//     'https://twitter.com/AvalancheVoid'
//   )
// }

// export const CASH: { [chainId in ChainId]: Token } = {
//   [ChainId.MUMBAI]: new Token(ChainId.MUMBAI, ZERO_ADDRESS, 18, 'CASH', 'Avacash Finance'),
//   [ChainId.POLYGON]: new Token(
//     ChainId.POLYGON,
//     '0xcd426834d733e5b4bffc89d3f21fa7e16d0bf583',
//     18,
//     'CASH',
//     'Avacash Finance'
//   )
// }

export const UNDEFINED: { [chainId in ChainId]: Token } = {
  [ChainId.MUMBAI]: new Token(ChainId.MUMBAI, ZERO_ADDRESS, 0),
  [ChainId.POLYGON]: new Token(ChainId.POLYGON, ZERO_ADDRESS, 0)
}

export const AIRDROP_ADDRESS: { [chainId in ChainId]?: string } = {
  [ChainId.MUMBAI]: ZERO_ADDRESS,
  [ChainId.POLYGON]: ZERO_ADDRESS
}

// const WAVAX_ONLY: ChainTokenList = {
//   [ChainId.MUMBAI]: [WAVAX[ChainId.MUMBAI]],
//   [ChainId.POLYGON]: [WAVAX[ChainId.POLYGON]]
// }
const WMATIC_ONLY: ChainTokenList = {
  [ChainId.MUMBAI]: [WMATIC[ChainId.MUMBAI]],
  [ChainId.POLYGON]: [WMATIC[ChainId.POLYGON]]
}
// used to construct intermediary pairs for trading
// export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
//   [ChainId.MUMBAI]: [WAVAX[ChainId.MUMBAI], BAG[ChainId.MUMBAI]],
//   [ChainId.POLYGON]: [WAVAX[ChainId.POLYGON], BAG[ChainId.POLYGON], USDTE[ChainId.POLYGON], USDCE[ChainId.POLYGON]]
// }
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
  [ChainId.MUMBAI]: [WMATIC[ChainId.MUMBAI], APD[ChainId.MUMBAI]],
  [ChainId.POLYGON]: [WMATIC[ChainId.POLYGON], APD[ChainId.POLYGON], USDT[ChainId.POLYGON], USDC[ChainId.POLYGON]]
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
  // ...WAVAX_ONLY,
  // [ChainId.POLYGON]: [...WAVAX_ONLY[ChainId.POLYGON]]
  ...WMATIC_ONLY,
  [ChainId.POLYGON]: [...WMATIC_ONLY[ChainId.POLYGON]]
}

// used to construct the list of all pairs we consider by default in the frontend
export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
  // ...WAVAX_ONLY,
  // ...WMATIC_ONLY,
  // [ChainId.POLYGON]: [...WAVAX_ONLY[ChainId.POLYGON]]
  [ChainId.POLYGON]: [...WMATIC_ONLY[ChainId.POLYGON]],
  [ChainId.MUMBAI]: [BAGTEST[ChainId.MUMBAI]]
}

// export const PINNED_PAIRS: { readonly [chainId in ChainId]?: [Token, Token][] } = {
//   [ChainId.POLYGON]: []
// }

export const PINNED_PAIRS: { readonly [chainId in ChainId]?: [Token, Token][] } = {
  [ChainId.POLYGON]: [],
  [ChainId.MUMBAI]: [[BAGTEST[ChainId.MUMBAI], APD[ChainId.MUMBAI]]]
}

// token contracts that should not be used with EIP712
// export const NO_EIP712_SUPPORT = [QI[ChainId.POLYGON]]

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
