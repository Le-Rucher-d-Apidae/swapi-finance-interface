import React from 'react'
import { AutoColumn } from '../Column'
import { RowBetween } from '../Row'
import styled from 'styled-components'
import { TYPE, InternalLink } from '../../theme'
import DoubleCurrencyLogo from '../DoubleLogo'
import CurrencyLogo from '../CurrencyLogo'
import { JSBI } from '@swapi-finance/sdk'
import { ButtonPrimary } from '../Button'
import { StakingInfo } from '../../state/stake/hooks'
import { useColor } from '../../hooks/useColor'
import { useCurrency } from '../../hooks/Tokens'
import { currencyId } from '../../utils/currencyId'
import { Break, CardNoise } from './styled'
import { UNDEFINED, USD_LABEL } from '../../constants'
import { Fraction, CURRENCY } from '@swapi-finance/sdk'

const StatContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 1rem;
  margin-right: 1rem;
  margin-left: 1rem;
  ${({ theme }) => theme.mediaWidth.upToSmall`
   display: none;
 `};
`

const Wrapper = styled(AutoColumn)<{ showBackground: boolean; bgColor: any }>`
  border-radius: 12px;
  width: 100%;
  overflow: hidden;
  position: relative;
  opacity: ${({ showBackground }) => (showBackground ? '1' : '1')};
  background: ${({ theme, bgColor, showBackground }) =>
    `radial-gradient(91.85% 100% at 1.84% 0%, ${bgColor} 0%, ${
      showBackground ? theme.poolCardBgStaked : theme.poolCardBgNotStaked
    } 100%) `};
  color: ${({ theme, showBackground }) => (showBackground ? theme.white : theme.text1)} !important;
  ${({ showBackground }) =>
    showBackground &&
    `  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
     0px 24px 32px rgba(0, 0, 0, 0.01);`}
  border: 1px solid ${({ theme }) => theme.poolInfoCardBorder};
`

const TopSection = styled.div`
  display: grid;
  grid-template-columns: 48px 1fr 120px;
  grid-gap: 0px;
  align-items: center;
  padding: 1rem;
  z-index: 1;
  ${({ theme }) => theme.mediaWidth.upToSmall`
     grid-template-columns: 48px 1fr 96px;
   `};
`

// const MiddleSection = styled.div`
//   padding: 12px 12px;
//   display: flex;
//   flex-direction: row;
//   align-items: center;
//   padding: 1rem;
//   z-index: 1;
// `

// const StyledLogo = styled.img`
//   display: flex;
//   width: 52px;
// `

const BottomSection = styled.div<{ showBackground: boolean }>`
  padding: 12px 16px;
  opacity: ${({ showBackground }) => (showBackground ? '1' : '0.4')};
  border-radius: 0 0 12px 12px;
  display: flex;
  // flex-direction: row;
  flex-direction: column;
  align-items: baseline;
  justify-content: space-between;
  z-index: 1;
`

const HorizontalMerge = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

