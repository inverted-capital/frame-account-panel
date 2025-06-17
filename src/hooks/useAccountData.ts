import { useExists, useTypedFile } from '@artifact/client/hooks'
import { accountDataSchema } from '../types/account.ts'

const notFoundError = new Error('profile.json not found')

const useAccountData = () => {
  const exists = useExists('profile.json')
  const data = useTypedFile('profile.json', accountDataSchema.parse)

  const loading = exists !== false && data === undefined
  const error = exists === false ? notFoundError : undefined

  return { data, loading, error }
}

export default useAccountData
