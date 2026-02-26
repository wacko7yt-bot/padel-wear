import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://favfjrpimjmroujciger.supabase.co',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhdmZqcnBpbWptcm91amNpZ2VyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwMjI2MTQsImV4cCI6MjA4NzU5ODYxNH0.h6ZhCClQlXaW9Dw2zxBNK_hIaLPKWTx5qqiwg7VAdco'
    )
}
