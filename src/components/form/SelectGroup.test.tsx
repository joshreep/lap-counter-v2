import { forEachTheme } from '@/test-utils/ThemeWrapper'
import SelectGroup from './SelectGroup'
import { fireEvent, render } from '@testing-library/react'

const options = [
  { label: 'Option A', value: 'a' },
  { label: 'Option B', value: 'b' },
  { label: 'Option C', value: 'c' },
]

forEachTheme((theme) => {
  describe(`${theme} theme`, () => {
    test('should match snapshot', () => {
      const { container } = render(
        <SelectGroup id="test" label="Test Label" options={options} value="" onChange={() => {}} />,
      )
      expect(container.firstChild).toMatchSnapshot()
    })

    test('should render all options plus the placeholder', () => {
      const { getAllByRole } = render(
        <SelectGroup id="test" label="Test Label" options={options} value="" onChange={() => {}} />,
      )
      const optionElements = getAllByRole('option')
      expect(optionElements).toHaveLength(options.length + 1)
      expect((optionElements[0] as HTMLOptionElement).disabled).toBe(true)
    })

    test('should call onChange when selection changes', () => {
      const handleChange = jest.fn()
      const { getByLabelText } = render(
        <SelectGroup
          id="test"
          label="Test Label"
          options={options}
          value=""
          onChange={handleChange}
        />,
      )
      fireEvent.change(getByLabelText('Test Label'), { target: { value: 'b' } })
      expect(handleChange).toHaveBeenCalled()
    })
  })
})
