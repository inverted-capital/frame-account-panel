import { useExists, useJson } from '@artifact/client/hooks'
import { accountDataSchema, type AccountData } from '../types/account.ts'
import { useEffect, useState } from 'react'

import Debug from 'debug'

const log = Debug('frame-account-panel:useAccountData')

const emptyUsage = {
  period: '',
  storage: { gained: 0, lost: 0, gainedCost: 0, lostRefund: 0 },
  compute: 0,
  computeCost: 0,
  bandwidth: 0,
  bandwidthCost: 0,
  aiTokens: 0,
  aiTokensCost: 0
}

const defaultAccount: AccountData = {
  user: { name: '', email: '', profilePicture: '' },
  paymentMethods: [],
  billing: { balance: 0, currency: 'USD', usageHistory: [emptyUsage] }
}

const useAccountData = () => {
  const exists = useExists('profile.json')
  const raw = useJson('profile.json')
  const [data, setData] = useState<AccountData>()

  useEffect(() => {
    if (raw !== undefined) {
      try {
        setData(accountDataSchema.parse(raw))
      } catch (e) {
        log('Failed to parse %s: %o', 'profile.json', e)
        setData(defaultAccount)
      }
    }
  }, [raw])

  const loading = exists === null || (exists && raw === undefined)
  const error = exists === false ? 'profile.json not found' : null

  useEffect(() => {
    if (exists === false) {
      log('File not found: %s', 'profile.json')
      setData(defaultAccount)
    }
  }, [exists])

  return { data, loading, error }
}

export default useAccountData
