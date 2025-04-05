import { forEachTheme } from '@/test-utils/ThemeWrapper'
import AddEditForm, { AddEditFormProps } from './AddEditForm'
import { fireEvent, render } from '@testing-library/react'
import { act } from 'react'
import RunnersService from '@/database/runners-service'

const modes: AddEditFormProps['mode'][] = ['add', 'edit']

jest.mock('@/database/runners-service')
jest.mock('next/router')
jest.useFakeTimers()

forEachTheme((theme) => {
  describe(`${theme} theme`, () => {
    modes.forEach((mode) => {
      describe(`${mode} mode`, () => {
        afterEach(() => {
          ;(RunnersService.upsert as jest.Mock).mockReset()
        })

        test('should match snapshot', () => {
          const { container } = render(<AddEditForm mode={mode} />)
          expect(container.firstChild).toMatchSnapshot()
        })

        test('should handle inputs and submit editing', async () => {
          const { getByLabelText, getByText } = render(<AddEditForm mode={mode} />)

          const runnerIdInput = getByLabelText('Runner Number') as HTMLInputElement
          const runnerNameInput = getByLabelText('Name') as HTMLInputElement

          if (mode === 'add') {
            act(() => fireEvent.change(runnerIdInput, { target: { value: '1' } }))
            expect(runnerIdInput.value).toBe('1')
            act(() => fireEvent.blur(runnerIdInput))
          }
          act(() => fireEvent.change(runnerNameInput, { target: { value: 'Thomas Jefferson' } }))
          expect(runnerNameInput.value).toBe('Thomas Jefferson')
          if (mode === 'add') {
            await act(async () => fireEvent.click(getByText('Submit')))
            expect(RunnersService.upsert).toHaveBeenCalled()
          }
          if (mode === 'edit') {
            const lapCountInput = getByLabelText('Lap Count') as HTMLInputElement
            expect(RunnersService.upsert).not.toHaveBeenCalled()
            act(() => fireEvent.change(lapCountInput, { target: { value: 101 } }))
            expect(lapCountInput.value).toBe('101')
            await act(async () => fireEvent.click(getByText('Submit')))
            expect(RunnersService.upsert).toHaveBeenCalled()
          }
        })

        test('should handle submit', async () => {
          const { getByLabelText, getByText } = render(<AddEditForm mode={mode} />)

          const runnerIdInput = getByLabelText('Runner Number') as HTMLInputElement
          const runnerNameInput = getByLabelText('Name') as HTMLInputElement

          act(() => {
            if (mode === 'add') fireEvent.change(runnerIdInput, { target: { value: '1' } })
            fireEvent.change(runnerNameInput, { target: { value: 'George Washington' } })
            if (mode === 'edit')
              fireEvent.change(getByLabelText('Lap Count'), { target: { value: 20 } })
          })
          await act(async () => {
            fireEvent.click(getByText('Submit'))
          })

          expect(RunnersService.upsert).toHaveBeenCalled()

          // allow animations to finish
          act(() => {
            jest.runAllTimers()
          })

          if (mode === 'add') {
            expect(runnerIdInput.value).toBe('')
            expect(runnerNameInput.value).toBe('')
          }
        })

        if (mode === 'edit') {
          test('should handle delete', async () => {
            const { getByText } = render(
              <AddEditForm
                mode="edit"
                params={{ name: 'George', runnerId: '17', lapCount: '10' }}
              />,
            )

            const confirmSpy = jest.spyOn(window, 'confirm').mockImplementation(() => true)

            await act(async () => {
              fireEvent.click(getByText('Delete'))
            })

            expect(confirmSpy).toHaveBeenCalled()
            expect(RunnersService.delete).toHaveBeenCalledWith('17')

            confirmSpy.mockRestore()
          })
        }
      })
    })
  })
})
