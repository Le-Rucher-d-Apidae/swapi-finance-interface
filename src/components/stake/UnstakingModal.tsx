import React, { useState } from 'react'
import Modal from '../Modal'
import { AutoColumn } from '../Column'
import styled from 'styled-components'
import { RowBetween } from '../Row'
import { TYPE, CloseIcon } from '../../theme'
import { ButtonError } from '../Button'
import { StakingInfo } from '../../state/stake/hooks'
import { useStakingContract, useAutocompoundContract } from '../../hooks/useContract'
import { SubmittedView, LoadingView } from '../ModalViews'
import { TransactionResponse } from '@ethersproject/providers'
import { useTransactionAdder } from '../../state/transactions/hooks'
import FormattedCurrencyAmount from '../FormattedCurrencyAmount'
import { useActiveWeb3React } from '../../hooks'
import { UNDEFINED } from '../../constants'

import { SELF_TOKEN } from '../../constants'
import { ChainId, LIQUIDITY_TOKEN_SYMBOL } from '@swapi-finance/sdk'

const ContentWrapper = styled(AutoColumn)`
  width: 100%;
  padding: 1rem;
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.poolStakeUnstakeModalBorder};
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
`

interface StakingModalProps {
  isOpen: boolean
  onDismiss: () => void
  stakingInfo: StakingInfo
}

export default function UnstakingModal({ isOpen, onDismiss, stakingInfo }: StakingModalProps) {
  const { account, chainId } = useActiveWeb3React()

  // monitor call to help UI loading state
  const addTransaction = useTransactionAdder()
  const [hash, setHash] = useState<string | undefined>()
  const [attempting, setAttempting] = useState(false)

  function wrappedOndismiss() {
    setHash(undefined)
    setAttempting(false)
    onDismiss()
  }

  const stakingContract = useStakingContract(stakingInfo.stakingRewardAddress)
  const autocompoundContract = useAutocompoundContract(stakingInfo.autocompoundingAddress)

  async function onWithdraw() {
    if (stakingContract && stakingInfo?.stakedAmount) {
      setAttempting(true)
      if (autocompoundContract && stakingInfo.useAutocompounding) {
        await autocompoundContract
          .withdraw(`0x${stakingInfo.sharesAmount.toString(16)}`, { gasLimit: 300000 })
          .then((response: TransactionResponse) => {
            addTransaction(response, {
              summary: `Withdraw deposited tokens`
            })
            setHash(response.hash)
          })
          .catch((error: any) => {
            setAttempting(false)
            console.log(error)
          })
      } else {
        await stakingContract
          .exit({ gasLimit: 300000 })
          .then((response: TransactionResponse) => {
            addTransaction(response, {
              summary: `Withdraw deposited tokens`
            })
            setHash(response.hash)
          })
          .catch((error: any) => {
            setAttempting(false)
            console.log(error)
          })
      }
    }
  }

  let error: string | undefined
  if (!account) {
    error = 'Connect Wallet'
  }
  if (!stakingInfo?.stakedAmount) {
    error = error ?? 'Enter an amount'
  }

  const isPair = stakingInfo?.tokens[1] !== UNDEFINED[stakingInfo?.tokens[1].chainId]
  const tokenSymbol = isPair ? LIQUIDITY_TOKEN_SYMBOL : stakingInfo?.tokens[0].symbol
  const rewardToken = stakingInfo?.rewardToken
  const selfTokenSymbol = SELF_TOKEN[chainId ? chainId : ChainId.POLYGON].symbol

  return (
    <Modal isOpen={isOpen} onDismiss={wrappedOndismiss} maxHeight={90}>
      {!attempting && !hash && (
        <ContentWrapper gap="lg">
          <RowBetween>
            <TYPE.mediumHeader>Withdraw</TYPE.mediumHeader>
            <CloseIcon onClick={wrappedOndismiss} />
          </RowBetween>
          {stakingInfo?.stakedAmount && (
            <AutoColumn justify="center" gap="md">
              <TYPE.body fontWeight={600} fontSize={36}>
                {<FormattedCurrencyAmount currencyAmount={stakingInfo.stakedAmount} />}
              </TYPE.body>
              <TYPE.body>Deposited {tokenSymbol} tokens</TYPE.body>
            </AutoColumn>
          )}
          {stakingInfo?.earnedAmount && !stakingInfo.useAutocompounding && (
            <AutoColumn justify="center" gap="md">
              <TYPE.body fontWeight={600} fontSize={36}>
                {<FormattedCurrencyAmount currencyAmount={stakingInfo?.earnedAmount} />}
              </TYPE.body>
              <TYPE.body>Unclaimed {rewardToken.symbol}</TYPE.body>
            </AutoColumn>
          )}
          {isPair && (
            <TYPE.subHeader style={{ textAlign: 'center' }}>
              When you withdraw, your {selfTokenSymbol} is claimed and your Baguette Liquidity tokens,
              {LIQUIDITY_TOKEN_SYMBOL}, are returned to you. You will no longer earn {selfTokenSymbol} rewards on this
              liquidity. Your original token liquidity will remain in its liquidity pool.
            </TYPE.subHeader>
          )}
          {!isPair && !stakingInfo.useAutocompounding && (
            <TYPE.subHeader style={{ textAlign: 'center' }}>
              When you withdraw, your {rewardToken.symbol} is claimed and your {tokenSymbol} tokens are returned to you.
              You will no longer earn {rewardToken.symbol} rewards on this staking pool.
            </TYPE.subHeader>
          )}
          <ButtonError disabled={!!error} error={!!error && !!stakingInfo?.stakedAmount} onClick={onWithdraw}>
            {error ?? stakingInfo.useAutocompounding ? 'Withdraw' : 'Withdraw & Claim'}
          </ButtonError>
        </ContentWrapper>
      )}
      {attempting && !hash && (
        <LoadingView onDismiss={wrappedOndismiss}>
          <AutoColumn gap="12px" justify={'center'}>
            <TYPE.body fontSize={20}>
              Withdrawing {stakingInfo?.stakedAmount?.toSignificant(6)} {tokenSymbol}
            </TYPE.body>
            {!stakingInfo?.useAutocompounding && (
              <TYPE.body fontSize={20}>
                Claiming {stakingInfo?.earnedAmount?.toSignificant(6)} {rewardToken.symbol}
              </TYPE.body>
            )}
          </AutoColumn>
        </LoadingView>
      )}
      {hash && (
        <SubmittedView onDismiss={wrappedOndismiss} hash={hash}>
          <AutoColumn gap="12px" justify={'center'}>
            <TYPE.largeHeader>Transaction Submitted</TYPE.largeHeader>
            <TYPE.body fontSize={20}>Withdrew {tokenSymbol}!</TYPE.body>
            {!stakingInfo?.useAutocompounding && <TYPE.body fontSize={20}>Claimed {rewardToken.symbol}!</TYPE.body>}
          </AutoColumn>
        </SubmittedView>
      )}
    </Modal>
  )
}
