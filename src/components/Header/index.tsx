import { ChainId, ChainLabel, TokenAmount, CURRENCY } from '@swapi-finance/sdk-local'

import React, { useState } from 'react'
import { Text } from 'rebass'
import { NavLink } from 'react-router-dom'
import { darken } from 'polished'
import { useTranslation } from 'react-i18next'

import styled from 'styled-components'

// import Logo from '../../assets/svg/icon.svg'
// import LogoDark from '../../assets/svg/icon.svg'
import bannerLogo from '../../assets/images/apidaeSwap-banner.png'
import { useActiveWeb3React } from '../../hooks'
// import { useDarkModeManager } from '../../state/user/hooks'
import { useETHBalances, useAggregateBagBalance } from '../../state/wallet/hooks'
import { CardNoise } from '../pool/styled'
import { CountUp } from 'use-count-up'
import { TYPE /* , ExternalLink */ } from '../../theme'

// import { RedCard } from '../Card'
import { PolygonNetworkCard } from '../Card'

import Settings from '../Settings'
import Menu from '../Menu'

import Row, { RowFixed } from '../Row'
import Web3Status from '../Web3Status'
import Modal from '../Modal'
import TokenBalanceContent from './TokenBalanceContent'
import usePrevious from '../../hooks/usePrevious'
// import { ANALYTICS_PAGE , BRIDGE_PAGE } from '../../constants'
// import { BAG } from '../../constants'
import { SELF_TOKEN } from '../../constants'
import { MEDIA_WIDTHS } from '../../theme'

const HeaderFrame = styled.div`
  display: grid;
  grid-template-columns: 1fr 120px;
  align-items: center;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  width: 100%;
  background-color: ${({ theme }) => theme.bg6};
  top: 0;
  position: relative;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding: 1rem;
  z-index: 2;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    grid-template-columns: 1fr;
    padding: 0 1rem;
    width: calc(100%);
    position: relative;
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
        padding: 0.5rem 1rem;
  `}
`

// const HeaderControls = styled.div`
//   display: flex;
//   flex-direction: row;
//   align-items: center;
//   justify-self: flex-end;
//   ${({ theme }) => theme.mediaWidth.upToMedium`
//     flex-direction: row;
//     justify-content: space-between;
//     justify-self: center;
//     width: 100%;
//     max-width: 960px;
//     padding: 1rem;
//     position: fixed;
//     bottom: 0px;
//     left: 0px;
//     width: 100%;
//     z-index: 99;
//     height: 72px;
//     border-radius: 12px 12px 0 0;
//     background-color: ${({ theme }) => theme.bg1};
//   `};
// `

const HeaderControls = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-self: flex-end;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    flex-direction: row;
    justify-content: space-between;
    justify-self: center;
    width: 100%;
    max-width: ${MEDIA_WIDTHS.upToMedium};
    padding: 1rem;
    position: fixed;
    bottom: 0px;
    left: 0px;
    width: 100%;
    z-index: 99;
    height: 72px;
    border-radius: 12px 12px 0 0;
    background-color: ${({ theme }) => theme.bg1};
  `};
`

const HeaderElement = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  ${({ theme }) => theme.mediaWidth.upToMedium`
   flex-direction: row-reverse;
    align-items: center;
  `};
`

const HeaderElementWrap = styled.div`
  display: flex;
  align-items: center;
`

const HeaderRow = styled(RowFixed)`
  ${({ theme }) => theme.mediaWidth.upToMedium`
   width: 100%;
  `};
`

const HeaderLinks = styled(Row)`
  justify-content: center;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 1rem 0 1rem 1rem;
    justify-content: flex-end;
`};
`

