// import { Currency, CAVAX, Token, ChainId } from '@swapi-finance/sdk-local'
import { Currency, CURRENCY, Token, ChainId } from '@swapi-finance/sdk-local'
import React, { useMemo } from 'react'
import styled from 'styled-components'

// import AvaxLogo from '../../assets/images/avalanche_token_round.png'
import PolygonLogo from '../../assets/images/polygon_token_round.png'
import useHttpLocations from '../../hooks/useHttpLocations'
import { WrappedTokenInfo } from '../../state/lists/hooks'
import Logo from '../Logo'
// import { BAG } from '../../constants'
import { SELF_TOKEN } from '../../constants'
import {
  TOKEN_LIST_EXCHANGE_CUSTOM_ASSET_DEFAULT_LOGO_URL,
  TOKEN_LIST_EXCHANGE_CUSTOM_ASSET_TESTNET_DEFAULT_LOGO_URL,
  TOKEN_LIST_ASSET_GENERIC_ADDRESS_DEFAULT_LOGO_URL_BASE,
  TOKEN_LIST_ASSET_GENERIC_ADDRESS_DEFAULT_LOGO_URL_DEFAULT_LOGO,
  TOKEN_LIST_ASSET_GENERIC_ADDRESS_TESTNET_DEFAULT_LOGO_URL_BASE
} from '../../constants/index'

// const getTokenLogoURL = (address: string) =>
//   address === BAG[ChainId.AVALANCHE].address
//   ? `https://raw.githubusercontent.com/baguette-exchange/contracts/main/tokenlist/logos/baguette.png`
//   : `https://raw.githubusercontent.com/pangolindex/tokens/main/assets/${address}/logo.png`

// const getTokenLogoURL = (address: string) =>
//   // address === BAG[ChainId.POLYGON].address
//   address === SELF_TOKEN[ChainId.POLYGON].address
//     ? `https://raw.githubusercontent.com/Le-Rucher-d-Apidae/swapi-finance-contracts/main/tokenlist/logos/apidae.png` // `https://raw.githubusercontent.com/baguette-exchange/contracts/main/tokenlist/logos/baguette.png` // TODO: update this : change to APIDAE logo */
//     : `https://raw.githubusercontent.com/trustwallet/assets/main/blockchains/polygon/assets/${address}/logo.png` // `https://raw.githubusercontent.com/pangolindex/tokens/main/assets/${address}/logo.png` // TODO: update this
// // alternatives: https://github.com/dappradar/tokens/tree/main/polygon

