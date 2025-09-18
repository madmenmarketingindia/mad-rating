import AppProvidersWrapper from './components/wrappers/AppProvidersWrapper'
import { Toaster } from 'react-hot-toast'
import AppRouter from './routes/router'
import '@/assets/scss/app.scss'
const App = () => {
  return (
    <AppProvidersWrapper>
      <Toaster position="top-right" reverseOrder={false} />
      <AppRouter />
    </AppProvidersWrapper>
  )
}
export default App
