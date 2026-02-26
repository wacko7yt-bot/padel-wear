'use client'

import { useState, useEffect } from 'react'
import { Ticket, Plus, Trash2, Check, X, RefreshCw } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

interface Cupon {
    id: string
    codigo: string
    descuento_porcentaje: number
    activo: boolean
    usos_actuales: number
    max_usos: number | null
}

export function CuponesView() {
    const [cupones, setCupones] = useState<Cupon[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [newCoupon, setNewCoupon] = useState({ codigo: '', descuento_porcentaje: 10, max_usos: '' })
    const supabase = createClient()

    const loadCupones = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('cupones')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) toast.error('Error al cargar cupones')
        else setCupones(data || [])
        setLoading(false)
    }

    useEffect(() => { loadCupones() }, [])

    const handleCreate = async () => {
        if (!newCoupon.codigo) return toast.error('El código es obligatorio')

        const { error } = await supabase.from('cupones').insert([{
            codigo: newCoupon.codigo.toUpperCase(),
            descuento_porcentaje: newCoupon.descuento_porcentaje,
            max_usos: newCoupon.max_usos ? parseInt(newCoupon.max_usos) : null,
            activo: true
        }])

        if (error) toast.error('Error al crear: ' + error.message)
        else {
            toast.success('Cupón creado')
            setShowForm(false)
            setNewCoupon({ codigo: '', descuento_porcentaje: 10, max_usos: '' })
            loadCupones()
        }
    }

    const toggleStatus = async (id: string, current: boolean) => {
        const { error } = await supabase.from('cupones').update({ activo: !current }).eq('id', id)
        if (error) toast.error('Error al actualizar')
        else loadCupones()
    }

    const deleteCoupon = async (id: string) => {
        if (!confirm('¿Eliminar este cupón?')) return
        const { error } = await supabase.from('cupones').delete().eq('id', id)
        if (error) toast.error('Error al eliminar')
        else loadCupones()
    }

    return (
        <div className="animate-fade-up">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                <div>
                    <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 38, letterSpacing: '0.04em' }}>CUPONES</h2>
                </div>
                <button onClick={() => setShowForm(!showForm)} className="btn btn-primary btn-sm">
                    {showForm ? <X size={16} /> : <Plus size={16} />}
                    {showForm ? 'CANCELAR' : 'NUEVO CUPÓN'}
                </button>
            </div>

            {showForm && (
                <div style={{ background: '#121212', border: '1px solid var(--accent)', borderRadius: 16, padding: 24, marginBottom: 24 }} className="animate-scale-in">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
                        <div>
                            <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 6, display: 'block' }}>Código</label>
                            <input
                                type="text" value={newCoupon.codigo}
                                onChange={e => setNewCoupon({ ...newCoupon, codigo: e.target.value })}
                                placeholder="EJ: PADEL20"
                                style={{ width: '100%', padding: '12px', background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff' }}
                            />
                        </div>
                        <div>
                            <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 6, display: 'block' }}>Descuento (%)</label>
                            <input
                                type="number" value={newCoupon.descuento_porcentaje}
                                onChange={e => setNewCoupon({ ...newCoupon, descuento_porcentaje: parseInt(e.target.value) })}
                                style={{ width: '100%', padding: '12px', background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff' }}
                            />
                        </div>
                        <div>
                            <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 6, display: 'block' }}>Máx. Usos (opcional)</label>
                            <input
                                type="number" value={newCoupon.max_usos}
                                onChange={e => setNewCoupon({ ...newCoupon, max_usos: e.target.value })}
                                style={{ width: '100%', padding: '12px', background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff' }}
                            />
                        </div>
                    </div>
                    <button onClick={handleCreate} className="btn btn-primary" style={{ marginTop: 20, width: '100%' }}>CREAR CUPÓN</button>
                </div>
            )}

            <div style={{ background: '#121212', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 20, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: 13 }}>CÓDIGO</th>
                            <th style={{ padding: '16px 20px', textAlign: 'center', fontSize: 13 }}>DESCUENTO</th>
                            <th style={{ padding: '16px 20px', textAlign: 'center', fontSize: 13 }}>USOS</th>
                            <th style={{ padding: '16px 20px', textAlign: 'center', fontSize: 13 }}>ESTADO</th>
                            <th style={{ padding: '16px 20px', textAlign: 'right', fontSize: 13 }}>ACCIONES</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cupones.map(c => (
                            <tr key={c.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                <td style={{ padding: '16px 20px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <div style={{ width: 32, height: 32, background: 'rgba(255,92,0,0.1)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}>
                                            <Ticket size={16} />
                                        </div>
                                        <span style={{ fontWeight: 700, fontSize: 15 }}>{c.codigo}</span>
                                    </div>
                                </td>
                                <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                                    <span style={{ color: '#4ade80', fontWeight: 700 }}>{c.descuento_porcentaje}%</span>
                                </td>
                                <td style={{ padding: '16px 20px', textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>
                                    {c.usos_actuales} / {c.max_usos || '∞'}
                                </td>
                                <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                                    <button
                                        onClick={() => toggleStatus(c.id, c.activo)}
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: c.activo ? '#4ade80' : 'rgba(255,255,255,0.2)' }}
                                    >
                                        {c.activo ? <Check size={18} /> : <X size={18} />}
                                    </button>
                                </td>
                                <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                                    <button onClick={() => deleteCoupon(c.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#f87171', opacity: 0.6 }}>
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {cupones.length === 0 && !loading && (
                            <tr>
                                <td colSpan={5} style={{ padding: 40, textAlign: 'center', color: 'rgba(255,255,255,0.2)' }}>No hay cupones creados</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
