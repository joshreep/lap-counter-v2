import styled from 'styled-components'
import { Text, TextInput, View } from '../Themed'

export const Group = styled(View)`
  display: flex;
  flex-direction: column;
  background-color: transparent;
  gap: 4px;
`
export const Label = styled.label<{ disabled?: boolean }>`
  padding: 0;
  font-size: 16px;
  margin-left: 5px;
  color: ${({ theme, disabled }) => (disabled ? theme.colors.disabledText : theme.colors.text)};
`
export const Input = styled(TextInput)`
  width: 100%;
  padding: 15px;
  font-size: 16px;
  border-style: solid;
`
export const DisabledInput = styled(View)`
  width: 100%;
  padding: 15px;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.disabledInputBackground};
`

export const DisabledInputText = styled(Text('p'))`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.disabledText};
`
