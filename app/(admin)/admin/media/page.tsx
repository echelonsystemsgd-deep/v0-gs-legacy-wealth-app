'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  Upload, Trash2, Copy, Search, Filter, ImageIcon, Film, FileText, Loader2, Check, ExternalLink, RefreshCw
} from 'lucide-react'

type MediaAsset = {
  id: string; bucket_name: string; file_path: string; file_url: string; file_name: string
  file_size: number | null; mime_type: string | null; created_at: string
}

const BUCKETS = [
  { value: 'website-media', label: 'Website Media' },
  { value: 'branding', label: 'Branding Assets' },
  { value: 'portfolio', label: 'Portfolio Images' },
  { value: 'testimonials', label: 'Testimonial Avatars' },
]

export default function MediaPage() {
  const supabase = createClient()
  const [assets, setAssets] = useState<MediaAsset[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedBucket, setSelectedBucket] = useState('website-media')
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [uploading, setUploading] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000) }

  const fetchAssets = useCallback(async () => {
    setLoading(true)
    let query = supabase.from('media_assets').select('*').eq('bucket_name', selectedBucket)

    if (typeFilter === 'images') {
      query = query.ilike('mime_type', 'image/%')
    } else if (typeFilter === 'videos') {
      query = query.ilike('mime_type', 'video/%')
    } else if (typeFilter === 'documents') {
      query = query.not('mime_type', 'ilike', 'image/%').not('mime_type', 'ilike', 'video/%')
    }

    if (searchQuery) {
      query = query.ilike('file_name', `%${searchQuery}%`)
    }

    const { data } = await query.order('created_at', { ascending: false })
    setAssets(data ?? [])
    setLoading(false)
  }, [selectedBucket, typeFilter, searchQuery, supabase])

  useEffect(() => {
    fetchAssets()
  }, [fetchAssets])

  const handleCopy = (url: string, id: string) => {
    navigator.clipboard.writeText(url)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
    showToast('Copied file URL to clipboard.')
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const filePath = `${Date.now()}-${file.name}`

    // 1. Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from(selectedBucket)
      .upload(filePath, file, { cacheControl: '3600', upsert: false })

    if (uploadError) {
      showToast(`Upload failed: ${uploadError.message}`)
      setUploading(false)
      return
    }

    // 2. Get Public URL
    const { data: { publicUrl } } = supabase.storage.from(selectedBucket).getPublicUrl(filePath)

    // 3. Register in database media_assets
    const { data: { user } } = await supabase.auth.getUser()
    const { error: dbError } = await supabase.from('media_assets').insert({
      bucket_name: selectedBucket,
      file_path: filePath,
      file_url: publicUrl,
      file_name: file.name,
      file_size: file.size,
      mime_type: file.type,
      uploaded_by: user?.id || null
    })

    setUploading(false)
    if (dbError) {
      showToast(`Asset uploaded but database registration failed: ${dbError.message}`)
    } else {
      showToast('Asset uploaded successfully.')
      fetchAssets()
    }
  }

  const handleDelete = async (asset: MediaAsset) => {
    if (!window.confirm(`Are you sure you want to delete "${asset.file_name}" permanently?`)) return

    // 1. Delete from storage
    const { error: storageError } = await supabase.storage
      .from(asset.bucket_name)
      .remove([asset.file_path])

    if (storageError) {
      showToast(`Failed to delete from storage: ${storageError.message}`)
      return
    }

    // 2. Delete from DB catalog
    const { error: dbError } = await supabase
      .from('media_assets')
      .delete()
      .eq('id', asset.id)

    if (dbError) {
      showToast(`Deleted from storage, but database record removal failed: ${dbError.message}`)
    } else {
      showToast('Asset deleted successfully.')
      fetchAssets()
    }
  }

  const formatSize = (bytes: number | null) => {
    if (!bytes) return '—'
    const kb = bytes / 1024
    if (kb < 1024) return `${kb.toFixed(1)} KB`
    return `${(kb / 1024).toFixed(1)} MB`
  }

  const getFileIcon = (mime: string | null) => {
    if (mime?.startsWith('image/')) return <ImageIcon size={20} className="text-gold" />
    if (mime?.startsWith('video/')) return <Film size={20} className="text-amber-400" />
    return <FileText size={20} className="text-blue-400" />
  }

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed top-4 left-4 z-50 px-4 py-3 rounded-xl bg-green-500/15 border border-green-500/30 text-sm font-medium text-green-400 shadow-xl flex items-center gap-2">
          <Check size={14} /> {toast}
        </div>
      )}

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xxs font-bold uppercase tracking-[0.3em] text-gold/70">Storage Explorer</p>
          <h1 className="font-serif text-3xl font-bold text-foreground mt-1">Media Library</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage global assets, images, and video backgrounds.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchAssets}
            className="p-2.5 rounded-xl bg-white/5 border border-gold/15 text-muted-foreground hover:text-foreground transition-all"
            title="Refresh assets grid"
          >
            <RefreshCw size={15} />
          </button>
          <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-gold to-gold-light text-background text-sm font-bold hover:shadow-[0_0_16px_rgba(212,175,55,0.35)] transition-all cursor-pointer">
            {uploading ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
            <span>Upload File</span>
            <input type="file" onChange={handleUpload} disabled={uploading} className="hidden" />
          </label>
        </div>
      </div>

      {/* Grid Settings & Filters */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Bucket selector */}
        <div className="space-y-1.5">
          <label className="text-xxs font-bold uppercase tracking-widest text-muted-foreground">Select Bucket</label>
          <select
            value={selectedBucket}
            onChange={(e) => setSelectedBucket(e.target.value)}
            className="w-full bg-card border border-gold/15 rounded-xl px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold/20"
          >
            {BUCKETS.map((b) => <option key={b.value} value={b.value}>{b.label}</option>)}
          </select>
        </div>

        {/* Search */}
        <div className="space-y-1.5">
          <label className="text-xxs font-bold uppercase tracking-widest text-muted-foreground">Search by Name</label>
          <div className="relative">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Filter assets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-card border border-gold/15 rounded-xl pl-9 pr-4 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold/20"
            />
          </div>
        </div>

        {/* Mime type Filter */}
        <div className="space-y-1.5">
          <label className="text-xxs font-bold uppercase tracking-widest text-muted-foreground">File Type</label>
          <div className="relative">
            <Filter size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full bg-card border border-gold/15 rounded-xl pl-9 pr-4 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold/20"
            >
              <option value="all">All File Types</option>
              <option value="images">Images Only</option>
              <option value="videos">Videos Only</option>
              <option value="documents">Other Documents</option>
            </select>
          </div>
        </div>
      </div>

      {/* Assets Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => <div key={i} className="aspect-square rounded-2xl bg-card animate-pulse" />)}
        </div>
      ) : assets.length === 0 ? (
        <div className="glass rounded-2xl border border-gold/10 p-20 flex flex-col items-center justify-center text-center">
          <ImageIcon size={48} className="text-gold/25 mb-4" />
          <p className="font-serif text-lg text-foreground">No media assets found</p>
          <p className="text-sm text-muted-foreground mt-1">Upload files to this bucket to populate your assets index.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {assets.map((asset) => (
            <div key={asset.id} className="glass border border-gold/10 hover:border-gold/20 rounded-2xl overflow-hidden flex flex-col group transition-all">
              {/* Preview container */}
              <div className="aspect-square bg-black/40 relative flex items-center justify-center overflow-hidden border-b border-gold/8 shrink-0">
                {asset.mime_type?.startsWith('image/') ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={asset.file_url} alt={asset.file_name} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300" />
                ) : (
                  <div className="flex flex-col items-center justify-center space-y-2">
                    {getFileIcon(asset.mime_type)}
                    <span className="text-[10px] text-muted-foreground font-semibold uppercase">{asset.mime_type?.split('/')?.[1] ?? 'File'}</span>
                  </div>
                )}
                {/* Actions overlay on hover */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2.5">
                  <button
                    onClick={() => handleCopy(asset.file_url, asset.id)}
                    className="p-2 rounded-xl bg-white/10 hover:bg-gold hover:text-background text-foreground transition-all"
                    title="Copy URL"
                  >
                    {copiedId === asset.id ? <Check size={15} /> : <Copy size={15} />}
                  </button>
                  <a
                    href={asset.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-foreground transition-all"
                    title="Open Link"
                  >
                    <ExternalLink size={15} />
                  </a>
                  <button
                    onClick={() => handleDelete(asset)}
                    className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500 text-foreground transition-all border border-red-500/30"
                    title="Delete Asset"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
              {/* Metadata */}
              <div className="p-3 flex-1 flex flex-col justify-between space-y-1">
                <p className="text-xs font-semibold text-foreground line-clamp-1 break-all" title={asset.file_name}>{asset.file_name}</p>
                <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                  <span>{formatSize(asset.file_size)}</span>
                  <span>{new Date(asset.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
