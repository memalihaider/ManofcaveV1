'use client'

import { QrCodeIcon, CogIcon, ChartBarIcon } from '@heroicons/react/24/outline'

export default function CookiePolicyPage() {
  const cookieTypes = [
    {
      icon: CogIcon,
      title: 'Essential Cookies',
      description: 'Required for basic site functionality',
      purpose: 'These cookies are necessary for the website to function and cannot be switched off in our systems.',
      examples: ['Authentication cookies', 'Security cookies', 'Session management']
    },
    {
      icon: ChartBarIcon,
      title: 'Analytics Cookies',
      description: 'Help us understand how visitors use our site',
      purpose: 'These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site.',
      examples: ['Google Analytics', 'Usage statistics', 'Performance metrics']
    },
    {
      icon: QrCodeIcon,
      title: 'Functional Cookies',
      description: 'Enhance your browsing experience',
      purpose: 'These cookies enable the website to provide enhanced functionality and personalization.',
      examples: ['Language preferences', 'Location settings', 'Saved searches']
    }
  ]

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-[#f5f5f5]">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#d4af37]/10 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Cookie <span className="text-[#d4af37]">Policy</span>
            </h1>
            <p className="text-xl md:text-2xl text-[#a3a3a3] max-w-3xl mx-auto leading-relaxed">
              Learn about how we use cookies to improve your experience on our website.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-[#141414] rounded-lg border border-[#333333] p-8 md:p-12">
          <div className="mb-8">
            <p className="text-[#a3a3a3] text-sm mb-4">Last updated: December 6, 2025</p>
          </div>

          {/* Cookie Types Overview */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {cookieTypes.map((type, index) => (
              <div key={index} className="bg-[#262626] rounded-lg border border-[#333333] p-6 text-center">
                <type.icon className="h-12 w-12 text-[#d4af37] mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">{type.title}</h3>
                <p className="text-[#a3a3a3] text-sm">{type.description}</p>
              </div>
            ))}
          </div>

          {/* Cookie Policy Content */}
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">1. What Are Cookies?</h2>
              <p className="text-[#a3a3a3] leading-relaxed mb-4">
                Cookies are small text files that are placed on your computer or mobile device when you visit our website.
                They allow us to remember your preferences, analyze site usage, and provide personalized content.
              </p>
              <p className="text-[#a3a3a3] leading-relaxed">
                Cookies help us provide you with a better browsing experience by remembering your settings and understanding
                how you interact with our site.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">2. How We Use Cookies</h2>
              <p className="text-[#a3a3a3] leading-relaxed mb-6">
                We use cookies for several purposes to improve your experience on RAGDOL:
              </p>

              <div className="space-y-6">
                {cookieTypes.map((type, index) => (
                  <div key={index} className="bg-[#262626] rounded-lg border border-[#333333] p-6">
                    <div className="flex items-start space-x-4">
                      <type.icon className="h-8 w-8 text-[#d4af37] flex-shrink-0 mt-1" />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-2">{type.title}</h3>
                        <p className="text-[#a3a3a3] mb-3">{type.purpose}</p>
                        <div>
                          <p className="text-[#a3a3a3] text-sm font-medium mb-2">Examples:</p>
                          <ul className="list-disc list-inside text-[#a3a3a3] text-sm space-y-1 ml-4">
                            {type.examples.map((example, idx) => (
                              <li key={idx}>{example}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">3. Third-Party Cookies</h2>
              <p className="text-[#a3a3a3] leading-relaxed mb-4">
                We may also use third-party cookies from trusted partners to help us analyze site usage and provide
                relevant content. These include:
              </p>
              <ul className="list-disc list-inside text-[#a3a3a3] leading-relaxed space-y-2 ml-4">
                <li><strong>Google Analytics:</strong> To understand how visitors use our site</li>
                <li><strong>Social Media Plugins:</strong> To enable sharing functionality</li>
                <li><strong>Payment Processors:</strong> To securely process transactions</li>
                <li><strong>Customer Support:</strong> To provide live chat and support services</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">4. Managing Your Cookie Preferences</h2>
              <div className="space-y-4">
                <p className="text-[#a3a3a3] leading-relaxed">
                  You have several options for managing cookies:
                </p>

                <div className="bg-[#262626] rounded-lg border border-[#333333] p-6">
                  <h3 className="text-lg font-semibold mb-3">Browser Settings</h3>
                  <p className="text-[#a3a3a3] leading-relaxed mb-3">
                    Most web browsers allow you to control cookies through their settings. You can:
                  </p>
                  <ul className="list-disc list-inside text-[#a3a3a3] leading-relaxed space-y-1 ml-4">
                    <li>Block all cookies</li>
                    <li>Block third-party cookies</li>
                    <li>Delete existing cookies</li>
                    <li>Receive notifications when cookies are set</li>
                  </ul>
                </div>

                <div className="bg-[#262626] rounded-lg border border-[#333333] p-6">
                  <h3 className="text-lg font-semibold mb-3">Our Cookie Consent Tool</h3>
                  <p className="text-[#a3a3a3] leading-relaxed">
                    When you first visit our site, you'll see a cookie consent banner that allows you to accept or
                    reject non-essential cookies. You can change your preferences at any time by clicking the
                    "Cookie Settings" link in our footer.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">5. Impact of Disabling Cookies</h2>
              <p className="text-[#a3a3a3] leading-relaxed mb-4">
                Please note that disabling certain cookies may affect your experience on our website:
              </p>
              <ul className="list-disc list-inside text-[#a3a3a3] leading-relaxed space-y-2 ml-4">
                <li>Essential cookies cannot be disabled as they are required for basic functionality</li>
                <li>Disabling analytics cookies will prevent us from improving our service</li>
                <li>Functional cookies enhance your experience but are not essential</li>
                <li>Some features may not work properly without certain cookies</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">6. Cookie Retention</h2>
              <p className="text-[#a3a3a3] leading-relaxed mb-4">
                Different cookies have different lifespans:
              </p>
              <ul className="list-disc list-inside text-[#a3a3a3] leading-relaxed space-y-2 ml-4">
                <li><strong>Session Cookies:</strong> Deleted when you close your browser</li>
                <li><strong>Persistent Cookies:</strong> Remain until deleted or expired (typically 1-2 years)</li>
                <li><strong>Essential Cookies:</strong> May have longer retention for security purposes</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">7. Updates to This Policy</h2>
              <p className="text-[#a3a3a3] leading-relaxed">
                We may update this Cookie Policy from time to time to reflect changes in our practices or for other
                operational, legal, or regulatory reasons. We will notify you of any material changes by updating
                the "Last updated" date at the top of this policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">8. Contact Us</h2>
              <p className="text-[#a3a3a3] leading-relaxed mb-4">
                If you have any questions about our use of cookies or this Cookie Policy, please contact us:
              </p>
              <div className="bg-[#262626] rounded-lg p-4 border border-[#333333]">
                <p className="text-[#a3a3a3]">Email: privacy@ragdol.com</p>
                <p className="text-[#a3a3a3]">Phone: +92 300 1234567</p>
                <p className="text-[#a3a3a3]">Address: 123 Business Bay Tower, Business Bay, Dubai, UAE</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}