import React from 'react'

// import styled, { ThemeContext } from 'styled-components'
// import styled from 'styled-components'
import styled, { keyframes } from 'styled-components'
import { AutoColumn } from '../../components/Column'
// import { AutoRow } from '../../components/Row'
// import { RowBetween, RowFixed } from '../../components/Row'
// import { RowBetween } from '../../components/Row'
import { Box } from 'rebass/styled-components'

import { TYPE } from '../../theme'
import apidaeCoin from '../../assets/images/apidae-coin.png'

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

export default function Home() {
  return (
    <>
      <PageWrapper>


        <Section>

          <Row border={'1px solid blue'} display={'flex'}>
            <TYPE.largeHeader fontWeight={600}>La</TYPE.largeHeader>
            <TYPE.white fontWeight={600}>
              première ferme de rendement au profit de la préservation des abeilles
            </TYPE.white>

            <TYPE.white fontWeight={600}>
              Les jetons APT sont au cœur de l&apos;écosystème de Swapi qui fait le lien entre investisseur et producteur.
              Achetez-les, gagnez-les, dépensez-les, utilisez-les pour le yield farming ou le staking tout en participant
              a une bonne œuvre.
            </TYPE.white>

            <TYPE.white fontWeight={600}>
              La première ferme de rendement au profit de la préservation des abeilles
            </TYPE.white>

            <TYPE.white>...</TYPE.white>

            <AutoColumn gap="md" justify="flex-start">
              <TYPE.white fontSize={48} fontWeight={600} color="yellow1">
                A
              </TYPE.white>
            </AutoColumn>
          </Row>
          <Row display={'block'} padding={'0px 0% 0px 0px ;'}>
            <AutoColumn gap="md" justify="flex-end">
              <BagTokenAnimated object-fit={'fill'} src={apidaeCoin} />{' '}
            </AutoColumn>

            <TYPE.white fontWeight={600}>Liquidity provider rewards</TYPE.white>
            <TYPE.white></TYPE.white>

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