export default function PoolCard({ stakingInfo /* apr */ }: { stakingInfo: StakingInfo; apr: string }) {
  const token0 = stakingInfo.tokens[0]
  const token1 = stakingInfo.tokens[1]
  const rewardToken = stakingInfo.rewardToken
  const isPair = token1 !== UNDEFINED[token1.chainId]
  // const autocompoundAvailable = stakingInfo.autocompoundingAddress !== ZERO_ADDRESS

  const currency0 = useCurrency(token0.address) ?? UNDEFINED[token0.chainId]
  const currency1 = useCurrency(token1.address) ?? UNDEFINED[token1.chainId]
  const rewardCurrency = useCurrency(rewardToken.address) ?? UNDEFINED[rewardToken.chainId]

  const isStaking = Boolean(stakingInfo.stakedAmount.greaterThan('0'))
  // console.log('PoolCard:stakingInfo.stakedAmount = ', stakingInfo.stakedAmount)
  // console.log('PoolCard:stakingInfo.stakedAmount.raw = ', stakingInfo.stakedAmount.raw)
  // console.log('PoolCard:stakingInfo.stakedAmount.raw.toString = ', stakingInfo.stakedAmount.raw.toString())
  // console.log('PoolCard:stakingInfo.stakedAmount.toFixed = ', stakingInfo.stakedAmount.toFixed(18, { groupSeparator: ',' }))
  // console.log('PoolCard:isStaking = ', isStaking)
  const token = token1.equals(UNDEFINED[token1.chainId]) ? token0 : token1

  // get the color of the token
  const backgroundColor = useColor(token)

  const secondsPerDay = 60 * 60 * 24
  const secondsPerWeek = secondsPerDay * 7
  const secondsPerYear = secondsPerDay * 365

  let weeklyRewardAmount: Fraction
  let weeklyRewardPerCURRENCY: Fraction
  let yearlyRewardAmount: Fraction

  if (stakingInfo.totalStakedInWcurrency.equalTo(JSBI.BigInt(0))) {
    const ZERO = new Fraction(JSBI.BigInt(0))
    weeklyRewardAmount = ZERO
    weeklyRewardPerCURRENCY = ZERO
    yearlyRewardAmount = ZERO
  } else {
    weeklyRewardAmount = stakingInfo.totalRewardRate.multiply(JSBI.BigInt(secondsPerWeek))
    weeklyRewardPerCURRENCY = weeklyRewardAmount.divide(stakingInfo.totalStakedInWcurrency)
    yearlyRewardAmount = stakingInfo.totalRewardRate.multiply(JSBI.BigInt(secondsPerYear))
  }

  return (
    <Wrapper showBackground={isStaking} bgColor={backgroundColor}>
      {/* <CardBGImage desaturate /> */}
      <CardNoise />

      <TopSection>
        {isPair && (
          <>
            <DoubleCurrencyLogo currency0={currency0} currency1={currency1} size={24} />
            <TYPE.white fontWeight={600} fontSize={24} style={{ marginLeft: '8px' }}>
              {currency0?.symbol}-{currency1?.symbol}
            </TYPE.white>
            <InternalLink
              to={`/stake-pool/${currencyId(currency0)}/${currencyId(currency1)}`}
              style={{ width: '100%' }}
            >
              <ButtonPrimary padding="8px" borderradius="8px">
                {isStaking ? 'Manage' : 'Deposit'}
              </ButtonPrimary>
            </InternalLink>
          </>
        )}
        {!isPair && (
          <>
            <CurrencyLogo currency={currency0} size="24px" />
            <TYPE.white fontWeight={600} fontSize={24} style={{ marginLeft: '8px' }}>
              {currency0.symbol}
            </TYPE.white>
            <InternalLink
              to={`/stake/${currencyId(currency0)}/${currencyId(rewardCurrency)}`}
              style={{ width: '100%' }}
            >
              <ButtonPrimary padding="8px" borderradius="8px">
                {isStaking ? 'Manage' : 'Deposit'}
              </ButtonPrimary>
            </InternalLink>
          </>
        )}
      </TopSection>

      <StatContainer>
        <RowBetween>
          <TYPE.white>Earn</TYPE.white>
          <HorizontalMerge>
            <TYPE.white style={{ marginRight: '8px' }}>{rewardCurrency.symbol}</TYPE.white>
            <CurrencyLogo currency={rewardCurrency} size="24px" />
          </HorizontalMerge>
        </RowBetween>
        {isStaking && (
          <RowBetween>
            <TYPE.white>Your Deposit value</TYPE.white>
            <TYPE.white>
              {`${stakingInfo.addressDepositStakedInUsd.toSignificant(4, { groupSeparator: ',' }) ??
                '-'} ${''} ${USD_LABEL}`}
              <TYPE.gray fontSize={14}>
                {`${stakingInfo.addressDepositStakedInWcurrency.toSignificant(4, { groupSeparator: ',' }) ?? '-'} ${
                  CURRENCY.symbol
                }`}
              </TYPE.gray>
            </TYPE.white>
          </RowBetween>
        )}
        <RowBetween>
          <TYPE.white>Total deposited</TYPE.white>
          <TYPE.white>
            {`${stakingInfo.totalPoolDepositsStakedInUsd.toSignificant(4, { groupSeparator: ',' }) ??
              '-'} ${''} ${USD_LABEL}`}
            <TYPE.gray fontSize={14}>
              {`${stakingInfo.totalStakedInWcurrency.toSignificant(4, { groupSeparator: ',' }) ?? '-'} ${
                CURRENCY.symbol
              }`}
            </TYPE.gray>
          </TYPE.white>
        </RowBetween>
        {/*
        <RowBetween>
          <TYPE.white> Pool rate </TYPE.white>
          <TYPE.white>{`${weeklyRewardAmount.toFixed(0, { groupSeparator: ',' })} ${
            stakingInfo?.rewardToken.symbol
          } / week`}</TYPE.white>
        </RowBetween>
 */}
        <RowBetween>
          <TYPE.white> Pool rate </TYPE.white>
          <TYPE.white>{`${yearlyRewardAmount.toFixed(0, { groupSeparator: ',' })} ${
            stakingInfo?.rewardToken.symbol
          } / week`}</TYPE.white>
        </RowBetween>

        <RowBetween>
          <TYPE.white> Current reward </TYPE.white>
          <TYPE.white>{`${weeklyRewardPerCURRENCY.toFixed(4, { groupSeparator: ',' }) ?? '-'} ${
            stakingInfo?.rewardToken.symbol
          } / Week per ${CURRENCY.symbol}`}</TYPE.white>
        </RowBetween>
      </StatContainer>
      {/*
      {autocompoundAvailable && (
        <MiddleSection>
          <RowBetween>
            <TYPE.white>Autocompounding available</TYPE.white>
            <StyledLogo src={YieldYakLogoWhite} alt="Yield Yak Logo" />
          </RowBetween>
        </MiddleSection>
      )} */}

      {isStaking && (
        <>
          <Break />
          <BottomSection showBackground={true}>
            <RowBetween>
              <TYPE.white fontWeight={500}>
                <span>Your rate</span>
                <span role="img" aria-label="wizard-icon" style={{ marginRight: '0.5rem' }}>
                  ⚡
                </span>
              </TYPE.white>
              <TYPE.white style={{ textAlign: 'right' }} fontWeight={500}>
                {`${stakingInfo.rewardRate?.multiply(`${secondsPerDay}`)?.toSignificant(10, { groupSeparator: ',' })} ${
                  stakingInfo?.rewardToken.symbol
                } / day`}
              </TYPE.white>
            </RowBetween>
            <RowBetween>
              <TYPE.white fontWeight={500}></TYPE.white>
              <TYPE.white style={{ textAlign: 'right' }} fontWeight={500}>
                {`${stakingInfo.rewardRate
                  ?.multiply(`${secondsPerWeek}`)
                  ?.toSignificant(10, { groupSeparator: ',' })} ${stakingInfo?.rewardToken.symbol} / week`}
              </TYPE.white>
            </RowBetween>
            <RowBetween>
              <TYPE.white fontWeight={500}></TYPE.white>
              <TYPE.white style={{ textAlign: 'right' }} fontWeight={500}>
                {`${stakingInfo.rewardRate
                  ?.multiply(`${secondsPerYear}`)
                  ?.toSignificant(10, { groupSeparator: ',' })} ${stakingInfo?.rewardToken.symbol} / year`}
              </TYPE.white>
            </RowBetween>
          </BottomSection>
        </>
      )}
    </Wrapper>
  )
}
