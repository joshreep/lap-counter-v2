import { forEachTheme } from '@/test-utils/ThemeWrapper'
import { render } from '@testing-library/react'
import RunnerRowListItem from './RunnerRowListItem'

forEachTheme((theme) => {
  describe(`${theme} theme`, () => {
    test('should match snapshot', () => {
      const { container } = render(
        <RunnerRowListItem item={{ runnerId: '1', name: 'George Washington', lapCount: 100 }} />,
      )
      expect(container.firstChild).toMatchSnapshot()
    })

    test('should render with no name prop', () => {
      const { container } = render(<RunnerRowListItem item={{ runnerId: '1', lapCount: 100 }} />)
      expect(container.firstChild).toMatchSnapshot()
    })
  })
})
