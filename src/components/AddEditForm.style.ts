import styled from 'styled-components'
import { View } from './Themed'

export const Container = styled(View)`
  flex: 1;
  align-items: center;
  justify-content: flex-start;
  padding: 40px 20px 20px;
  background-color: ${({ theme }) => theme.colors.rootBackground};
`

export const InputContainer = styled(View)`
  display: flex;
  gap: 20px;
  width: 100%;
  background-color: transparent;
`
