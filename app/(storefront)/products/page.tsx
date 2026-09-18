'use client';

import * as React from 'react';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductCard } from '@/components/storefront/product-card';
import type { Product } from '@/types';

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(initialCategory);
  const [speed, setSpeed] = useState('all');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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
        setProducts(data.products || data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [category, search, sort]);

  const categories = [
    { id: 'all', label: 'All Gear' },
    { id: 'smart packaging', label: 'Smart Packaging' },
    { id: 'apparel', label: 'Tactical Apparel' },
    { id: 'accessories', label: 'Industrial Hardware' },
    { id: 'electronics', label: 'Sensors & IoT' },
  ];

  return (
    <div className="w-full flex flex-col min-h-screen bg-surface">
      {/* Page Header & Metrics Section */}
      <section className="w-full bg-surface-container-low py-8 px-6 lg:px-12 border-b border-surface-container-high">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-secondary-fixed animate-pulse" />
              <span className="font-label-sm text-xs uppercase tracking-widest text-primary font-bold">
                Catalog Index / Release 4.8.2
              </span>
              <span className="font-label-sm text-xs text-outline">•</span>
              <span className="font-label-sm text-xs uppercase tracking-wider text-outline">
                14 Transcontinental Depots Online
              </span>
            </div>
            <h1 className="font-headline text-3xl sm:text-4xl font-bold tracking-tight text-on-surface">
              Curated Freight Hardware & Telemetry
            </h1>
            <p className="font-body-md text-sm text-on-surface-variant max-w-2xl">
              Surgical-grade tracking beacons, shock-resistant modular pods, and smart logistics accessories engineered for high-velocity global supply chains.
            </p>
          </div>

          {/* Live Pipeline Telemetry Summary Mini-Grid */}
          <div className="flex items-center gap-2 bg-surface-container-lowest p-3 rounded-2xl shadow-sm border border-outline-variant/40">
            <div className="px-3 border-r border-outline-variant/30">
              <div className="font-label-sm text-[10px] uppercase text-outline font-bold">Hub Dispatch</div>
              <div className="font-headline text-base font-bold text-on-surface flex items-center gap-1">
                <span>99.94%</span>
                <span className="material-symbols-outlined text-[16px] text-secondary">trending_up</span>
              </div>
            </div>
            <div className="px-3 border-r border-outline-variant/30">
              <div className="font-label-sm text-[10px] uppercase text-outline font-bold">Avg Transpacific</div>
              <div className="font-headline text-base font-bold text-primary">18.4 hrs</div>
            </div>
            <div className="px-3">
              <div className="font-label-sm text-[10px] uppercase text-outline font-bold">In-Stock SKUs</div>
              <div className="font-headline text-base font-bold text-on-surface">148 Ready</div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Sticky Filter & Discovery Bar */}
      <section className="sticky top-20 z-30 w-full bg-surface/90 backdrop-blur-md shadow-sm py-4 px-6 lg:px-12 border-b border-surface-container-high transition-all">
        <div className="max-w-[1440px] mx-auto flex flex-col gap-3">
          {/* Main Category & Speed Controls Row */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
              {categories.map((cat) => {
                const isSelected = category.toLowerCase() === cat.id.toLowerCase();
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`px-4 py-2 rounded-full font-label-md text-xs font-bold transition-all whitespace-nowrap ${
                      isSelected
                        ? 'bg-on-surface text-surface shadow-sm'
                        : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* Right Tooling: Speed Filters, Search, and View Mode */}
            <div className="flex flex-wrap items-center gap-3 self-end lg:self-center">
              {/* Delivery Guarantee Selector */}
              <div className="flex items-center bg-surface-container-low rounded-full p-1 shadow-sm border border-outline-variant/30">
                {[
                  { id: 'all', label: 'All Speeds' },
                  { id: 'next-day', label: 'Next-Day' },
                  { id: 'same-day', label: '⚡ Same-Day' },
                ].map((s) => {
                  const isSelected = speed === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSpeed(s.id)}
                      className={`px-3 py-1.5 rounded-full font-label-sm text-xs transition-all font-bold ${
                        isSelected
                          ? 'bg-surface-container-lowest text-on-surface shadow-sm'
                          : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      {s.label}
                    </button>
                  );
                })}
              </div>

              {/* Search Input */}
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Search spec, hub, SKU..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-48 lg:w-56 pl-9 pr-3 py-1.5 rounded-full bg-surface-container-lowest text-on-surface placeholder:text-outline font-body-sm text-xs shadow-sm border border-outline-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
                <span className="material-symbols-outlined absolute left-2.5 text-[18px] text-outline pointer-events-none">
                  search
                </span>
              </div>

              {/* Sort Selector */}
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="appearance-none bg-surface-container-lowest pl-3 pr-8 py-1.5 rounded-full font-label-sm text-xs font-bold text-on-surface shadow-sm border border-outline-variant/40 focus:outline-none cursor-pointer"
                >
                  <option value="featured">Sort: Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
                <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-[16px] text-outline pointer-events-none">
                  unfold_more
                </span>
              </div>

              {/* View Toggle */}
              <div className="flex items-center bg-surface-container-lowest p-1 rounded-full shadow-sm border border-outline-variant/40">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-full transition-all ${
                    viewMode === 'grid'
                      ? 'bg-surface-container text-primary'
                      : 'text-outline hover:text-on-surface'
                  }`}
                  title="Grid View"
                >
                  <span className="material-symbols-outlined text-[18px]">grid_view</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-full transition-all ${
                    viewMode === 'list'
                      ? 'bg-surface-container text-primary'
                      : 'text-outline hover:text-on-surface'
                  }`}
                  title="List View"
                >
                  <span className="material-symbols-outlined text-[18px]">view_agenda</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Active Filter Status */}
          <div className="flex items-center justify-between text-on-surface-variant font-label-sm text-xs pt-1">
            <div className="flex items-center gap-2">
              <span>
                Displaying <strong className="text-on-surface font-bold">{products.length}</strong> deployment-certified freight products
              </span>
              <span className="hidden md:inline text-outline">•</span>
              <span className="hidden md:inline text-secondary font-medium">
                Synchronized with Frankfurt & Tokyo Depots
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                setCategory('all');
                setSearch('');
                setSpeed('all');
                setSort('featured');
              }}
              className="text-primary hover:underline font-label-sm text-xs flex items-center gap-1 cursor-pointer font-bold"
            >
              <span className="material-symbols-outlined text-[14px]">refresh</span> Reset filters
            </button>
          </div>
        </div>
      </section>

      {/* Catalog Grid Stage */}
      <section className="w-full px-6 lg:px-12 py-10 flex-1">
        <div className="max-w-[1440px] mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-96 rounded-2xl bg-surface-container-low animate-pulse border border-outline-variant/30" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-24 bg-surface-container-lowest rounded-3xl border border-outline-variant/40 p-8">
              <span className="material-symbols-outlined text-[48px] text-outline mb-2">package_2</span>
              <h3 className="font-headline text-xl font-bold text-on-surface mb-1">No freight gear found</h3>
              <p className="font-body-sm text-sm text-on-surface-variant">Try selecting a different category or clearing search keywords.</p>
              <button
                type="button"
                onClick={() => { setCategory('all'); setSearch(''); }}
                className="mt-6 px-6 py-2.5 rounded-full bg-primary text-on-primary font-bold text-xs hover:bg-primary-container transition-all"
              >
                Reset Filter Parameters
              </button>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" : "flex flex-col gap-4"}>
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-24 text-center font-headline text-sm text-on-surface-variant">
          Initializing telemetry catalog...
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}

