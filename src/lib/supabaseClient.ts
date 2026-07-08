/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

const url = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const key = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

const hasRealSupabaseConfig = Boolean(
  url &&
  key &&
  !url.includes('your-project') &&
  !key.includes('your-anon') &&
  !url.includes('example')
);

const createFallbackClient = () => {
  const emptyQuery = async () => ({ data: null, error: new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.') });

  return {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => undefined } }, error: null }),
      signInWithPassword: async () => ({ data: null, error: new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.') }),
      signOut: async () => ({ error: null }),
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          maybeSingle: emptyQuery,
        }),
      }),
      update: () => ({ eq: emptyQuery }),
      insert: emptyQuery,
    }),
  } as any;
};

export const supabaseConfigured = hasRealSupabaseConfig;
export const supabase = hasRealSupabaseConfig ? createClient(url, key) : createFallbackClient();
