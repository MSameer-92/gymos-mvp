'use client'
import { useState, useRef } from 'react'

interface FileUploadProps {
  entityType: string
  entityId?: number
  onUploadComplete?: (file: any) => void
  accept?: string
  label?: string
}

export default function FileUpload({ 
  entityType, 
  entityId,
  onUploadComplete,
  accept = "image/*,.pdf,.doc,.docx",
  label = "Upload File"
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const uploadFile = async (file: File) => {
    setUploading(true)
    setError('')
    setSuccess('')

    const formData = new FormData()
    formData.append('file', file)
    formData.append('entityType', entityType)
    if (entityId) formData.append('entityId', String(entityId))

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      
      if (!res.ok) {
        setError(data.error || 'Upload failed')
      } else {
        setSuccess(`✅ ${file.name} uploaded!`)
        onUploadComplete?.(data)
      }
    } catch {
      setError('Upload failed. Try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) uploadFile(file)
  }

  return (
    <div style={{ width: '100%' }}>
      <div
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        style={{
          border: `2px dashed ${dragOver ? '#7c3aed' : '#374151'}`,
          borderRadius: '12px',
          padding: '32px',
          textAlign: 'center',
          cursor: 'pointer',
          backgroundColor: dragOver 
            ? 'rgba(124,58,237,0.08)' 
            : 'rgba(255,255,255,0.02)',
          transition: 'all 0.2s',
        }}
      >
        <div style={{ fontSize: '36px', marginBottom: '8px' }}>
          {uploading ? '⏳' : '📁'}
        </div>
        <p style={{ color: 'white', fontSize: '14px', fontWeight: '500' }}>
          {uploading ? 'Uploading...' : label}
        </p>
        <p style={{ color: '#6b7280', fontSize: '12px', marginTop: '4px' }}>
          Drag & drop or click to browse
        </p>
        <p style={{ color: '#4b5563', fontSize: '11px', marginTop: '4px' }}>
          Max 5MB • JPG, PNG, PDF, DOC
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        style={{ display: 'none' }}
        onChange={e => {
          const file = e.target.files?.[0]
          if (file) uploadFile(file)
        }}
      />

      {error && (
        <p style={{ 
          color: '#ef4444', fontSize: '13px', 
          marginTop: '8px', padding: '8px 12px',
          backgroundColor: 'rgba(239,68,68,0.1)',
          borderRadius: '8px'
        }}>
          ❌ {error}
        </p>
      )}
      {success && (
        <p style={{ 
          color: '#4ade80', fontSize: '13px',
          marginTop: '8px', padding: '8px 12px',
          backgroundColor: 'rgba(74,222,128,0.1)',
          borderRadius: '8px'
        }}>
          {success}
        </p>
      )}
    </div>
  )
}
