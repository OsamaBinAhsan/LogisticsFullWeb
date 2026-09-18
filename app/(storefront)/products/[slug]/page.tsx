import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getProductBySlug, getRelatedProducts } from '@/lib/services/products.service';
import { ProductGallery } from '@/components/storefront/product-gallery';
import { ProductBuyPanel } from '@/components/storefront/product-buy-panel';
import { ProductCard } from '@/components/storefront/product-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);
  
  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product.id, product.category);

  return (
    <div className="container mx-auto px-4 py-8 lg:py-16 space-y-16">
      {/* Top Section: Gallery + Buy Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        {/* Left: Image Gallery (Client Component) */}
        <div className="sticky top-24 h-fit">
          <ProductGallery images={product.images} title={product.name} />
        </div>

        {/* Right: Buy Panel (Client Component for interactivity) */}
        <div>
          <ProductBuyPanel product={product} />
        </div>
      </div>

      {/* Description Tabs */}
      <div className="max-w-4xl mx-auto glass-card p-6 lg:p-10">
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-[#06080A] border border-[#1E293B]/70 p-1 mb-8">
            <TabsTrigger value="description" className="data-[state=active]:bg-[#14B8A6] data-[state=active]:text-black">
              Description
            </TabsTrigger>
            <TabsTrigger value="specifications" className="data-[state=active]:bg-[#14B8A6] data-[state=active]:text-black">
              Specifications
            </TabsTrigger>
            <TabsTrigger value="reviews" className="data-[state=active]:bg-[#14B8A6] data-[state=active]:text-black">
              Reviews ({product.reviewCount})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="description" className="prose prose-invert max-w-none text-zinc-300">
            <div dangerouslySetInnerHTML={{ __html: product.descriptionHtml || `<p>${product.description}</p>` }} />
          </TabsContent>
          
          <TabsContent value="specifications">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {product.specifications?.map((spec: any, index: number) => (
                <div key={index} className="flex flex-col py-3 border-b border-[#1E293B]/70 last:border-0">
                  <span className="text-sm text-zinc-500 font-medium">{spec.label}</span>
                  <span className="text-zinc-200">{spec.value}</span>
                </div>
              )) || <p className="text-zinc-400">No specifications available.</p>}
            </div>
          </TabsContent>
          
          <TabsContent value="reviews">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="text-4xl font-bold text-white">{product.rating.toFixed(1)}</div>
                <div className="space-y-1">
                  <div className="flex text-[#14B8A6]">
                    {[1,2,3,4,5].map(star => (
                      <span key={star}>{star <= Math.round(product.rating) ? '★' : '☆'}</span>
                    ))}
                  </div>
                  <div className="text-sm text-zinc-400">Based on {product.reviewCount} reviews</div>
                </div>
              </div>
              {/* Review list would go here */}
              <p className="text-zinc-400 italic">Review loading is currently mock data.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="space-y-8">
          <h3 className="text-2xl font-bold text-white border-b border-[#1E293B]/70 pb-4">
            You might also like
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p: any) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
