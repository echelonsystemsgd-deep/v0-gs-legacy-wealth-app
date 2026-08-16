'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  User, Shield, UserX, UserCheck, Save, Loader2, Key, Check, AlertCircle, Upload, Settings, Calendar, CheckCircle2, ScrollText, Sparkles, Flame, Megaphone
} from 'lucide-react'

type Profile = {
  id: string; full_name: string | null; avatar_url: string | null
  role: 'admin' | 'client' | 'user'; is_suspended: boolean; created_at: string
}

export default function SettingsPage() {
  const supabase = createClient()
  const [activeTab, setActiveTab] = useState<'profile' | 'team' | 'system' | 'cohort' | 'logs'>('profile')
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [currentUser, setCurrentUser] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [logs, setLogs] = useState<any[]>([])
  const [logsLoading, setLogsLoading] = useState(false)

  // Profile Form States
  const [fullName, setFullName] = useState('')
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarUrl, setAvatarUrl] = useState('') // raw storage path or public URL
  const [displayAvatarUrl, setDisplayAvatarUrl] = useState('') // resolved URL for preview

  // System Config States
  const [calendlyUrl, setCalendlyUrl] = useState('')
  const [leadThreshold, setLeadThreshold] = useState('10')

  // Cohort & Scarcity CMS States
  const [cohortQuota, setCohortQuota] = useState('2')
  const [cohortOverride, setCohortOverride] = useState('')
  const [cohortStatus, setCohortStatus] = useState<'open' | 'closing_soon' | 'waitlist_only'>('open')
  const [bannerActive, setBannerActive] = useState(true)
  const [bannerText, setBannerText] = useState('Custom AI Automations & Digital Storefronts — Test Live Order Demo')
  const [bannerLink, setBannerLink] = useState('/local')

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
      const rawPath = curr.avatar_url ?? ''
      setAvatarUrl(rawPath)
      // Resolve to a displayable URL
      if (rawPath) {
        if (rawPath.startsWith('http://') || rawPath.startsWith('https://') || rawPath.startsWith('data:')) {
          setDisplayAvatarUrl(rawPath)
        } else {
          const { data: signedData } = await supabase.storage.from('avatars').createSignedUrl(rawPath, 3600)
          if (signedData) setDisplayAvatarUrl(signedData.signedUrl)
        }
      }
    }

    // Fetch system configs if available
    const { data: contentData } = await supabase.from('website_content').select('*').eq('section_key', 'system_config').maybeSingle()
    if (contentData && contentData.content) {
      setCalendlyUrl(contentData.content.calendly_url ?? '')
      setLeadThreshold(contentData.content.lead_threshold ?? '10')
    }

    // Fetch cohort scarcity CMS settings
    const { data: cohortData } = await supabase.from('website_content').select('*').eq('section_key', 'cohort_scarcity_settings').maybeSingle()
    if (cohortData && cohortData.content) {
      const c = cohortData.content
      if (c.total_quota !== undefined) setCohortQuota(String(c.total_quota))
      if (c.manual_override_slots !== undefined && c.manual_override_slots !== null) setCohortOverride(String(c.manual_override_slots))
      if (c.cohort_status) setCohortStatus(c.cohort_status)
      if (typeof c.banner_active === 'boolean') setBannerActive(c.banner_active)
      if (c.banner_text) setBannerText(c.banner_text)
      if (c.banner_link) setBannerLink(c.banner_link)
    }

    setLoading(false)
  }, [supabase])

  useEffect(() => {
    fetchProfilesAndUser()
  }, [fetchProfilesAndUser])

  const fetchLogs = useCallback(async () => {
    setLogsLoading(true)
    const { data } = await supabase
      .from('activity_logs')
      .select('id, action_type, target_table, created_at, profiles(full_name, role)')
      .order('created_at', { ascending: false })
      .limit(50)
    setLogs(data ?? [])
    setLogsLoading(false)
  }, [supabase])

  useEffect(() => {
    if (activeTab === 'logs') {
      fetchLogs()
    }
  }, [activeTab, fetchLogs])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser) return
    setSaving(true)

    let finalAvatarUrl = avatarUrl

    if (avatarFile) {
      const fileName = `avatar-${Date.now()}.jpg`
      const filePath = `${currentUser.id}/${fileName}`

      // Purge old avatars in the user's folder
      const { data: existingFiles } = await supabase.storage.from('avatars').list(currentUser.id)
      if (existingFiles && existingFiles.length > 0) {
        const filesToRemove = existingFiles.map((f) => `${currentUser.id}/${f.name}`)
        await supabase.storage.from('avatars').remove(filesToRemove)
      }

      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, avatarFile, { upsert: true })
      if (uploadError) {
        showToast(`Avatar upload failed: ${uploadError.message}`)
        setSaving(false)
        return
      }
      // Get signed URL for display
      const { data: signedData } = await supabase.storage.from('avatars').createSignedUrl(filePath, 3600)
      if (signedData) setDisplayAvatarUrl(signedData.signedUrl)
      finalAvatarUrl = filePath
      setAvatarUrl(filePath)
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

  const handleUpdateCohort = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()

    const overrideValue = cohortOverride.trim() === '' ? null : Number(cohortOverride)
    const quotaValue = Number(cohortQuota) || 2

    const payload = {
      total_quota: quotaValue,
      manual_override_slots: overrideValue,
      cohort_status: cohortStatus,
      banner_active: bannerActive,
      banner_text: bannerText,
      banner_link: bannerLink,
    }

    const { error } = await supabase
      .from('website_content')
      .upsert(
        {
          section_key: 'cohort_scarcity_settings',
          content: payload,
          updated_at: new Date().toISOString(),
          updated_by: user?.id || null,
        },
        { onConflict: 'section_key' }
      )

    setSaving(false)
    if (error) {
      showToast(`Cohort settings save failed: ${error.message}`)
    } else {
      showToast('Cohort scarcity and broadcast settings saved.')
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
    const { error } = await supabase.functions.invoke('admin-user-actions', {
      body: { target_user_id: profile.id, action: targetStatus ? 'suspend' : 'unsuspend' }
    })
    if (error) {
      showToast(`Error updating status: ${error.message}`)
    } else {
      showToast(targetStatus ? 'Account suspended.' : 'Account active.')
      fetchProfilesAndUser()
    }
  }

  return (
    <div className="space-y-6 sm:space-y-10 relative">
      {toast && (
        <div className="fixed top-4 left-4 z-50 px-4 py-3 rounded-xl bg-green-500/15 border border-green-500/30 text-sm font-medium text-green-400 shadow-xl flex items-center gap-2 animate-fade-in">
          <CheckCircle2 size={14} className="text-green-400" /> {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold tracking-[0.2em] text-gold/80 uppercase">
            <Settings size={12} /> System Console Panel
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground mt-1">Settings</h1>
          <p className="text-sm text-muted-foreground">Configure your personal profile, team permissions, cohort scarcity, and sitewide telemetry.</p>
        </div>
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
          onClick={() => setActiveTab('cohort')}
          className={`px-5 py-3 border-b-2 text-sm font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
            activeTab === 'cohort'
              ? 'border-gold text-gold bg-gold/5'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Flame size={14} /> Cohort Scarcity & Broadcast
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
          <Settings size={14} /> Integrations
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`px-5 py-3 border-b-2 text-sm font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
            activeTab === 'logs'
              ? 'border-gold text-gold bg-gold/5'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <ScrollText size={14} /> Audit Trail Logs
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
                    {displayAvatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={displayAvatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <User size={28} className="text-gold" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground block">Upload Avatar</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0] ?? null
                        setAvatarFile(file)
                        if (file) {
                          const localUrl = URL.createObjectURL(file)
                          setDisplayAvatarUrl(localUrl)
                        }
                      }}
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
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-gold to-gold-light text-background text-sm font-bold disabled:opacity-50 hover:shadow-[0_0_16px_rgba(212,175,55,0.3)] transition-all cursor-pointer"
                  >
                    {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'cohort' && (
            <div className="glass rounded-2xl border border-gold/10 p-6 max-w-2xl space-y-6">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-gold">
                  <Flame size={14} /> Telemetry & Scarcity Controls
                </div>
                <h2 className="font-serif text-xl font-bold text-foreground">Cohort Scarcity & Sitewide Announcement</h2>
                <p className="text-xs text-muted-foreground">Directly update scarcity counts displayed on the homepage hero, pricing tiers, and announcement bar.</p>
              </div>

              <form onSubmit={handleUpdateCohort} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground block">
                      Total Monthly Quota
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      required
                      value={cohortQuota}
                      onChange={(e) => setCohortQuota(e.target.value)}
                      className="w-full bg-background/60 border border-gold/15 hover:border-gold/25 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold/20 transition-all font-mono"
                    />
                    <p className="text-[10px] text-muted-foreground">Default is 2 partners per month.</p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground block">
                      Manual Slots Override (Optional)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="20"
                      placeholder="Leave blank for auto CRM count"
                      value={cohortOverride}
                      onChange={(e) => setCohortOverride(e.target.value)}
                      className="w-full bg-background/60 border border-gold/15 hover:border-gold/25 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold/20 transition-all font-mono"
                    />
                    <p className="text-[10px] text-muted-foreground">Forces remaining slots counter (e.g. 1 or 0).</p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground block">
                    Cohort Status
                  </label>
                  <select
                    value={cohortStatus}
                    onChange={(e: any) => setCohortStatus(e.target.value)}
                    className="w-full bg-background/60 border border-gold/15 hover:border-gold/25 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold/20 transition-all"
                  >
                    <option value="open">Open (Active Intake)</option>
                    <option value="closing_soon">Closing Soon (Final Slot)</option>
                    <option value="waitlist_only">Waitlist Only (Cohort Filled)</option>
                  </select>
                </div>

                <div className="pt-4 border-t border-gold/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-foreground">Sitewide Announcement Bar</p>
                      <p className="text-[11px] text-muted-foreground">Top header promotional banner across all public pages.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={bannerActive}
                        onChange={(e) => setBannerActive(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-background after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold"></div>
                    </label>
                  </div>

                  {bannerActive && (
                    <>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground block">Banner Headline</label>
                        <input
                          value={bannerText}
                          onChange={(e) => setBannerText(e.target.value)}
                          className="w-full bg-background/60 border border-gold/15 hover:border-gold/25 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold/20 transition-all"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground block">Target Link Destination</label>
                        <input
                          value={bannerLink}
                          onChange={(e) => setBannerLink(e.target.value)}
                          placeholder="/local or /book"
                          className="w-full bg-background/60 border border-gold/15 hover:border-gold/25 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold/20 transition-all font-mono"
                        />
                      </div>
                    </>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-gold to-gold-light text-background text-sm font-bold disabled:opacity-50 hover:shadow-[0_0_16px_rgba(212,175,55,0.3)] transition-all cursor-pointer"
                  >
                    {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                    Save Telemetry & Scarcity
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'team' && (
            <div className="glass rounded-2xl border border-gold/10 p-6 space-y-4">
              <h2 className="font-serif text-xl font-bold text-foreground">Manage Console Roles</h2>
              {/* Desktop Table view */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gold/10 text-xxs font-bold uppercase tracking-widest text-muted-foreground bg-white/[0.01]">
                      <th className="py-3 px-4">User</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Access Level</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gold/5 text-sm">
                    {profiles.map((profile) => (
                      <tr key={profile.id} className="hover:bg-white/[0.02] transition-colors">
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
                              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-foreground transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                              title="Toggle admin role status"
                            >
                              <Shield size={14} />
                            </button>
                            <button
                              onClick={() => toggleUserSuspension(profile)}
                              disabled={profile.id === currentUser?.id}
                              className={`p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer ${
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

              {/* Mobile Card List view */}
              <div className="block md:hidden space-y-4">
                {profiles.map((profile) => (
                  <div
                    key={profile.id}
                    className="p-4 glass rounded-xl border border-gold/10 hover:border-gold/25 transition-all space-y-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/20 overflow-hidden flex items-center justify-center shrink-0">
                        {profile.avatar_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xs font-bold text-gold">{profile.full_name?.[0] ?? 'U'}</span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-foreground text-sm truncate">{profile.full_name || 'Anonymous User'}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{profile.id}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gold/5 text-xs">
                      <div className="flex gap-2">
                        {profile.is_suspended ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-red-500/10 border border-red-500/30 text-[10px] font-semibold text-red-400">Suspended</span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full bg-green-500/10 border border-green-500/30 text-[10px] font-semibold text-green-400">Active</span>
                        )}
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                          profile.role === 'admin' ? 'bg-gold/15 border border-gold/30 text-gold' : 'bg-white/5 border border-gold/10 text-muted-foreground'
                        }`}>
                          {profile.role.toUpperCase()}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleUserRole(profile)}
                          disabled={profile.id === currentUser?.id}
                          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-foreground transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                          title="Toggle admin role status"
                        >
                          <Shield size={14} />
                        </button>
                        <button
                          onClick={() => toggleUserSuspension(profile)}
                          disabled={profile.id === currentUser?.id}
                          className={`p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer ${
                            profile.is_suspended ? 'text-green-400' : 'text-red-400'
                          }`}
                          title={profile.is_suspended ? 'Activate Account' : 'Suspend Account'}
                        >
                          {profile.is_suspended ? <UserCheck size={14} /> : <UserX size={14} />}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
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
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-gold to-gold-light text-background text-sm font-bold disabled:opacity-50 hover:shadow-[0_0_16px_rgba(212,175,55,0.3)] transition-all cursor-pointer"
                  >
                    {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                    Save Configurations
                  </button>
                </div>
              </form>
            </div>
          )}
          {activeTab === 'logs' && (
            <div className="glass rounded-2xl border border-gold/10 p-6 space-y-6">
              <div>
                <h2 className="font-serif text-xl font-bold text-foreground">Operational Audit Trail</h2>
                <p className="text-[10px] text-muted-foreground mt-0.5">Real-time system telemetry and transaction records</p>
              </div>

              {logsLoading ? (
                <div className="py-12 flex flex-col items-center justify-center space-y-4">
                  <Loader2 size={24} className="text-gold animate-spin" />
                  <p className="text-xs text-muted-foreground font-mono">Syncing log records...</p>
                </div>
              ) : logs.length === 0 ? (
                <div className="py-12 text-center text-xs text-muted-foreground italic border border-dashed border-gold/10 rounded-xl">
                  No activity records logged in this segment.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-gold/10 text-[9px] font-bold uppercase tracking-widest text-muted-foreground bg-white/[0.01]">
                        <th className="py-2.5 px-3">Date</th>
                        <th className="py-2.5 px-3">User</th>
                        <th className="py-2.5 px-3">Action</th>
                        <th className="py-2.5 px-3">Target Table</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gold/5 font-mono text-[11px]">
                      {logs.map((log) => (
                        <tr key={log.id} className="hover:bg-white/[0.01] transition-colors">
                          <td className="py-2.5 px-3 text-muted-foreground">
                            {new Date(log.created_at).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td className="py-2.5 px-3 text-foreground font-sans font-semibold">
                            {log.profiles?.full_name || 'System Operator'}
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="px-1.5 py-0.5 rounded bg-gold/5 text-gold border border-gold/20 text-[9px] font-bold">
                              {log.action_type}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-muted-foreground">
                            {log.target_table}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
