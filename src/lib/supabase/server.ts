import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
    const cookieStore = await cookies()

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://favfjrpimjmroujciger.supabase.co'
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhdmZqcnBpbWptcm91amNpZ2VyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwMjI2MTQsImV4cCI6MjA4NzU5ODYxNH0.h6ZhCClQlXaW9Dw2zxBNK_hIaLPKWTx5qqiwg7VAdco'

    if (!supabaseUrl || !supabaseAnonKey) {
        if (process.env.NODE_ENV === 'production') {
            console.warn('⚠️ Supabase environment variables are missing.')
        }
    }

    return createServerClient(
        supabaseUrl,
        supabaseAnonKey,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        )
                    } catch {
                        // Server Component: ignorar errores de escritura
                    }
                },
            },
        }
    )
}
