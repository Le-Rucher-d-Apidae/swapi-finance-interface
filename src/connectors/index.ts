import { Web3Provider } from '@ethersproject/providers'
import { InjectedConnector } from '@pangolindex/web3-react-injected-connector'

import { NetworkConnector } from './NetworkConnector'
import { ChainId } from '@swapi-finance/sdk'

const NETWORK_URL = process.env.REACT_APP_NETWORK_URL

// export const NETWORK_CHAIN_ID: number = parseInt(process.env.REACT_APP_CHAIN_ID ?? '43114')
export const NETWORK_CHAIN_ID: number = parseInt(process.env.REACT_APP_CHAIN_ID ?? ChainId.POLYGON.toString())

if (typeof NETWORK_URL === 'undefined') {
  throw new Error(`REACT_APP_NETWORK_URL must be a defined environment variable`)
}

export const network = new NetworkConnector({
  urls: { [NETWORK_CHAIN_ID]: NETWORK_URL }
})

let networkLibrary: Web3Provider | undefined
export function getNetworkLibrary(): Web3Provider {
  return (networkLibrary = networkLibrary ?? new Web3Provider(network.provider as any))
}

export const injected = new InjectedConnector({
  // supportedChainIds: [43113, 43114]
  supportedChainIds: [80001, 137] // Polygon Mumbai Testnet, Polygon Mainnet
})
