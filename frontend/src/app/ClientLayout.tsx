"use client";
import { usePathname } from 'next/navigation';
import Navbar from '../components/Navbar';
import FloatingSocials from '../components/FloatingSocials';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');
  const isProductPage = pathname?.startsWith('/product');
  const isHomePage = pathname === '/';

  // Apply pt-24 top padding to non-admin, non-home pages to push their content below the fixed navbar.
  // Home page starts at y=0 so the full-screen hero section gradient extends behind the floating navbar.
  const paddingClass = !isAdminPage && !isHomePage ? "pt-24" : "";
  const bgClass = isProductPage ? "bg-[#FCFAF7]" : "";
  const mainClassName = [paddingClass, bgClass].filter(Boolean).join(" ");

  return (
    <>
      {!isAdminPage && <Navbar />}
      {!isAdminPage && <FloatingSocials />}
      <main className={mainClassName || undefined}>
        {children}
      </main>
    </>
  );
}


