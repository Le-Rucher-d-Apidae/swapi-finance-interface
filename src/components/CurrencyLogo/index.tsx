import { Currency, CURRENCY, Token, ChainId } from '@swapi-finance/sdk'
import React, { useMemo } from 'react'
import styled from 'styled-components'
import PolygonCurrencyLogo from '../../assets/images/polygon_token_round.png'
import useHttpLocations from '../../hooks/useHttpLocations'
import { WrappedTokenInfo } from '../../state/lists/hooks'
import Logo from '../Logo'
import { SELF_TOKEN } from '../../constants'
import {
  TOKEN_LIST_EXCHANGE_CUSTOM_ASSET_DEFAULT_LOGO_URL,
  TOKEN_LIST_EXCHANGE_CUSTOM_ASSET_TESTNET_DEFAULT_LOGO_URL,
  TOKEN_LIST_ASSET_GENERIC_ADDRESS_DEFAULT_LOGO_URL_BASE,
  TOKEN_LIST_ASSET_GENERIC_ADDRESS_DEFAULT_LOGO_URL_DEFAULT_LOGO,
  TOKEN_LIST_ASSET_GENERIC_ADDRESS_TESTNET_DEFAULT_LOGO_URL_BASE
} from '../../constants/index'
import { useActiveWeb3React } from '../../hooks'

const getTokenLogoURL = (address: string, chainId?: ChainId) => {
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
const StyledCurrencyLogo = styled.img<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
  border-radius: 24px;
`

const StyledLogo = styled(Logo)<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  border-radius: ${({ size }) => size};
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.175);
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
  const { chainId } = useActiveWeb3React()
  const uriLocations = useHttpLocations(currency instanceof WrappedTokenInfo ? currency.logoURI : undefined)

  const srcs: string[] = useMemo(() => {
    if (currency === CURRENCY) return []

    if (currency instanceof Token) {
      if (currency instanceof WrappedTokenInfo) {
        return [...uriLocations, getTokenLogoURL(currency.address, chainId)]
      }
      return [...uriLocations, getTokenLogoURL(currency.address, chainId)]
    }
    return []
  }, [currency, uriLocations, chainId])

  if (currency === CURRENCY) {
    return <StyledCurrencyLogo src={PolygonCurrencyLogo} size={size} style={style} />
  }

  return <StyledLogo size={size} srcs={srcs} alt={`${currency?.symbol ?? 'token'} logo`} style={style} />
}
