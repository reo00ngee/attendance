import * as api from '../api/adminAuthAPI' 
import { queryClient } from '../queryClient'
 
const adminAuthQuery = () => ({
    queryKey: ['admin'],
    queryFn: api.getAdmin
})

export const UseAuthAdmin = async () => {
    const query = adminAuthQuery()
 
    return queryClient.getQueryData(query.queryKey)
        ?? (await queryClient.fetchQuery(query).catch(() => undefined))
}
