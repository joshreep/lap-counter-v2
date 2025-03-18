import styled from 'styled-components'
import { View } from './Themed'
import Lottie from 'lottie-react'

export const ButtonGroup = styled(View)`
  display: flex;
  justify-content: space-between;
  gap: 1.25rem;
  background-color: transparent;
`

export const Button = styled.button<{ $style: 'primary' | 'secondary' }>`
  padding: 0.75rem 1.25rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  border: none;
  background-color: ${({ theme, $style }) => theme.colors[$style]};
  :active {
    background-color: darken(${({ theme, $style }) => theme.colors[$style]}, 10%);
  }
`

export const BaseAnimation = styled(Lottie).attrs({ autoPlay: true })`
  width: 200px;
  height: 200px;
`

export const CheckAnimation = styled(BaseAnimation).attrs({
  loop: false,
  speed: 2,
})``

export const LoadingAnimation = styled(BaseAnimation).attrs({
  loop: true,
})``
