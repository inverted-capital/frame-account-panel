import { useExists, useJson } from '@artifact/client/hooks'
import { accountDataSchema } from '../types/account.ts'

const notFoundError = new Error('profile.json not found')

const useAccountData = () => {
  const exists = useExists('profile.json')
  const json = useJson('profile.json')

  const loading = exists !== false && json === undefined
  const error = exists === false ? notFoundError : undefined

  const safe = accountDataSchema.safeParse(json)
  const data = safe.success ? safe.data : undefined

  return { data, loading, error }
}

export default useAccountData
