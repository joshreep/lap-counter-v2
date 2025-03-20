import { DBService } from '@/database/db-service'
import { InputRunnerRow } from '@/database/types'
import { FC, useCallback, useRef, useState } from 'react'
import { Container, InputContainer } from './AddEditForm.style'
import SubmitAnimation, { SubmissionState } from './SubmitAnimation'
import InputGroup from './form/InputGroup'
import { ButtonGroup } from './Button'
import { useParams } from 'next/navigation'
import { useRouter } from 'next/router'

export interface AddEditFormProps {
  mode: 'add' | 'edit'
}

const AddEditForm: FC<AddEditFormProps> = (props) => {
  const { mode } = props
  const nameInputRef = useRef<HTMLInputElement>(null)
  const runnerNumberInputRef = useRef<HTMLInputElement>(null)
  const lapCountInputRef = useRef<HTMLInputElement>(null)

  const params = useParams<{ name?: string; runnerId?: string; lapCount?: string }>()
  const router = useRouter()

  const [runnerName, setRunnerName] = useState(params.name ?? '')
  const [runnerNumber, setRunnerNumber] = useState(params.runnerId ?? '')
  const [lapCount, setLapCount] = useState(params.lapCount ? +params.lapCount : 0)
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
      if (params.runnerId) await DBService.deleteRunner(params.runnerId)
      setSubmissionState(SubmissionState.Complete)
      router.back()
    } catch (error) {
      console.error(error)
      setSubmissionState(SubmissionState.Error)
    }
  }, [params.runnerId, router, showLapCount])

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
      nameInputRef.current?.focus()
    } else {
      router.back()
    }
  }, [mode, router])

  return (
    <Container>
      <InputContainer>
        <InputGroup
          disabled={mode === 'edit'}
          type="number"
          label="Runner Number"
          onChange={(e) => setRunnerNumber(e.target.value)}
          onSubmitEditing={() => nameInputRef.current?.focus()}
          ref={runnerNumberInputRef}
          returnKeyType="done"
          testID="runnerIdInput"
          value={runnerNumber}
        />
        <InputGroup
          autoCapitalize="words"
          label="Name"
          onChangeText={setRunnerName}
          onSubmitEditing={() => (mode === 'add' ? onSubmit() : lapCountInputRef.current?.focus())}
          ref={nameInputRef}
          returnKeyType="next"
          testID="runnerNameInput"
          textContentType="name"
          value={runnerName}
        />
        {showLapCount && (
          <InputGroup
            keyboardType="number-pad"
            label="Lap Count"
            onChangeText={(text) => setLapCount(+text)}
            onSubmitEditing={() => onSubmit()}
            ref={lapCountInputRef}
            returnKeyType="done"
            testID="lapCountInput"
            value={lapCount.toString()}
          />
        )}
        <ButtonGroup>
          {mode === 'edit' && <Button title="Delete" onPress={confirmDelete} color="red" />}
          <Button title="Submit" onPress={onSubmit} />
        </ButtonGroup>
      </InputContainer>

      <SubmitAnimation
        submissionState={submissionState}
        onAnimationFinish={onCheckAnimationFinish}
      />

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </Container>
  )
}

export default AddEditForm
