import { useExists, useTypedFile } from '@artifact/client/hooks'
import { accountDataSchema, type AccountData } from '../types/account.ts'
import { useEffect, useMemo, useState } from 'react'
import equals from 'fast-deep-equal'

const notFoundError = new Error('profile.json not found')

const useAccountData = () => {
  const exists = useExists('profile.json')
  const data = useTypedFile('profile.json', accountDataSchema.parse)

  const loading = exists !== false && data === undefined
  const error = exists === false ? notFoundError : undefined

  return { data, loading, error }
}

export default useAccountData
