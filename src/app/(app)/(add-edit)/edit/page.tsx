import AddEditForm from '@/components/AddEditForm'
import React, { FC } from 'react'

type SearchParams = Promise<{ [key: string]: string | undefined }>

const EditPage: FC<{ searchParams: SearchParams }> = async ({ searchParams }) => {
  const params = await searchParams
  return <AddEditForm mode="edit" params={params} />
}

export default EditPage
