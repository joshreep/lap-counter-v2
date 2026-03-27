import { Gender, Grade, QueryStatus, RunnerRow } from '@/database/types'
import { forEachTheme } from '@/test-utils/ThemeWrapper'
import { render } from '@testing-library/react'
import GroupedRunnerList from './GroupedRunnerList'

const mockRunners: RunnerRow[] = [
  { runnerId: '1', name: 'George Washington', grade: Grade.Fifth, gender: Gender.Boy, lapCount: 10 },
  { runnerId: '2', name: 'John Adams', grade: Grade.Fourth, gender: Gender.Boy, lapCount: 7 },
  { runnerId: '3', name: 'Thomas Jefferson', grade: Grade.Third, gender: Gender.Boy, lapCount: 7 },
  { runnerId: '4', name: 'Abraham Lincoln', grade: Grade.K, gender: Gender.Girl, lapCount: 5 },
]

jest.mock('@/database/runners-service', () => ({
  __esModule: true,
  useRunners: () => ({ data: mockRunners, status: QueryStatus.Idle, refreshData: jest.fn() }),
  default: {},
}))

forEachTheme((theme) => {
  describe(`${theme} theme`, () => {
    test('should match snapshot', () => {
      const { container } = render(<GroupedRunnerList />)
      expect(container.firstChild).toMatchSnapshot()
    })

    test('should match snapshot with autoScroll', () => {
      const { container } = render(<GroupedRunnerList autoScroll />)
      expect(container.firstChild).toMatchSnapshot()
    })

    test('should render group headers', () => {
      const { getByText } = render(<GroupedRunnerList />)

      expect(getByText('Kindergarten - Girls')).toBeTruthy()
      expect(getByText('3rd Grade - Boys')).toBeTruthy()
      expect(getByText('4th Grade - Boys')).toBeTruthy()
      expect(getByText('5th Grade - Boys')).toBeTruthy()
    })
  })
})
