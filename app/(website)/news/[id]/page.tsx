'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { CalendarDaysIcon, UserIcon, ClockIcon, ArrowLeftIcon, ArrowRightIcon, ShareIcon, BookmarkIcon } from '@heroicons/react/24/outline'
import { NewspaperIcon } from '@heroicons/react/24/solid'

const newsArticles = [
  {
    id: 1,
    title: 'Dubai Real Estate Market Shows Strong Q4 Growth',
    excerpt: 'The Dubai property market continues to demonstrate resilience with significant growth in both residential and commercial sectors.',
    date: 'December 5, 2025',
    author: 'Market Analysis Team',
    category: 'Market Report',
    readTime: '5 min read',
    featured: true,
    image: '/api/placeholder/800/400',
    content: `
      <h2>Dubai Property Market Resilience</h2>
      <p>The Dubai real estate market has demonstrated remarkable resilience in the fourth quarter of 2025, with both residential and commercial sectors showing significant growth despite global economic uncertainties.</p>

      <h3>Residential Market Performance</h3>
      <p>Residential property sales in Dubai increased by 18% quarter-over-quarter, with luxury apartments and villas leading the growth. The average property price in prime locations reached AED 3.2 million, representing a 12% increase from the previous quarter.</p>

      <h3>Commercial Sector Growth</h3>
      <p>Commercial real estate showed even stronger performance, with office spaces and retail units experiencing 25% growth in transaction volumes. Dubai's position as a business hub continues to drive demand for commercial properties.</p>

      <h3>Market Outlook for 2026</h3>
      <p>Industry experts predict continued growth in 2026, with infrastructure developments and Expo 2020 legacy projects expected to further boost property values. Foreign investment remains strong, particularly from European and Asian markets.</p>

      <h3>Key Market Indicators</h3>
      <ul>
        <li>Transaction volumes: +18% QoQ</li>
        <li>Average property prices: AED 3.2M</li>
        <li>Foreign investor share: 65%</li>
        <li>Rental yields: 6.8% average</li>
      </ul>

      <p>The market's performance underscores Dubai's attractiveness as a stable investment destination in an uncertain global economy.</p>
    `,
    tags: ['Market Analysis', 'Q4 2025', 'Property Growth', 'Dubai Real Estate']
  },
  {
    id: 2,
    title: 'New Luxury Developments Launch in Dubai Marina',
    excerpt: 'Several high-end residential projects have been announced in Dubai Marina, offering premium waterfront living options.',
    date: 'December 3, 2025',
    author: 'Development News',
    category: 'New Developments',
    readTime: '4 min read',
    featured: false,
    image: '/api/placeholder/800/400',
    content: `
      <h2>Dubai Marina's Luxury Expansion</h2>
      <p>Dubai Marina, one of the emirate's most sought-after residential districts, is set to welcome several new luxury developments that promise to redefine waterfront living in the region.</p>

      <h3>Major Projects Announced</h3>
      <p>Three major developers have unveiled ambitious projects totaling AED 12 billion in investment. These developments feature cutting-edge architecture and world-class amenities designed to cater to the growing demand for premium residential options.</p>

      <h3>Architectural Innovation</h3>
      <p>The new projects showcase Dubai's commitment to architectural excellence, with designs that incorporate sustainable materials, smart home technology, and panoramic marina views. Each development offers a unique lifestyle experience with private beaches, yacht clubs, and exclusive resident facilities.</p>

      <h3>Amenity-Rich Communities</h3>
      <p>Residents can expect comprehensive amenity packages including:</p>
      <ul>
        <li>Private marina berths</li>
        <li>Infinity pools with marina views</li>
        <li>State-of-the-art fitness centers</li>
        <li>Concierge services</li>
        <li>Children's play areas</li>
        <li>Retail and dining options</li>
      </ul>

      <h3>Investment Potential</h3>
      <p>With Dubai Marina's proven track record of property appreciation and rental demand, these new developments are expected to offer strong investment returns. The area continues to attract both local and international investors seeking premium waterfront properties.</p>

      <p>The launches are scheduled for early 2026, with completion expected within 3-4 years.</p>
    `,
    tags: ['Dubai Marina', 'Luxury Developments', 'Waterfront Living', 'New Projects']
  },
  {
    id: 3,
    title: 'Commercial Property Investment Trends in 2026',
    excerpt: 'Analysis of emerging trends in commercial real estate investment and their impact on Dubai\'s business landscape.',
    date: 'December 1, 2025',
    author: 'Investment Team',
    category: 'Investment',
    readTime: '6 min read',
    featured: false,
    image: '/api/placeholder/800/400',
    content: `
      <h2>2026 Commercial Investment Landscape</h2>
      <p>As Dubai continues to solidify its position as a global business hub, commercial property investment trends for 2026 point to significant opportunities across multiple sectors.</p>

      <h3>Office Space Evolution</h3>
      <p>The demand for modern, flexible office spaces is driving investment in Dubai's business districts. Companies are seeking properties that support hybrid work models and incorporate advanced technology infrastructure.</p>

      <h3>Retail Sector Transformation</h3>
      <p>The retail landscape is undergoing a digital transformation, with investors focusing on mixed-use developments that combine physical retail with e-commerce fulfillment centers. Dubai's position as a logistics hub makes it ideal for this trend.</p>

      <h3>Industrial and Logistics Growth</h3>
      <p>Rapid e-commerce growth and Dubai's strategic location are fueling demand for industrial properties and logistics facilities. Investment in automated warehouses and cold storage facilities is particularly strong.</p>

      <h3>Emerging Trends</h3>
      <ul>
        <li>Co-working and flexible office spaces</li>
        <li>Mixed-use developments</li>
        <li>Sustainable and green buildings</li>
        <li>Technology-integrated properties</li>
        <li>Last-mile distribution centers</li>
      </ul>

      <h3>Investment Strategy</h3>
      <p>Successful commercial investment in Dubai requires understanding local market dynamics and regulatory frameworks. Key considerations include location analysis, tenant quality, lease terms, and exit strategies.</p>

      <h3>Market Outlook</h3>
      <p>Industry analysts predict continued growth in commercial property values, with rental yields remaining attractive for investors. The combination of economic diversification and infrastructure development creates a favorable environment for commercial real estate investment.</p>
    `,
    tags: ['Commercial Investment', '2026 Trends', 'Office Space', 'Retail', 'Industrial']
  },
  {
    id: 4,
    title: 'Dubai Ranks Top Global Real Estate Destination',
    excerpt: 'Dubai maintains its position as the world\'s most attractive real estate market according to latest global rankings.',
    date: 'November 28, 2025',
    author: 'International Reports',
    category: 'Global Rankings',
    readTime: '3 min read',
    featured: false,
    image: '/api/placeholder/800/400',
    content: `
      <h2>Global Real Estate Rankings 2025</h2>
      <p>Dubai has once again topped global rankings as the world's most attractive real estate destination, according to the latest Knight Frank Global House Price Index and related reports.</p>

      <h3>Key Rankings Achieved</h3>
      <ul>
        <li>#1 Global Real Estate Destination (Knight Frank)</li>
        <li>#1 City for Foreign Investment (World Investment Report)</li>
        <li>#3 Most Competitive Real Estate Market (World Economic Forum)</li>
        <li>Top 5 Global Property Appreciation (Global Property Guide)</li>
      </ul>

      <h3>Factors Driving Success</h3>
      <p>Several key factors contribute to Dubai's continued success in global real estate rankings:</p>

      <h4>Economic Stability</h4>
      <p>Dubai's economic diversification strategy and stable currency have created a reliable investment environment that appeals to international investors.</p>

      <h4>Regulatory Framework</h4>
      <p>Clear property laws, efficient registration processes, and investor-friendly policies make Dubai an attractive destination for property investment.</p>

      <h4>Infrastructure Excellence</h4>
      <p>World-class infrastructure, including the world's busiest airport and modern transportation systems, supports property value appreciation.</p>

      <h4>Lifestyle Appeal</h4>
      <p>Dubai's cosmopolitan lifestyle, tax advantages, and quality of life attract both investors and residents from around the world.</p>

      <h3>Future Outlook</h3>
      <p>With ongoing infrastructure projects and economic initiatives, Dubai is well-positioned to maintain its leading position in global real estate markets. The combination of strategic location, regulatory stability, and lifestyle appeal continues to drive international interest.</p>
    `,
    tags: ['Global Rankings', 'Investment Destination', 'Dubai Success', 'Property Market']
  },
  {
    id: 5,
    title: 'Sustainable Building Practices in UAE Real Estate',
    excerpt: 'How green building initiatives are transforming the construction industry and property values in the UAE.',
    date: 'November 25, 2025',
    author: 'Sustainability Team',
    category: 'Sustainability',
    readTime: '7 min read',
    featured: false,
    image: '/api/placeholder/800/400',
    content: `
      <h2>Sustainability Revolution in UAE Real Estate</h2>
      <p>The UAE real estate sector is undergoing a transformation as sustainable building practices become integral to development strategies, driven by government initiatives and market demand.</p>

      <h3>Government-Led Initiatives</h3>
      <p>The UAE government has implemented ambitious sustainability targets, including:</p>
      <ul>
        <li>UAE Green Building Council certification requirements</li>
        <li>Net-zero carbon emissions by 2050</li>
        <li>50% of energy from renewable sources by 2050</li>
        <li>Mandatory green building standards for new developments</li>
      </ul>

      <h3>Green Building Standards</h3>
      <p>Several certification systems are widely adopted in the UAE:</p>

      <h4>Estidama (Abu Dhabi)</h4>
      <p>Focuses on sustainable urbanism and environmental responsibility, with requirements for water conservation, energy efficiency, and sustainable materials.</p>

      <h4>Green Building Council UAE</h4>
      <p>Provides comprehensive rating systems for buildings, communities, and infrastructure projects, measuring performance across environmental, social, and economic criteria.</p>

      <h3>Market Impact</h3>
      <p>Sustainable buildings command premium prices and attract environmentally conscious investors. Properties with green certifications typically see:</p>
      <ul>
        <li>5-15% higher property values</li>
        <li>10-20% lower operating costs</li>
        <li>Higher rental yields</li>
        <li>Increased demand from international tenants</li>
      </ul>

      <h3>Technological Innovations</h3>
      <p>UAE developers are incorporating cutting-edge sustainable technologies:</p>
      <ul>
        <li>Solar panel integration</li>
        <li>Smart energy management systems</li>
        <li>Rainwater harvesting</li>
        <li>Green roofs and vertical gardens</li>
        <li>High-performance insulation</li>
        <li>LED lighting and efficient HVAC systems</li>
      </ul>

      <h3>Future Trends</h3>
      <p>The future of UAE real estate will see increased focus on:</p>
      <ul>
        <li>Net-zero energy buildings</li>
        <li>Circular economy principles</li>
        <li>Biophilic design integration</li>
        <li>Smart city technologies</li>
        <li>Renewable energy microgrids</li>
      </ul>

      <p>Sustainability is no longer optional in UAE real estate—it's becoming the standard that defines market leadership and investment value.</p>
    `,
    tags: ['Sustainability', 'Green Buildings', 'UAE Real Estate', 'Environmental', 'Future Trends']
  },
  {
    id: 6,
    title: 'Holiday Season Property Market Update',
    excerpt: 'Seasonal trends and opportunities in Dubai\'s real estate market during the holiday period.',
    date: 'November 22, 2025',
    author: 'Seasonal Analysis',
    category: 'Market Update',
    readTime: '4 min read',
    featured: false,
    image: '/api/placeholder/800/400',
    content: `
      <h2>Holiday Season Market Dynamics</h2>
      <p>The holiday season brings unique opportunities and trends to Dubai's real estate market, with both seasonal patterns and year-end investment strategies influencing activity.</p>

      <h3>Seasonal Buying Patterns</h3>
      <p>Contrary to traditional markets, Dubai's holiday season often sees increased property activity due to several factors:</p>
      <ul>
        <li>Tax planning and year-end investments</li>
        <li>Holiday visitors exploring property options</li>
        <li>Developers launching projects before year-end</li>
        <li>International investors finalizing purchases</li>
      </ul>

      <h3>Market Activity Trends</h3>
      <p>December typically shows:</p>
      <ul>
        <li>15-20% increase in property viewings</li>
        <li>Higher off-plan sales due to tax advantages</li>
        <li>Increased activity in luxury segments</li>
        <li>More international buyer inquiries</li>
      </ul>

      <h3>Investment Opportunities</h3>
      <p>The holiday period offers strategic investment opportunities:</p>

      <h4>Tax Optimization</h4>
      <p>Year-end property purchases can provide tax advantages and capital appreciation opportunities before the new year begins.</p>

      <h4>Developer Incentives</h4>
      <p>Many developers offer holiday promotions, payment plans, and additional incentives to boost sales during this period.</p>

      <h4>Market Timing</h4>
      <p>Investors can take advantage of seasonal market dynamics to negotiate better terms or secure preferred units.</p>

      <h3>Rental Market Dynamics</h3>
      <p>The holiday season affects rental markets differently:</p>
      <ul>
        <li>Short-term holiday rentals see peak demand</li>
        <li>Long-term rentals may have higher vacancy rates</li>
        <li>Premium pricing for furnished properties</li>
        <li>Increased competition for quality rentals</li>
      </ul>

      <h3>Market Outlook</h3>
      <p>While holiday periods traditionally slow down real estate activity in many markets, Dubai's unique position creates opportunities for strategic investors. The combination of tax advantages, developer promotions, and international interest makes this an active period for property transactions.</p>

      <p>Investors should work with experienced professionals to navigate seasonal market dynamics and identify the best opportunities during this period.</p>
    `,
    tags: ['Holiday Season', 'Market Update', 'Investment Opportunities', 'Seasonal Trends']
  }
]

