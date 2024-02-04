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
// import { ReactComponent as Line } from '../../assets/images/line.svg'

const PageWrapper = styled(AutoColumn)`
  padding: 0px;
  width: 100%;
  display: block;
`

const Section = styled(AutoColumn)`
  padding: 20px;
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

const LineSection = styled(AutoColumn)`
  padding: 0px;
  width: 100%;
  display: flex;
  position: absolute;
  background: ${({ theme }) => theme.pageBottomBackground};
`

const StyledSVG = styled.svg<{ size: string; stroke?: string }>`
  height: ${({ size }) => size};
  width: ${({ size }) => size};
  path {
    stroke: ${({ stroke, theme }) => stroke ?? theme.primary2};
  }
  fill: ${({ fill, theme }) => fill ?? theme.primary2};
`

const BagTokenAnimated = styled.img`
  animation: ${floatingImg} 8s infinite ease-in-out;
`

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

const Grid = styled.div`
  display: grid;
  grid-gap: 10px;
  grid-template-columns: repeat(3, 1fr);
  ${({ theme }) => theme.mediaWidth.upToSmall`
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 10px;
  `};
`

const PaddedColumn = styled(AutoColumn)`
  padding: 20px;
  padding-bottom: 12px;
  border-left: 1px solid ${({ theme }) => darken(0.5, theme.text1)};
`

const Bottom = styled.div`
  position: relative;
  width: 100%;
  min-height: 100%;
  background: ${({ theme }) => theme.pageBottomBackground};
  padding: 1rem;
`

export default function Home() {
  const theme = useContext(ThemeContext)
  return (
    <>
      <PageWrapper>
        <Section>
          <Row display={'flex'}>
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

              <ButtonBuy2 style={{ display: 'inline-block' }} as={Link} to={`/swap`}>
                <Text fontWeight={500} fontSize={16}>
                  Acheter des APT
                </Text>
              </ButtonBuy2>

              <CustomInternalLink id="info" to={'/todo'}>
                {'En savoir plus'}
              </CustomInternalLink>
            </Row>
          </Row>

          <Row display={'block'} padding={'0px 0% 0px 0px ;'}>
            <AutoColumn gap="md" justify="flex-end">
              <BagTokenAnimated height={420} object-fit={'fill'} src={apidaeCoin} />{' '}
            </AutoColumn>

            <Row display={'block'} padding={'20%'}></Row>
          </Row>
        </Section>

        <Section>
          <AutoColumn gap="md" justify="flex-start">
            <Grid>
              <PaddedColumn>
                Quantité en circulation
                <TYPE.homeMedium color={theme.textHighlight2}>32,000,000</TYPE.homeMedium>
              </PaddedColumn>
              <PaddedColumn>
                Apport total
                <TYPE.homeMedium color={theme.textHighlight2}>32,000,000</TYPE.homeMedium>
              </PaddedColumn>
              <PaddedColumn>
                Approvisionnement maximal
                <TYPE.homeMedium color={theme.textHighlight2}>32,000,000</TYPE.homeMedium>
              </PaddedColumn>
              <PaddedColumn>
                Capitalisation
                <TYPE.homeMedium color={theme.textHighlight2}>6,5 mille $</TYPE.homeMedium>
              </PaddedColumn>
              <PaddedColumn>
                Total brûlé
                <TYPE.homeMedium color={theme.textHighlight2}>32,000,000</TYPE.homeMedium>
              </PaddedColumn>
              <PaddedColumn>
                Émissions actuelles
                <TYPE.homeMedium color={theme.textHighlight2}>0.095/bloc</TYPE.homeMedium>
              </PaddedColumn>
            </Grid>
          </AutoColumn>
        </Section>
        <LineSection style={{ width: '140%' }}>
          <StyledSVG viewBox="0 0 1660 48" xmlns="http://www.w3.org/2000/svg" size={'140%'}>
            <path d="M -346 48 C 174.985 46.1887 977.744 15.2453 1314 0 H -346 V 48 Z"></path>
          </StyledSVG>
        </LineSection>
        <Section style={{ display: 'block', padding: '50px 0px', height: '20px' }}>
          <Bottom style={{ display: 'block' }}>
            <AutoColumn gap="md" justify="flex-start">
              <TYPE.textBottom>Bottom 1</TYPE.textBottom>
            </AutoColumn>
            <AutoColumn gap="md" justify="flex-start">
              <TYPE.textBottom>Bottom 2</TYPE.textBottom>
            </AutoColumn>
            <AutoColumn gap="md" justify="flex-start">
              <TYPE.textBottom>Bottom 3</TYPE.textBottom>
            </AutoColumn>
          </Bottom>
        </Section>
{/* 
        <Section>
          <AutoColumn gap="md" justify="flex-start">
            <Grid>
              <PaddedColumn>
                Quantité en circulation
                <TYPE.homeMedium color={theme.textHighlight2}>32,000,000</TYPE.homeMedium>
              </PaddedColumn>
              <PaddedColumn>
                Apport total
                <TYPE.homeMedium color={theme.textHighlight2}>32,000,000</TYPE.homeMedium>
              </PaddedColumn>
              <PaddedColumn>
                Approvisionnement maximal
                <TYPE.homeMedium color={theme.textHighlight2}>32,000,000</TYPE.homeMedium>
              </PaddedColumn>
              <PaddedColumn>
                Capitalisation
                <TYPE.homeMedium color={theme.textHighlight2}>6,5 mille $</TYPE.homeMedium>
              </PaddedColumn>
              <PaddedColumn>
                Total brûlé
                <TYPE.homeMedium color={theme.textHighlight2}>32,000,000</TYPE.homeMedium>
              </PaddedColumn>
              <PaddedColumn>
                Émissions actuelles
                <TYPE.homeMedium color={theme.textHighlight2}>0.095/bloc</TYPE.homeMedium>
              </PaddedColumn>
            </Grid>
          </AutoColumn>
        </Section>
 */}
      </PageWrapper>
    </>
  )
}
