/* eslint-disable @typescript-eslint/camelcase */
import React, { useMemo, useState } from 'react'
import { AutoColumn } from '../../components/Column'
import styled from 'styled-components'
import { STAKING_REWARDS_INFO, useStakingInfo, StakingType } from '../../state/stake/hooks'
import { TYPE } from '../../theme'
import PoolCard from '../../components/stake/PoolCard'
import { RowBetween, AutoRow } from '../../components/Row'
import { CardSection, DataCard, CardNoise, CardBGImage } from '../../components/stake/styled'
import Loader from '../../components/Loader'
import Toggle from '../../components/Toggle'
import { useActiveWeb3React } from '../../hooks'
import { JSBI } from '@swapi-finance/sdk'

const PageWrapper = styled(AutoColumn)`
  max-width: 640px;
  width: 100%;
`

const TopSection = styled(AutoColumn)`
  max-width: 720px;
  width: 100%;
`

const PoolSection = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  column-gap: 10px;
  row-gap: 15px;
  width: 100%;
  justify-self: center;
`

export default function Stake() {
  const { chainId } = useActiveWeb3React()
  const stakingInfos = useStakingInfo(StakingType.SINGLE)
  const [stakingInfoResults, setStakingInfoResults] = useState<any[]>()
  const [showOnlyActive, setShowOnlyActive] = useState<boolean>(true)

  console.log(`showOnlyActive ${showOnlyActive}`)

  useMemo(() => {
    Promise.all(
      stakingInfos
        ?.sort(function(info_a, info_b) {
          // greater stake in currency comes first
          return info_a.totalStakedInWcurrency?.greaterThan(info_b.totalStakedInWcurrency ?? JSBI.BigInt(0)) ? -1 : 1
        })
        .sort(function(info_a, info_b) {
          if (info_a.stakedAmount.greaterThan(JSBI.BigInt(0))) {
            if (info_b.stakedAmount.greaterThan(JSBI.BigInt(0)))
              // both are being staked, so we keep the previous sorting
              return 0
            // the second is actually not at stake, so we should bring the first up
            else return -1
          } else {
            if (info_b.stakedAmount.greaterThan(JSBI.BigInt(0)))
              // first is not being staked, but second is, so we should bring the first down
              return 1
            // none are being staked, let's keep the  previous sorting
            else return 0
          }
        })
      /*
        .map(stakingInfo => {
          return fetch(`https://api.baguette.exchange/baguette/apr/${stakingInfo.stakingRewardAddress.toLowerCase()}`)
            .then(res => res.text())
            .then(res => ({ apr: res, ...stakingInfo }))
        })
        */
    ).then(results => {
      setStakingInfoResults(results)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stakingInfos?.length])

  const DataRow = styled(RowBetween)`
    ${({ theme }) => theme.mediaWidth.upToSmall`
     flex-direction: column;
   `};
  `

  // const stakingRewardsExist = Boolean(typeof chainId === 'number' && (STAKING_REWARDS_INFO[chainId]?.length ?? 0) > 0)
  // STAKING_REWARDS_INFO contains both staking and farming pools, only look at single asset staking pools
  const stakingRewardsExist =
    Boolean(typeof chainId === 'number' && (STAKING_REWARDS_INFO[chainId]?.length ?? 0) > 0) && stakingInfos.length > 0

  return (
    <PageWrapper gap="lg" justify="center">
      <TopSection gap="md">
        <DataCard>
          <CardBGImage />
          <CardNoise />
          <CardSection>
            <AutoColumn gap="md">
              <RowBetween>
                <TYPE.text5 fontWeight={600}>Welcome to the staking. Lock tokens to earn new tokens</TYPE.text5>
              </RowBetween>
              <RowBetween>
                <TYPE.text5 fontSize={14}>Deposit your tokens to receive incentives.</TYPE.text5>
              </RowBetween>{' '}
            </AutoColumn>
          </CardSection>
          <CardBGImage />
          <CardNoise />
        </DataCard>
      </TopSection>

      <AutoColumn gap="lg" style={{ width: '100%', maxWidth: '720px' }}>
        <DataRow style={{ alignItems: 'baseline' }}>
          <TYPE.mediumHeader style={{ marginTop: '0.5rem' }}>Participating</TYPE.mediumHeader>
          {/* <TYPE.black fontWeight={400}>Info message</TYPE.black> */}
        </DataRow>
        <AutoRow justify="flex-end">
          <TYPE.black fontWeight={400} padding="12px">
            Show only active staking
          </TYPE.black>
          <Toggle
            id="toggle-show-only-active"
            isActive={showOnlyActive}
            toggle={() => {
              setShowOnlyActive(!showOnlyActive)
            }}
          />
        </AutoRow>

        <PoolSection>
          {stakingRewardsExist && stakingInfos?.length === 0 ? (
            <Loader style={{ margin: 'auto' }} />
          ) : !stakingRewardsExist ? (
            <TYPE.warn warn={true} fontWeight={400} padding="12px">
              No active rewards
            </TYPE.warn>
          ) : (
            stakingInfoResults?.map(
              stakingInfo =>
                (!showOnlyActive || stakingInfo.totalRewardRate.greaterThan(0)) && (
                  <PoolCard apr={'0'} key={stakingInfo.stakingRewardAddress} stakingInfo={stakingInfo} />
                )
            )
          )}
        </PoolSection>
      </AutoColumn>
    </PageWrapper>
  )
}