const AccountElement = styled.div<{ active: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  color: ${({ theme }) => theme.text2};
  background-color: ${({ theme, active }) => (!active ? theme.bg1 : theme.bg3)};
  border-radius: 12px;
  white-space: nowrap;
  width: 100%;
  cursor: pointer;

  :focus {
    border: 1px solid blue;
  }
  /* :hover {
    background-color: ${({ theme, active }) => (!active ? theme.bg2 : theme.bg4)};
  } */
`

// const TokenAmountStyle = styled(AccountElement)`
//   color: white;
//   padding: 4px 8px;
//   height: 36px;
//   font-weight: 500;
//   background-color: ${({ theme }) => theme.bg3};
//   background: radial-gradient(174.47% 188.91% at 1.84% 0%, #e8c177 0%, #ecd0a3 100%), #edeef2;
// `
const TokenAmountStyle = styled(AccountElement)`
  color: ${({ theme }) => theme.text2};
  padding: 4px 8px;
  height: 36px;
  font-weight: 500;
  background-color: ${({ theme }) => theme.bg3};
`
const TokenWrapper = styled.span`
  width: fit-content;
  position: relative;
  cursor: pointer;
  :hover {
    opacity: 0.8;
  }
  :active {
    opacity: 0.9;
  }
`

const HideSmall = styled.span`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: none;
  `};
`

const NetworkCard = styled(PolygonNetworkCard)`
  border-radius: 12px;
  padding: 8px 12px;
  text-align: center;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin: 0;
    margin-right: 0.5rem;
    width: initial;
    overflow: hidden;
    text-overflow: ellipsis;
    flex-shrink: 1;
  `};
`

const BalanceText = styled(Text)`
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: none;
  `};
`

// const Title = styled.a`
//   display: flex;
//   align-items: center;
//   pointer-events: auto;
//   justify-self: flex-start;
//   margin-right: 12px;
//   ${({ theme }) => theme.mediaWidth.upToSmall`
//     justify-self: center;
//   `};
//   :hover {
//     cursor: pointer;
//   }
// `

const Title = styled.a`
  display: flex;
  align-items: center;
  pointer-events: auto;
  margin-top: 0.5rem;
  justify-self: flex-start;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    justify-self: center;
  `};
  :hover {
    cursor: pointer;
  }
`

const TokenIcon = styled.div`
  transition: transform 0.3s ease;
  :hover {
    transform: rotate(-5deg);
  }
`

const activeClassName = 'ACTIVE'

const StyledNavLink = styled(NavLink).attrs({
  activeClassName
})`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: left;
  border-radius: 3rem;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text2};
  font-size: 1rem;
  width: fit-content;
  margin: 0 12px;
  font-weight: 500;

  &.${activeClassName} {
    border-radius: 12px;
    font-weight: 800;
    color: ${({ theme }) => theme.text1};
  }

  :hover,
  :focus {
    color: ${({ theme }) => darken(0.1, theme.text1)};
  }
`
/*
const StyledExternalLink = styled(ExternalLink).attrs({
  activeClassName
})<{ isActive?: boolean }>`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: left;
  border-radius: 3rem;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text2};
  font-size: 1rem;
  width: fit-content;
  margin: 0 12px;
  font-weight: 500;
  &.${activeClassName} {
    border-radius: 12px;
    font-weight: 600;
    color: ${({ theme }) => theme.text1};
  }
  :hover,
  :focus {
    text-decoration: none;
    color: ${({ theme }) => darken(0.1, theme.text1)};
  }
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
      display: none;
`}
`
*/
const NETWORK_LABELS: { [chainId in ChainId]?: string } = {
  [ChainId.MUMBAI]: ChainLabel[ChainId.MUMBAI],
  [ChainId.POLYGON]: ChainLabel[ChainId.POLYGON]
}

