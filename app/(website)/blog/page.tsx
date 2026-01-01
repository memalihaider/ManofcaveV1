import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { CalendarIcon, UserIcon, ArrowRightIcon, SparklesIcon, ChartBarIcon, NewspaperIcon } from '@heroicons/react/24/outline'

export const metadata: Metadata = {
  title: 'Real Estate Blog & Market Insights | Dubai Property News | RAGDOL',
  description: 'Stay updated with the latest Dubai real estate news, market insights, investment tips, and expert guides.',
}

const posts = [
  {
    id: '1',
    title: 'Dubai Real Estate Market Trends 2024: What to Expect',
    excerpt: 'An in-depth analysis of the projected growth, emerging hotspots, and regulatory changes shaping the Dubai property market in the coming year.',
    category: 'Market Update',
    author: 'Sarah Ahmed',
    date: 'Dec 15, 2023',
    image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
    readTime: '8 min read'
  },
  {
    id: '2',
    title: 'Top 5 Areas for High-Yield Property Investment in Dubai',
    excerpt: 'Discover the communities offering the best rental returns and capital appreciation potential for savvy investors in 2024.',
    category: 'Investment',
    author: 'Ahmed Hassan',
    date: 'Dec 10, 2023',
    image: 'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800',
    readTime: '6 min read'
  },
  {
    id: '3',
    title: 'The Ultimate Guide to Buying Off-Plan Property in Dubai',
    excerpt: 'Everything you need to know about the off-plan buying process, from payment plans and escrow accounts to developer reputation.',
    category: 'Guides',
    author: 'Fatima Khan',
    date: 'Dec 05, 2023',
    image: 'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=800',
    readTime: '12 min read'
  },
  {
    id: '4',
    title: 'Luxury Living: The Rise of Branded Residences in Dubai',
    excerpt: 'Exploring the growing trend of fashion and automotive brands entering the real estate space with ultra-luxury residential projects.',
    category: 'Lifestyle',
    author: 'Sarah Ahmed',
    date: 'Nov 28, 2023',
    image: 'https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg?auto=compress&cs=tinysrgb&w=800',
    readTime: '10 min read'
  },
  {
    id: '5',
    title: 'Sustainable Real Estate: Green Buildings in the UAE',
    excerpt: 'How Dubai is leading the way in sustainable urban development and what it means for future property owners and the environment.',
    category: 'Sustainability',
    author: 'Michael Chen',
    date: 'Nov 20, 2023',
    image: 'https://images.pexels.com/photos/2121287/pexels-photo-2121287.jpeg?auto=compress&cs=tinysrgb&w=800',
    readTime: '7 min read'
  },
  {
    id: '6',
    title: 'Navigating the Golden Visa: Real Estate Requirements',
    excerpt: 'A comprehensive breakdown of the UAE Golden Visa program for property investors and how to qualify through real estate acquisition.',
    category: 'Legal',
    author: 'Fatima Khan',
    date: 'Nov 15, 2023',
    image: 'https://images.pexels.com/photos/4819372/pexels-photo-4819372.jpeg?auto=compress&cs=tinysrgb&w=800',
    readTime: '9 min read'
  }
]

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden bg-secondary">
        <div className="absolute inset-0">
          <Image 
            src="https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1600"
            alt="Blog Hero"
            fill
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-secondary/60 via-secondary/40 to-white"></div>
        </div>
        
        <div className="container-custom relative z-10 text-center">
          <h2 className="text-primary font-bold tracking-[0.4em] uppercase text-sm mb-6 animate-slide-up">
            Insights & News
          </h2>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight mb-8 animate-slide-up [animation-delay:100ms]">
            RAGDOL <span className="text-gradient">Journal</span>
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto font-medium animate-slide-up [animation-delay:200ms]">
            Stay ahead of the curve with expert market analysis, investment guides, and the latest real estate news from Dubai.
          </p>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-24">
        <div className="container-custom">
          <div className="group relative bg-slate-900 rounded-[3rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row animate-slide-up">
            <div className="lg:w-1/2 relative h-96 lg:h-auto overflow-hidden">
              <img 
                src={posts[0].image} 
                alt={posts[0].title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
              />
              <div className="absolute top-8 left-8">
                <span className="px-6 py-2 bg-primary text-secondary text-xs font-black uppercase tracking-widest rounded-full shadow-xl">
                  Featured Article
                </span>
              </div>
            </div>
            <div className="lg:w-1/2 p-12 lg:p-20 flex flex-col justify-center">
              <div className="flex items-center gap-4 text-primary text-xs font-bold uppercase tracking-widest mb-6">
                <span>{posts[0].category}</span>
                <span className="w-1 h-1 bg-white/20 rounded-full"></span>
                <span>{posts[0].date}</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-8 leading-tight group-hover:text-primary transition-colors">
                {posts[0].title}
              </h2>
              <p className="text-xl text-slate-400 leading-relaxed mb-10 font-medium">
                {posts[0].excerpt}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-white/10 rounded-full flex items-center justify-center text-white">
                    <UserIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-white font-bold">{posts[0].author}</div>
                    <div className="text-slate-500 text-xs font-bold uppercase tracking-widest">{posts[0].readTime}</div>
                  </div>
                </div>
                <Link href={`/blog/${posts[0].id}`} className="h-14 w-14 bg-primary rounded-2xl flex items-center justify-center text-secondary hover:bg-white transition-all">
                  <ArrowRightIcon className="h-6 w-6" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 border-y border-slate-100">
        <div className="container-custom">
          <div className="flex flex-wrap justify-center gap-4">
            {['All Posts', 'Market Update', 'Investment', 'Guides', 'Lifestyle', 'Legal', 'Sustainability'].map(cat => (
              <button key={cat} className="px-8 py-3 rounded-full border border-slate-200 text-slate-600 font-bold text-sm hover:border-primary hover:text-primary transition-all">
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-24">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {posts.slice(1).map((post, i) => (
              <Link key={post.id} href={`/blog/${post.id}`} className="group animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="relative aspect-[16/10] rounded-[2rem] overflow-hidden mb-8 shadow-xl">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-6 left-6">
                    <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md text-primary text-[10px] font-black uppercase tracking-widest rounded-full">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-4">
                  <span>{post.date}</span>
                  <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                  <span>{post.readTime}</span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 group-hover:text-primary transition-colors leading-tight mb-4">
                  {post.title}
                </h3>
                <p className="text-slate-500 font-medium leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>
              </Link>
            ))}
          </div>
          
          <div className="text-center mt-20">
            <button className="btn-outline !rounded-full !px-12 !py-4">
              Load More Articles
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 bg-slate-50">
        <div className="container-custom">
          <div className="bg-primary rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-6xl font-black text-secondary mb-8 tracking-tight">
                Get the Latest <span className="text-white">Insights</span>
              </h2>
              <p className="text-xl text-secondary/80 mb-12 font-medium">
                Subscribe to our newsletter and receive the most important Dubai real estate news and market reports directly in your inbox.
              </p>
              <form className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
                <input 
                  type="email" 
                  placeholder="Your Email Address" 
                  className="flex-1 px-8 py-5 rounded-2xl bg-white/20 border border-white/30 text-secondary placeholder:text-secondary/50 focus:outline-none focus:ring-2 focus:ring-white/50 font-bold"
                />
                <button className="px-10 py-5 bg-secondary text-white font-black uppercase tracking-widest rounded-2xl hover:bg-white hover:text-secondary transition-all">
                  Subscribe Now
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
