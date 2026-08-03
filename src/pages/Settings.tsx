import { useEffect, useState, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import {
  Building2, Shield, Bell, Bot, Puzzle, Mail, MessageSquare,
  Link, Unlink, Eye, EyeOff, Upload, Trash2, Loader2, CheckCircle2,
} from 'lucide-react';
import { Card, Button, Input, Badge } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { SETTINGS_TABS, INTEGRATIONS, NOTIFICATION_CATEGORIES } from '../lib/constants';
import { supabase } from '../lib/supabase';

const iconMap: Record<string, LucideIcon> = {
  Building2, Shield, Bell, Bot, Puzzle,
};

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 cursor-pointer ${
        checked ? 'bg-primary' : 'bg-border'
      }`}
      role="switch"
      aria-checked={checked}
      aria-label={label}
    >
      <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm transform transition-transform duration-200 ${
        checked ? 'translate-x-[18px]' : 'translate-x-[3px]'
      }`} />
    </button>
  );
}

function ToggleRow({ label, description, checked, onChange }: {
  label: string; description?: string; checked: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex-1 pr-4">
        <p className="text-sm font-medium text-foreground">{label}</p>
        {description && <p className="text-xs text-text-secondary mt-0.5">{description}</p>}
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

function BusinessProfileTab() {
  const { profile, refreshProfile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [hasUnsaved, setHasUnsaved] = useState(false);

  // Field state
  const [formData, setFormData] = useState({
    company_name: '',
    business_tagline: '',
    business_description: '',
    company_email: '',
    phone: '',
    website: '',
    street_address: '',
    city: '',
    state: '',
    zip_code: '',
  });

  // Initialise from profile
  useEffect(() => {
    if (profile?.business_logo_url) {
      setLogoPreview(profile.business_logo_url);
    }
    setFormData({
      company_name: profile?.company_name || '',
      business_tagline: profile?.business_tagline || '',
      business_description: profile?.business_description || '',
      company_email: profile?.company_email || profile?.email || '',
      phone: profile?.phone || '',
      website: profile?.website || '',
      street_address: profile?.street_address || '',
      city: profile?.city || '',
      state: profile?.state || '',
      zip_code: profile?.zip_code || '',
    });
  }, [profile]);

  // Track unsaved changes
  const handleFieldChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setHasUnsaved(true);
    setSuccess(null);
    setError(null);
  };

  // Compute initials from company name
  const displayName = formData.company_name || 'Sweet Crumbs Bakery';
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');

  const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/svg+xml'];
  const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

  // ── Validation ──
  function validateForm(): string | null {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const urlRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/i;
    const phoneRegex = /^[\d\s\-+()]{7,20}$/;

    if (formData.company_email && !emailRegex.test(formData.company_email)) {
      return 'Please enter a valid email address.';
    }
    if (formData.website && !urlRegex.test(formData.website)) {
      return 'Please enter a valid website URL (e.g. https://example.com).';
    }
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      return 'Please enter a valid phone number (7-20 digits).';
    }
    return null;
  }

  function validateFile(file: File): string | null {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'Unsupported file type. Please upload a PNG, JPG, or SVG image.';
    }
    if (file.size > MAX_SIZE) {
      return 'File is too large. Maximum size is 5 MB.';
    }
    return null;
  }

  // ── Logo Upload ──
  async function handleUpload(file: File) {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setSuccess(null);
    setUploading(true);
    setUploadProgress(0);

    try {
      const ext = file.name.split('.').pop() || 'png';
      const fileName = `${crypto.randomUUID()}.${ext}`;
      const filePath = `business-logos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('business-logos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) throw new Error(uploadError.message);

      const { data: urlData } = supabase.storage
        .from('business-logos')
        .getPublicUrl(filePath);

      const publicUrl = urlData.publicUrl;

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ business_logo_url: publicUrl })
        .eq('id', profile?.id);

      if (updateError) throw new Error(updateError.message);

      setLogoPreview(publicUrl);
      setSuccess('Logo uploaded successfully.');
      await refreshProfile();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  }

  async function handleRemove() {
    if (!profile?.business_logo_url) return;

    setError(null);
    setSuccess(null);
    setUploading(true);

    try {
      const urlParts = profile.business_logo_url.split('/business-logos/');
      if (urlParts.length > 1) {
        const filePath = `business-logos/${urlParts[1]}`;
        await supabase.storage.from('business-logos').remove([filePath]);
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ business_logo_url: null })
        .eq('id', profile?.id);

      if (updateError) throw new Error(updateError.message);

      setLogoPreview(null);
      setSuccess('Logo removed successfully.');
      await refreshProfile();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove logo. Please try again.');
    } finally {
      setUploading(false);
    }
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  // ── Save Profile ──
  async function handleSave() {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setSuccess(null);
    setSaving(true);

    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          company_name: formData.company_name || null,
          business_tagline: formData.business_tagline || null,
          business_description: formData.business_description || null,
          company_email: formData.company_email || null,
          phone: formData.phone || null,
          website: formData.website || null,
          street_address: formData.street_address || null,
          city: formData.city || null,
          state: formData.state || null,
          zip_code: formData.zip_code || null,
        })
        .eq('id', profile?.id);

      if (updateError) throw new Error(updateError.message);

      setSuccess('Business profile updated successfully.');
      setHasUnsaved(false);
      await refreshProfile();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  // ── Unsaved changes warning ──
  useEffect(() => {
    if (!hasUnsaved) return;
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsaved]);

  const inputClass = (field: string) => {
    const base = 'w-full px-4 py-2.5 rounded-lg border border-border bg-card text-sm text-foreground placeholder:text-muted outline-none transition-all duration-150 focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:bg-surface disabled:text-muted disabled:cursor-not-allowed';
    return base;
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-foreground mb-1">Business Profile</h3>
        <p className="text-sm text-text-secondary">Manage your organisation's identity and contact information.</p>
      </div>

      {/* ── Success Toast ── */}
      {success && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-sm text-emerald-700 flex items-center gap-2 animate-fade-in-up">
          <CheckCircle2 size={16} className="shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* ── Business Identity Card ── */}
      <Card padding="md">
        <h4 className="text-sm font-semibold text-foreground mb-1">Business Identity</h4>
        <p className="text-xs text-text-secondary mb-5">Your company logo, name, and tagline appear across the entire application.</p>

        {/* Logo + Company Name + Tagline */}
        <div className="flex flex-col sm:flex-row items-start gap-6">
          {/* Logo */}
          <div className="relative shrink-0">
            {logoPreview ? (
              <img
                src={logoPreview}
                alt={`${displayName} logo`}
                className="w-[120px] h-[120px] rounded-full object-cover border-2 border-border shadow-sm"
              />
            ) : (
              <div className="w-[120px] h-[120px] rounded-full bg-secondary border-2 border-dashed border-border flex items-center justify-center">
                <span className="text-2xl font-bold text-primary/60">{initials || '?'}</span>
              </div>
            )}
            {uploading && (
              <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center">
                <Loader2 size={24} className="text-white animate-spin" />
              </div>
            )}
          </div>

          {/* Logo Actions + Company Name + Tagline */}
          <div className="flex-1 min-w-0 space-y-4">
            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept=".png,.jpg,.jpeg,.svg"
                onChange={handleFileSelect}
                className="hidden"
                id="logo-upload"
              />
              <label
                htmlFor="logo-upload"
                className={`
                  inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium
                  transition-all duration-150 cursor-pointer active:scale-[0.97]
                  ${uploading
                    ? 'bg-surface text-muted cursor-not-allowed'
                    : 'bg-primary text-white hover:bg-primary/90'
                  }
                `}
              >
                <Upload size={14} />
                {logoPreview ? 'Replace Logo' : 'Upload Logo'}
              </label>
              {logoPreview && (
                <button
                  onClick={handleRemove}
                  disabled={uploading}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-danger bg-red-50 hover:bg-red-100 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-[0.97]"
                >
                  <Trash2 size={14} />
                  Remove Logo
                </button>
              )}
            </div>
            <p className="text-xs text-text-secondary">PNG, JPG or SVG. Max 5 MB.</p>

            {/* Company Name Display */}
            <div>
              <p className="text-sm font-medium text-foreground">{displayName}</p>
              {formData.business_tagline && (
                <p className="text-xs text-text-secondary mt-0.5 italic">&ldquo;{formData.business_tagline}&rdquo;</p>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* ── Business Information ── */}
      <Card padding="md">
        <h4 className="text-sm font-semibold text-foreground mb-1">Business Information</h4>
        <p className="text-xs text-text-secondary mb-5">Update your company details and contact information.</p>

        <div className="space-y-5">
          {/* Company Name + Tagline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Company Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                value={formData.company_name}
                onChange={(e) => handleFieldChange('company_name', e.target.value)}
                placeholder="Sweet Crumbs Bakery"
                className={inputClass('company_name')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Business Tagline</label>
              <input
                type="text"
                value={formData.business_tagline}
                onChange={(e) => handleFieldChange('business_tagline', e.target.value)}
                placeholder="Crafting sweetness, one cake at a time."
                className={inputClass('business_tagline')}
              />
            </div>
          </div>

          {/* Business Description */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Business Description</label>
            <textarea
              rows={3}
              value={formData.business_description}
              onChange={(e) => handleFieldChange('business_description', e.target.value)}
              placeholder="Tell us about your business..."
              className={`${inputClass('business_description')} resize-none`}
            />
          </div>

          {/* Divider */}
          <div className="border-t border-border pt-4">
            <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">Contact Details</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Company Email</label>
                <input
                  type="email"
                  value={formData.company_email}
                  onChange={(e) => handleFieldChange('company_email', e.target.value)}
                  placeholder="hello@sweetcrumbbakery.com"
                  className={inputClass('company_email')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleFieldChange('phone', e.target.value)}
                  placeholder="+234 801 234 0000"
                  className={inputClass('phone')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Website</label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleFieldChange('website', e.target.value)}
                  placeholder="https://sweetcrumbbakery.com"
                  className={inputClass('website')}
                />
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-border pt-4">
            <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">Address</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Street Address</label>
                <input
                  type="text"
                  value={formData.street_address}
                  onChange={(e) => handleFieldChange('street_address', e.target.value)}
                  placeholder="12 Awolowo Road"
                  className={inputClass('street_address')}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleFieldChange('city', e.target.value)}
                    placeholder="Ikoyi, Lagos"
                    className={inputClass('city')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">State</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => handleFieldChange('state', e.target.value)}
                    placeholder="Lagos"
                    className={inputClass('state')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">ZIP Code</label>
                  <input
                    type="text"
                    value={formData.zip_code}
                    onChange={(e) => handleFieldChange('zip_code', e.target.value)}
                    placeholder="100001"
                    className={inputClass('zip_code')}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* ── Error Message ── */}
      {error && (
        <div className="p-3 rounded-lg bg-danger/10 border border-danger/20 text-sm text-danger flex items-center gap-2 animate-scale-in">
          <span>{error}</span>
        </div>
      )}

      {/* ── Save Button ── */}
      <div className="flex items-center justify-between pt-2">
        <div className="text-xs text-text-secondary">
          {hasUnsaved && <span className="text-warning font-medium">You have unsaved changes.</span>}
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-white font-medium text-sm
            transition-all duration-150 cursor-pointer
            hover:bg-primary/90 active:scale-[0.97]
            disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
        >
          {saving ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </button>
      </div>
    </div>
  );
}

function SecurityTab() {
  const [showPassword, setShowPassword] = useState(false);
  const [twoFA, setTwoFA] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-foreground mb-1">Security</h3>
        <p className="text-sm text-text-secondary">Manage your password and security settings.</p>
      </div>

      <Card padding="md">
        <h4 className="text-sm font-semibold text-foreground mb-4">Change Password</h4>
        <div className="space-y-4">
          <div className="relative">
            <Input
              label="Current Password"
              type={showPassword ? 'text' : 'password'}
              defaultValue="••••••••"
            />
          </div>
          <Input
            label="New Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter new password"
          />
          <Input
            label="Confirm New Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Confirm new password"
          />
          <div className="flex items-center gap-3">
            <Button variant="primary" size="sm">Update Password</Button>
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-foreground transition-colors duration-150 cursor-pointer"
            >
              {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>
      </Card>

      <Card padding="md">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold text-foreground">Two-Factor Authentication</h4>
            <p className="text-xs text-text-secondary mt-0.5">Add an extra layer of security to your account.</p>
          </div>
          <Toggle checked={twoFA} onChange={setTwoFA} label="Toggle 2FA" />
        </div>
      </Card>

      <Card padding="md">
        <h4 className="text-sm font-semibold text-foreground mb-4">Active Sessions</h4>
        <div className="space-y-3">
          {[
            { device: 'MacBook Pro — Chrome', location: 'Lagos, Nigeria', active: true, time: 'Active now' },
            { device: 'iPhone 15 — Safari', location: 'Lagos, Nigeria', active: true, time: '1h ago' },
            { device: 'Windows PC — Firefox', location: 'Abuja, Nigeria', active: false, time: '3 days ago' },
          ].map((session, i) => (
            <div className="flex items-center gap-3 py-2 border-b border-border last:border-0">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${session.active ? 'bg-emerald-500' : 'bg-border'}`} />
                <div>
                  <p className="text-sm text-foreground">{session.device}</p>
                  <p className="text-xs text-text-secondary">{session.location} · {session.time}</p>
                </div>
              </div>
              {session.active && (
                <button className="text-xs text-danger hover:text-red-700 transition-colors duration-150 cursor-pointer">
                  Revoke
                </button>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function NotificationsTab() {
  const [states, setStates] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    NOTIFICATION_CATEGORIES.forEach((cat) => {
      cat.events.forEach((ev) => {
        initial[`${cat.id}-${ev.id}-email`] = ev.email;
        initial[`${cat.id}-${ev.id}-push`] = ev.push;
        initial[`${cat.id}-${ev.id}-sms`] = ev.sms;
      });
    });
    return initial;
  });

  const toggle = (key: string) => setStates((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-foreground mb-1">Notifications</h3>
        <p className="text-sm text-text-secondary">Choose how you receive notifications.</p>
      </div>

      {NOTIFICATION_CATEGORIES.map((cat) => (
        <Card key={cat.id} padding="none">
          <div className="px-6 py-3 border-b border-border bg-surface/50">
            <h4 className="text-sm font-semibold text-foreground">{cat.label}</h4>
          </div>
          <div className="px-6">
            {/* Header row */}
            <div className="flex items-center justify-end gap-6 py-2 border-b border-border">
              <span className="text-xs font-medium text-text-secondary w-8 text-center">Email</span>
              <span className="text-xs font-medium text-text-secondary w-8 text-center">Push</span>
              <span className="text-xs font-medium text-text-secondary w-8 text-center">SMS</span>
            </div>
            {cat.events.map((ev) => (
              <div key={ev.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                <span className="text-sm text-foreground flex-1">{ev.label}</span>
                <div className="flex items-center gap-6">
                  <Toggle checked={states[`${cat.id}-${ev.id}-email`]} onChange={() => toggle(`${cat.id}-${ev.id}-email`)} />
                  <Toggle checked={states[`${cat.id}-${ev.id}-push`]} onChange={() => toggle(`${cat.id}-${ev.id}-push`)} />
                  <Toggle checked={states[`${cat.id}-${ev.id}-sms`]} onChange={() => toggle(`${cat.id}-${ev.id}-sms`)} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}

function AIPreferencesTab() {
  const [autoAssign, setAutoAssign] = useState(true);
  const [maxTasks, setMaxTasks] = useState(10);
  const [confidence, setConfidence] = useState(75);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-foreground mb-1">AI Preferences</h3>
        <p className="text-sm text-text-secondary">Configure how your AI agents operate.</p>
      </div>

      <Card padding="md">
        <ToggleRow
          label="Auto-Assign Tasks"
          description="AI agents will automatically pick up tasks from the queue"
          checked={autoAssign}
          onChange={setAutoAssign}
        />
      </Card>

      <Card padding="md">
        <h4 className="text-sm font-semibold text-foreground mb-4">Working Hours</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Start Time" type="time" defaultValue="09:00" />
          <Input label="End Time" type="time" defaultValue="18:00" />
        </div>
        <div className="mt-2">
          <label className="text-xs font-medium text-text-secondary">Time Zone</label>
          <select className="mt-1 w-full px-4 py-2.5 rounded-lg border border-border bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
            <option>America/New York (EST)</option>
            <option>Africa/Lagos (WAT)</option>
            <option>Europe/London (GMT)</option>
            <option>Asia/Tokyo (JST)</option>
          </select>
        </div>
      </Card>

      <Card padding="md">
        <h4 className="text-sm font-semibold text-foreground mb-4">Task Limits</h4>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm text-foreground">Max Tasks Per Agent</label>
              <span className="text-sm font-semibold text-primary">{maxTasks}</span>
            </div>
            <input
              type="range"
              min="1"
              max="50"
              value={maxTasks}
              onChange={(e) => setMaxTasks(Number(e.target.value))}
              className="w-full h-2 bg-surface-hover rounded-full appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-[10px] text-text-secondary mt-1">
              <span>1</span>
              <span>50</span>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm text-foreground">Confidence Threshold</label>
              <span className="text-sm font-semibold text-primary">{confidence}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="99"
              value={confidence}
              onChange={(e) => setConfidence(Number(e.target.value))}
              className="w-full h-2 bg-surface-hover rounded-full appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-[10px] text-text-secondary mt-1">
              <span>50%</span>
              <span>99%</span>
            </div>
          </div>
        </div>
      </Card>

      <div>
        <Button variant="primary" size="md">Save Preferences</Button>
      </div>
    </div>
  );
}

function IntegrationsTab() {
  const [integrations, setIntegrations] = useState(INTEGRATIONS);

  const toggleIntegration = (id: string) => {
    setIntegrations((prev) =>
      prev.map((int) => int.id === id ? { ...int, connected: !int.connected } : int)
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-foreground mb-1">Integrations</h3>
        <p className="text-sm text-text-secondary">Connect your favorite tools and services.</p>
      </div>

      <div className="space-y-3">
        {integrations.map((int) => (
          <Card key={int.id} padding="md" hover>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  int.connected ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-surface text-muted'
                }`}>
                  {int.icon === 'Stripe' && <Building2 size={20} />}
                  {int.icon === 'Slack' && <MessageSquare size={20} />}
                  {int.icon === 'Mail' && <Mail size={20} />}
                  {int.icon === 'FileText' && <Shield size={20} />}
                  {int.icon === 'ShoppingBag' && <Puzzle size={20} />}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{int.name}</p>
                  <p className="text-xs text-text-secondary">{int.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {int.connected ? (
                  <Badge variant="success" dot size="sm">Connected</Badge>
                ) : (
                  <Badge variant="neutral" size="sm">Disconnected</Badge>
                )}
                <Button
                  variant={int.connected ? 'ghost' : 'secondary'}
                  size="sm"
                  icon={int.connected ? <Unlink size={14} /> : <Link size={14} />}
                  onClick={() => toggleIntegration(int.id)}
                >
                  {int.connected ? 'Disconnect' : 'Connect'}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

const tabComponents: Record<string, React.ComponentType> = {
  profile: BusinessProfileTab,
  security: SecurityTab,
  notifications: NotificationsTab,
  'ai-preferences': AIPreferencesTab,
  integrations: IntegrationsTab,
};

export default function Settings() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const ActiveComponent = tabComponents[activeTab];

  return (
    <div className="animate-fade-in-up">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Settings</h1>
        <p className="section-subtitle">
          Manage your account and application settings.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Tab Sidebar */}
        <div className="lg:w-56 shrink-0">
          <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
            {SETTINGS_TABS.map((tab) => {
              const Icon = iconMap[tab.icon];
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium
                    transition-all duration-150 whitespace-nowrap cursor-pointer
                    ${activeTab === tab.id
                      ? 'bg-secondary text-primary'
                      : 'text-text-secondary hover:bg-surface hover:text-foreground'
                    }
                  `}
                >
                  {Icon && <Icon size={18} />}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="flex-1 min-w-0">
          {ActiveComponent && <ActiveComponent />}
        </div>
      </div>
    </div>
  );
}