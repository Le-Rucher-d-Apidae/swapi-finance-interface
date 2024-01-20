// import { Currency, CAVAX, Token, ChainId } from '@swapi-finance/sdk-local'
import { Currency, CMATIC, Token, ChainId } from '@swapi-finance/sdk-local'
import React, { useMemo } from 'react'
import styled from 'styled-components'

// import AvaxLogo from '../../assets/images/avalanche_token_round.png'
import PolygonLogo from '../../assets/images/polygon_token_round.png'
import useHttpLocations from '../../hooks/useHttpLocations'
import { WrappedTokenInfo } from '../../state/lists/hooks'
import Logo from '../Logo'
import { /* BAG */ MAIN_TOKEN } from '../../constants'

// const getTokenLogoURL = (address: string) =>
//   address === BAG[ChainId.AVALANCHE].address
//   ? `https://raw.githubusercontent.com/baguette-exchange/contracts/main/tokenlist/logos/baguette.png`
//   : `https://raw.githubusercontent.com/pangolindex/tokens/main/assets/${address}/logo.png`

const getTokenLogoURL = (address: string) =>
  // address === BAG[ChainId.POLYGON].address
  address === MAIN_TOKEN[ChainId.POLYGON].address
    ? `https://raw.githubusercontent.com/Le-Rucher-d-Apidae/swapi-finance-contracts/main/tokenlist/logos/apidae.png` // `https://raw.githubusercontent.com/baguette-exchange/contracts/main/tokenlist/logos/baguette.png` // TODO: update this : change to APIDAE logo */
    : `https://raw.githubusercontent.com/trustwallet/assets/main/blockchains/polygon/assets/${address}/logo.png` // `https://raw.githubusercontent.com/pangolindex/tokens/main/assets/${address}/logo.png` // TODO: update this
// alternatives: https://github.com/dappradar/tokens/tree/main/polygon

const StyledEthereumLogo = styled.img<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
  border-radius: 24px;
`

const StyledLogo = styled(Logo)<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  border-radius: ${({ size }) => size};
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
`

export default function CurrencyLogo({
  currency,
  size = '24px',
  style
}: {
  currency?: Currency
  size?: string
  style?: React.CSSProperties
}) {
  const uriLocations = useHttpLocations(currency instanceof WrappedTokenInfo ? currency.logoURI : undefined)

  const srcs: string[] = useMemo(() => {
    // if (currency === CAVAX) return []
    if (currency === CMATIC) return []

    if (currency instanceof Token) {
      if (currency instanceof WrappedTokenInfo) {
        return [...uriLocations, getTokenLogoURL(currency.address)]
      }

      return [...uriLocations, getTokenLogoURL(currency.address)]
    }
    return []
  }, [currency, uriLocations])

  // if (currency === CAVAX) {
  if (currency === CMATIC) {
    // return <StyledEthereumLogo src={AvaxLogo} size={size} style={style} />
    return <StyledEthereumLogo src={PolygonLogo} size={size} style={style} />
  }

  return <StyledLogo size={size} srcs={srcs} alt={`${currency?.symbol ?? 'token'} logo`} style={style} />
}
