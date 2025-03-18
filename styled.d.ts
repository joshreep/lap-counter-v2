import 'styled-components'

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      background: string
      border: string
      card: string
      disabledInputBackground: string
      disabledText: string
      error: string
      inputBackground: string
      notification: string
      primary: string
      secondary: string
      rootBackground: string
      text: string
    }
    dark: boolean
  }
}
