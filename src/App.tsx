import { BrowserRouter } from 'react-router-dom'
import { ConvexProvider } from 'convex/react'
import { convex } from './lib/convex'
import { AuthProvider } from './lib/auth-context'
import { AppRoutes } from './router'


function App() {
  return (
    <ConvexProvider client={convex}>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ConvexProvider>
  )
}

export default App