'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { ProductCard } from '@/components/storefront/product-card';

function ProductsContent() {

  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(initialCategory);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (category && category !== 'all') queryParams.set('category', category);
        if (search) queryParams.set('search', search);
        if (sort) queryParams.set('sort', sort);

        const res = await fetch(`/api/products?${queryParams.toString()}`);
        if (!res.ok) throw new Error('Failed to fetch products');
        
        const data = await res.json();
        setProducts(data.products || data); // Handle both formats just in case
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [category, search, sort]);

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 shrink-0 space-y-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-[#14B8A6]" />
              Filters
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Category</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#0E121B] border border-[#1E293B]/70 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-[#14B8A6] appearance-none"
                >
                  <option value="all">All Categories</option>
                  <option value="electronics">Electronics</option>
                  <option value="apparel">Apparel</option>
                  <option value="beauty">Beauty</option>
                  <option value="accessories">Accessories</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Sort By</label>
                <div className="relative">
                  <select 
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="w-full bg-[#0E121B] border border-[#1E293B]/70 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-[#14B8A6] appearance-none pr-8"
                  >
                    <option value="newest">Newest Arrivals</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-zinc-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300 flex justify-between">
                  Price Range 
                  <span className="text-[#14B8A6]">৳0 - ৳50,000+</span>
                </label>
                <input 
                  type="range" 
                  min="0" 
                  max="50000" 
                  step="1000"
                  className="w-full accent-[#14B8A6]"
                />
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-[#0E121B]/50 p-4 rounded-xl border border-[#1E293B]/70">
            <div className="relative w-full max-w-md">
              <Search className="w-5 h-5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#06080A] border border-[#1E293B]/70 rounded-md pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-[#14B8A6]"
              />
            </div>
            <div className="text-sm text-zinc-400">
              Showing {products.length} results
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="glass-card h-80 animate-pulse bg-[#1E293B]/20" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-24 glass-card">
              <h3 className="text-xl font-semibold text-white mb-2">No products found</h3>
              <p className="text-zinc-400">Try adjusting your search or filters.</p>
              <button 
                onClick={() => { setCategory('all'); setSearch(''); }}
                className="mt-6 text-[#14B8A6] hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-24 text-center text-zinc-500 font-mono text-sm">
          Loading catalog...
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}

