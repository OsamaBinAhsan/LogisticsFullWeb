import { type Product, type CreateProduct } from '@/types';

const INITIAL_PRODUCTS: Product[] = [
  {
    id: "PROD-001",
    slug: "obsidian-heavyweight-hoodie",
    name: "Obsidian Heavyweight Hoodie",
    description: "Premium heavyweight cotton blend hoodie with an oversized fit.",
    category: "Apparel",
    tags: ["winter", "hoodie", "obsidian"],
    basePrice: 2250,
    images: ["/images/products/hoodie-1.jpg", "/images/products/hoodie-2.jpg"],
    rating: 4.8,
    reviewCount: 124,
    badge: "bestseller",
    isFeatured: true,
    createdAt: "2023-10-01T00:00:00Z",
    variants: [
      { id: "VAR-001-M", sku: "MOD-HOODIE-BLK-M", size: "M", color: "Black", price: 2250, costPrice: 1100, stock: 45, images: [] },
      { id: "VAR-001-L", sku: "MOD-HOODIE-BLK-L", size: "L", color: "Black", price: 2250, costPrice: 1100, stock: 24, images: [] },
    ]
  },
  {
    id: "PROD-002",
    slug: "emerald-modal-silk-scarf",
    name: "Emerald Modal Silk Scarf",
    description: "Luxurious modal silk scarf with deep emerald hues.",
    category: "Accessories",
    tags: ["silk", "scarf", "emerald"],
    basePrice: 950,
    images: ["/images/products/scarf-1.jpg"],
    rating: 4.9,
    reviewCount: 56,
    isFeatured: true,
    createdAt: "2023-10-05T00:00:00Z",
    variants: [
      { id: "VAR-002", sku: "SILK-SCARF-EMR", color: "Emerald Green", price: 950, costPrice: 380, stock: 8, images: [] },
    ]
  },
  {
    id: "PROD-003",
    slug: "tactical-cargo-pant",
    name: "Tactical Ripstop Cargo Pant",
    description: "Durable ripstop fabric with multiple utilitarian pockets.",
    category: "Apparel",
    tags: ["cargo", "tactical", "pants"],
    basePrice: 1850,
    images: ["/images/products/cargo-1.jpg"],
    rating: 4.5,
    reviewCount: 89,
    badge: "low-stock",
    isFeatured: false,
    createdAt: "2023-11-12T00:00:00Z",
    variants: [
      { id: "VAR-003-30", sku: "TACT-CARGO-OD-30", size: "30", color: "Olive Drab", price: 1850, costPrice: 850, stock: 12, images: [] },
      { id: "VAR-003-32", sku: "TACT-CARGO-OD-32", size: "32", color: "Olive Drab", price: 1850, costPrice: 850, stock: 35, images: [] },
    ]
  },
  {
    id: "PROD-004",
    slug: "leather-cardholder",
    name: "Full Grain Leather Cardholder",
    description: "Minimalist full grain leather cardholder.",
    category: "Accessories",
    tags: ["leather", "wallet", "minimal"],
    basePrice: 1200,
    images: ["/images/products/wallet-1.jpg"],
    rating: 4.7,
    reviewCount: 210,
    isFeatured: true,
    createdAt: "2023-09-15T00:00:00Z",
    variants: [
      { id: "VAR-004-BLK", sku: "MIN-WALLET-BLK", color: "Black", price: 1200, costPrice: 450, stock: 3, images: [] },
      { id: "VAR-004-BRN", sku: "MIN-WALLET-BRN", color: "Brown", price: 1200, costPrice: 450, stock: 15, images: [] },
    ]
  },
  {
    id: "PROD-005",
    slug: "apex-pulse-runner",
    name: "Apex Pulse Runner Sneakers",
    description: "Lightweight and breathable running sneakers.",
    category: "Footwear",
    tags: ["sneakers", "running", "shoes"],
    basePrice: 3400,
    images: ["/images/products/sneaker-1.jpg"],
    rating: 4.6,
    reviewCount: 45,
    badge: "new",
    isFeatured: true,
    createdAt: "2024-01-20T00:00:00Z",
    variants: [
      { id: "VAR-005-41", sku: "SNEAK-RUN-WHT-41", size: "41", color: "White", price: 3400, costPrice: 1600, stock: 10, images: [] },
      { id: "VAR-005-42", sku: "SNEAK-RUN-WHT-42", size: "42", color: "White", price: 3400, costPrice: 1600, stock: 14, images: [] },
    ]
  },
  {
    id: "PROD-006",
    slug: "raw-denim-jacket",
    name: "Raw Selvedge Denim Jacket",
    description: "Classic selvedge denim jacket, unwashed and rigid.",
    category: "Apparel",
    tags: ["denim", "jacket", "selvedge"],
    basePrice: 3100,
    images: ["/images/products/denim-1.jpg"],
    rating: 4.9,
    reviewCount: 78,
    isFeatured: false,
    createdAt: "2023-12-05T00:00:00Z",
    variants: [
      { id: "VAR-006-M", sku: "DENIM-JACK-BLU-M", size: "M", color: "Indigo", price: 3100, costPrice: 1450, stock: 19, images: [] },
      { id: "VAR-006-L", sku: "DENIM-JACK-BLU-L", size: "L", color: "Indigo", price: 3100, costPrice: 1450, stock: 12, images: [] },
    ]
  },
  {
    id: "PROD-007",
    slug: "supima-cotton-polo",
    name: "Supima Cotton Polo",
    description: "Ultra-soft Supima cotton polo shirt.",
    category: "Apparel",
    tags: ["polo", "cotton", "summer"],
    basePrice: 1100,
    images: ["/images/products/polo-1.jpg"],
    rating: 4.4,
    reviewCount: 156,
    isFeatured: false,
    createdAt: "2023-08-10T00:00:00Z",
    variants: [
      { id: "VAR-007-L", sku: "MIN-POLO-WHT-L", size: "L", color: "White", price: 1100, costPrice: 500, stock: 50, images: [] },
      { id: "VAR-007-XL", sku: "MIN-POLO-WHT-XL", size: "XL", color: "White", price: 1100, costPrice: 500, stock: 32, images: [] },
    ]
  },
  {
    id: "PROD-008",
    slug: "ceramic-teaware-set",
    name: "Handmade Ceramic Teaware Set",
    description: "6-piece handmade ceramic teaware set.",
    category: "Home",
    tags: ["home", "ceramic", "tea"],
    basePrice: 4200,
    images: ["/images/products/tea-1.jpg"],
    rating: 4.8,
    reviewCount: 22,
    badge: "sale",
    isFeatured: false,
    createdAt: "2024-02-14T00:00:00Z",
    variants: [
      { id: "VAR-008", sku: "PREM-TEA-SET-6P", color: "Earthy Brown", price: 3800, costPrice: 1500, stock: 8, images: [] },
    ]
  },
  {
    id: "PROD-009",
    slug: "duck-canvas-tote",
    name: "Heavy Duck Canvas Tote",
    description: "Everyday carry tote bag made of heavy duck canvas.",
    category: "Accessories",
    tags: ["bag", "canvas", "tote"],
    basePrice: 850,
    images: ["/images/products/tote-1.jpg"],
    rating: 4.5,
    reviewCount: 300,
    isFeatured: false,
    createdAt: "2023-07-22T00:00:00Z",
    variants: [
      { id: "VAR-009", sku: "CANV-TOTE-NAT", color: "Natural", price: 850, costPrice: 350, stock: 120, images: [] },
    ]
  },
  {
    id: "PROD-010",
    slug: "brass-carabiner-keyring",
    name: "Matte Brass Carabiner Keyring",
    description: "Solid brass carabiner for keys.",
    category: "Accessories",
    tags: ["keyring", "brass"],
    basePrice: 550,
    images: ["/images/products/keyring-1.jpg"],
    rating: 4.6,
    reviewCount: 112,
    isFeatured: false,
    createdAt: "2023-09-05T00:00:00Z",
    variants: [
      { id: "VAR-010", sku: "KEY-CHAIN-BRS", color: "Brass", price: 550, costPrice: 200, stock: 45, images: [] },
    ]
  },
  {
    id: "PROD-011",
    slug: "windbreaker-windrunner",
    name: "Vintage Windbreaker Windrunner",
    description: "Retro styled nylon windbreaker.",
    category: "Apparel",
    tags: ["retro", "jacket", "windbreaker"],
    basePrice: 2850,
    images: ["/images/products/windbreaker-1.jpg"],
    rating: 4.2,
    reviewCount: 34,
    isFeatured: false,
    createdAt: "2023-11-20T00:00:00Z",
    variants: [
      { id: "VAR-011-L", sku: "RETRO-JACKET-NVY-L", size: "L", color: "Navy", price: 2850, costPrice: 1200, stock: 15, images: [] },
      { id: "VAR-011-XL", sku: "RETRO-JACKET-NVY-XL", size: "XL", color: "Navy", price: 2850, costPrice: 1200, stock: 5, images: [] },
    ]
  },
  {
    id: "PROD-012",
    slug: "wireless-earbuds-pro",
    name: "Aura Pro Wireless Earbuds",
    description: "Noise cancelling wireless earbuds with premium sound.",
    category: "Electronics",
    tags: ["audio", "wireless", "earbuds"],
    basePrice: 4500,
    images: ["/images/products/earbuds-1.jpg"],
    rating: 4.7,
    reviewCount: 420,
    badge: "bestseller",
    isFeatured: true,
    createdAt: "2024-03-01T00:00:00Z",
    variants: [
      { id: "VAR-012-BLK", sku: "AURA-BUDS-BLK", color: "Obsidian Black", price: 4500, costPrice: 2000, stock: 80, images: [] },
      { id: "VAR-012-WHT", sku: "AURA-BUDS-WHT", color: "Frost White", price: 4500, costPrice: 2000, stock: 65, images: [] },
    ]
  }
];

