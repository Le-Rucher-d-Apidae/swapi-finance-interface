import React, { useContext } from 'react'

// import styled from 'styled-components'
import styled, { keyframes, ThemeContext } from 'styled-components'
import { AutoColumn } from '../../components/Column'
// import { AutoRow } from '../../components/Row'
// import { RowBetween, RowFixed } from '../../components/Row'
// import { RowBetween } from '../../components/Row'
import { Box } from 'rebass/styled-components'
import { Text } from 'rebass'

import { TYPE, StyledInternalLink } from '../../theme'
import apidaeCoin from '../../assets/images/apidae-coin.png'
// import { ButtonPrimary } from '../../components/Button'
import { ButtonSecondary } from '../../components/Button'

import { Link } from 'react-router-dom'
import { darken } from 'polished'

const PageWrapper = styled(AutoColumn)`
  border: 3px solid black;
  padding: 10px;
  width: 100%;
  display: block;
`

const Section = styled(AutoColumn)`
  border: 2px solid blue;
  padding: 10px;
  width: 100%;
  display: flex;
`

const Row = styled(Box)<{ align?: string; padding?: string; border?: string; borderRadius?: string }>`
  width: ${({ width }) => (width ? width : '100%')};
  display: ${({ display }) => (display ? display : 'flex')};
  padding: 0;
  align-items: ${({ align }) => (align ? align : 'center')};
  padding: ${({ padding }) => padding};
  border: ${({ border }) => border};
  border-radius: ${({ borderRadius }) => borderRadius};
  flex-direction: column;
`

const floatingImg = keyframes`
  0% {
    transform:translate(0);
  }
  60% {
    transform:translate(-24px,-24px);
  }
  100% {
    transform:translate(0);
  }
`

const BagTokenAnimated = styled.img`
  animation: ${floatingImg} 8s infinite ease-in-out;
`

// const ButtonBuy = styled.button`
//   height: 48px;
//   background-color: ${({ theme }) => theme.primary5};
//   border-radius: 0.5rem;
//   padding: 0 1rem;
//   font-size: 1rem;
//   font-weight: 600;
//   cursor: pointer;
//   margin-right: 0.5rem;
//   color: ${({ theme }) => theme.buttonLightText};
//   &:hover {
//     background-color: ${({ theme }) => darken(0.05, theme.primary5)};
//   }
//   ${({ theme }) => theme.mediaWidth.upToExtraSmall`
//     margin-right: 0.5rem;
//   `};
// `

const ButtonBuy2 = styled(ButtonSecondary)`
  height: 48px;
  color: ${({ theme }) => theme.buttonLightText};
  background-color: ${({ theme }) => theme.primary5};
  width: fit-content;
  font-weight: 800;
  margin-right: 0.5rem;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 48%;
  `};
  &:hover {
    background-color: ${({ theme }) => darken(0.1, theme.primary5)};
  }
`

const CustomInternalLink = styled(StyledInternalLink)`
  font-weight: 600;
  color: ${({ theme }) => theme.textInfoLink};
`

export default function Home() {
  const theme = useContext(ThemeContext)
  return (
    <>
      <PageWrapper>
        <Section>
          <Row border={'1px solid white'} display={'flex'}>
            <TYPE.homeLarge color={theme.textHighlight2} style={{ display: 'inline-block' }}>
              <TYPE.homeLarge color={theme.textHighlight1} style={{ display: 'inline-block' }}>
                La&nbsp;
              </TYPE.homeLarge>
              première ferme de rendement au profit de la préservation des abeilles
            </TYPE.homeLarge>

            <TYPE.homeNormal>
              Les jetons APT sont au cœur de l&apos;écosystème de Swapi qui fait le lien entre investisseur et
              producteur. producteur. Achetez-les, gagnez-les, dépensez-les, utilisez-les pour le yield farming ou le en
              en participant a une bonne œuvre.
            </TYPE.homeNormal>

            <Row display={'block'} padding={'20px 0px 0px 10px ;'}>
              {/*
               <ButtonBuy style={{ display: 'inline-block' }} as={Link} to={`/swap`}>
                Acheter des APT
              </ButtonBuy>
              <ButtonBuy style={{ display: 'inline-block' }}>Acheter des APT</ButtonBuy>
 */}

              <ButtonBuy2 style={{ display: 'inline-block' }} as={Link} to={`/swap`}>
                <Text fontWeight={500} fontSize={16}>
                  Acheter des APT
                </Text>
              </ButtonBuy2>

              {/* 
              <ButtonPrimary
                padding="8px"
                borderRadius="8px"
                as={Link}
                to={`/`}
                width="auto"
                style={{ display: 'inline-block' }}
              >
              En savoir plus
              </ButtonPrimary>
*/}

              <CustomInternalLink id="info" to={'/todo'}>
                {'En savoir plus'}
              </CustomInternalLink>
            </Row>
          </Row>
          <Row display={'block'} padding={'0px 0% 0px 0px ;'}>
            <AutoColumn gap="md" justify="flex-end">
              <BagTokenAnimated height={420} object-fit={'fill'} src={apidaeCoin} />{' '}
            </AutoColumn>

            <AutoColumn gap="md" justify="flex-start">
              <TYPE.white fontSize={48} fontWeight={600} color="yellow1">
                B
              </TYPE.white>
            </AutoColumn>
          </Row>
        </Section>

        <Section>
          <AutoColumn gap="md" justify="flex-start">
            <TYPE.white fontSize={48} fontWeight={600} color="yellow1">
              C
            </TYPE.white>
          </AutoColumn>
        </Section>
      </PageWrapper>
    </>
  )
}
