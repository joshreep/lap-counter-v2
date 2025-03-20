'use client'

import { DBService } from '@/database/db-service'
import { InputRunnerRow } from '@/database/types'
import { useRouter } from 'next/navigation'
import { FC, useCallback, useRef, useState } from 'react'
import Button from './Button'
import ButtonGroup from './ButtonGroup'
import SubmitAnimation, { SubmissionState } from './SubmitAnimation'
import InputGroup from './form/InputGroup'

export interface AddEditFormProps {
  mode: 'add' | 'edit'
  params?: Record<string, string | undefined>
}

const AddEditForm: FC<AddEditFormProps> = (props) => {
  const { mode, params } = props
  const nameInputRef = useRef<HTMLInputElement>(null)
  const runnerNumberInputRef = useRef<HTMLInputElement>(null)
  const lapCountInputRef = useRef<HTMLInputElement>(null)

  const router = useRouter()

  const [runnerName, setRunnerName] = useState(params?.name ?? '')
  const [runnerNumber, setRunnerNumber] = useState(params?.runnerId ?? '')
  const [lapCount, setLapCount] = useState(params?.lapCount ? +params.lapCount : 0)
  const [submissionState, setSubmissionState] = useState(SubmissionState.Idle)

  const showLapCount = mode === 'edit'

  const onSubmit = useCallback(async () => {
    nameInputRef.current?.blur()
    runnerNumberInputRef.current?.blur()
    if (showLapCount) lapCountInputRef.current?.blur()
    setSubmissionState(SubmissionState.Pending)

    try {
      const input: InputRunnerRow = {
        name: runnerName,
        runnerId: runnerNumber,
        lapCount: lapCount,
      }
      await DBService.upsertRunner(input)
      setSubmissionState(SubmissionState.Complete)
    } catch (error) {
      console.error(error)
      setSubmissionState(SubmissionState.Error)
    }
  }, [lapCount, runnerName, runnerNumber, showLapCount])

  const onSubmitDelete = useCallback(async () => {
    nameInputRef.current?.blur()
    runnerNumberInputRef.current?.blur()
    if (showLapCount) lapCountInputRef.current?.blur()
    setSubmissionState(SubmissionState.Pending)

    try {
      if (params?.runnerId) await DBService.deleteRunner(params.runnerId)
      setSubmissionState(SubmissionState.Complete)
    } catch (error) {
      console.error(error)
      setSubmissionState(SubmissionState.Error)
    }
  }, [params?.runnerId, showLapCount])

  const confirmDelete = useCallback(() => {
    if (
      confirm(
        'Are you Sure?\nAre you Sure you want to delete this runner?  This action cannot be undone!',
      )
    ) {
      onSubmitDelete()
    }
  }, [onSubmitDelete])

  const onCheckAnimationFinish = useCallback(() => {
    setSubmissionState(SubmissionState.Idle)
    if (mode === 'add') {
      setRunnerName('')
      setRunnerNumber('')
      runnerNumberInputRef.current?.focus()
    } else {
      router.back()
    }
  }, [mode, router])

  return (
    <div className="flex flex-col flex-1 items-center justify-start pt-10 pb-5 px-5">
      <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-5 w-full">
        <InputGroup
          data-testid="runnerIdInput"
          disabled={mode === 'edit'}
          enterKeyHint="next"
          id="runnerId"
          label="Runner Number"
          min={0}
          onChange={(e) => setRunnerNumber(e.target.value)}
          onBlur={() => nameInputRef.current?.focus()}
          pattern="\d*"
          ref={runnerNumberInputRef}
          type="number"
          value={runnerNumber}
        />
        <InputGroup
          autoCapitalize="words"
          data-testid="runnerNameInput"
          enterKeyHint="next"
          id="name"
          label="Name"
          onChange={(e) => setRunnerName(e.target.value)}
          onBlur={() => showLapCount && lapCountInputRef.current?.focus()}
          ref={nameInputRef}
          value={runnerName}
        />
        {showLapCount && (
          <InputGroup
            data-testid="lapCountInput"
            enterKeyHint="done"
            id="lapCount"
            label="Lap Count"
            min={0}
            onChange={(e) => setLapCount(+e.target.value)}
            pattern="\d*"
            ref={lapCountInputRef}
            type="number"
            value={lapCount.toString()}
          />
        )}
        <ButtonGroup className="flex-row-reverse">
          <Button onClick={onSubmit} className="bg-primary text-white">
            Submit
          </Button>
          {mode === 'edit' && (
            <Button onClick={confirmDelete} buttonStyle="error">
              Delete
            </Button>
          )}
        </ButtonGroup>
      </form>

      <SubmitAnimation
        submissionState={submissionState}
        onAnimationFinish={onCheckAnimationFinish}
      />
    </div>
  )
}

export default AddEditForm