export default function Header() {
  const { account, chainId } = useActiveWeb3React()
  const { t } = useTranslation()

  const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']
  // const [isDark] = useDarkModeManager()

  const aggregateBalance: TokenAmount | undefined = useAggregateBagBalance()

  const [showBagBalanceModal, setShowTokenBalanceModal] = useState(false)

  const countUpValue = aggregateBalance?.toFixed(0) ?? '0'
  const countUpValuePrevious = usePrevious(countUpValue) ?? '0'

  return (
    <HeaderFrame>
      <Modal isOpen={showBagBalanceModal} onDismiss={() => setShowTokenBalanceModal(false)}>
        <TokenBalanceContent setShowTokenBalanceModal={setShowTokenBalanceModal} />
      </Modal>
      <HeaderRow>
        <Title href=".">
          <TokenIcon>
            {/* <img width={'24px'} src={isDark ? LogoDark : Logo} alt="logo" /> */}
            <img height={'48px'} style={{ margin: 2 }} src={bannerLogo} alt="logo" />
          </TokenIcon>
        </Title>
        <HeaderLinks>
          <StyledNavLink id={`swap-nav-link`} to={'/swap'}>
            {t('swap')}
          </StyledNavLink>
          <StyledNavLink
            id={`pool-nav-link`}
            to={'/pool'}
            isActive={(match, { pathname }) =>
              Boolean(match) ||
              pathname.startsWith('/add') ||
              pathname.startsWith('/remove') ||
              pathname.startsWith('/create') ||
              pathname.startsWith('/find')
            }
          >
            {t('pool')}
          </StyledNavLink>
          {/* 
          <StyledNavLink id={`stake-nav-link`} to={'/mill'}>
            Mill
          </StyledNavLink>
 */}
          <StyledNavLink id={`stake-nav-link`} to={'/stake-farm'}>
            Farm
          </StyledNavLink>
          {/*
          <StyledNavLink id={`stake-nav-link`} to={'/oven'}>
            Oven
          </StyledNavLink>
 */}
          {/*
          <StyledExternalLink id={`info-nav-link`} href={ANALYTICS_PAGE}>
            Analytics <span style={{ fontSize: '11px' }}>↗</span>
          </StyledExternalLink>
          */}
          {/*
          <StyledExternalLink id={`info-nav-link`} href={BRIDGE_PAGE}>
            Bridge <span style={{ fontSize: '11px' }}>↗</span>
          </StyledExternalLink>
          */}
        </HeaderLinks>
      </HeaderRow>
      <HeaderControls>
        <HeaderElement>
          <HideSmall>
            {chainId && NETWORK_LABELS[chainId] && (
              <NetworkCard title={NETWORK_LABELS[chainId]}>{NETWORK_LABELS[chainId]}</NetworkCard>
            )}
          </HideSmall>
          {aggregateBalance && (
            <TokenWrapper onClick={() => setShowTokenBalanceModal(true)}>
              <TokenAmountStyle active={!!account} style={{ pointerEvents: 'auto' }}>
                {account && (
                  <HideSmall>
                    <TYPE.black
                      style={{
                        paddingRight: '.4rem'
                      }}
                    >
                      <CountUp
                        key={countUpValue}
                        isCounting
                        start={parseFloat(countUpValuePrevious)}
                        end={parseFloat(countUpValue)}
                        thousandsSeparator={','}
                        duration={1}
                      />
                    </TYPE.black>
                  </HideSmall>
                )}
                {/* BAG */}
                {SELF_TOKEN[chainId ? chainId : ChainId.POLYGON].symbol}
              </TokenAmountStyle>
              <CardNoise />
            </TokenWrapper>
          )}
          <AccountElement active={!!account} style={{ pointerEvents: 'auto' }}>
            {account && userEthBalance ? (
              <BalanceText style={{ flexShrink: 0 }} pl="0.75rem" pr="0.5rem" fontWeight={500}>
                {/* {userEthBalance?.toSignificant(4)} AVAX */}
                {userEthBalance?.toSignificant(4)} {CURRENCY.symbol}
              </BalanceText>
            ) : null}
            <Web3Status />
          </AccountElement>
        </HeaderElement>
        <HeaderElementWrap>
          <Settings />
          <Menu />
        </HeaderElementWrap>
      </HeaderControls>
    </HeaderFrame>
  )
}
