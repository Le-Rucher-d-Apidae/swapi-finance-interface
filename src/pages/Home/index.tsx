import React from 'react'

// import styled, { ThemeContext } from 'styled-components'
// import styled from 'styled-components'
import styled, { keyframes } from 'styled-components'
import { AutoColumn } from '../../components/Column'
// import { AutoRow } from '../../components/Row'
import { TYPE } from '../../theme'
import apidaeCoin from '../../assets/images/apidae-coin.png'

const PageWrapper = styled(AutoColumn)`
  border: 1px solid red;
  padding: 100px;
  width: 100%;
`

const rotateImg = keyframes`
  0% {
    transform:translate(0);
  }
  20% {
    transform:translate(8px,-8px);
  }
  80% {
    transform:translate(8px,8px);
  }
  60% {
    transform:translate(-8px,8px);
  }
  80% {
    transform:translate(-8px,-8px);
  }
  100% {
    transform:translate(0);
  }
`

/* export */ const BagTokenAnimated = styled.img`
  animation: ${rotateImg} 10s infinite;
`

export default function Home() {
  return (
    <>
      <PageWrapper>
        <AutoColumn gap="md" justify="flex-start">
          <TYPE.white fontSize={48} fontWeight={600} color="yellow1">
            A
          </TYPE.white>
        </AutoColumn>
        <AutoColumn gap="md" justify="flex-end">
          B
          <BagTokenAnimated width="400px" src={apidaeCoin} />{' '}
        </AutoColumn>
      </PageWrapper>
    </>
  )
}
