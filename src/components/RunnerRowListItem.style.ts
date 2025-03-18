import { Text } from './Themed'
import styled from 'styled-components'

export const Row = styled.button`
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  margin-top: 10px;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: 4px;
`

export const Cell = styled(Text)<{ $greedy?: boolean }>`
  padding: 10px 20px;
  font-size: 16px;
  flex-grow: ${({ $greedy }) => ($greedy ? 2 : 0)};
`
