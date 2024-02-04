import { ChainId } from '@swapi-finance/sdk'
import MULTICALL_ABI from './abi.json'

// const MULTICALL_NETWORKS: { [chainId in ChainId]: string } = {
//   [ChainId.FUJI]: '0xb465Fd2d9C71d5D6e6c069aaC9b4E21c69aAA78f',
//   [ChainId.AVALANCHE]: '0x0FB54156B496b5a040b51A71817aED9e2927912E',
//   [ChainId.CRYPTOSEALS]: '0xDfb690cF42cD1e9af757AEbA482F5171F8643E92',
// }
const MULTICALL_NETWORKS: { [chainId in ChainId]: string } = {
  [ChainId.MUMBAI]: '0xe9939e7Ea7D7fb619Ac57f648Da7B1D425832631',
  [ChainId.POLYGON]: '0x275617327c958bD06b5D6b871E7f491D76113dd8'
}

export { MULTICALL_ABI, MULTICALL_NETWORKS }
