'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  User, Shield, UserX, UserCheck, Save, Loader2, Key, Check, AlertCircle, Upload, Settings, Calendar
} from 'lucide-react'

type Profile = {
  id: string; full_name: string | null; avatar_url: string | null
  role: 'admin' | 'user'; is_suspended: boolean; created_at: string
}

export default function SettingsPage() {
  const supabase = createClient()
  const [activeTab, setActiveTab] = useState<'profile' | 'team' | 'system'>('profile')
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [currentUser, setCurrentUser] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  // Profile Form States
  const [fullName, setFullName] = useState('')
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarUrl, setAvatarUrl] = useState('')

  // System Config States
  const [calendlyUrl, setCalendlyUrl] = useState('')
  const [leadThreshold, setLeadThreshold] = useState('10')

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000) }

  const fetchProfilesAndUser = useCallback(async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Fetch team
    const { data: profilesList } = await supabase.from('profiles').select('*').order('created_at', { ascending: true })
    const list = profilesList ?? []
    setProfiles(list)

    const curr = list.find((p) => p.id === user.id)
    if (curr) {
      setCurrentUser(curr)
      setFullName(curr.full_name ?? '')
      setAvatarUrl(curr.avatar_url ?? '')
    }

    // Fetch system configs if available
    const { data: contentData } = await supabase.from('website_content').select('*').eq('section_key', 'system_config').single()
    if (contentData) {
      setCalendlyUrl(contentData.content.calendly_url ?? '')
      setLeadThreshold(contentData.content.lead_threshold ?? '10')
    }

    setLoading(false)
  }, [supabase])

  useEffect(() => {
    fetchProfilesAndUser()
  }, [fetchProfilesAndUser])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser) return
    setSaving(true)

    let finalAvatarUrl = avatarUrl

    if (avatarFile) {
      const path = `avatars/${currentUser.id}-${Date.now()}-${avatarFile.name}`
      const { error: uploadError } = await supabase.storage.from('branding').upload(path, avatarFile, { upsert: true })
      if (uploadError) {
        showToast(`Avatar upload failed: ${uploadError.message}`)
        setSaving(false)
        return
      }
      const { data: { publicUrl } } = supabase.storage.from('branding').getPublicUrl(path)
      finalAvatarUrl = publicUrl
      setAvatarUrl(publicUrl)
    }

    const { error } = await supabase
      .from('profiles')
      .update({ full_name: fullName, avatar_url: finalAvatarUrl })
      .eq('id', currentUser.id)

    setSaving(false)
    if (error) {
      showToast(`Profile update failed: ${error.message}`)
    } else {
      showToast('Profile settings saved.')
      fetchProfilesAndUser()
    }
  }

  const handleUpdateSystem = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()

    const { error } = await supabase
      .from('website_content')
      .upsert(
        {
          section_key: 'system_config',
          content: { calendly_url: calendlyUrl, lead_threshold: leadThreshold },
          updated_at: new Date().toISOString(),
          updated_by: user?.id || null
        },
        { onConflict: 'section_key' }
      )

    setSaving(false)
    if (error) {
      showToast(`System update failed: ${error.message}`)
    } else {
      showToast('System configuration saved.')
    }
  }

  const toggleUserRole = async (profile: Profile) => {
    if (profile.id === currentUser?.id) {
      showToast('You cannot change your own role.')
      return
    }
    const newRole = profile.role === 'admin' ? 'user' : 'admin'
    const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', profile.id)
    if (error) {
      showToast(`Error updating role: ${error.message}`)
    } else {
      showToast(`Role updated to ${newRole}.`)
      fetchProfilesAndUser()
    }
  }

  const toggleUserSuspension = async (profile: Profile) => {
    if (profile.id === currentUser?.id) {
      showToast('You cannot suspend your own account.')
      return
    }
    const targetStatus = !profile.is_suspended
    const { error } = await supabase.from('profiles').update({ is_suspended: targetStatus }).eq('id', profile.id)
    if (error) {
      showToast(`Error updating status: ${error.message}`)
    } else {
      showToast(targetStatus ? 'Account suspended.' : 'Account active.')
      fetchProfilesAndUser()
    }
  }

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed top-4 left-4 z-50 px-4 py-3 rounded-xl bg-green-500/15 border border-green-500/30 text-sm font-medium text-green-400 shadow-xl flex items-center gap-2">
          <Check size={14} /> {toast}
        </div>
      )}

      <div>
        <p className="text-xxs font-bold uppercase tracking-[0.3em] text-gold/70">Console</p>
        <h1 className="font-serif text-3xl font-bold text-foreground mt-1">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Configure your personal profile, team permissions, and third-party tools.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gold/10 overflow-x-auto scrollbar-none gap-2">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-5 py-3 border-b-2 text-sm font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
            activeTab === 'profile'
              ? 'border-gold text-gold bg-gold/5'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <User size={14} /> Personal Profile
        </button>
        <button
          onClick={() => setActiveTab('team')}
          className={`px-5 py-3 border-b-2 text-sm font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
            activeTab === 'team'
              ? 'border-gold text-gold bg-gold/5'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Shield size={14} /> Team Permissions
        </button>
        <button
          onClick={() => setActiveTab('system')}
          className={`px-5 py-3 border-b-2 text-sm font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
            activeTab === 'system'
              ? 'border-gold text-gold bg-gold/5'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Settings size={14} /> Integrations & Systems
        </button>
      </div>

      {loading ? (
        <div className="glass rounded-2xl border border-gold/10 p-12 flex flex-col items-center justify-center space-y-4">
          <Loader2 size={36} className="text-gold animate-spin" />
          <p className="text-sm text-muted-foreground animate-pulse">Loading settings panel...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {activeTab === 'profile' && currentUser && (
            <div className="glass rounded-2xl border border-gold/10 p-6 max-w-2xl space-y-6">
              <h2 className="font-serif text-xl font-bold text-foreground">Edit Profile Information</h2>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="flex items-center gap-5 flex-wrap">
                  <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold/25 overflow-hidden flex items-center justify-center relative shrink-0">
                    {avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <User size={28} className="text-gold" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground block">Upload Avatar</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setAvatarFile(e.target.files?.[0] ?? null)}
                      className="text-xs text-muted-foreground file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border file:border-gold/25 file:bg-gold/5 file:text-xxs file:font-semibold file:text-gold hover:file:bg-gold/10 transition-all cursor-pointer"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Full Display Name</label>
                  <input
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-background/60 border border-gold/15 hover:border-gold/25 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold/20 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">User ID Reference</label>
                  <input
                    disabled
                    value={currentUser.id}
                    className="w-full bg-white/5 border border-gold/10 rounded-xl px-4 py-2.5 text-sm text-muted-foreground outline-none cursor-not-allowed"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-gold to-gold-light text-background text-sm font-bold disabled:opacity-50 hover:shadow-[0_0_16px_rgba(212,175,55,0.3)] transition-all"
                  >
                    {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'team' && (
            <div className="glass rounded-2xl border border-gold/10 p-6 space-y-4">
              <h2 className="font-serif text-xl font-bold text-foreground">Manage Console Roles</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gold/10 text-xxs font-bold uppercase tracking-widest text-muted-foreground">
                      <th className="py-3 px-4">User</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Access Level</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gold/5 text-sm">
                    {profiles.map((profile) => (
                      <tr key={profile.id} className="hover:bg-white/2 transition-colors">
                        <td className="py-3.5 px-4 flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gold/10 border border-gold/20 overflow-hidden flex items-center justify-center shrink-0">
                            {profile.avatar_url ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-xs font-bold text-gold">{profile.full_name?.[0] ?? 'U'}</span>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">{profile.full_name || 'Anonymous User'}</p>
                            <p className="text-[10px] text-muted-foreground break-all">{profile.id}</p>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          {profile.is_suspended ? (
                            <span className="px-2.5 py-0.5 rounded-full bg-red-500/10 border border-red-500/30 text-xxs font-semibold text-red-400">Suspended</span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full bg-green-500/10 border border-green-500/30 text-xxs font-semibold text-green-400">Active</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-xxs font-semibold ${
                            profile.role === 'admin' ? 'bg-gold/15 border border-gold/30 text-gold' : 'bg-white/5 border border-gold/10 text-muted-foreground'
                          }`}>
                            {profile.role.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => toggleUserRole(profile)}
                              disabled={profile.id === currentUser?.id}
                              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-foreground transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                              title="Toggle admin role status"
                            >
                              <Shield size={14} />
                            </button>
                            <button
                              onClick={() => toggleUserSuspension(profile)}
                              disabled={profile.id === currentUser?.id}
                              className={`p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
                                profile.is_suspended ? 'text-green-400' : 'text-red-400'
                              }`}
                              title={profile.is_suspended ? 'Activate Account' : 'Suspend Account'}
                            >
                              {profile.is_suspended ? <UserCheck size={14} /> : <UserX size={14} />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'system' && (
            <div className="glass rounded-2xl border border-gold/10 p-6 max-w-2xl space-y-6">
              <h2 className="font-serif text-xl font-bold text-foreground">Integrations & Dashboard Configuration</h2>
              <form onSubmit={handleUpdateSystem} className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    <Calendar size={13} className="text-gold" />
                    <span>Calendly Booking URL</span>
                  </div>
                  <input
                    value={calendlyUrl}
                    onChange={(e) => setCalendlyUrl(e.target.value)}
                    placeholder="https://calendly.com/your-agency/strategy-session"
                    className="w-full bg-background/60 border border-gold/15 hover:border-gold/25 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold/20 transition-all"
                  />
                  <p className="text-[10px] text-muted-foreground">Used directly by the public booking scheduler modal/page.</p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    <Shield size={13} className="text-gold" />
                    <span>Lead Threshold (Target Leads Month)</span>
                  </div>
                  <input
                    type="number"
                    value={leadThreshold}
                    onChange={(e) => setLeadThreshold(e.target.value)}
                    className="w-full bg-background/60 border border-gold/15 hover:border-gold/25 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold/20 transition-all"
                  />
                  <p className="text-[10px] text-muted-foreground">Sets the denominator target for the active month KPIs.</p>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-gold to-gold-light text-background text-sm font-bold disabled:opacity-50 hover:shadow-[0_0_16px_rgba(212,175,55,0.3)] transition-all"
                  >
                    {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                    Save Configurations
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
