// import { Currency, currencyEquals, CAVAX, WAVAX } from '@swapi-finance/sdk-local'
import { Currency, currencyEquals, CURRENCY, WMATIC, ChainId } from '@swapi-finance/sdk-local'
import { useMemo } from 'react'
import { tryParseAmount } from '../state/swap/hooks'
import { useTransactionAdder } from '../state/transactions/hooks'
import { useCurrencyBalance } from '../state/wallet/hooks'
import { useActiveWeb3React } from './index'
import { useWETHContract } from './useContract'

export enum WrapType {
  NOT_APPLICABLE,
  WRAP,
  UNWRAP
}

const NOT_APPLICABLE = { wrapType: WrapType.NOT_APPLICABLE }
/**
 * Given the selected input and output currency, return a wrap callback
 * @param inputCurrency the selected input currency
 * @param outputCurrency the selected output currency
 * @param typedValue the user input value
 */
export default function useWrapCallback(
  inputCurrency: Currency | undefined,
  outputCurrency: Currency | undefined,
  typedValue: string | undefined
): { wrapType: WrapType; execute?: undefined | (() => Promise<void>); inputError?: string } {
  const { chainId, account } = useActiveWeb3React()
  const wethContract = useWETHContract()
  const balance = useCurrencyBalance(account ?? undefined, inputCurrency)
  // we can always parse the amount typed as the input currency, since wrapping is 1:1
  const inputAmount = useMemo(() => tryParseAmount(typedValue, inputCurrency), [inputCurrency, typedValue])
  const addTransaction = useTransactionAdder()

  return useMemo(() => {
    if (!wethContract || !chainId || !inputCurrency || !outputCurrency) return NOT_APPLICABLE

    const sufficientBalance = inputAmount && balance && !balance.lessThan(inputAmount)

    // if (inputCurrency === CAVAX && currencyEquals(WAVAX[chainId], outputCurrency)) {
    if (inputCurrency === CURRENCY && currencyEquals(WMATIC[chainId], outputCurrency)) {
      return {
        wrapType: WrapType.WRAP,
        execute:
          sufficientBalance && inputAmount
            ? async () => {
                try {
                  const txReceipt = await wethContract.deposit({ value: `0x${inputAmount.raw.toString(16)}` })
                  // addTransaction(txReceipt, { summary: `Wrap ${inputAmount.toSignificant(6)} AVAX to WAVAX` })
                  addTransaction(txReceipt, {
                    summary: `Wrap ${inputAmount.toSignificant(6)} ${CURRENCY.name} to ${WMATIC[ChainId.POLYGON]}`
                  })
                } catch (error) {
                  console.error('Could not deposit', error)
                }
              }
            : undefined,
        // inputError: sufficientBalance ? undefined : 'Insufficient AVAX balance'
        inputError: sufficientBalance ? undefined : `Insufficient ${CURRENCY.name} balance`
      }
      // } else if (currencyEquals(WAVAX[chainId], inputCurrency) && outputCurrency === CAVAX) {
    } else if (currencyEquals(WMATIC[chainId], inputCurrency) && outputCurrency === CURRENCY) {
      return {
        wrapType: WrapType.UNWRAP,
        execute:
          sufficientBalance && inputAmount
            ? async () => {
                try {
                  const txReceipt = await wethContract.withdraw(`0x${inputAmount.raw.toString(16)}`)
                  // addTransaction(txReceipt, { summary: `Unwrap ${inputAmount.toSignificant(6)} WAVAX to AVAX` })
                  addTransaction(txReceipt, {
                    summary: `Unwrap ${inputAmount.toSignificant(6)} ${WMATIC[ChainId.POLYGON]} to ${CURRENCY.name}`
                  })
                } catch (error) {
                  console.error('Could not withdraw', error)
                }
              }
            : undefined,
        // inputError: sufficientBalance ? undefined : 'Insufficient WAVAX balance'
        inputError: sufficientBalance ? undefined : `Insufficient ${WMATIC[ChainId.POLYGON]} balance`
      }
    } else {
      return NOT_APPLICABLE
    }
  }, [wethContract, chainId, inputCurrency, outputCurrency, inputAmount, balance, addTransaction])
}