// const getTokenLogoURL = (address: string) =>
const getTokenLogoURL = (address: string, chainId?: ChainId) => {
  // debugger
  if (chainId) {
    if (address === SELF_TOKEN[chainId].address) {
      if (chainId === ChainId.MUMBAI) {
        return (
          process.env.REACT_APP_TOKEN_LIST_EXCHANGE_CUSTOM_ASSET_TESTNET_LOGO_URL ||
          TOKEN_LIST_EXCHANGE_CUSTOM_ASSET_TESTNET_DEFAULT_LOGO_URL
        )
      }
      return (
        process.env.REACT_APP_TOKEN_LIST_EXCHANGE_CUSTOM_ASSET_LOGO_URL ||
        TOKEN_LIST_EXCHANGE_CUSTOM_ASSET_DEFAULT_LOGO_URL
      )
    }
    if (chainId === ChainId.MUMBAI) {
      // REACT_APP_TOKEN_LIST_ASSET_GENERIC_ADDRESS_TESTNET_LOGO_URL_BASE || TOKEN_LIST_ASSET_GENERIC_ADDRESS_TESTNET_DEFAULT_LOGO_URL_BASE
      return process.env.REACT_APP_TOKEN_LIST_ASSET_GENERIC_ADDRESS_TESTNET_LOGO_URL_BASE &&
        process.env.REACT_APP_TOKEN_LIST_ASSET_GENERIC_ADDRESS_LOGO_URL_DEFAULT_LOGO
        ? `${process.env.REACT_APP_TOKEN_LIST_ASSET_GENERIC_ADDRESS_TESTNET_LOGO_URL_BASE}${address}${process.env.REACT_APP_TOKEN_LIST_ASSET_GENERIC_ADDRESS_LOGO_URL_DEFAULT_LOGO}`
        : `${TOKEN_LIST_ASSET_GENERIC_ADDRESS_TESTNET_DEFAULT_LOGO_URL_BASE}${address}${TOKEN_LIST_ASSET_GENERIC_ADDRESS_DEFAULT_LOGO_URL_DEFAULT_LOGO}`
    }
  }
  return process.env.REACT_APP_TOKEN_LIST_ASSET_GENERIC_ADDRESS_LOGO_URL_BASE &&
    process.env.REACT_APP_TOKEN_LIST_ASSET_GENERIC_ADDRESS_LOGO_URL_DEFAULT_LOGO
    ? `${process.env.REACT_APP_TOKEN_LIST_ASSET_GENERIC_ADDRESS_LOGO_URL_BASE}${address}${process.env.REACT_APP_TOKEN_LIST_ASSET_GENERIC_ADDRESS_LOGO_URL_DEFAULT_LOGO}`
    : `${TOKEN_LIST_ASSET_GENERIC_ADDRESS_DEFAULT_LOGO_URL_BASE}${address}${TOKEN_LIST_ASSET_GENERIC_ADDRESS_DEFAULT_LOGO_URL_DEFAULT_LOGO}`
}
/*
  address === SELF_TOKEN[ChainId.POLYGON].address
    ? process.env.REACT_APP_TOKEN_LIST_EXCHANGE_CUSTOM_ASSET_LOGO_URL ||
      TOKEN_LIST_EXCHANGE_CUSTOM_ASSET_DEFAULT_LOGO_URL
    : address === SELF_TOKEN[ChainId.MUMBAI].address
    ? process.env.REACT_APP_TOKEN_LIST_EXCHANGE_CUSTOM_ASSET_TESTNET_LOGO_URL ||
      TOKEN_LIST_EXCHANGE_CUSTOM_ASSET_TESTNET_DEFAULT_LOGO_URL
    : `${process.env.REACT_APP_TOKEN_LIST_ASSET_GENERIC_ADDRESS_LOGO_URL_BASE}${address}${process.env.REACT_APP_TOKEN_LIST_ASSET_GENERIC_ADDRESS_LOGO_URL_DEFAULT_LOGO}` ||
      `${TOKEN_LIST_ASSET_GENERIC_ADDRESS_DEFAULT_LOGO_URL_BASE}${address}${TOKEN_LIST_ASSET_GENERIC_ADDRESS_DEFAULT_LOGO_URL_DEFAULT_LOGO}`

      // REACT_APP_TOKEN_LIST_ASSET_GENERIC_ADDRESS_TESTNET_LOGO_URL_BASE || TOKEN_LIST_ASSET_GENERIC_ADDRESS_TESTNET_DEFAULT_LOGO_URL_BASE
*/
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
  style,
  chainId
}: {
  currency?: Currency
  size?: string
  style?: React.CSSProperties
  chainId?: ChainId
}) {
  const uriLocations = useHttpLocations(currency instanceof WrappedTokenInfo ? currency.logoURI : undefined)

  const srcs: string[] = useMemo(() => {
    // if (currency === CAVAX) return []
    if (currency === CURRENCY) return []

    if (currency instanceof Token) {
      if (currency instanceof WrappedTokenInfo) {
        console.debug(
          `src/components/CurrencyLogo/index.tsx currency instanceof WrappedTokenInfo currency.address=${
            currency.address
          } getTokenLogoURL=${getTokenLogoURL(currency.address, chainId)}`
        )
        return [...uriLocations, getTokenLogoURL(currency.address, chainId)]
      }

      console.debug(
        `src/components/CurrencyLogo/index.tsx currency.address=${currency.address} getTokenLogoURL=${getTokenLogoURL(
          currency.address,
          chainId
        )}`
      )
      return [...uriLocations, getTokenLogoURL(currency.address, chainId)]
    }
    return []
  }, [currency, uriLocations, chainId])

  // if (currency === CAVAX) {
  if (currency === CURRENCY) {
    // return <StyledEthereumLogo src={AvaxLogo} size={size} style={style} />
    return <StyledEthereumLogo src={PolygonLogo} size={size} style={style} />
  }

  return <StyledLogo size={size} srcs={srcs} alt={`${currency?.symbol ?? 'token'} logo`} style={style} />
}
