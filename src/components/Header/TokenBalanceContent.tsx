// import { ChainId, TokenAmount, WAVAX, JSBI } from '@swapi-finance/sdk-local'
import { ChainId, TokenAmount, CURRENCY, WCURRENCY, JSBI } from '@swapi-finance/sdk-local'
// import React, { useState, useEffect } from 'react'
import React, { useState } from 'react'
import { useEffect } from 'react'
// import { useMemo } from 'react'
import { X } from 'react-feather'
import styled from 'styled-components'
import tokenLogo from '../../assets/images/token-logo.png'
// import { BAG } from '../../constants'
import { SELF_TOKEN } from '../../constants'
import { useTotalSupply } from '../../data/TotalSupply'
import { useActiveWeb3React } from '../../hooks'
// import { useAggregateBagBalance, useTokenBalance } from '../../state/wallet/hooks'
import { useTokenBalance } from '../../state/wallet/hooks'
import { TYPE, BagTokenAnimated } from '../../theme'
// import { computeBagCirculation } from '../../utils/computeBagCirculation'
import { computeBagCirculation } from '../../utils/computeBagCirculation'
import { AutoColumn } from '../Column'
import { RowBetween } from '../Row'
import { Break, CardBGImage, CardNoise, CardSection, DataCard } from '../pool/styled'
import { usePair } from '../../data/Reserves'

const ContentWrapper = styled(AutoColumn)`
  width: 100%;
`

// const ModalUpper = styled(DataCard)`
//   box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
//   background: radial-gradient(76.02% 75.41% at 1.84% 0%, #e8c177 0%, #ecd0a3 100%);
//   padding: 0.5rem;
// `
const ModalUpper = styled(DataCard)`
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  padding: 0.5rem;
`

