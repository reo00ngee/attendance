import { QueryClient, useQueryClient, useMutation} from '@tanstack/react-query'
import * as api from './api/authAPI' 
import { AxiosError } from 'axios';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
            refetchOnWindowFocus: false
        },
        mutations: {
            retry: false
        }
    }
})

export const UseLogin = () => {
  const queryClient = useQueryClient()

  return useMutation({
      mutationFn: api.login,
      onError: (error: AxiosError) => {
          console.log(error)
          alert('You failed to login. Please try again.')
          window.location.href = '/login'
      },
      onSuccess: (data) => {
          console.log(data)
          queryClient.invalidateQueries({queryKey: ['auth'] })
          window.location.href = '/attendance_registration_for_monthly'
      }
  })
}

export const UseLogout = () => {
  const queryClient = useQueryClient()

  return useMutation({
      mutationFn: api.logout,
      onError: (error: AxiosError) => {
          console.log(error)
      },
      onSuccess: (data) => {
          console.log(data)
          queryClient.invalidateQueries({queryKey: ['auth'] })
          window.location.href = '/login'
      }
  })
}

export default queryClient;