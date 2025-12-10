'use server'

import { createAdminClient } from '@/lib/supabase/server'
import { auth } from '@/features/auth'
import { isAdminRole } from '../constants'
import { logger } from '@/lib/logger'
import type { AdminUser, UserFilters } from '../types'

export async function getUsers(filters: UserFilters = {}): Promise<AdminUser[]> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return []
    }

    if (!isAdminRole(session.user.role)) {
      return []
    }

    const supabase = await createAdminClient()

    let query = supabase
      .from('users')
      .select('user_id, email, fname, lname, role, status, signup_date, created_at, updated_at')

    if (filters.role && filters.role !== 'all') {
      query = query.eq('role', filters.role)
    }

    if (filters.status && filters.status !== 'all') {
      query = query.eq('status', filters.status)
    }

    if (filters.search) {
      query = query.or(
        `email.ilike.%${filters.search}%,fname.ilike.%${filters.search}%,lname.ilike.%${filters.search}%`
      )
    }

    query = query.order('created_at', { ascending: false })

    if (filters.limit) {
      query = query.limit(filters.limit)
    }
    if (filters.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit ?? 25) - 1)
    }

    const { data, error } = await query

    if (error) {
      logger.error('Error fetching users', { error })
      return []
    }

    return (data || []).map((u) => ({
      userId: u.user_id,
      email: u.email,
      fname: u.fname,
      lname: u.lname,
      role: u.role,
      status: u.status || 'active',
      signupDate: u.signup_date,
      createdAt: u.created_at,
      updatedAt: u.updated_at,
    }))
  } catch (error) {
    logger.error('Unexpected error in getUsers', { error })
    return []
  }
}

export async function getUserDetail(targetUserId: string): Promise<AdminUser | null> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return null
    }

    if (!isAdminRole(session.user.role)) {
      return null
    }

    const supabase = await createAdminClient()

    const { data, error } = await supabase
      .from('users')
      .select('user_id, email, fname, lname, role, status, signup_date, created_at, updated_at')
      .eq('user_id', targetUserId)
      .single()

    if (error) {
      logger.error('Error fetching user detail', { error, targetUserId })
      return null
    }

    return {
      userId: data.user_id,
      email: data.email,
      fname: data.fname,
      lname: data.lname,
      role: data.role,
      status: data.status || 'active',
      signupDate: data.signup_date,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    }
  } catch (error) {
    logger.error('Unexpected error in getUserDetail', { error, targetUserId })
    return null
  }
}
