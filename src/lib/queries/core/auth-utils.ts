import { createCacheClient } from '@/lib/supabase/server'
import { auth } from '@/features/auth/auth'

export async function isAdmin(): Promise<boolean> {
  const session = await auth()
  if (!session?.user?.id) return false

  const supabase = createCacheClient()
  const { data } = await supabase
    .from('users')
    .select('role')
    .eq('user_id', session.user.id)
    .single()

  return data?.role === 'admin'
}
