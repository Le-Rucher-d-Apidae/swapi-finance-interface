// import { transparentize } from 'polished'
import React, { useMemo } from 'react'
import styled, {
  ThemeProvider as StyledComponentsThemeProvider,
  createGlobalStyle,
  css,
  DefaultTheme
} from 'styled-components'
import { useIsDarkMode } from '../state/user/hooks'
import { Text, TextProps } from 'rebass'
import { Colors } from './styled'

export * from './components'

// const MEDIA_WIDTHS = {
//   upToExtraSmall: 500,
//   upToSmall: 720,
//   upToMedium: 960,
//   upToLarge: 1280
// }

export const MEDIA_WIDTHS = {
  upToExtraSmall: 720,
  upToSmall: 960,
  upToMedium: 1152,
  upToLarge: 1280
}

const mediaWidthTemplates: { [width in keyof typeof MEDIA_WIDTHS]: typeof css } = Object.keys(MEDIA_WIDTHS).reduce(
  (accumulator, size) => {
    ;(accumulator as any)[size] = (a: any, b: any, c: any) => css`
      @media (max-width: ${(MEDIA_WIDTHS as any)[size]}px) {
        ${css(a, b, c)}
      }
    `
    return accumulator
  },
  {}
) as any

const white = '#FFFFFF'

const yellow = '#ffff00'
const yellow1 = '#f4da85'
const yellow2 = '#dabe39'

const dark1 = '#08060b'
// const dark2 = '#27262c'

const darkYellow = '#ffba00'

const brown = '#51331b'
const lightPurple = '#b8add2'
const darkPurple1 = '#201335' // 9, 7, 12

const darkPurple2 = '#280d5f' // 40, 13, 95
const purple1 = '#3b4155' // 59, 65, 85
const purple2 = '#3a3045' // 58, 48, 69

const grey = '#888D9B'

const black = '#000000'

export function colors(darkMode: boolean): Colors {
  return {
    // base
    white,
    black,

    // text
    // text1: darkMode ? '#FFFFFF' : '#000000',
    text1: darkMode ? lightPurple : brown,
    // text2: darkMode ? '#C3C5CB' : '#565A69',
    // text2: darkMode ? '#C3C5CB' : brown,
    text2: darkMode ? white : brown,
    // text3: darkMode ? '#6C7284' : '#888D9B',
    text3: darkMode ? '#6C7284' : '#888D9B',
    text4: darkMode ? '#565A69' : '#C3C5CB',
    text5: darkMode ? lightPurple : white,

    // backgrounds / greys
    // bg1: darkMode ? '#212429' : '#FFFFFF',
    bg1: darkMode ? dark1 : yellow2,
    // bg2: darkMode ? '#2C2F36' : '#F7F8FA',
    bg2: darkMode ? darkPurple1 : yellow1,
    // bg3: darkMode ? '#40444F' : '#EDEEF2',
    bg3: darkMode ? grey : white,
    // bg4: darkMode ? '#565A69' : '#CED0D9',
    bg4: darkMode ? '#565A69' : '#CED0D9',
    bg5: darkMode ? '#6C7284' : '#888D9B',
    bg6: darkMode ? dark1 : yellow2,

    //specialty colors
    modalBG: darkMode ? 'rgba(0,0,0,.425)' : 'rgba(0,0,0,0.3)',
    advancedBG: darkMode ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.6)',

    //primary colors
    // primary1: darkMode ? '#2172E5' : '#EAC178',
    primary1: darkMode ? dark1 : black,
    // primary2: darkMode ? '#3680E7' : '#EAC178',
    primary2: darkMode ? darkPurple1 : yellow2,
    // primary3: darkMode ? '#4D8FEA' : '#EAC178',
    primary3: darkMode ? '#4D8FEA' : white, // button border focus
    // primary4: darkMode ? '#376bad70' : '#EAC178',
    primary4: darkMode ? '#376bad70' : grey, // button border
    // primary5: darkMode ? '#153d6f70' : '#EAC178',
    primary5: darkMode ? darkYellow : darkYellow,
    primary6: darkMode ? '#2172E5' : '#FFFFFF',

    // color text
    primaryText1: darkMode ? '#6da8ff' : '#ffffff',

    // secondary colors
    secondary1: darkMode ? '#2172E5' : '#ff007a',
    secondary2: darkMode ? '#17000b26' : '#F6DDE8',
    secondary3: darkMode ? '#17000b26' : '#FDEAF1',

    // other
    red1: '#FF6871',
    red2: '#F82D3A',
    green1: '#27AE60',
    yellow1: '#FFE270',
    yellow2: '#F3841E',
    blue1: '#2172E5',

    // avaxRed: '#E84142',

    polygonPurple: '#8247e5',

    // dont wanna forget these blue yet
    // blue4: darkMode ? '#153d6f70' : '#C4D9F8',
    // blue5: darkMode ? '#153d6f70' : '#EBF4FF',

    pageBackground: darkMode
      ? `linear-gradient(${dark1} 22%, ${darkPurple1} 100%);`
      : `linear-gradient(${yellow1} 22%, ${yellow2} 100%);`,

    wrapperBackground: darkMode
      ? `linear-gradient(${purple2} 60%, ${purple1} 90%);`
      : `linear-gradient(${yellow2} 60%, ${yellow1} 90%);`,

    buttonLightBackground: darkMode ? darkYellow : darkYellow,
    buttonLightText: darkMode ? white : white,

    buttonClosePopup: darkMode ? darkYellow : brown,

    textPopupHeader: darkMode ? white : brown,
    textHighlight1: darkMode ? yellow : brown,
    textHighlight2: darkMode ? white : darkPurple2,
    textInfoLink: darkMode ? darkYellow : darkYellow
  }
}

