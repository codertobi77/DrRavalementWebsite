import { BrowserRouter } from 'react-router-dom'
import { ConvexProvider } from 'convex/react'
import { convex } from './lib/convex'
import { AuthProvider } from './lib/auth-context'
import { CmsCacheProvider } from './contexts/CmsCacheContext'
import { AppRoutes } from './router'
import { Analytics } from '@vercel/analytics/react'


function App() {
  return (
    <ConvexProvider client={convex}>
      <AuthProvider>
        <CmsCacheProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </CmsCacheProvider>
      </AuthProvider>
      <Analytics />
    </ConvexProvider>
  )
}

export default App