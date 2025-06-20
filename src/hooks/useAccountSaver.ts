import { useArtifact } from '@artifact/client/hooks'
import type { AccountData } from '../types/account.ts'

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

const useAccountSaver = () => {
  const artifact = useArtifact()

  return async (data?: AccountData): Promise<void> => {
    if (!artifact) return
    const toWrite = data ?? defaultAccount
    artifact.files.write.json('profile.json', toWrite)
    await artifact.branch.write.commit('Update account data')
  }
}

export default useAccountSaver