export function theme(darkMode: boolean): DefaultTheme {
  return {
    ...colors(darkMode),

    grids: {
      sm: 8,
      md: 12,
      lg: 24
    },

    //shadows
    shadow1: darkMode ? '#000' : '#2F80ED',

    // media queries
    mediaWidth: mediaWidthTemplates,

    // css snippets
    flexColumnNoWrap: css`
      display: flex;
      flex-flow: column nowrap;
    `,
    flexRowNoWrap: css`
      display: flex;
      flex-flow: row nowrap;
    `
  }
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const darkMode = useIsDarkMode()

  const themeObject = useMemo(() => theme(darkMode), [darkMode])

  return <StyledComponentsThemeProvider theme={themeObject}>{children}</StyledComponentsThemeProvider>
}

const TextWrapper = styled(Text)<{ color: keyof Colors }>`
  color: ${({ color, theme }) => (theme as any)[color]};
`

export const TYPE = {
  main(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'text2'} {...props} />
  },
  link(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'primary1'} {...props} />
  },
  black(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'text2'} {...props} />
  },
  white(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'white'} {...props} />
  },
  // yellow(props: TextProps) {
  //   return <TextWrapper fontWeight={500} color={'red'} {...props} />
  // },
  body(props: TextProps) {
    return <TextWrapper fontWeight={400} fontSize={16} color={'text1'} {...props} />
  },
  largeHeader(props: TextProps) {
    return <TextWrapper fontWeight={600} fontSize={24} {...props} />
  },
  mediumHeader(props: TextProps) {
    return <TextWrapper fontWeight={500} fontSize={20} {...props} />
  },
  subHeader(props: TextProps) {
    return <TextWrapper fontWeight={400} fontSize={14} {...props} />
  },
  small(props: TextProps) {
    return <TextWrapper fontWeight={500} fontSize={11} {...props} />
  },
  blue(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'primary1'} {...props} />
  },
  yellow(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'yellow1'} {...props} />
  },
  darkGray(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'text3'} {...props} />
  },
  gray(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'bg3'} {...props} />
  },
  italic(props: TextProps) {
    return <TextWrapper fontWeight={500} fontSize={12} fontStyle={'italic'} color={'text2'} {...props} />
  },
  error({ error, ...props }: { error: boolean } & TextProps) {
    return <TextWrapper fontWeight={500} color={error ? 'red1' : 'text2'} {...props} />
  },
  homeLarge(props: TextProps) {
    return <TextWrapper fontWeight={600} fontSize={32} {...props} />
  },
  homeMedium(props: TextProps) {
    return <TextWrapper fontWeight={600} fontSize={22} {...props} />
  },
  homeNormal(props: TextProps) {
    return <TextWrapper fontWeight={500} {...props} />
  },
  text1(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'text1'} {...props} />
  },
  text5(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'text5'} {...props} />
  }
}

export const FixedGlobalStyle = createGlobalStyle`

/* thai */
@font-face {
  font-family: 'Kanit';
  font-style: normal;
  font-weight: 400;
  src: url(https://fonts.gstatic.com/s/kanit/v15/nKKZ-Go6G5tXcraBGwCYdA.woff2) format('woff2');
  unicode-range: U+0E01-0E5B, U+200C-200D, U+25CC;
}
/* vietnamese */
@font-face {
  font-family: 'Kanit';
  font-style: normal;
  font-weight: 400;
  src: url(https://fonts.gstatic.com/s/kanit/v15/nKKZ-Go6G5tXcraaGwCYdA.woff2) format('woff2');
  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;
}
/* latin-ext */
@font-face {
  font-family: 'Kanit';
  font-style: normal;
  font-weight: 400;
  src: url(https://fonts.gstatic.com/s/kanit/v15/nKKZ-Go6G5tXcrabGwCYdA.woff2) format('woff2');
  unicode-range: U+0100-02AF, U+0304, U+0308, U+0329, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
  font-family: 'Kanit';
  font-style: normal;
  font-weight: 400;
  src: url(https://fonts.gstatic.com/s/kanit/v15/nKKZ-Go6G5tXcraVGwA.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

html, input, textarea, button {
  font-family: 'Kanit', sans-serif;
  font-display: fallback;
}
@supports (font-variation-settings: normal) {
  html, input, textarea, button {
    font-family: 'Kanit', sans-serif;
  }
}

html,
body {
  margin: 0;
  padding: 0;
}

* {
  box-sizing: border-box;
}

button {
  user-select: none;
}

html {
  font-size: 16px;
  font-variant: none;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  font-feature-settings: 'ss01' on, 'ss02' on, 'cv01' on, 'cv03' on;

}
`

// export const ThemedGlobalStyle = createGlobalStyle`
// html {
//   color: ${({ theme }) => theme.text1};
//   background-color: ${({ theme }) => theme.bg2};
// }

// body {
//   min-height: 100vh;
//   background-position: 0 -30vh;
//   background-repeat: no-repeat;
//   background-image: ${({ theme }) =>
//     `radial-gradient(50% 50% at 50% 50%, ${transparentize(0.85, theme.primary1)} 0%, ${transparentize(
//       1,
//       theme.bg1
//     )} 100%)`};
// }
// `

export const ThemedGlobalStyle = createGlobalStyle`
html {
  color: ${({ theme }) => theme.text1};
  background-color: ${({ theme }) => theme.bg2};
}
body {
  min-height: 100vh;
  background-position: 0 -30vh;
  background-repeat: no-repeat;
  background: ${({ theme }) => theme.pageBackground};
  }
  `
