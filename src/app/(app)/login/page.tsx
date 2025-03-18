'use client'

import loadingAnimation from '@/animations/loading-animation.json'
import { AuthContext, AuthStatus } from '@/authentication/auth'
import InputGroup from '@/components/form/InputGroup'
import { Button, ButtonGroup, LoadingAnimation } from '@/components/styles'
import { Text, View } from '@/components/Themed'
import { FirebaseError } from 'firebase/app'
import { FC, useCallback, useContext, useRef, useState } from 'react'
import styled from 'styled-components'

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

  const onSubmit = useCallback(
    (email: string, password: string) => {
      setErrorDirty(false)
      signIn(email, password)
    },
    [signIn],
  )

  return (
    <Container>
      <InputContainer>
        <Title>Sign In with Email and Password</Title>
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
          <ErrorText>{getErrorText(error, email)}</ErrorText>
        )}
        {customFormError && <ErrorText>{customFormError}</ErrorText>}
        <ButtonGroup>
          <Button type="button" $style="secondary" onClick={() => resetPassword(email)}>
            Forgot Password
          </Button>
          <Button type="submit" $style="primary" onClick={() => onSubmit(email, password)}>
            Sign In
          </Button>
        </ButtonGroup>
      </InputContainer>
      {authStatus === AuthStatus.Pending && <LoadingAnimation animationData={loadingAnimation} />}
    </Container>
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

const Container = styled(View).attrs({ $rootBackground: true })`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1.25rem;
  height: 100%;
`

const InputContainer = styled(View)`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  width: 100%;
  background-color: transparent;
`
const Title = styled(Text('h1'))`
  text-align: center;
  font-size: 1.25rem;
`

const ErrorText = styled('p')`
  color: ${({ theme }) => theme.colors.error};
  text-align: center;
  font-size: 0.875rem;
`