class ProductsService {
  private products: Product[] = [...INITIAL_PRODUCTS];

  private async delay(ms: number = 200) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getProducts(filters?: { category?: string; search?: string; sort?: string; page?: number; limit?: number }): Promise<{ products: Product[]; total: number }> {
    await this.delay(150);
    
    let result = [...this.products];

    if (filters?.category && filters.category !== 'All') {
      result = result.filter(p => p.category.toLowerCase() === filters.category!.toLowerCase());
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q) ||
        p.tags.some(t => t.includes(q))
      );
    }

    if (filters?.sort) {
      if (filters.sort === 'price-asc') {
        result.sort((a, b) => a.basePrice - b.basePrice);
      } else if (filters.sort === 'price-desc') {
        result.sort((a, b) => b.basePrice - a.basePrice);
      } else if (filters.sort === 'newest') {
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }
    }

    const page = filters?.page || 1;
    const limit = filters?.limit || 12;
    const startIndex = (page - 1) * limit;
    
    const paginatedProducts = result.slice(startIndex, startIndex + limit);

    return {
      products: paginatedProducts,
      total: result.length
    };
  }

  async getProductBySlug(slug: string): Promise<Product | null> {
    await this.delay(100);
    return this.products.find(p => p.slug === slug) || null;
  }

  async getFeaturedProducts(): Promise<Product[]> {
    await this.delay(100);
    return this.products.filter(p => p.isFeatured).slice(0, 4);
  }

  async getCategories(): Promise<string[]> {
    await this.delay(50);
    const categories = new Set(this.products.map(p => p.category));
    return Array.from(categories);
  }

  async updateStock(variantId: string, delta: number): Promise<boolean> {
    await this.delay(200);
    let updated = false;
    this.products = this.products.map(p => {
      const vIndex = p.variants.findIndex(v => v.id === variantId);
      if (vIndex !== -1) {
        const variants = [...p.variants];
        variants[vIndex] = {
          ...variants[vIndex],
          stock: Math.max(0, variants[vIndex].stock + delta)
        };
        updated = true;
        return { ...p, variants };
      }
      return p;
    });
    return updated;
  }

  async createProduct(data: CreateProduct): Promise<Product> {
    await this.delay(300);
    
    const newProduct: Product = {
      ...data,
      id: `PROD-${Math.floor(Math.random() * 10000)}`,
      slug: data.name.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-'),
      createdAt: new Date().toISOString()
    };
    
    this.products.push(newProduct);
    return newProduct;
  }
}

export const productsService = new ProductsService();

export const getProducts = (filters?: { category?: string; search?: string; sort?: string; page?: number; limit?: number }) =>
  productsService.getProducts(filters);

export const getProductBySlug = (slug: string) =>
  productsService.getProductBySlug(slug);

export const getFeaturedProducts = () =>
  productsService.getFeaturedProducts();

export const getCategories = () =>
  productsService.getCategories();

export const getRelatedProducts = async (id: string, category: string): Promise<Product[]> => {
  const { products } = await productsService.getProducts({ category });
  return products.filter((p) => p.id !== id).slice(0, 4);
};

export const createProduct = (data: any) => productsService.createProduct(data);
export const updateStock = (variantId: string, delta: number) => productsService.updateStock(variantId, delta);


