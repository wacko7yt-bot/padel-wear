// Re-exportación centralizada del cliente Supabase
// Usa /lib/supabase/client.ts para el cliente de navegador
// Usa /lib/supabase/server.ts para Server Components y API Routes

export { createClient } from './supabase/client'
export * from './supabase/types'
export * from './supabase/queries'
