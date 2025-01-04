import { ChainId, TokenAmount, CURRENCY, WCURRENCY, JSBI } from '@swapi-finance/sdk'
import React, { useContext } from 'react'
import { X } from 'react-feather'
import styled, { ThemeContext } from 'styled-components'
import tokenLogo from '../../assets/images/token-logo.png'
import { oneToken18, oneToken18JSBI, SELF_TOKEN, USD_LABEL, USDC } from '../../constants'
import { useTotalSupply } from '../../data/TotalSupply'
import { useActiveWeb3React } from '../../hooks'
import { useAggregateSelfTokenBalance, useTokenBalance } from '../../state/wallet/hooks'
import { TYPE, BagTokenAnimated } from '../../theme'
// import { computeSelfTokenCirculation } from '../../utils/computeSelfTokenCirculation'
import { AutoColumn } from '../Column'
import { RowBetween } from '../Row'
import { Break, CardBGImage, CardNoise, CardSection, DataCard } from '../pool/styled'
import { usePair } from '../../data/Reserves'
import { Color } from '../../theme/styled'

const ContentWrapper = styled(AutoColumn)`
  width: 100%;
`
const ModalUpper = styled(DataCard)`
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.accountModalBorder};
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  padding: 0.5rem;
`

const StyledClose = styled(X)<{ color?: Color }>`
  cursor: pointer;
  position: absolute;
  right: 16px;
  top: 16px;
  color: ${({ color, theme }) => (color ? color : theme.buttonClosePopup)};
  :hover {
    transform: scale(1.1);
    opacity: 0.6;
  }
`

/**
 * Content for balance stats modal
 */
export default function TokenBalanceContent({ setShowTokenBalanceModal }: { setShowTokenBalanceModal: any }) {
  const { account, chainId } = useActiveWeb3React()
  const CHAINID = chainId ? chainId : ChainId.POLYGON
  const theme = useContext(ThemeContext)
  const selfToken = chainId ? SELF_TOKEN[chainId] : SELF_TOKEN[ChainId.POLYGON]

  const total = useAggregateSelfTokenBalance()
  const selfTokenBalance: TokenAmount | undefined = useTokenBalance(account ?? undefined, selfToken)
  const treasuryAccoutTokenBalance: TokenAmount | undefined = useTokenBalance(
    `${process.env.REACT_APP_TREASURY_ACCOUNT}` ?? undefined,
    selfToken
  )

  const totalSupply: TokenAmount | undefined = useTotalSupply(selfToken)

  const wcurrency = WCURRENCY[CHAINID]
  const [currencySelfTokenTokenPairState, currencySelfTokenTokenPair] = usePair(wcurrency, selfToken)
  let tokenPriceInCurrency: number | undefined
  if (currencySelfTokenTokenPairState && currencySelfTokenTokenPair && selfToken) {
    const currencySelfTokenRatio = JSBI.divide(
      JSBI.multiply(oneToken18JSBI, currencySelfTokenTokenPair.reserveOf(wcurrency).raw),
      currencySelfTokenTokenPair.reserveOf(selfToken).raw
    )
    tokenPriceInCurrency = JSBI.toNumber(currencySelfTokenRatio) / oneToken18 // 10^18
  }

  const usdToken = USDC[CHAINID] // USD Token in use ; WCurrency / USD token pair must exist to be able to calculate price !
  const [currencyUSDTokenPairState, currencyUSDTokenPair] = usePair(wcurrency, usdToken)

  let tokenPriceInUSD: number | undefined
  if (currencyUSDTokenPairState && currencyUSDTokenPair && selfToken) {
    const currencyUSDTokenRatio = JSBI.divide(
      JSBI.multiply(oneToken18JSBI, currencyUSDTokenPair.reserveOf(usdToken).raw),
      currencyUSDTokenPair.reserveOf(wcurrency).raw
    )
    if (tokenPriceInCurrency) tokenPriceInUSD = (tokenPriceInCurrency * JSBI.toNumber(currencyUSDTokenRatio)) / 1e6
  }

  return (
    <ContentWrapper gap="lg">
      <ModalUpper>
        <CardBGImage desaturate={true} />
        <CardNoise />
        <CardSection gap="md">
          <RowBetween>
            <TYPE.text5>Your {SELF_TOKEN[chainId ? chainId : ChainId.POLYGON].symbol} Breakdown</TYPE.text5>
            <StyledClose color={theme.buttonCloseDarkPopup} onClick={() => setShowTokenBalanceModal(false)} />
          </RowBetween>
        </CardSection>
        <Break />
        {account && (
          <>
            <CardSection gap="sm">
              <AutoColumn gap="md" justify="center">
                <BagTokenAnimated width="48px" src={tokenLogo} />{' '}
                <TYPE.text5 fontSize={48} fontWeight={600}>
                  {total?.toFixed(2, { groupSeparator: ',' })}
                </TYPE.text5>
              </AutoColumn>
              <AutoColumn gap="md">
                <RowBetween>
                  <TYPE.text5>Balance:</TYPE.text5>
                  <TYPE.text5>{selfTokenBalance?.toFixed(2, { groupSeparator: ',' })}</TYPE.text5>
                </RowBetween>
              </AutoColumn>
            </CardSection>
            <Break />
          </>
        )}
        <CardSection gap="sm">
          <AutoColumn gap="md">
            <RowBetween>
              <TYPE.text5>{SELF_TOKEN[chainId ? chainId : ChainId.POLYGON].symbol} price:</TYPE.text5>
              <TYPE.text5>
                {tokenPriceInCurrency?.toFixed(5) ?? '-'} {CURRENCY.symbol}
              </TYPE.text5>
            </RowBetween>
            <RowBetween>
              <TYPE.text5>{SELF_TOKEN[chainId ? chainId : ChainId.POLYGON].symbol} price:</TYPE.text5>
              <TYPE.text5>
                {tokenPriceInUSD?.toFixed(5) ?? '-'} {USD_LABEL}
              </TYPE.text5>
            </RowBetween>
            <RowBetween>
              <TYPE.text5>{SELF_TOKEN[chainId ? chainId : ChainId.POLYGON].symbol} in circulation:</TYPE.text5>
              <TYPE.text5>
                {totalSupply
                  ?.subtract(treasuryAccoutTokenBalance ?? new TokenAmount(selfToken, '0'))
                  .toFixed(0, { groupSeparator: ',' })}
              </TYPE.text5>
            </RowBetween>
            <RowBetween>
              <TYPE.text5>Total Supply</TYPE.text5>
              <TYPE.text5>{totalSupply?.toFixed(0, { groupSeparator: ',' })}</TYPE.text5>
            </RowBetween>
          </AutoColumn>
        </CardSection>
      </ModalUpper>
    </ContentWrapper>
  )
}
