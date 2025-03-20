'use client'

import SubmitAnimation, { SubmissionState } from '@/components/SubmitAnimation'
import { DBService } from '@/database/db-service'
import React, { FC, FocusEventHandler, useCallback, useRef, useState } from 'react'

const IndexPage: FC = () => {
  const inputRef = useRef<HTMLInputElement>(null)

  const [value, setValue] = useState('')
  const [submissionState, setSubmissionState] = useState(SubmissionState.Idle)
  const [error, setError] = useState<string>()

  const handleSubmit: FocusEventHandler<HTMLInputElement> = useCallback(async (event) => {
    if (!event.target.value) return

    setSubmissionState(SubmissionState.Pending)

    try {
      await DBService.incrementRunnerLap(event.target.value)
      setSubmissionState(SubmissionState.Complete)
    } catch (error) {
      console.error(error)
      setSubmissionState(SubmissionState.Error)
      if (typeof error === 'string') setError(error)
      if (error instanceof Error) setError(error.message)
    }
  }, [])

  const onAnimationFinish = useCallback(() => {
    setSubmissionState(SubmissionState.Idle)
    inputRef.current?.focus()
  }, [])

  const handleFocus = useCallback(() => {
    setSubmissionState(SubmissionState.Idle)
    setValue('')
  }, [])

  return (
    <form className="flex-1 flex-col flex items-center justify-center gap-5 h-full">
      <p className="text-center text-lg">
        To add 1 lap to a runner&apos;s account, enter the runners number below and press
        &ldquo;done&rdquo;.
      </p>
      <label htmlFor="runner-number" className="text-4xl">
        Runner Number
      </label>
      <input
        id="runner-number"
        type="number"
        className="bg-input-bg border-border text-5xl w-full p-6 rounded-lg text-center"
        min={0}
        enterKeyHint="done"
        pattern="\d*"
        onBlur={handleSubmit}
        onFocus={handleFocus}
        value={value}
        ref={inputRef}
        onChange={(event) => setValue(event.target.value)}
        disabled={[SubmissionState.Complete, SubmissionState.Pending].includes(submissionState)}
      />
      {submissionState === SubmissionState.Error && (
        <p className="text-error text-center">{error}</p>
      )}
      <SubmitAnimation submissionState={submissionState} onAnimationFinish={onAnimationFinish} />
    </form>
  )
}

export default IndexPage
