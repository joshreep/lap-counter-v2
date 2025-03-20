'use client'

import { QueryStatus, useRunners } from '@/database/db-service'
import { faSpinner } from '@fortawesome/free-solid-svg-icons/faSpinner'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import usePrevious from '@joshreep/captain-hooks/dist/usePrevious'
import React, { FC } from 'react'

const ListPage: FC = () => {
  const { data, status } = useRunners()
  const previousStatus = usePrevious(status)

  const isLoading = !previousStatus && status === QueryStatus.Loading

  return (
    <>
      {isLoading && <FontAwesomeIcon icon={faSpinner} className="fa-2xl fa-spin" />}
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </>
  )
}

export default ListPage

// const Container = styled(View).attrs({ $rootBackground: true })`
//   display: flex;
//   flex-direction: column;
//   flex: 1;
//   align-items: center;
//   justify-content: center;
//   padding: 1.25rem;
//   gap: 1.25rem;
// `
