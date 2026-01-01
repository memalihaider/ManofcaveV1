import React, { useState, useEffect } from 'react';
import {
  Cog6ToothIcon,
  GlobeAltIcon,
  HomeIcon,
  CurrencyDollarIcon,
  EnvelopeIcon,
  BellIcon,
  ShieldCheckIcon,
  CloudIcon,
  ServerIcon,
  KeyIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

// Types for the Settings component
interface SettingsData {
  general: {
    siteTitle: string;
    siteDescription: string;
    contactEmail: string;
    supportPhone: string;
    timezone: string;
    language: string;
  };
  property: {
    defaultCurrency: string;
    commissionRate: number;
    listingDuration: number;
    autoApproveListings: boolean;
    featuredListingFee: number;
    premiumListingFee: number;
  };
  email: {
    newUserNotifications: boolean;
    propertyInquiryAlerts: boolean;
    weeklyReports: boolean;
    marketingEmails: boolean;
    smtpHost: string;
    smtpPort: number;
    smtpUsername: string;
    smtpPassword: string;
  };
  security: {
    twoFactorAuth: boolean;
    sessionTimeout: number;
    passwordMinLength: number;
    loginAttempts: number;
    ipWhitelist: string[];
  };
  api: {
    apiKey: string;
    apiRateLimit: number;
    webhookUrl: string;
    enableLogs: boolean;
  };
}

interface SettingsProps {
  // Props can be added here if needed for data passing
}

const Settings: React.FC<SettingsProps> = () => {
  // State for settings data
  const [settings, setSettings] = useState<SettingsData>({
    general: {
      siteTitle: 'RAGDOL - Dubai\'s Premier Real Estate Platform',
      siteDescription: 'Discover your dream property in Dubai with RAGDOL. Browse apartments, villas, and commercial properties with expert guidance.',
      contactEmail: 'info@ragdol.com',
      supportPhone: '+971 50 123 4567',
      timezone: 'Asia/Dubai',
      language: 'en',
    },
    property: {
      defaultCurrency: 'AED',
      commissionRate: 2.5,
      listingDuration: 90,
      autoApproveListings: true,
      featuredListingFee: 500,
      premiumListingFee: 1000,
    },
    email: {
      newUserNotifications: true,
      propertyInquiryAlerts: true,
      weeklyReports: false,
      marketingEmails: false,
      smtpHost: 'smtp.gmail.com',
      smtpPort: 587,
      smtpUsername: '',
      smtpPassword: '',
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      passwordMinLength: 8,
      loginAttempts: 5,
      ipWhitelist: [],
    },
    api: {
      apiKey: 'ragdol_api_key_' + Math.random().toString(36).substr(2, 9),
      apiRateLimit: 1000,
      webhookUrl: '',
      enableLogs: true,
    },
  });

  // State for UI management
  const [activeSection, setActiveSection] = useState<'general' | 'property' | 'email' | 'security' | 'api'>('general');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Track changes for unsaved changes warning
  useEffect(() => {
    setHasUnsavedChanges(true);
  }, [settings]);

  // Handle input changes
  const handleInputChange = (section: keyof SettingsData, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  // Handle save settings
  const handleSaveSettings = async () => {
    setIsLoading(true);
    setSaveStatus('saving');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // In a real app, this would save to backend
      console.log('Saving settings:', settings);

      setSaveStatus('saved');
      setHasUnsavedChanges(false);

      // Reset status after 3 seconds
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle reset to defaults
  const handleResetToDefaults = () => {
    if (confirm('Are you sure you want to reset all settings to default values? This action cannot be undone.')) {
      // Reset logic would go here
      alert('Settings reset to defaults (not implemented in demo)');
    }
  };

  // Generate new API key
  const handleGenerateApiKey = () => {
    const newApiKey = 'ragdol_api_key_' + Math.random().toString(36).substr(2, 9);
    handleInputChange('api', 'apiKey', newApiKey);
  };

  // Test email configuration
  const handleTestEmail = async () => {
    setIsLoading(true);
    try {
      // Simulate email test
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Test email sent successfully!');
    } catch (error) {
      alert('Failed to send test email. Please check your SMTP settings.');
    } finally {
      setIsLoading(false);
    }
  };

  // Render section content
  const renderSectionContent = () => {
    switch (activeSection) {
      case 'general':
        return (
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <GlobeAltIcon className="h-5 w-5" />
                Site Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Site Title</label>
                  <input
                    type="text"
                    value={settings.general.siteTitle}
                    onChange={(e) => handleInputChange('general', 'siteTitle', e.target.value)}
                    className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter site title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Site Description</label>
                  <textarea
                    rows={3}
                    value={settings.general.siteDescription}
                    onChange={(e) => handleInputChange('general', 'siteDescription', e.target.value)}
                    className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter site description"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Contact Email</label>
                    <input
                      type="email"
                      value={settings.general.contactEmail}
                      onChange={(e) => handleInputChange('general', 'contactEmail', e.target.value)}
                      className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="contact@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Support Phone</label>
                    <input
                      type="tel"
                      value={settings.general.supportPhone}
                      onChange={(e) => handleInputChange('general', 'supportPhone', e.target.value)}
                      className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="+971 XX XXX XXXX"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Localization</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Timezone</label>
                  <select
                    value={settings.general.timezone}
                    onChange={(e) => handleInputChange('general', 'timezone', e.target.value)}
                    className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="Asia/Dubai">Asia/Dubai (GST)</option>
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">America/New_York (EST)</option>
                    <option value="Europe/London">Europe/London (GMT)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Language</label>
                  <select
                    value={settings.general.language}
                    onChange={(e) => handleInputChange('general', 'language', e.target.value)}
                    className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="en">English</option>
                    <option value="ar">العربية (Arabic)</option>
                    <option value="fr">Français (French)</option>
                    <option value="de">Deutsch (German)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      case 'property':
        return (
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <HomeIcon className="h-5 w-5" />
                Property Configuration
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Default Currency</label>
                    <select
                      value={settings.property.defaultCurrency}
                      onChange={(e) => handleInputChange('property', 'defaultCurrency', e.target.value)}
                      className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="AED">AED - UAE Dirham</option>
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Commission Rate (%)</label>
                    <input
                      type="number"
                      value={settings.property.commissionRate}
                      onChange={(e) => handleInputChange('property', 'commissionRate', parseFloat(e.target.value))}
                      step="0.1"
                      min="0"
                      max="10"
                      className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Listing Duration (days)</label>
                    <input
                      type="number"
                      value={settings.property.listingDuration}
                      onChange={(e) => handleInputChange('property', 'listingDuration', parseInt(e.target.value))}
                      min="1"
                      max="365"
                      className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Featured Listing Fee (AED)</label>
                    <input
                      type="number"
                      value={settings.property.featuredListingFee}
                      onChange={(e) => handleInputChange('property', 'featuredListingFee', parseInt(e.target.value))}
                      min="0"
                      className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Premium Listing Fee (AED)</label>
                    <input
                      type="number"
                      value={settings.property.premiumListingFee}
                      onChange={(e) => handleInputChange('property', 'premiumListingFee', parseInt(e.target.value))}
                      min="0"
                      className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Auto-approve Listings</label>
                    <p className="text-xs text-muted-foreground">Automatically approve new property listings</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.property.autoApproveListings}
                      onChange={(e) => handleInputChange('property', 'autoApproveListings', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      case 'email':
        return (
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <EnvelopeIcon className="h-5 w-5" />
                Email Notifications
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">New User Notifications</label>
                      <p className="text-xs text-muted-foreground">Send email when new users register</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.email.newUserNotifications}
                        onChange={(e) => handleInputChange('email', 'newUserNotifications', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Property Inquiry Alerts</label>
                      <p className="text-xs text-muted-foreground">Notify agents of new inquiries</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.email.propertyInquiryAlerts}
                        onChange={(e) => handleInputChange('email', 'propertyInquiryAlerts', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Weekly Reports</label>
                      <p className="text-xs text-muted-foreground">Send weekly performance reports</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.email.weeklyReports}
                        onChange={(e) => handleInputChange('email', 'weeklyReports', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Marketing Emails</label>
                      <p className="text-xs text-muted-foreground">Send promotional emails to users</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.email.marketingEmails}
                        onChange={(e) => handleInputChange('email', 'marketingEmails', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <ServerIcon className="h-5 w-5" />
                  SMTP Configuration
                </h3>
                <button
                  onClick={handleTestEmail}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors disabled:opacity-50"
                >
                  {isLoading ? <ArrowPathIcon className="h-4 w-4 animate-spin" /> : <EnvelopeIcon className="h-4 w-4" />}
                  Test Email
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">SMTP Host</label>
                  <input
                    type="text"
                    value={settings.email.smtpHost}
                    onChange={(e) => handleInputChange('email', 'smtpHost', e.target.value)}
                    className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="smtp.example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">SMTP Port</label>
                  <input
                    type="number"
                    value={settings.email.smtpPort}
                    onChange={(e) => handleInputChange('email', 'smtpPort', parseInt(e.target.value))}
                    className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="587"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">SMTP Username</label>
                  <input
                    type="text"
                    value={settings.email.smtpUsername}
                    onChange={(e) => handleInputChange('email', 'smtpUsername', e.target.value)}
                    className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="username@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">SMTP Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={settings.email.smtpPassword}
                      onChange={(e) => handleInputChange('email', 'smtpPassword', e.target.value)}
                      className="w-full px-3 py-2 pr-10 bg-muted border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Enter password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <EyeIcon className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <ShieldCheckIcon className="h-5 w-5" />
                Security Settings
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Two-Factor Authentication</label>
                    <p className="text-xs text-muted-foreground">Require 2FA for admin accounts</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.security.twoFactorAuth}
                      onChange={(e) => handleInputChange('security', 'twoFactorAuth', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Session Timeout (minutes)</label>
                    <input
                      type="number"
                      value={settings.security.sessionTimeout}
                      onChange={(e) => handleInputChange('security', 'sessionTimeout', parseInt(e.target.value))}
                      min="5"
                      max="480"
                      className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Password Minimum Length</label>
                    <input
                      type="number"
                      value={settings.security.passwordMinLength}
                      onChange={(e) => handleInputChange('security', 'passwordMinLength', parseInt(e.target.value))}
                      min="6"
                      max="32"
                      className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Maximum Login Attempts</label>
                  <input
                    type="number"
                    value={settings.security.loginAttempts}
                    onChange={(e) => handleInputChange('security', 'loginAttempts', parseInt(e.target.value))}
                    min="3"
                    max="10"
                    className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <KeyIcon className="h-5 w-5" />
                IP Whitelist
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Allowed IP Addresses</label>
                  <textarea
                    rows={4}
                    value={settings.security.ipWhitelist.join('\n')}
                    onChange={(e) => handleInputChange('security', 'ipWhitelist', e.target.value.split('\n').filter(ip => ip.trim()))}
                    className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="192.168.1.1&#10;10.0.0.1&#10;203.0.113.1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Enter one IP address per line. Leave empty to allow all IPs.</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'api':
        return (
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <CloudIcon className="h-5 w-5" />
                API Configuration
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-foreground">API Key</label>
                    <button
                      onClick={handleGenerateApiKey}
                      className="text-sm text-primary hover:text-primary/80 transition-colors"
                    >
                      Generate New Key
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showApiKey ? 'text' : 'password'}
                      value={settings.api.apiKey}
                      readOnly
                      className="w-full px-3 py-2 pr-10 bg-muted border border-border rounded-lg text-foreground font-mono text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showApiKey ? (
                        <EyeSlashIcon className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <EyeIcon className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Rate Limit (requests/hour)</label>
                    <input
                      type="number"
                      value={settings.api.apiRateLimit}
                      onChange={(e) => handleInputChange('api', 'apiRateLimit', parseInt(e.target.value))}
                      min="100"
                      max="10000"
                      className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Webhook URL</label>
                    <input
                      type="url"
                      value={settings.api.webhookUrl}
                      onChange={(e) => handleInputChange('api', 'webhookUrl', e.target.value)}
                      className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="https://your-app.com/webhook"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Enable API Logs</label>
                    <p className="text-xs text-muted-foreground">Log all API requests and responses</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.api.enableLogs}
                      onChange={(e) => handleInputChange('api', 'enableLogs', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">API Documentation</h3>
              <div className="space-y-4">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2">Base URL</h4>
                  <code className="text-sm text-muted-foreground">https://api.ragdol.com/v1/</code>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2">Authentication</h4>
                  <code className="text-sm text-muted-foreground">Authorization: Bearer {'{your-api-key}'}</code>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors">
                  <EyeIcon className="h-4 w-4" />
                  View Full API Documentation
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">System Settings</h2>
          <p className="text-muted-foreground">Configure your platform settings and preferences</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Save Status Indicator */}
          {saveStatus !== 'idle' && (
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
              saveStatus === 'saving' ? 'bg-blue-500/10 text-blue-500' :
              saveStatus === 'saved' ? 'bg-green-500/10 text-green-500' :
              'bg-red-500/10 text-red-500'
            }`}>
              {saveStatus === 'saving' && <ArrowPathIcon className="h-4 w-4 animate-spin" />}
              {saveStatus === 'saved' && <CheckIcon className="h-4 w-4" />}
              {saveStatus === 'error' && <ExclamationTriangleIcon className="h-4 w-4" />}
              {saveStatus === 'saving' ? 'Saving...' :
               saveStatus === 'saved' ? 'Settings saved!' :
               'Error saving settings'}
            </div>
          )}

          {/* Action Buttons */}
          <button
            onClick={handleResetToDefaults}
            className="px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors"
          >
            Reset to Defaults
          </button>
          <button
            onClick={handleSaveSettings}
            disabled={isLoading || !hasUnsavedChanges}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? <ArrowPathIcon className="h-4 w-4 animate-spin" /> : <CheckIcon className="h-4 w-4" />}
            Save Changes
          </button>
        </div>
      </div>

      {/* Settings Navigation */}
      <div className="bg-card border border-border rounded-xl p-1">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-1">
          {[
            { id: 'general', label: 'General', icon: GlobeAltIcon },
            { id: 'property', label: 'Property', icon: HomeIcon },
            { id: 'email', label: 'Email', icon: EnvelopeIcon },
            { id: 'security', label: 'Security', icon: ShieldCheckIcon },
            { id: 'api', label: 'API', icon: CloudIcon },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveSection(id as typeof activeSection)}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeSection === id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Settings Content */}
      <div className="min-h-[600px]">
        {renderSectionContent()}
      </div>

      {/* Unsaved Changes Warning */}
      {hasUnsavedChanges && (
        <div className="fixed bottom-4 right-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 max-w-sm">
          <div className="flex items-start gap-3">
            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-yellow-500">Unsaved Changes</p>
              <p className="text-xs text-muted-foreground mt-1">
                You have unsaved changes. Click "Save Changes" to apply them.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;