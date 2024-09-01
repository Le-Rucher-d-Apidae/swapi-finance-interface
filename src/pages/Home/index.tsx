import React, { useContext } from 'react'

import styled, { keyframes, ThemeContext } from 'styled-components'
import { AutoColumn } from '../../components/Column'
import { Box } from 'rebass/styled-components'
import { Text } from 'rebass'

import { TYPE, StyledInternalLink } from '../../theme'
import apidaeCoin from '../../assets/images/apidae-coin.png'
import { ButtonSecondary } from '../../components/Button'

import { Link } from 'react-router-dom'
import { darken } from 'polished'
import { SELF_TOKEN, USDC } from '../../constants'
// import { ReactComponent as Line } from '../../assets/images/line.svg'
import { useActiveWeb3React } from '../../hooks'
import { ChainId, TokenAmount } from '@swapi-finance/sdk'
import { useTotalSupply } from '../../data/TotalSupply'
import { useTokenBalance } from '../../state/wallet/hooks'

const PageWrapper = styled(AutoColumn)`
  padding: 0px;
  width: 100%;
  display: block;
  scrollbar-color: red red;
`

const Section = styled(AutoColumn)`
  padding: 20px;
  width: 100%;
  display: flex;
`

const Section2 = styled(AutoColumn)`
  width: 150%;
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
  height: 100%;
  display: flex;
  background: ${({ theme }) => theme.pageBottomBackground};
`
const StyledSVG = styled.svg<{ size: string; stroke?: string }>`
  display: flex;
  overflow: hidden;
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
  const { chainId } = useActiveWeb3React()
  const selfToken = chainId ? SELF_TOKEN[chainId] : SELF_TOKEN[ChainId.POLYGON]
  const totalSupply: TokenAmount | undefined = useTotalSupply(selfToken)
  const treasuryAccoutTokenBalance: TokenAmount | undefined = useTokenBalance(
    `${process.env.REACT_APP_TREASURY_ACCOUNT}` ?? undefined,
    selfToken
  )
  const circulatingSupply = totalSupply?.subtract(treasuryAccoutTokenBalance ?? new TokenAmount(selfToken, '0'))
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
              Les jetons BWS sont au c&oelig;ur de l&apos;écosystème de Swapi qui fait le lien entre investisseur et
              producteur. producteur. Achetez-les, gagnez-les, dépensez-les, utilisez-les pour le yield farming ou le en
              en participant a une bonne &oelig;uvre.
            </TYPE.homeNormal>

            <Row display={'block'} padding={'20px 0px 0px 10px ;'}>
              <ButtonBuy2
                style={{ display: 'inline-block' }}
                as={Link}
                to={`swap?inputCurrency=${USDC[chainId ? chainId : ChainId.POLYGON].address}&outputCurrency=${
                  SELF_TOKEN[chainId ? chainId : ChainId.POLYGON].address
                }`}
              >
                <Text fontWeight={500} fontSize={16}>
                  Acheter des BWS
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
                <TYPE.homeMedium color={theme.textHighlight2}>
                  {circulatingSupply?.toFixed(0, { groupSeparator: ',' })}
                </TYPE.homeMedium>
              </PaddedColumn>
              <PaddedColumn>
                Total
                <TYPE.homeMedium color={theme.textHighlight2}>
                  {totalSupply?.toFixed(0, { groupSeparator: ',' })}
                </TYPE.homeMedium>
              </PaddedColumn>
              <PaddedColumn>
                Maximal
                <TYPE.homeMedium color={theme.textHighlight2}>
                  {totalSupply?.toFixed(0, { groupSeparator: ',' })}
                </TYPE.homeMedium>
              </PaddedColumn>
              <PaddedColumn>
                Capitalisation
                <TYPE.homeMedium color={theme.textHighlight2}>-- $</TYPE.homeMedium>
              </PaddedColumn>
              <PaddedColumn>
                Total brûlé
                <TYPE.homeMedium color={theme.textHighlight2}>--</TYPE.homeMedium>
              </PaddedColumn>
              <PaddedColumn>
                Émissions actuelles
                <TYPE.homeMedium color={theme.textHighlight2}>--/bloc</TYPE.homeMedium>
              </PaddedColumn>
            </Grid>
          </AutoColumn>
        </Section>
        <Section2>
          <LineSection>
            <StyledSVG viewBox="0 0 1660 48" xmlns="http://www.w3.org/2000/svg" size={'100%'}>
              <path d="M -346 48 C 174.985 46.1887 977.744 15.2453 1314 0 H -346 V 48 Z"></path>
            </StyledSVG>
          </LineSection>
        </Section2>
        <Section style={{ display: 'block', padding: '50px 0px', height: '20px' }}>
          <Bottom style={{ display: 'block' }}>
            {/* 
            <AutoColumn gap="md" justify="flex-start">
              <TYPE.textBottom>Bottom 1</TYPE.textBottom>
            </AutoColumn>
            <AutoColumn gap="md" justify="flex-start">
              <TYPE.textBottom>Bottom 2</TYPE.textBottom>
            </AutoColumn>
            <AutoColumn gap="md" justify="flex-start">
              <TYPE.textBottom>Bottom 3</TYPE.textBottom>
            </AutoColumn>
             */}
          </Bottom>
        </Section>
        {/* 
        <Section>
          <AutoColumn gap="md" justify="flex-start">
            <Grid>
              <PaddedColumn>
                Quantité en circulation
                <TYPE.homeMedium color={theme.textHighlight2}>8,000,000</TYPE.homeMedium>
              </PaddedColumn>
              <PaddedColumn>
                Apport total
                <TYPE.homeMedium color={theme.textHighlight2}>8,000,000</TYPE.homeMedium>
              </PaddedColumn>
              <PaddedColumn>
                Approvisionnement maximal
                <TYPE.homeMedium color={theme.textHighlight2}>8,000,000</TYPE.homeMedium>
              </PaddedColumn>
              <PaddedColumn>
                Capitalisation
                <TYPE.homeMedium color={theme.textHighlight2}>6,5 mille $</TYPE.homeMedium>
              </PaddedColumn>
              <PaddedColumn>
                Total brûlé
                <TYPE.homeMedium color={theme.textHighlight2}>8,000,000</TYPE.homeMedium>
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
