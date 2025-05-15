import React from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes/routes'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './queryClient'
import header from './components/Header'
 
const App: React.FC = () => {
    return (
        <QueryClientProvider client={queryClient}>
            {/* <header  */}
            <RouterProvider router={router} />
        </QueryClientProvider>
    )
}
 
export default App