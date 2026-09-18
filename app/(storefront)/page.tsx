import Link from 'next/link';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { getFeaturedProducts } from '@/lib/services/products.service';
import { ProductCard } from '@/components/storefront/product-card';
import { HeroVisualizer } from '@/components/storefront/hero-visualizer';

export default async function StorefrontPage() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <div className="flex flex-col gap-24 pb-24">
      {/* Hero Section */}
      <section className="relative pt-20 lg:pt-32 pb-16 overflow-hidden">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="dyno-tape inline-block">AuraCommerce v2.0</div>
              <h1 className="text-5xl lg:text-7xl font-bold tracking-tighter leading-[1.1] text-white">
                The Future of <br className="hidden lg:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#14B8A6] to-[#1E293B]">Commerce.</span>
              </h1>
              <p className="text-lg lg:text-xl text-zinc-400 max-w-lg">
                Authentic products, same-day dispatch, WhatsApp checkout.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4 text-sm font-medium text-zinc-300">
              <span className="flex items-center gap-2"><span className="text-[#14B8A6]">✓</span> Same-Day Dispatch</span>
              <span className="flex items-center gap-2"><span className="text-[#14B8A6]">✓</span> Authentic Sourcing</span>
              <span className="flex items-center gap-2"><span className="text-[#14B8A6]">✓</span> Instant WhatsApp Checkout</span>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link 
                href="/products" 
                className="bg-[#14B8A6] text-black px-8 py-3.5 rounded-md font-semibold hover:bg-white hover:text-black transition-all"
              >
                Shop Now
              </Link>
              <Link 
                href="/products" 
                className="group flex items-center gap-2 px-8 py-3.5 rounded-md font-medium text-white border border-[#1E293B]/70 hover:bg-[#1E293B]/30 transition-all"
              >
                Browse Collections
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
          
          <div className="relative h-[400px] lg:h-[600px] rounded-2xl border border-[#1E293B]/70 bg-[#0E121B]/50 backdrop-blur-sm overflow-hidden flex items-center justify-center teal-glow">
            <HeroVisualizer />
          </div>
        </div>
      </section>

      {/* Featured Drops Section */}
      <section className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-bold tracking-tight text-white">Featured Drops</h2>
          <Link href="/products" className="text-sm font-medium text-[#14B8A6] hover:text-white transition-colors flex items-center gap-1">
            View All Products <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Live Showcase / Value Props Band */}
      <section className="border-y border-[#1E293B]/70 bg-[#0E121B]/50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-8 text-center space-y-3">
              <div className="text-4xl font-bold text-white">10,000+</div>
              <div className="text-sm font-medium text-[#14B8A6] uppercase tracking-wider">Happy Customers</div>
            </div>
            <div className="glass-card p-8 text-center space-y-3">
              <div className="text-4xl font-bold text-white">99.2%</div>
              <div className="text-sm font-medium text-[#14B8A6] uppercase tracking-wider">On-Time Delivery</div>
            </div>
            <div className="glass-card p-8 text-center space-y-3">
              <div className="text-4xl font-bold text-white">3</div>
              <div className="text-sm font-medium text-[#14B8A6] uppercase tracking-wider">Courier Partners</div>
            </div>
          </div>
        </div>
      </section>

      {/* Collections Grid */}
      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-bold tracking-tight text-white mb-10">Shop by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {['Electronics', 'Apparel', 'Beauty', 'Accessories'].map((category) => (
            <Link 
              key={category} 
              href={`/products?category=${category.toLowerCase()}`}
              className="group relative h-64 rounded-xl overflow-hidden glass-card transition-all hover:scale-[1.02] hover:teal-glow hover:border-[#14B8A6]/50"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#06080A] via-[#06080A]/40 to-transparent z-10" />
              {/* Image placeholder */}
              <div className="absolute inset-0 bg-zinc-900 group-hover:bg-zinc-800 transition-colors" />
              <div className="absolute inset-0 p-6 flex flex-col justify-end z-20">
                <h3 className="text-xl font-bold text-white mb-1">{category}</h3>
                <span className="text-sm text-[#14B8A6] font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0">
                  Explore <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* WhatsApp CTA Section */}
      <section className="container mx-auto px-4">
        <div className="glass-card p-12 text-center max-w-4xl mx-auto relative overflow-hidden">
          <div className="absolute top-0 right-0 p-32 bg-[#14B8A6]/10 rounded-full blur-[100px] -mr-16 -mt-16" />
          <div className="relative z-10 space-y-6">
            <h2 className="text-3xl font-bold text-white">Prefer to Order via WhatsApp?</h2>
            <p className="text-zinc-400 max-w-lg mx-auto">
              Skip the checkout process. Message us directly on WhatsApp to place your order instantly. Our team is ready to assist you.
            </p>
            <a 
              href="https://wa.me/8801234567890" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] text-white px-8 py-3.5 rounded-md font-semibold hover:bg-[#20bd5a] transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              Message +880 1XXX-XXXXXX
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
