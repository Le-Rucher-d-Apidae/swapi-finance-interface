// import { ChainId, TokenAmount, WAVAX, JSBI } from '@swapi-finance/sdk-local'
// import { ChainId, TokenAmount, WAVAX, JSBI } from '@swapi-finance/sdk-local'
import { ChainId, TokenAmount, CMATIC, WMATIC, JSBI } from '@swapi-finance/sdk-local'
import React, { useState, useEffect } from 'react'
import { X } from 'react-feather'
import styled from 'styled-components'
import tokenLogo from '../../assets/images/token-logo.png'
import { /* BAG */ APD } from '../../constants'
import { useTotalSupply } from '../../data/TotalSupply'
import { useActiveWeb3React } from '../../hooks'
import { useAggregateBagBalance, useTokenBalance } from '../../state/wallet/hooks'
import { TYPE, BagTokenAnimated } from '../../theme'
import { computeBagCirculation } from '../../utils/computeBagCirculation'
import { AutoColumn } from '../Column'
import { RowBetween } from '../Row'
import { Break, CardBGImage, CardNoise, CardSection, DataCard } from '../pool/styled'
import { usePair } from '../../data/Reserves'

const ContentWrapper = styled(AutoColumn)`
  width: 100%;
`

const ModalUpper = styled(DataCard)`
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  background: radial-gradient(76.02% 75.41% at 1.84% 0%, #e8c177 0%, #ecd0a3 100%);
  padding: 0.5rem;
`

const StyledClose = styled(X)`
  position: absolute;
  right: 16px;
  top: 16px;

  :hover {
    cursor: pointer;
  }
`

/**
 * Content for balance stats modal
 */
export default function TokenBalanceContent({ setShowTokenBalanceModal }: { setShowTokenBalanceModal: any }) {
  const { account, chainId } = useActiveWeb3React()
  const [circulatingSupply, setCirculatingSupply] = useState<TokenAmount>()
  // const bag = chainId ? BAG[chainId] : undefined
  const apt = chainId ? APD[chainId] : undefined

  const total = useAggregateBagBalance()
  const bagBalance: TokenAmount | undefined = useTokenBalance(account ?? undefined, /* bag */ apt)
  const totalSupply: TokenAmount | undefined = useTotalSupply(/* bag */ apt)

  // useEffect(() => {
  // 	bag && chainId === ChainId.AVALANCHE
  // 		? computeBagCirculation(bag)
  // 			.then(circulating => {
  // 				setCirculatingSupply(circulating)
  // 			})
  // 		: setCirculatingSupply(totalSupply)
  // }, [bag, chainId, totalSupply])
  useEffect(() => {
    /* bag */ apt && chainId === ChainId.POLYGON
      ? computeBagCirculation(/* bag */ apt).then(circulating => {
          setCirculatingSupply(circulating)
        })
      : setCirculatingSupply(totalSupply)
  }, [/* bag */ apt, chainId, totalSupply])

  // TODO: Determine APD price in MATIC
  // TODO: Determine APD price in MATIC
  // TODO: Determine APD price in MATIC
  // TODO: Determine APD price in MATIC
  // TODO: Determine APD price in MATIC
  // Determine BAG price in AVAX
  // const wavax = WAVAX[chainId ? chainId : 43114]
  const wmatic = WMATIC[chainId ? chainId : ChainId.POLYGON]
  // const [, avaxBagTokenPair] = usePair(wmatic, bag)
  const [, maticBagTokenPair] = usePair(wmatic, /* bag */ apt)
  const oneToken = JSBI.BigInt(1_000_000_000_000_000_000) // 10^18
  // let bagPrice: Number | undefined
  let tokenPrice: number | undefined
  // if (avaxBagTokenPair && bag) {
  if (maticBagTokenPair && apt) {
    // const avaxBagRatio = JSBI.divide(
    const maticTokenRatio = JSBI.divide(
      // JSBI.multiply(oneToken, avaxBagTokenPair.reserveOf(wmatic).raw),
      JSBI.multiply(oneToken, maticBagTokenPair.reserveOf(wmatic).raw),
      // avaxBagTokenPair.reserveOf(bag).raw
      maticBagTokenPair.reserveOf(apt).raw
    )
    // bagPrice = JSBI.toNumber(avaxBagRatio) / 1_000_000_000_000_000_000 // 10^18
    tokenPrice = JSBI.toNumber(maticTokenRatio) / 1_000_000_000_000_000_000 // 10^18
  }

  return (
    <ContentWrapper gap="lg">
      <ModalUpper>
        <CardBGImage />
        <CardNoise />
        <CardSection gap="md">
          <RowBetween>
            <TYPE.white color="white">
              {/* Your BAG Breakdown */}
              Your {APD[chainId ? chainId : ChainId.POLYGON].symbol} Breakdown
            </TYPE.white>
            <StyledClose stroke="white" onClick={() => setShowTokenBalanceModal(false)} />
          </RowBetween>
        </CardSection>
        <Break />
        {account && (
          <>
            <CardSection gap="sm">
              <AutoColumn gap="md" justify="center">
                <BagTokenAnimated width="48px" src={tokenLogo} />{' '}
                <TYPE.white fontSize={48} fontWeight={600} color="white">
                  {total?.toFixed(2, { groupSeparator: ',' })}
                </TYPE.white>
              </AutoColumn>
              <AutoColumn gap="md">
                <RowBetween>
                  <TYPE.white color="white">Balance:</TYPE.white>
                  <TYPE.white color="white">{bagBalance?.toFixed(2, { groupSeparator: ',' })}</TYPE.white>
                </RowBetween>
              </AutoColumn>
            </CardSection>
            <Break />
          </>
        )}
        <CardSection gap="sm">
          <AutoColumn gap="md">
            <RowBetween>
              <TYPE.white color="white">
                {/* BAG price: */}
                {APD[chainId ? chainId : ChainId.POLYGON].symbol} price:
              </TYPE.white>
              {/* <TYPE.white color="white">{bagPrice?.toFixed(5) ?? '-'} AVAX</TYPE.white> */}
              <TYPE.white color="white">
                {/* {bagPrice?.toFixed(5) ?? '-'} {CMATIC.symbol} */}
                {tokenPrice?.toFixed(5) ?? '-'} {CMATIC.symbol}
              </TYPE.white>
            </RowBetween>
            <RowBetween>
              <TYPE.white color="white">
                {/* BAG in circulation: */}
                {APD[chainId ? chainId : ChainId.POLYGON].symbol} in circulation:
              </TYPE.white>
              <TYPE.white color="white">{circulatingSupply?.toFixed(0, { groupSeparator: ',' })}</TYPE.white>
            </RowBetween>
            <RowBetween>
              <TYPE.white color="white">Total Supply</TYPE.white>
              <TYPE.white color="white">{totalSupply?.toFixed(0, { groupSeparator: ',' })}</TYPE.white>
            </RowBetween>
          </AutoColumn>
        </CardSection>
      </ModalUpper>
    </ContentWrapper>
  )
}
