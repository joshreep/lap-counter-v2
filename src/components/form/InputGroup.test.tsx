import { forEachTheme } from '@/test-utils/ThemeWrapper'
import InputGroup from './InputGroup'
import { render } from '@testing-library/react'

forEachTheme((theme) => {
  describe(`${theme} theme`, () => {
    test('should match snapshot', () => {
      const { container } = render(
        <InputGroup id="name" label="Name" value="George Washington" onChange={jest.fn()} />,
      )
      expect(container.firstChild).toMatchSnapshot()
    })

    test('should match snapshot when disabled', () => {
      const { container } = render(
        <InputGroup
          id="birthday"
          label="Birthday"
          value="7/4/1776"
          disabled
          onChange={jest.fn()}
        />,
      )
      expect(container.firstChild).toMatchSnapshot()
    })
  })
})
