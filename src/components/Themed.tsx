/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import { HTMLAttributes } from 'react'
import styled from 'styled-components'

type ThemeProps = {
  lightColor?: string
  darkColor?: string
}

export type ViewProps = HTMLAttributes<HTMLDivElement> & ThemeProps & { $rootBackground?: boolean }

export const TextInput = styled.input`
  color: ${({ theme }) => theme.colors.text};
  background-color: ${({ theme }) => theme.colors.inputBackground};
  border-radius: 4px;
`

type TextTags = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span'

export const Text = (tag: TextTags = 'p') => styled(tag)`
  color: ${({ theme }) => theme.colors.text};
`

export const View = styled.div<ViewProps>`
  background-color: ${(props) =>
    ((props.theme.dark ? props.darkColor : props.lightColor) ?? props.$rootBackground)
      ? props.theme.colors.rootBackground
      : props.theme.colors.background};
`
