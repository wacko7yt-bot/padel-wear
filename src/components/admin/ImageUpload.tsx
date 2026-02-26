'use client'

import { useState, useRef, useCallback } from 'react'
import { Upload, X, Loader2, Image as ImageIcon, Plus } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

interface ImageUploadProps {
    value: string[]
    onChange: (urls: string[]) => void
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false)
    const [isDragging, setIsDragging] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const supabase = createClient()

    const onUpload = useCallback(async (files: FileList | File[]) => {
        if (!files || files.length === 0) return

        setUploading(true)
        const newUrls = [...value]

        try {
            for (const file of Array.from(files)) {
                if (!file.type.startsWith('image/')) {
                    toast.error(`${file.name} no es una imagen válida`)
                    continue
                }

                if (file.size > 5 * 1024 * 1024) {
                    toast.error(`${file.name} es demasiado grande (máx 5MB)`)
                    continue
                }

                const fileExt = file.name.split('.').pop()
                const fileName = `${Math.random()}.${fileExt}`
                const filePath = `${fileName}`

                const { data, error } = await supabase.storage
                    .from('product-images')
                    .upload(filePath, file)

                if (error) throw error

                const { data: { publicUrl } } = supabase.storage
                    .from('product-images')
                    .getPublicUrl(data.path)

                newUrls.push(publicUrl)
            }

            onChange(newUrls)
            toast.success('Imágenes subidas correctamente')
        } catch (error: any) {
            console.error('Error uploading:', error)
            toast.error('Error al subir: ' + error.message)
        } finally {
            setUploading(false)
            setIsDragging(false)
        }
    }, [value, onChange, supabase])

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) onUpload(e.target.files)
    }

    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const onDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
    }

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        if (e.dataTransfer.files) onUpload(e.dataTransfer.files)
    }

    const removeImage = (urlToRemove: string) => {
        onChange(value.filter(url => url !== urlToRemove))
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>
                Fotos del Producto
            </label>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                <AnimatePresence>
                    {value.map((url) => (
                        <motion.div
                            key={url}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            style={{
                                position: 'relative',
                                width: 100,
                                height: 100,
                                borderRadius: 12,
                                overflow: 'hidden',
                                border: '1px solid var(--border)'
                            }}
                        >
                            <img src={url} alt="Product" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <button
                                onClick={() => removeImage(url)}
                                style={{
                                    position: 'absolute', top: 4, right: 4,
                                    background: 'rgba(0,0,0,0.6)', color: '#fff',
                                    border: 'none', borderRadius: '50%',
                                    width: 22, height: 22, cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    backdropFilter: 'blur(4px)'
                                }}
                            >
                                <X size={12} />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Dropzone */}
                <div
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onDrop={onDrop}
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                        width: 100,
                        height: 100,
                        borderRadius: 12,
                        border: `2px dashed ${isDragging ? 'var(--accent)' : 'rgba(255,255,255,0.1)'}`,
                        background: isDragging ? 'var(--accent-subtle)' : 'rgba(255,255,255,0.02)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        color: isDragging ? 'var(--accent)' : 'rgba(255,255,255,0.3)',
                    }}
                >
                    {uploading ? (
                        <Loader2 size={20} className="animate-spin" />
                    ) : (
                        <>
                            <Plus size={24} />
                            <span style={{ fontSize: 10, marginTop: 4, fontWeight: 600 }}>AÑADIR</span>
                        </>
                    )}
                </div>
            </div>

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*"
                multiple
                style={{ display: 'none' }}
            />

            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>
                <ImageIcon size={12} />
                <span>Arrastra tus fotos o haz clic para subir. Máx 5MB.</span>
            </div>
        </div>
    )
}
