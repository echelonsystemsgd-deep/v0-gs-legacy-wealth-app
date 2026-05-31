'use client'

import { useState, useRef } from 'react'
import { Upload, Loader2, FileUp } from 'lucide-react'

interface MediaDropzoneProps {
  onFilesSelected: (files: FileList) => void
  loading?: boolean
  maxSizeMB?: number
  allowedTypes?: string[]
}

export function MediaDropzone({
  onFilesSelected,
  loading = false,
  maxSizeMB = 50,
  allowedTypes = [],
}: MediaDropzoneProps) {
  const [isDragActive, setIsDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true)
    } else if (e.type === 'dragleave') {
      setIsDragActive(false)
    }
  }

  const validateFiles = (files: FileList): boolean => {
    setError(null)
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`File ${file.name} exceeds the maximum size limit of ${maxSizeMB}MB.`)
        return false
      }
      if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
        setError(`File type for ${file.name} is not permitted.`)
        return false
      }
    }
    return true
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      if (validateFiles(e.dataTransfer.files)) {
        onFilesSelected(e.dataTransfer.files)
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files.length > 0) {
      if (validateFiles(e.target.files)) {
        onFilesSelected(e.target.files)
      }
    }
  }

  const onButtonClick = () => {
    inputRef.current?.click()
  }

  return (
    <div
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all ${
        isDragActive
          ? 'border-gold bg-gold/5 scale-[0.99]'
          : 'border-gold/15 hover:border-gold/35 bg-white/2'
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        onChange={handleChange}
        disabled={loading}
        className="hidden"
      />

      {loading ? (
        <div className="flex flex-col items-center justify-center space-y-3">
          <Loader2 size={32} className="text-gold animate-spin" />
          <p className="text-sm text-muted-foreground animate-pulse">Uploading files...</p>
        </div>
      ) : (
        <div className="space-y-4 flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center">
            <Upload size={20} className="text-gold" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              Drag and drop files here, or{' '}
              <button
                type="button"
                onClick={onButtonClick}
                className="text-gold hover:underline font-bold"
              >
                browse
              </button>
            </p>
            <p className="text-xxs text-muted-foreground mt-1">
              Supports files up to {maxSizeMB}MB
            </p>
          </div>

          {error && (
            <p className="text-xs font-medium text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-lg">
              {error}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
