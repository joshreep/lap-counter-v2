import MatchMediaMock from 'jest-matchmedia-mock'

type Theme = 'light' | 'dark'

const themes: Theme[] = ['light', 'dark']

export function forEachTheme(callback: (theme: Theme) => void) {
  themes.forEach((theme) => {
    const matchMedia = new MatchMediaMock()
    matchMedia.useMediaQuery(`(prefers-color-scheme: ${theme})`)

    callback(theme)

    matchMedia.clear()
  })
}
