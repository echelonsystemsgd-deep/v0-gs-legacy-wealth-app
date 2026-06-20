'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Shield, 
  Calendar, 
  Camera, 
  Loader2, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

type Profile = {
  id: string
  first_name: string | null
  last_name: string | null
  full_name: string | null
  email: string | null
  avatar_url: string | null
  phone_number: string | null
  address_line1: string | null
  address_line2: string | null
  city: string | null
  post_code: string | null
  role: string
  created_at: string
}

interface ProfileClientContainerProps {
  initialProfile: Profile
  email: string
}

export default function ProfileClientContainer({
  initialProfile,
  email
}: ProfileClientContainerProps) {
  const router = useRouter()
  const supabase = createClient()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Form states
  const [firstName, setFirstName] = useState(initialProfile.first_name || '')
  const [lastName, setLastName] = useState(initialProfile.last_name || '')
  const [phoneNumber, setPhoneNumber] = useState(initialProfile.phone_number || '')
  const [addressLine1, setAddressLine1] = useState(initialProfile.address_line1 || '')
  const [addressLine2, setAddressLine2] = useState(initialProfile.address_line2 || '')
  const [city, setCity] = useState(initialProfile.city || '')
  const [postCode, setPostCode] = useState(initialProfile.post_code || '')
  const [avatarUrl, setAvatarUrl] = useState(initialProfile.avatar_url || '')

  // UI state
  const [displayAvatarUrl, setDisplayAvatarUrl] = useState('')
  const [pendingFile, setPendingFile] = useState<Blob | null>(null)
  const [saving, setSaving] = useState(false)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  // Resolve initial storage path to signed URL on load
  useState(() => {
    const resolveInitialAvatar = async () => {
      if (initialProfile.avatar_url) {
        if (
          initialProfile.avatar_url.startsWith('data:') || 
          initialProfile.avatar_url.startsWith('http://') || 
          initialProfile.avatar_url.startsWith('https://')
        ) {
          setDisplayAvatarUrl(initialProfile.avatar_url)
        } else {
          try {
            const { data, error } = await supabase.storage
              .from('avatars')
              .createSignedUrl(initialProfile.avatar_url, 3600)
            if (!error && data) {
              setDisplayAvatarUrl(data.signedUrl)
            }
          } catch (err) {
            console.error('Error fetching signed avatar URL', err)
          }
        }
      }
    }
    resolveInitialAvatar()
  })

  // Resizes and prepares file for upload
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file.')
      return
    }

    setUploading(true)
    setErrorMsg(null)
    setSuccessMsg(null)

    try {
      const resizedBase64 = await resizeAvatar(file)
      // Set local preview
      setDisplayAvatarUrl(resizedBase64)
      
      // Convert base64 preview back to blob for upload
      const response = await fetch(resizedBase64)
      const blob = await response.blob()
      setPendingFile(blob)
      setSuccessMsg('Avatar updated! Click Save Profile to apply changes.')
    } catch (err: any) {
      console.error(err)
      setErrorMsg('Failed to process the profile image.')
    } finally {
      setUploading(false)
    }
  }

  const resizeAvatar = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const max_size = 180 // Compact avatar size is sufficient
          let width = img.width
          let height = img.height

          if (width > height) {
            if (width > max_size) {
              height *= max_size / width
              width = max_size
            }
          } else {
            if (height > max_size) {
              width *= max_size / height
              height = max_size
            }
          }
          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          ctx?.drawImage(img, 0, 0, width, height)
          // Compress as JPEG to keep database size extremely lightweight (20-30kb)
          const dataUrl = canvas.toDataURL('image/jpeg', 0.8)
          resolve(dataUrl)
        }
        img.onerror = () => reject('Error loading image')
        img.src = e.target?.result as string
      }
      reader.onerror = () => reject('Error reading file')
      reader.readAsDataURL(file)
    })
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setErrorMsg(null)
    setSuccessMsg(null)

    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim()
    let finalAvatarPath = avatarUrl

    try {
      if (pendingFile) {
        // 1. Purge any old avatars inside the user's directory
        const { data: existingFiles, error: listError } = await supabase.storage
          .from('avatars')
          .list(initialProfile.id)
        
        if (!listError && existingFiles && existingFiles.length > 0) {
          const filesToRemove = existingFiles.map(f => `${initialProfile.id}/${f.name}`)
          await supabase.storage.from('avatars').remove(filesToRemove)
        }

        // 2. Upload the new file
        const fileName = `avatar-${Date.now()}.jpg`
        const filePath = `${initialProfile.id}/${fileName}`
        
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, pendingFile, {
            contentType: 'image/jpeg',
            upsert: true
          })

        if (uploadError) throw uploadError
        
        finalAvatarPath = filePath
        setAvatarUrl(filePath)
        setPendingFile(null)
      }

      // 3. Save details to profile table
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: firstName,
          last_name: lastName,
          full_name: fullName,
          phone_number: phoneNumber,
          address_line1: addressLine1,
          address_line2: addressLine2,
          city,
          post_code: postCode,
          avatar_url: finalAvatarPath,
          updated_at: new Date().toISOString()
        })
        .eq('id', initialProfile.id)

      if (error) throw error

      // 4. Resolve the newly saved storage path to a fresh signed URL
      if (finalAvatarPath && !finalAvatarPath.startsWith('http') && !finalAvatarPath.startsWith('data')) {
        const { data: signedData } = await supabase.storage
          .from('avatars')
          .createSignedUrl(finalAvatarPath, 3600)
        if (signedData) {
          setDisplayAvatarUrl(signedData.signedUrl)
        }
      }

      setSuccessMsg('Your profile has been saved successfully!')
      router.refresh()
    } catch (err: any) {
      console.error(err)
      setErrorMsg(err.message || 'An error occurred while saving your profile.')
    } finally {
      setSaving(false)
      setTimeout(() => {
        setSuccessMsg(null)
      }, 5000)
    }
  }


  const getInitials = () => {
    if (firstName || lastName) {
      return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase()
    }
    return email?.[0]?.toUpperCase() || 'U'
  }

  const getFullName = () => {
    if (firstName || lastName) {
      return `${firstName} ${lastName}`.trim()
    }
    return email?.split('@')[0] || 'Registered User'
  }

  const getFormattedDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  return (
    <div className="grid md:grid-cols-3 gap-8 animate-fade-in relative z-10">
      {/* Sidebar: Profile Summary Card */}
      <div className="md:col-span-1 space-y-6">
        <div className="p-8 rounded-2xl border border-gold/15 bg-background/50 backdrop-blur-md text-center flex flex-col items-center space-y-6 shadow-xl">
          {/* Avatar Area */}
          <div className="relative group">
            <div className="h-28 w-28 rounded-full border-2 border-gold/25 group-hover:border-gold/50 transition-all duration-300 overflow-hidden flex items-center justify-center bg-card">
              <Avatar className="h-26 w-26">
                <AvatarImage src={displayAvatarUrl || ''} alt={getFullName()} className="object-cover" />
                <AvatarFallback className="bg-gradient-to-br from-gold/20 to-purple-500/20 text-gold text-2xl font-bold font-serif">

                  {getInitials()}
                </AvatarFallback>
              </Avatar>
            </div>
            {/* Upload Hover Overlay */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 bg-[#000000]/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 border border-gold/40 cursor-pointer"
              disabled={uploading}
            >
              {uploading ? (
                <Loader2 className="h-6 w-6 text-gold animate-spin" />
              ) : (
                <Camera className="h-6 w-6 text-gold" />
              )}
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
          </div>

          <div>
            <h3 className="text-xl font-bold font-serif text-foreground truncate max-w-full">
              {getFullName()}
            </h3>
            <p className="text-xs text-muted-foreground mt-1 truncate max-w-full">{email}</p>
          </div>

          {/* Account Status / Metadata */}
          <div className="w-full pt-6 border-t border-gold/10 space-y-3 text-left">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Shield size={13} className="text-gold" /> Role:
              </span>
              <span className="font-semibold text-gold uppercase tracking-wider text-[10px] px-2.5 py-0.5 rounded-full bg-gold/10 border border-gold/20">
                {initialProfile.role}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Calendar size={13} className="text-gold" /> Member Since:
              </span>
              <span className="font-medium text-foreground">
                {getFormattedDate(initialProfile.created_at)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content: Form Editor */}
      <div className="md:col-span-2">
        <form onSubmit={handleSave} className="p-8 rounded-2xl border border-gold/15 bg-background/50 backdrop-blur-md space-y-8 shadow-xl">
          <div className="space-y-1 pb-4 border-b border-gold/10">
            <h3 className="text-xl font-bold font-serif text-foreground">Profile Settings</h3>
            <p className="text-xs text-muted-foreground">Modify your account coordinates, contact channels, and physical location.</p>
          </div>

          {/* Notification Banners */}
          {successMsg && (
            <div className="flex items-start gap-2.5 bg-green-500/10 border border-green-500/25 rounded-xl px-4 py-3 text-xs text-green-400">
              <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}
          {errorMsg && (
            <div className="flex items-start gap-2.5 bg-red-500/10 border border-red-500/25 rounded-xl px-4 py-3 text-xs text-red-400">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Grid fields */}
          <div className="grid sm:grid-cols-2 gap-6">
            {/* First name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <User size={12} className="text-gold" /> First Name
              </label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="e.g. John"
                className="w-full bg-background/30 border border-gold/10 hover:border-gold/25 focus:border-gold/50 rounded-lg px-3 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/30 outline-none transition-all"
              />
            </div>

            {/* Last name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <User size={12} className="text-gold" /> Last Name
              </label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="e.g. Smith"
                className="w-full bg-background/30 border border-gold/10 hover:border-gold/25 focus:border-gold/50 rounded-lg px-3 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/30 outline-none transition-all"
              />
            </div>

            {/* Email (Read-only) */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                <Mail size={12} className="text-gold/40" /> Email Address (Read-only)
              </label>
              <input
                type="email"
                disabled
                value={email}
                className="w-full bg-background/10 border border-gold/5 text-muted-foreground cursor-not-allowed rounded-lg px-3 py-2.5 text-xs outline-none"
              />
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Phone size={12} className="text-gold" /> Phone Number
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+44 7700 900077"
                className="w-full bg-background/30 border border-gold/10 hover:border-gold/25 focus:border-gold/50 rounded-lg px-3 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/30 outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-6 pt-4 border-t border-gold/10">
            <h4 className="text-sm font-bold font-serif text-gold flex items-center gap-1.5">
              <MapPin size={14} /> Address Coordinates
            </h4>

            <div className="grid sm:grid-cols-2 gap-6">
              {/* Address Line 1 */}
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Address Line 1</label>
                <input
                  type="text"
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  placeholder="e.g. 12 Mayfair Crescent"
                  className="w-full bg-background/30 border border-gold/10 hover:border-gold/25 focus:border-gold/50 rounded-lg px-3 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/30 outline-none transition-all"
                />
              </div>

              {/* Address Line 2 */}
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Address Line 2 (Optional)</label>
                <input
                  type="text"
                  value={addressLine2}
                  onChange={(e) => setAddressLine2(e.target.value)}
                  placeholder="e.g. Flat 3B"
                  className="w-full bg-background/30 border border-gold/10 hover:border-gold/25 focus:border-gold/50 rounded-lg px-3 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/30 outline-none transition-all"
                />
              </div>

              {/* City */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. London"
                  className="w-full bg-background/30 border border-gold/10 hover:border-gold/25 focus:border-gold/50 rounded-lg px-3 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/30 outline-none transition-all"
                />
              </div>

              {/* Post Code */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Post Code</label>
                <input
                  type="text"
                  value={postCode}
                  onChange={(e) => setPostCode(e.target.value)}
                  placeholder="e.g. W1J 8DJ"
                  className="w-full bg-background/30 border border-gold/10 hover:border-gold/25 focus:border-gold/50 rounded-lg px-3 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/30 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Action button */}
          <div className="pt-4 border-t border-gold/10 flex justify-end">
            <Button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-gold hover:bg-gold-light text-background font-bold text-xs hover:shadow-[0_0_15px_rgba(212,175,55,0.25)] transition-all duration-300 flex items-center gap-1.5 cursor-pointer"
            >
              {saving ? <Loader2 size={13} className="animate-spin" /> : null}
              Save Profile Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
