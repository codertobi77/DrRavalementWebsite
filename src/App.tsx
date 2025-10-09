import { BrowserRouter } from 'react-router-dom'
import { ConvexProvider } from 'convex/react'
import { convex } from './lib/convex'
import { AppRoutes } from './router'


function App() {
  return (
    <ConvexProvider client={convex}>
      <BrowserRouter basename={__BASE_PATH__}>
        <AppRoutes />
      </BrowserRouter>
    </ConvexProvider>
  )
}

export default App