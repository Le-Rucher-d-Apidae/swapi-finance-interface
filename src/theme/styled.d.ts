import { FlattenSimpleInterpolation, ThemedCssFunction } from 'styled-components'

export type Color = string
export interface Colors {
  // base
  white: Color
  black: Color

  // text
  text1: Color
  text2: Color
  text3: Color
  text4: Color
  text5: Color

  // backgrounds / greys
  bg1: Color
  bg2: Color
  bg3: Color
  bg4: Color
  bg5: Color
  bg6: Color

  // modalBG: Color
  modalBgOverlay: Color
  advancedBG: Color

  //blues
  primary1: Color
  primary2: Color
  primary3: Color
  primary4: Color
  primary5: Color
  primary6: Color

  primaryText1: Color

  // pinks
  secondary1: Color
  secondary2: Color
  secondary3: Color

  // other
  red1: Color
  red2: Color
  green1: Color
  yellow1: Color
  yellow2: Color
  blue1: Color

  // avaxRed: Color
  polygonPurple: Color

  pageBackground: Color
  wrapperBackground: Color
  pageBottomBackground: Color
  pageBottomBackground2: Color

  buttonLightBackground: Color
  buttonLightText: Color
  buttonClosePopup: Color

  buttonBalanceMaxBg: Color
  buttonBalanceMaxText: Color
  buttonBalanceMaxBorder: Color
  buttonBalanceMaxBorderFocus: Color

  buttonPrimaryText: Color
  buttonPrimaryTextDisabled: Color
  buttonPrimaryBg: Color
  buttonPrimaryHover: Color
  buttonPrimaryFocus: Color
  buttonPrimaryBorder: Color
  buttonPrimaryDisabled: Color

  textPopupHeader: Color
  textHighlight1: Color
  textHighlight2: Color
  textInfoLink: Color

  poolCardBg1: Color
  infoCardBg1: Color
  textBottom: Color
  pollingText: Color
  pollingDot: Color
  pollingSpinner: Color
  internalLink: Color
  modalBG: Color
}

export interface Grids {
  sm: number
  md: number
  lg: number
}

declare module 'styled-components' {
  export interface DefaultTheme extends Colors {
    grids: Grids

    // shadows
    shadow1: string

    // media queries
    mediaWidth: {
      upToExtraSmall: ThemedCssFunction<DefaultTheme>
      upToSmall: ThemedCssFunction<DefaultTheme>
      upToMedium: ThemedCssFunction<DefaultTheme>
      upToLarge: ThemedCssFunction<DefaultTheme>
    }

    // css snippets
    flexColumnNoWrap: FlattenSimpleInterpolation
    flexRowNoWrap: FlattenSimpleInterpolation
  }
}
