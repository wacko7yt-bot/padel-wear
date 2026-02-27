'use client'

import { useState, useEffect, useCallback } from 'react'
import {
    Package, Plus, Edit2, Trash2, RefreshCw, X,
    Save, ToggleLeft, ToggleRight, Search
} from 'lucide-react'
import { Producto } from '@/lib/supabase/types'
import { formatPrice } from '@/lib/utils/cn'
import { ImageUpload } from './ImageUpload'

function StockBadge({ val }: { val: number }) {
    const color = val === 0 ? '#f87171' : val <= 3 ? '#fbbf24' : '#4ade80'
    const bg = val === 0 ? 'rgba(239,68,68,0.08)' : val <= 3 ? 'rgba(251,191,36,0.08)' : 'rgba(74,222,128,0.08)'
    return (
        <span style={{
            display: 'inline-flex', padding: '2px 8px', borderRadius: 6, fontSize: 11, fontWeight: 700,
            background: bg, color, border: `1px solid ${color}30`, minWidth: 24, justifyContent: 'center'
        }}>
            {val}
        </span>
    )
}

export function ProductosView() {
    const [productos, setProductos] = useState<Producto[]>([])
    const [filtered, setFiltered] = useState<Producto[]>([])
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [editId, setEditId] = useState<string | null>(null)
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState<Partial<Producto>>({
        name: '', description: '', price: 0, category: 'camiseta',
        images: [], available: true, size_s: 0, size_m: 0, size_l: 0, size_xl: 0,
    })

    const loadProductos = useCallback(async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/productos?all=true')
            const data = await res.json()
            setProductos(Array.isArray(data) ? data : [])
            setFiltered(Array.isArray(data) ? data : [])
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { loadProductos() }, [loadProductos])

    useEffect(() => {
        const query = search.toLowerCase()
        setFiltered(productos.filter(p =>
            p.name.toLowerCase().includes(query) ||
            (p.category?.toLowerCase() || '').includes(query)
        ))
    }, [search, productos])

    const openNew = () => {
        setEditId(null)
        setForm({ name: '', description: '', price: 0, category: 'camiseta', images: [], available: true, size_s: 0, size_m: 0, size_l: 0, size_xl: 0 })
        setShowForm(true)
    }

    const openEdit = (p: Producto) => {
        setEditId(p.id)
        setForm({ ...p })
        setShowForm(true)
    }

    const handleSave = async () => {
        if (!form.name || !form.price) return setError('Nombre y precio obligatorios')
        setSaving(true)
        setError(null)

        const url = editId ? `/api/productos/${editId}` : '/api/productos'
        const method = editId ? 'PATCH' : 'POST'

        const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
        const data = await res.json()
        setSaving(false)

        if (!res.ok) return setError(data.error ?? 'Error al guardar')
        setShowForm(false)
        setEditId(null)
        loadProductos()
    }

    const handleToggle = async (p: Producto) => {
        const res = await fetch(`/api/productos/${p.id}`, {
            method: 'PATCH', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ available: !p.available }),
        })
        if (res.ok) loadProductos()
    }

    const handleDelete = async (p: Producto) => {
        if (!confirm(`¿Eliminar "${p.name}"?`)) return
        const res = await fetch(`/api/productos/${p.id}`, { method: 'DELETE' })
        if (res.ok) loadProductos()
    }

    return (
        <div className="animate-fade-up">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                <div>
                    <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 38, letterSpacing: '0.04em' }}>PRODUCTOS</h2>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                    <div style={{ position: 'relative' }}>
                        <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
                        <input
                            type="text"
                            placeholder="Buscar..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{
                                padding: '10px 12px 10px 36px', background: '#161616', border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: 10, color: '#fff', fontSize: 13, outline: 'none', width: 200
                            }}
                        />
                    </div>
                    <button onClick={openNew} className="btn btn-primary btn-sm">
                        <Plus size={16} /> NUEVO
                    </button>
                </div>
            </div>

            {showForm && (
                <div style={{ background: '#161616', border: '1px solid var(--accent)', borderRadius: 16, padding: 24, marginBottom: 32 }} className="animate-scale-in">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                        <InputField label="Nombre" value={form.name!} onChange={v => setForm(f => ({ ...f, name: v }))} />
                        <InputField label="Precio (€)" type="number" value={String(form.price)} onChange={v => setForm(f => ({ ...f, price: Number(v) }))} />

                        {/* Sección de Stock mejorada */}
                        <div style={{ gridColumn: '1 / -1', background: 'rgba(255,255,255,0.02)', padding: 20, borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)' }}>
                            <p style={{ fontSize: 11, fontWeight: 800, color: 'var(--accent)', letterSpacing: '0.05em', marginBottom: 16, textTransform: 'uppercase' }}>Inventario por Talla</p>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', gap: 12 }}>
                                <StockInput label="Talla S" value={form.size_s} onChange={v => setForm(f => ({ ...f, size_s: v }))} />
                                <StockInput label="Talla M" value={form.size_m} onChange={v => setForm(f => ({ ...f, size_m: v }))} />
                                <StockInput label="Talla L" value={form.size_l} onChange={v => setForm(f => ({ ...f, size_l: v }))} />
                                <StockInput label="Talla XL" value={form.size_xl} onChange={v => setForm(f => ({ ...f, size_xl: v }))} />
                            </div>
                        </div>

                        <div style={{ gridColumn: '1 / -1' }}>
                            <ImageUpload
                                value={form.images || []}
                                onChange={v => setForm(f => ({ ...f, images: v }))}
                            />
                        </div>
                    </div>
                    <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
                        <button onClick={handleSave} disabled={saving} className="btn btn-primary">{saving ? 'Guardando...' : 'Guardar'}</button>
                        <button onClick={() => setShowForm(false)} className="btn btn-secondary">Cancelar</button>
                    </div>
                </div>
            )}

            <div style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' }}>
                            <th style={{ padding: 16, fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>PRODUCTO</th>
                            <th style={{ padding: 16, fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>S</th>
                            <th style={{ padding: 16, fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>M</th>
                            <th style={{ padding: 16, fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>L</th>
                            <th style={{ padding: 16, fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>XL</th>
                            <th style={{ padding: 16, fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>ESTADO</th>
                            <th style={{ padding: 16 }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(p => (
                            <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <td style={{ padding: 16 }}>
                                    <p style={{ fontWeight: 600, fontSize: 14 }}>{p.name}</p>
                                    <p style={{ fontSize: 12, color: 'var(--accent)' }}>{formatPrice(p.price)}</p>
                                </td>
                                <td style={{ padding: 16 }}><StockBadge val={p.size_s ?? 0} /></td>
                                <td style={{ padding: 16 }}><StockBadge val={p.size_m ?? 0} /></td>
                                <td style={{ padding: 16 }}><StockBadge val={p.size_l ?? 0} /></td>
                                <td style={{ padding: 16 }}><StockBadge val={p.size_xl ?? 0} /></td>
                                <td style={{ padding: 16 }}>
                                    <button onClick={() => handleToggle(p)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                                        {p.available ? <ToggleRight color="#4ade80" size={24} /> : <ToggleLeft color="rgba(255,255,255,0.2)" size={24} />}
                                        <span style={{ fontSize: 11, color: p.available ? '#4ade80' : 'rgba(255,255,255,0.3)' }}>{p.available ? 'ACTIVO' : 'OCULTO'}</span>
                                    </button>
                                </td>
                                <td style={{ padding: 16 }}>
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <button onClick={() => openEdit(p)} title="Editar" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.5)' }}><Edit2 size={16} /></button>
                                        <button onClick={() => handleDelete(p)} title="Borrar" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#f87171' }}><Trash2 size={16} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

function InputField({ label, value, onChange, type = 'text' }: { label: string, value: string, onChange: (v: string) => void, type?: string }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>{label}</label>
            <input
                type={type} value={value} onChange={e => onChange(e.target.value)}
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 12px', color: '#fff', fontSize: 14, outline: 'none' }}
            />
        </div>
    )
}

function StockInput({ label, value, onChange }: { label: string, value: number | null | undefined, onChange: (v: number) => void }) {
    return (
        <div style={{ background: '#000', padding: '12px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.05)' }}>
            <label style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.3)', display: 'block', marginBottom: 6 }}>{label}</label>
            <input
                type="number"
                value={value ?? 0}
                onChange={e => onChange(Number(e.target.value))}
                style={{ width: '100%', background: 'none', border: 'none', color: '#fff', fontSize: 18, fontWeight: 700, outline: 'none' }}
            />
        </div>
    )
}
