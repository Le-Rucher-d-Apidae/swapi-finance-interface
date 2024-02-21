import { BigNumber } from 'ethers'
import { useSelector } from 'react-redux'
import { AppState } from '../state'

// combines the current timestamp with the user setting to give the deadline that should be used for any submitted transaction
export default function useTransactionDeadline(): BigNumber | undefined {
  // debugger
  /*
  const ttl = useSelector<AppState, number>(state => state.user.userDeadline)
  const currentTimestamp = BigNumber.from(new Date().getTime() + 100_000)
  // if (currentTimestamp && ttl) return currentTimestamp.add(ttl)
  if (currentTimestamp && ttl) return currentTimestamp.add(ttl * 1_000)
  return undefined
*/
  let txDeadline = undefined
  const ttl = useSelector<AppState, number>(state => state.user.userDeadline)
  const currentTimestamp = BigNumber.from(new Date().getTime() + 100_000) // minimum deadline is 100 seconds from now
  if (currentTimestamp && ttl) txDeadline = currentTimestamp.add(ttl * 1_000) // ms to s
  /*
  console.debug(
    `useTransactionDeadline ttl=${ttl} currentTimestamp=${currentTimestamp} txDeadline=${txDeadline} dt=${
      txDeadline ? new Date(txDeadline.toNumber()) : 'undefined'
    }`
  )
 */
  return txDeadline
}
