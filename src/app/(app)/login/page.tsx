'use client'

import { AuthContext, AuthStatus } from '@/authentication/auth'
import Button from '@/components/Button'
import ButtonGroup from '@/components/ButtonGroup'
import InputGroup from '@/components/form/InputGroup'
import LoadingAnimation from '@/components/LoadingAnimation'
import { FirebaseError } from 'firebase/app'
import { FC, FormEventHandler, useCallback, useContext, useRef, useState } from 'react'

const LoginPage: FC = () => {
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorDirty, setErrorDirty] = useState(false)
  const [customFormError, setCustomFormError] = useState('')
  const { authStatus, error, resetPassword, signIn } = useContext(AuthContext)

  const resetErrorState = useCallback(() => {
    setErrorDirty(true)
    setCustomFormError('')
  }, [])

  const onSubmit: FormEventHandler = useCallback(
    (event) => {
      event.preventDefault()
      setErrorDirty(false)
      signIn(email, password)
    },
    [email, password, signIn],
  )

  return (
    <form className="flex justify-center items-center p-5 h-full" onSubmit={onSubmit}>
      <div className="flex flex-col gap-5 w-full">
        <h1 className="text-center text-xl">Sign In with Email and Password</h1>
        <InputGroup
          autoCapitalize="false"
          autoComplete="email"
          enterKeyHint="next"
          id="email"
          inputMode="email"
          label="Email"
          onBlur={(e) => setEmail(e.target.value)}
          onChange={(e) => setEmail(e.target.value)}
          onFocus={resetErrorState}
          onSubmit={() => passwordRef.current?.focus()}
          ref={emailRef}
          type="email"
          value={email}
          tabIndex={0}
        />
        <InputGroup
          autoCapitalize="false"
          autoComplete="current-password"
          enterKeyHint="done"
          id="password"
          inputMode="text"
          label="Password"
          onBlur={(e) => setPassword(e.target.value)}
          onChange={(e) => setPassword(e.target.value)}
          onFocus={resetErrorState}
          ref={passwordRef}
          type="password"
          value={password}
          tabIndex={0}
        />
        {authStatus === AuthStatus.Error && !errorDirty && (
          <p className="text-center text-error text-sm">{getErrorText(error, email)}</p>
        )}
        {customFormError && <p className="text-center text-error text-sm">{customFormError}</p>}
        <ButtonGroup>
          <Button type="button" buttonStyle="secondary" onClick={() => resetPassword(email)}>
            Forgot Password
          </Button>
          <Button type="submit" buttonStyle="primary" tabIndex={0}>
            Sign In
          </Button>
        </ButtonGroup>
      </div>
      {authStatus === AuthStatus.Pending && <LoadingAnimation />}
    </form>
  )
}

export default LoginPage

function getErrorText(error: unknown, email: string): string {
  console.error(error)
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case 'auth/invalid-credential':
        return 'Incorrect username or password.  Please try again.'

      case 'auth/missing-email':
      case 'auth/invalid-email':
        if (!email) return 'Email is required.'
        return `The provided email (${email}) is not a valid email address.`

      case 'auth/too-many-requests':
        return error.message.replace('Firebase: ', '').replace(` (${error.code}).`, '')

      case 'auth/missing-password':
        return 'Password is required.'
    }
  }

  return 'Something went wrong trying to log in.  Please try again.'
}
