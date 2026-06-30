'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Copy, RefreshCw, Check, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { createBrowserClient } from '@supabase/ssr'
import { LocaleSwitcher } from '@/components/i18n/locale-switcher'
import { useT } from '@/components/i18n/locale-provider'
import { translateError } from '@/lib/i18n/t'
import { apiClient } from '@/lib/client/api-client'
import type { DbProfile, DbShareLink } from '@/types/record'

interface SettingsFormProps {
  profile: DbProfile | null
  shareLink: DbShareLink | null
  appUrl: string
}

export function SettingsForm({ profile, shareLink, appUrl }: SettingsFormProps) {
  const router = useRouter()
  const t = useT()
  const [displayName, setDisplayName] = useState(profile?.display_name ?? '')
  const [shareTitle, setShareTitle] = useState(profile?.share_title ?? '')
  const [shareDescription, setShareDescription] = useState(profile?.share_description ?? '')
  const [shareEnabled, setShareEnabled] = useState(shareLink?.is_enabled ?? true)
  const [token, setToken] = useState(shareLink?.token ?? '')
  const [saving, setSaving] = useState(false)
  const [regenerating, setRegenerating] = useState(false)
  const [copied, setCopied] = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const shareUrl = `${appUrl}/share/${token}`

  async function handleSaveProfile() {
    if (!displayName.trim()) {
      toast.error(t('settings.displayNameRequired'))
      return
    }
    setSaving(true)
    const result = await apiClient.patch('/settings/profile', {
      displayName,
      shareTitle,
      shareDescription,
    })
    setSaving(false)
    if (result.error) {
      toast.error(translateError(t, result.error) || t('settings.saveFailed'))
    } else {
      toast.success(t('settings.saved'))
      router.refresh()
    }
  }

  async function handleToggleShare(newEnabled: boolean) {
    const result = await apiClient.patch('/settings/share', { isEnabled: newEnabled })
    if (result.error) {
      toast.error(translateError(t, result.error) || t('settings.operationFailed'))
    } else {
      setShareEnabled(newEnabled)
      toast.success(newEnabled ? t('settings.shareEnabled') : t('settings.shareDisabledToast'))
    }
  }

  async function handleRegenerateToken() {
    setRegenerating(true)
    const result = await apiClient.post('/settings/share/regenerate', {})
    setRegenerating(false)
    if (result.error) {
      toast.error(translateError(t, result.error) || t('settings.operationFailed'))
    } else {
      const data = result.data as { token: string }
      setToken(data.token)
      toast.success(t('settings.linkRegenerated'))
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="space-y-6 pb-8">
      <section className="rounded-xl border border-border bg-card p-4">
        <h2 className="mb-4 text-sm font-semibold">{t('settings.profile')}</h2>
        <div className="space-y-3">
          <div>
            <Label htmlFor="displayName">{t('settings.displayName')}</Label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder={t('settings.displayNamePlaceholder')}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="shareTitle">{t('settings.shareTitle')}</Label>
            <Input
              id="shareTitle"
              value={shareTitle}
              onChange={(e) => setShareTitle(e.target.value)}
              placeholder={t('settings.shareTitlePlaceholder', {
                name: displayName || t('common.me'),
              })}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="shareDescription">{t('settings.shareDescription')}</Label>
            <Textarea
              id="shareDescription"
              value={shareDescription}
              onChange={(e) => setShareDescription(e.target.value)}
              placeholder={t('settings.shareDescriptionPlaceholder')}
              rows={2}
              className="mt-1.5 resize-none"
            />
          </div>
          <Button onClick={handleSaveProfile} disabled={saving} className="w-full">
            {saving ? t('common.saving') : t('common.save')}
          </Button>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-4">
        <h2 className="mb-4 text-sm font-semibold">{t('settings.language')}</h2>
        <LocaleSwitcher />
      </section>

      <section className="rounded-xl border border-border bg-card p-4">
        <h2 className="mb-4 text-sm font-semibold">{t('settings.shareSettings')}</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{t('settings.enableShare')}</p>
              <p className="text-xs text-muted-foreground">{t('settings.enableShareHint')}</p>
            </div>
            <Switch checked={shareEnabled} onCheckedChange={handleToggleShare} />
          </div>

          <Separator />

          <div>
            <Label>{t('settings.shareLink')}</Label>
            <div className="mt-1.5 flex gap-2">
              <Input
                value={shareEnabled ? shareUrl : t('settings.shareDisabled')}
                readOnly
                className="text-xs text-muted-foreground"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleCopy}
                disabled={!shareEnabled}
                aria-label={t('settings.copyLink')}
              >
                {copied ? <Check size={16} className="text-primary" /> : <Copy size={16} />}
              </Button>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={handleRegenerateToken}
            disabled={regenerating}
            className="w-full gap-1.5"
          >
            <RefreshCw size={14} className={regenerating ? 'animate-spin' : ''} />
            {regenerating ? t('settings.regenerating') : t('settings.regenerateLink')}
          </Button>
          <p className="text-xs text-muted-foreground">{t('settings.regenerateHint')}</p>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-4">
        <h2 className="mb-4 text-sm font-semibold">{t('settings.account')}</h2>
        <Button
          type="button"
          variant="outline"
          onClick={handleLogout}
          className="w-full gap-1.5 text-destructive"
        >
          <LogOut size={14} />
          {t('settings.logout')}
        </Button>
      </section>
    </div>
  )
}
