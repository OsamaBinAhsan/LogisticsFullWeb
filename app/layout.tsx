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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-surface text-on-surface antialiased font-sans">
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
