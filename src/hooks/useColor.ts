import { useState, useLayoutEffect, useContext } from 'react'
import { shade } from 'polished'
import Vibrant from 'node-vibrant'
import { hex } from 'wcag-contrast'
import { Token } from '@swapi-finance/sdk-local'
// import { BAG } from '../constants'
import { SELF_TOKEN } from '../constants'
import {
  TOKEN_LIST_EXCHANGE_CUSTOM_ASSET_DEFAULT_LOGO_URL,
  TOKEN_LIST_ASSET_GENERIC_ADDRESS_DEFAULT_LOGO_URL_BASE,
  TOKEN_LIST_ASSET_GENERIC_ADDRESS_DEFAULT_LOGO_URL_DEFAULT_LOGO
} from '../constants/index'
import { ThemeContext } from 'styled-components'

async function getColorFromToken(token: Token): Promise<string | null> {
  // const path = token.equals(BAG[token.chainId]) ?
  //   `https://raw.githubusercontent.com/baguette-exchange/contracts/main/tokenlist/logos/baguette.png` :
  //   `https://raw.githubusercontent.com/pangolindex/tokens/main/assets/${token.address}/logo.png`
  // const path = token.equals(SELF_TOKEN[token.chainId])
  //   ? `https://raw.githubusercontent.com/Le-Rucher-d-Apidae/swapi-finance-contracts/main/tokenlist/logos/apidae.png`
  //   : `https://raw.githubusercontent.com/trustwallet/assets/main/blockchains/polygon/assets/${token.address}/logo.png`
  const path = token.equals(SELF_TOKEN[token.chainId])
    ? process.env.REACT_APP_TOKEN_LIST_EXCHANGE_CUSTOM_ASSET_LOGO_URL ||
      TOKEN_LIST_EXCHANGE_CUSTOM_ASSET_DEFAULT_LOGO_URL
    : `${process.env.REACT_APP_TOKEN_LIST_ASSET_GENERIC_ADDRESS_LOGO_URL_BASE}${token.address}${process.env.REACT_APP_TOKEN_LIST_ASSET_GENERIC_ADDRESS_LOGO_URL_DEFAULT_LOGO}` ||
      `${TOKEN_LIST_ASSET_GENERIC_ADDRESS_DEFAULT_LOGO_URL_BASE}${token.address}${TOKEN_LIST_ASSET_GENERIC_ADDRESS_DEFAULT_LOGO_URL_DEFAULT_LOGO}`
  // console.debug('swapi-finance-interface/src/hooks/useColor.ts path=', path)
  return Vibrant.from(path)
    .getPalette()
    .then(palette => {
      if (palette?.Vibrant) {
        let detectedHex = palette.Vibrant.hex
        let AAscore = hex(detectedHex, '#FFF')
        while (AAscore < 3) {
          detectedHex = shade(0.005, detectedHex)
          AAscore = hex(detectedHex, '#FFF')
        }
        return detectedHex
      }
      return null
    })
    .catch(() => null)
}

export function useColor(token?: Token) {
  const theme = useContext(ThemeContext)
  // const defaultColor = '#2172E5'
  const defaultColor = theme.primary1
  // const [color, setColor] = useState('#2172E5')
  const [color, setColor] = useState(defaultColor)

  useLayoutEffect(() => {
    let stale = false

    if (token) {
      getColorFromToken(token).then(tokenColor => {
        // console.debug('swapi-finance-interface/src/hooks/useColor.ts tokenColor=', tokenColor)
        if (!stale && tokenColor !== null) {
          setColor(tokenColor)
        }
      })
    }

    return () => {
      stale = true
      setColor(defaultColor)
    }
  }, [token, defaultColor])

  return color
}
