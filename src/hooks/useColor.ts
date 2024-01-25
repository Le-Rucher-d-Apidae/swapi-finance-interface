import { useState, useLayoutEffect } from 'react'
import { shade } from 'polished'
import Vibrant from 'node-vibrant'
import { hex } from 'wcag-contrast'
import { Token } from '@swapi-finance/sdk-local'
// import { BAG } from '../constants'
import { MAIN_TOKEN } from '../constants'
import {
  TOKEN_LIST_EXCHANGE_CUSTOM_ASSET_DEFAULT_LOGO_URL,
  TOKEN_LIST_ASSET_GENERIC_ADDRESS_DEFAULT_LOGO_URL_BASE,
  TOKEN_LIST_ASSET_GENERIC_ADDRESS_DEFAULT_LOGO_URL_DEFAULT_LOGO
} from '../constants/index'

async function getColorFromToken(token: Token): Promise<string | null> {
  // const path = token.equals(BAG[token.chainId]) ?
  //   `https://raw.githubusercontent.com/baguette-exchange/contracts/main/tokenlist/logos/baguette.png` :
  //   `https://raw.githubusercontent.com/pangolindex/tokens/main/assets/${token.address}/logo.png`
  // const path = token.equals(MAIN_TOKEN[token.chainId])
  //   ? `https://raw.githubusercontent.com/Le-Rucher-d-Apidae/swapi-finance-contracts/main/tokenlist/logos/apidae.png`
  //   : `https://raw.githubusercontent.com/trustwallet/assets/main/blockchains/polygon/assets/${token.address}/logo.png`
  const path = token.equals(MAIN_TOKEN[token.chainId])
    ? process.env.REACT_APP_TOKEN_LIST_EXCHANGE_CUSTOM_ASSET_LOGO_URL ||
      TOKEN_LIST_EXCHANGE_CUSTOM_ASSET_DEFAULT_LOGO_URL
    : `${process.env.REACT_APP_TOKEN_LIST_ASSET_GENERIC_ADDRESS_LOGO_URL_BASE}${token.address}${process.env.REACT_APP_TOKEN_LIST_ASSET_GENERIC_ADDRESS_LOGO_URL_DEFAULT_LOGO}` ||
      `${TOKEN_LIST_ASSET_GENERIC_ADDRESS_DEFAULT_LOGO_URL_BASE}${token.address}${TOKEN_LIST_ASSET_GENERIC_ADDRESS_DEFAULT_LOGO_URL_DEFAULT_LOGO}`
  // console.debug('path', path)
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
  const [color, setColor] = useState('#2172E5')

  useLayoutEffect(() => {
    let stale = false

    if (token) {
      getColorFromToken(token).then(tokenColor => {
        if (!stale && tokenColor !== null) {
          setColor(tokenColor)
        }
      })
    }

    return () => {
      stale = true
      setColor('#2172E5')
    }
  }, [token])

  return color
}
