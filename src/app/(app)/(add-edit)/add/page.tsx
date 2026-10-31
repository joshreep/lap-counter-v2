import AddEditForm from '@/components/AddEditForm'
import React, { FC } from 'react'

type SearchParams = Promise<{ [key: string]: string | undefined }>

const AddPage: FC<{ searchParams: SearchParams }> = async ({ searchParams }) => {
  const params = await searchParams
  return <AddEditForm mode="add" params={params} />
}

export default AddPage
