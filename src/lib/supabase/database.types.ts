export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    __InternalSupabase: {
        PostgrestVersion: "14.1"
    }
    public: {
        Tables: {
            pedidos: {
                Row: {
                    cantidad: number | null
                    email_cliente: string | null
                    estado_pago: string | null
                    id: string
                    product_id: string | null
                    stripe_session_id: string | null
                    talla_comprada: string | null
                    created_at: string | null
                }
                Insert: {
                    cantidad?: number | null
                    email_cliente?: string | null
                    estado_pago?: string | null
                    id?: string
                    product_id?: string | null
                    stripe_session_id?: string | null
                    talla_comprada?: string | null
                    created_at?: string | null
                }
                Update: {
                    cantidad?: number | null
                    email_cliente?: string | null
                    estado_pago?: string | null
                    id?: string
                    product_id?: string | null
                    stripe_session_id?: string | null
                    talla_comprada?: string | null
                    created_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "pedidos_product_id_fkey"
                        columns: ["product_id"]
                        isOneToOne: false
                        referencedRelation: "productos"
                        referencedColumns: ["id"]
                    },
                ]
            }
            productos: {
                Row: {
                    activo: boolean | null
                    categoria: string | null
                    created_at: string | null
                    descripcion: string | null
                    id: string
                    images: string[] | null
                    nombre: string
                    precio: number
                    size_l: number | null
                    size_m: number | null
                    size_s: number | null
                    size_xl: number | null
                }
                Insert: {
                    activo?: boolean | null
                    categoria?: string | null
                    created_at?: string | null
                    descripcion?: string | null
                    id?: string
                    images?: string[] | null
                    nombre: string
                    precio: number
                    size_l?: number | null
                    size_m?: number | null
                    size_s?: number | null
                    size_xl?: number | null
                }
                Update: {
                    activo?: boolean | null
                    categoria?: string | null
                    created_at?: string | null
                    descripcion?: string | null
                    id?: string
                    images?: string[] | null
                    nombre?: string
                    precio?: number
                    size_l?: number | null
                    size_m?: number | null
                    size_s?: number | null
                    size_xl?: number | null
                }
                Relationships: []
            }
            resenas: {
                Row: {
                    comentario: string | null
                    created_at: string | null
                    email_usuario: string | null
                    id: string
                    nombre_usuario: string | null
                    product_id: string | null
                    puntuacion: number | null
                }
                Insert: {
                    comentario?: string | null
                    created_at?: string | null
                    email_usuario?: string | null
                    id?: string
                    nombre_usuario?: string | null
                    product_id?: string | null
                    puntuacion?: number | null
                }
                Update: {
                    comentario?: string | null
                    created_at?: string | null
                    email_usuario?: string | null
                    id?: string
                    nombre_usuario?: string | null
                    product_id?: string | null
                    puntuacion?: number | null
                }
                Relationships: [
                    {
                        foreignKeyName: "resenas_product_id_fkey"
                        columns: ["product_id"]
                        isOneToOne: false
                        referencedRelation: "productos"
                        referencedColumns: ["id"]
                    },
                ]
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">
type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
    DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
    TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
}
    ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
            Row: infer R
        }
    ? R
    : never
    : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
            Row: infer R
        }
    ? R
    : never
    : never

export const Constants = {
    public: {
        Enums: {},
    },
} as const
