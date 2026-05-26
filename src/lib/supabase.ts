import { createClient as createBrowserClient } from './supabase/client'
import { createClient as createServerClient } from './supabase/server'

export async function getSupabaseClient() {
  if (typeof window === 'undefined') {
    // We are on the server
    return await createServerClient()
  }
  // We are on the client
  return createBrowserClient()
}