const StyledClose = styled(X)`
  cursor: pointer;
  position: absolute;
  right: 16px;
  top: 16px;
  color: ${({ theme }) => theme.buttonClosePopup};
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
  const selfToken = chainId ? SELF_TOKEN[chainId] : SELF_TOKEN[ChainId.POLYGON]
  // const defaultTokenAmount = new TokenAmount(apd, JSBI.BigInt(0))
  // const [circulatingSupply, setCirculatingSupply] = useState<TokenAmount>()
  const [circulatingSupply, setCirculatingSupply] = useState<TokenAmount>()
  // const [circulatingSupply /* , setCirculatingSupply */] = useState<TokenAmount>()
  // const [circulatingSupply /* , setCirculatingSupply */] = useState<TokenAmount>(defaultTokenAmount)
  // const bag = chainId ? BAG[chainId] : undefined
  // const apd = chainId ? SELF_TOKEN[chainId] : SELF_TOKEN[ChainId.POLYGON]
  // const defaultTokenAmount = new TokenAmount(apd, JSBI.BigInt(0))
  // console.log('TokenBalanceContent apd=', apd)
  // console.dir(apd)
  // const total = useAggregateBagBalance()
  const total = selfToken
    ? new TokenAmount(selfToken, JSBI.BigInt(0))
    : new TokenAmount(SELF_TOKEN[ChainId.POLYGON], JSBI.BigInt(0)) // useAggregateBagBalance()
  // console.log('TokenBalanceContent total=', total)
  // console.dir(total)
  const selfTokenBalance: TokenAmount | undefined = useTokenBalance(account ?? undefined, /* bag */ selfToken)

  const totalSupply: TokenAmount | undefined = useTotalSupply(/* bag */ selfToken)
  // const totalSupply_: TokenAmount | undefined = useTotalSupply(/* bag */ apd)
  // console.log('TokenBalanceContent totalSupply_=', totalSupply_)
  // const totalSupply = useMemo(() => {
  //   if (apd) {
  //     if (totalSupply_) {
  //       return totalSupply_
  //     }
  //     // return new TokenAmount(apd, JSBI.BigInt(0))
  //   }
  //   return totalSupply_
  // }, [apd])

  // useEffect(() => {
  // 	bag && chainId === ChainId.AVALANCHE
  // 		? computeBagCirculation(bag)
  // 			.then(circulating => {
  // 				setCirculatingSupply(circulating)
  // 			})
  // 		: setCirculatingSupply(totalSupply)
  // }, [bag, chainId, totalSupply])
  /*
  useEffect(() => {
    if (apd && chainId === ChainId.POLYGON) {
      computeBagCirculation(apd).then(circulating => {
        // setCirculatingSupply(circulating)
        console.log('TODO: IF setCirculatingSupply circulating=', circulating)
      })
    } else {
      console.log('TODO: ELSE setCirculatingSupply totalSupply=', totalSupply)
      // setCirculatingSupply(undefined)
      setCirculatingSupply(new TokenAmount(SELF_TOKEN[ChainId.POLYGON], JSBI.BigInt(0)))
      // totalSupply && setCirculatingSupply(totalSupply)
    }
    // debugger
  }, [apd, chainId, totalSupply])
*/
  useEffect(() => {
    if (selfToken && chainId === ChainId.POLYGON) {
      computeBagCirculation(selfToken).then(circulating => {
        setCirculatingSupply(circulating)
        // console.log('TODO: IF setCirculatingSupply circulating=', circulating)
      })
    } else {
      // console.log('TODO: ELSE setCirculatingSupply totalSupply=', totalSupply)
      // setCirculatingSupply(undefined)
      // setCirculatingSupply(new TokenAmount(SELF_TOKEN[ChainId.POLYGON], JSBI.BigInt(0)))
      // totalSupply && setCirculatingSupply(totalSupply)
      // avoid loop: set CirculatingSupply if not already set
      !circulatingSupply && totalSupply && setCirculatingSupply(totalSupply)
      // console.debug(`apd=${chainId}, chainId=${chainId}, totalSupply=${totalSupply}`)
    }
    // debugger
  }, [selfToken, chainId, totalSupply, circulatingSupply])

  // TODO: Determine SELF_TOKEN price in WCURRENCY
  // TODO: Determine SELF_TOKEN price in WCURRENCY
  // TODO: Determine SELF_TOKEN price in WCURRENCY
  // TODO: Determine SELF_TOKEN price in WCURRENCY
  // TODO: Determine SELF_TOKEN price in WCURRENCY
  // Determine BAG price in AVAX
  // const wavax = WAVAX[chainId ? chainId : 43114]
  const wcurrency = WCURRENCY[chainId ? chainId : ChainId.POLYGON]
  // const [, avaxBagTokenPair] = usePair(wmatic, bag)
  const [, currencySelfTokenTokenPair] = usePair(wcurrency, /* bag */ selfToken)
  const oneToken = JSBI.BigInt(1_000_000_000_000_000_000) // 10^18
  // let bagPrice: Number | undefined
  let tokenPrice: number | undefined
  // if (avaxBagTokenPair && bag) {
  if (currencySelfTokenTokenPair && selfToken) {
    // const avaxBagRatio = JSBI.divide(
    const currencySelfTokenRatio = JSBI.divide(
      // JSBI.multiply(oneToken, avaxBagTokenPair.reserveOf(wmatic).raw),
      JSBI.multiply(oneToken, currencySelfTokenTokenPair.reserveOf(wcurrency).raw),
      // avaxBagTokenPair.reserveOf(bag).raw
      currencySelfTokenTokenPair.reserveOf(selfToken).raw
    )
    // bagPrice = JSBI.toNumber(avaxBagRatio) / 1_000_000_000_000_000_000 // 10^18
    tokenPrice = JSBI.toNumber(currencySelfTokenRatio) / 1_000_000_000_000_000_000 // 10^18
  }

  return (
    <ContentWrapper gap="lg">
      <ModalUpper>
        <CardBGImage desaturate={true} />
        <CardNoise />
        <CardSection gap="md">
          <RowBetween>
            <TYPE.text5>
              {/* Your BAG Breakdown */}
              Your {SELF_TOKEN[chainId ? chainId : ChainId.POLYGON].symbol} Breakdown
            </TYPE.text5>
            <StyledClose onClick={() => setShowTokenBalanceModal(false)} />
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
              <TYPE.text5>
                {/* BAG price: */}
                {SELF_TOKEN[chainId ? chainId : ChainId.POLYGON].symbol} price:
              </TYPE.text5>
              {/* <TYPE.white>{bagPrice?.toFixed(5) ?? '-'} AVAX</TYPE.white> */}
              <TYPE.text5>
                {/* {bagPrice?.toFixed(5) ?? '-'} {CURRENCY.symbol} */}
                {tokenPrice?.toFixed(5) ?? '-'} {CURRENCY.symbol}
              </TYPE.text5>
            </RowBetween>
            <RowBetween>
              <TYPE.text5>
                {/* BAG in circulation: */}
                {SELF_TOKEN[chainId ? chainId : ChainId.POLYGON].symbol} in circulation:
              </TYPE.text5>
              <TYPE.text5>{circulatingSupply?.toFixed(0, { groupSeparator: ',' })}</TYPE.text5>
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
