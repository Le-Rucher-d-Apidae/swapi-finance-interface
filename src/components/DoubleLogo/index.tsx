import { CURRENCY, Currency, WMATIC } from '@swapi-finance/sdk-local'
import React from 'react'
import styled from 'styled-components'
import CurrencyLogo from '../CurrencyLogo'
import { useActiveWeb3React } from '../../hooks'

const Wrapper = styled.div<{ margin: boolean; sizeraw: number }>`
  position: relative;
  display: flex;
  flex-direction: row;
  margin-right: ${({ sizeraw, margin }) => margin && (sizeraw / 3 + 8).toString() + 'px'};
`

interface DoubleCurrencyLogoProps {
  margin?: boolean
  size?: number
  currency0?: Currency
  currency1?: Currency
  // chainId?: ChainId
}

const HigherLogo = styled(CurrencyLogo)`
  z-index: 2;
`
const CoveredLogo = styled(CurrencyLogo)<{ sizeraw: number }>`
  position: absolute;
  left: ${({ sizeraw }) => '-' + (sizeraw / 2).toString() + 'px'} !important;
`

export default function DoubleCurrencyLogo({
  currency0,
  currency1,
  size = 16,
  margin = false // , chainId
}: DoubleCurrencyLogoProps) {
  const { chainId } = useActiveWeb3React()
  // Switch to (W)Currency
  const currency0_ = (chainId && CURRENCY === currency0 ? WMATIC[chainId] : currency0) as Currency
  const currency1_ = (chainId && CURRENCY === currency1 ? WMATIC[chainId] : currency1) as Currency
  // if (currency0 === CURRENCY) {
  //   console.log('currency0 is CURRENCY currency0_ is')
  //   console.dir(currency0_)
  // }
  // if (currency1 == CURRENCY) {
  //   console.log('currency1 is CURRENCY currency1_ is')
  //   console.dir(currency1_)
  // }
  return (
    <Wrapper sizeraw={size} margin={margin}>
      {currency0 && <HigherLogo currency={currency0_} size={size.toString() + 'px'} />}
      {currency1 && <CoveredLogo currency={currency1_} size={size.toString() + 'px'} sizeraw={size} />}
    </Wrapper>
  )
}
