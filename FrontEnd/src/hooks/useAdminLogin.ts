import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import * as api from '../api/adminAuthAPI'

export const UseAdminLogin = () => {
  const queryClient = useQueryClient()

  return useMutation({
      mutationFn: api.adminLogin,
      onError: (error: AxiosError) => {
          console.log(error)
          alert('Admin login failed. Please try again.')
      },
      onSuccess: (data) => {
          console.log(data)
          queryClient.invalidateQueries({queryKey: ['admin'] })
          // Navigate will be handled in the component
      }
  })
}

export const UseAdminLogout = () => {
  const queryClient = useQueryClient()

  return useMutation({
      mutationFn: api.adminLogout,
      onError: (error: AxiosError) => {
          console.error('Admin logout failed:', error)
          // エラーが発生してもローカルストレージをクリアしてリダイレクト
          localStorage.removeItem('admin')
          queryClient.clear()
          window.location.href = '/admin/login'
      },
      onSuccess: () => {
          console.log('Admin logout successful')
          queryClient.clear()
          localStorage.removeItem('admin')
          window.location.href = '/admin/login'
      }
  })
}
