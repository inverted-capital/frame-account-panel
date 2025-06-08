import AccountView from './AccountView.tsx'
import { FileBrowser } from './components/index.ts'

interface AppProps {
  skeleton?: boolean
}

function App({ skeleton }: AppProps) {
  return (
    <>
      <AccountView skeleton={skeleton} />
      <FileBrowser />
    </>
  )
}

export default App
