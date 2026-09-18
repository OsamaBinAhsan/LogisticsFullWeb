import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/lib/context/cart-context';
import { WishlistProvider } from '@/lib/context/wishlist-context';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: { default: 'AuraCommerce', template: '%s | AuraCommerce' },
  description: 'Premium multi-channel e-commerce platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>
        <CartProvider>
          <WishlistProvider>
            {children}
            <Toaster />
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
