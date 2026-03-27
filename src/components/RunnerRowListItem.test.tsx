import { Grade } from '@/database/types'
import { forEachTheme } from '@/test-utils/ThemeWrapper'
import { render } from '@testing-library/react'
import RunnerRowListItem from './RunnerRowListItem'

forEachTheme((theme) => {
  describe(`${theme} theme`, () => {
    test('should match snapshot', () => {
      const { container } = render(
        <RunnerRowListItem
          clickable
          item={{ runnerId: '1', name: 'George Washington', grade: Grade.Fifth, lapCount: 100 }}
        />,
      )
      expect(container.firstChild).toMatchSnapshot()
    })

    test('should render with no name prop', () => {
      const { container } = render(
        <RunnerRowListItem clickable item={{ runnerId: '1', grade: Grade.NA, lapCount: 100 }} />,
      )
      expect(container.firstChild).toMatchSnapshot()
    })
  })
})
