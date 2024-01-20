import React from 'react'
import styled from 'styled-components'
import PoweredByPolygonPOS from '../../assets/images/Powered by Polygon (MATIC)  Logo Vector.png'

const StyledLogo = styled.img`
  position: fixed;
  display: flex;
  left: 0;
  bottom: 0;
  width: 15%;
`

export default function PoweredByPolygon() {
  return <StyledLogo src={PoweredByPolygonPOS} alt="Powered by Polygon PoS Chain" />
}
