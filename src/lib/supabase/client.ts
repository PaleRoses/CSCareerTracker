import { createBrowserClient } from '@supabase/ssr'

/**
 * Creates a Supabase client for browser/client components.
 * Use this in 'use client' components where you need to interact with Supabase.
 *
 * Note: This client uses the anon key and respects Row Level Security policies.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
