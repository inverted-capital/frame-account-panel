import AccountView from './AccountView.tsx'

interface AppProps {
  skeleton?: boolean
}

export default function App({ skeleton }: AppProps) {
  return <AccountView skeleton={skeleton} />
}