const relatedArticles = [
  { id: 2, title: 'New Luxury Developments Launch in Dubai Marina', category: 'New Developments' },
  { id: 3, title: 'Commercial Property Investment Trends in 2026', category: 'Investment' },
  { id: 5, title: 'Sustainable Building Practices in UAE Real Estate', category: 'Sustainability' }
]

export default function NewsArticlePage() {
  const params = useParams()
  const router = useRouter()
  const [article, setArticle] = useState<any>(null)
  const [currentArticleIndex, setCurrentArticleIndex] = useState<number>(-1)

  useEffect(() => {
    const articleId = parseInt(params.id as string)
    const foundArticle = newsArticles.find(a => a.id === articleId)
    const articleIndex = newsArticles.findIndex(a => a.id === articleId)

    if (foundArticle) {
      setArticle(foundArticle)
      setCurrentArticleIndex(articleIndex)
    } else {
      router.push('/news')
    }
  }, [params.id, router])

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary">
        <div className="text-center">
          <NewspaperIcon className="h-16 w-16 mx-auto mb-4 text-primary" />
          <p className="text-slate-300">Loading article...</p>
        </div>
      </div>
    )
  }

  const previousArticle = currentArticleIndex > 0 ? newsArticles[currentArticleIndex - 1] : null
  const nextArticle = currentArticleIndex < newsArticles.length - 1 ? newsArticles[currentArticleIndex + 1] : null

  return (
    <div className="min-h-screen bg-secondary">
      {/* Header */}
      <div className="border-b border-primary/20 bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/news"
            className="inline-flex items-center text-sm font-medium text-slate-300 hover:text-primary transition-colors"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to News
          </Link>
        </div>
      </div>

      {/* Article Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <span className="px-3 py-1 bg-primary text-secondary rounded-full text-xs font-bold uppercase tracking-widest">
              {article.category}
            </span>
            <div className="flex items-center text-sm text-slate-400">
              <CalendarDaysIcon className="h-4 w-4 mr-1" />
              {article.date}
            </div>
            <div className="flex items-center text-sm text-slate-400">
              <ClockIcon className="h-4 w-4 mr-1" />
              {article.readTime}
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">
            {article.title}
          </h1>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <UserIcon className="h-5 w-5 mr-2 text-primary" />
              <span className="text-sm font-medium text-white">
                {article.author}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button className="p-2 rounded-full hover:bg-slate-800 transition-colors">
                <ShareIcon className="h-5 w-5 text-slate-300" />
              </button>
              <button className="p-2 rounded-full hover:bg-slate-800 transition-colors">
                <BookmarkIcon className="h-5 w-5 text-slate-300" />
              </button>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="mb-8">
          <div
            className="w-full h-64 md:h-96 bg-cover bg-center rounded-lg"
            style={{ backgroundImage: `url(${article.image})` }}
          />
        </div>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none mb-12">
          <div
            className="text-lg leading-relaxed text-slate-300 prose-headings:text-white prose-headings:font-black prose-headings:tracking-tight prose-p:text-slate-300 prose-li:text-slate-300 prose-strong:text-white"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>

        {/* Tags */}
        <div className="mb-12">
          <h3 className="text-lg font-bold text-white mb-4">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag: string, index: number) => (
              <span
                key={index}
                className="px-3 py-1 rounded-full text-sm border border-primary/30 text-primary hover:bg-primary hover:text-secondary transition-all"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Article Navigation */}
        <div className="border-t border-b border-slate-700 py-8 mb-12">
          <div className="flex justify-between items-center">
            {previousArticle ? (
              <Link
                href={`/news/${previousArticle.id}`}
                className="flex items-center p-4 rounded-2xl bg-slate-900 border border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-3 text-primary" />
                <div>
                  <div className="text-sm text-slate-500">Previous Article</div>
                  <div className="text-sm font-bold text-white">
                    {previousArticle.title.length > 50 ? `${previousArticle.title.substring(0, 50)}...` : previousArticle.title}
                  </div>
                </div>
              </Link>
            ) : (
              <div></div>
            )}

            {nextArticle ? (
              <Link
                href={`/news/${nextArticle.id}`}
                className="flex items-center p-4 rounded-2xl bg-slate-900 border border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 text-right"
              >
                <div>
                  <div className="text-sm text-slate-500">Next Article</div>
                  <div className="text-sm font-bold text-white">
                    {nextArticle.title.length > 50 ? `${nextArticle.title.substring(0, 50)}...` : nextArticle.title}
                  </div>
                </div>
                <ArrowRightIcon className="h-5 w-5 ml-3 text-primary" />
              </Link>
            ) : (
              <div></div>
            )}
          </div>
        </div>

        {/* Related Articles */}
        <div>
          <h3 className="text-2xl font-black text-secondary tracking-tight mb-6">
            <span className="text-secondary">Related</span> <span className="text-primary">Articles</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedArticles.map((relatedArticle) => (
              <Link
                key={relatedArticle.id}
                href={`/news/${relatedArticle.id}`}
                className="block p-6 rounded-2xl bg-slate-900 border border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:scale-105"
              >
                <div className="mb-3">
                  <span className="px-2 py-1 bg-slate-800 text-primary rounded-full text-xs font-bold uppercase tracking-widest border border-primary/30">
                    {relatedArticle.category}
                  </span>
                </div>
                <h4 className="text-lg font-bold text-white mb-2 hover:text-primary transition-colors">
                  {relatedArticle.title}
                </h4>
                <div className="text-sm font-bold text-primary hover:text-white transition-colors">
                  Read Article →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="py-16 bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <NewspaperIcon className="h-16 w-16 mx-auto mb-6 text-primary" />
          <h2 className="text-3xl md:text-4xl font-black text-secondary tracking-tight mb-4">
            <span className="text-secondary">Stay Updated</span> <span className="text-primary">with Latest News</span>
          </h2>
          <p className="text-lg mb-8 text-slate-300 max-w-2xl mx-auto">
            Subscribe to our newsletter for exclusive market insights and property updates.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 border border-primary/30 bg-slate-800 text-white rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            />
            <button className="px-8 py-3 bg-primary text-secondary font-bold rounded-xl hover:bg-white transition-all whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}