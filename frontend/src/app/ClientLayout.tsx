"use client";
import { usePathname } from 'next/navigation';
import Navbar from '../components/Navbar';
import FloatingSocials from '../components/FloatingSocials';
import Preloader from '../components/Preloader';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');
  const isProductPage = pathname?.startsWith('/product');
  const isHomePage = pathname === '/';

  // Apply pt-24 top padding to non-admin, non-home pages to push their content below the fixed navbar.
  // Home page starts at y=0 so the full-screen hero section gradient extends behind the floating navbar.
  const paddingClass = !isAdminPage && !isHomePage ? "pt-24" : "";
  const bgClass = "";
  const mainClassName = [paddingClass, bgClass].filter(Boolean).join(" ");

  return (
    <>
      <Preloader />
      {!isAdminPage && <Navbar />}
      {!isAdminPage && <FloatingSocials />}
      <main className={`${mainClassName || ""} relative z-10`}>
        {children}
      </main>
      {!isAdminPage && (
        <div className="fixed bottom-0 left-0 right-0 flex justify-center pointer-events-none z-50">
          <img
            src="/image/Milgan bottom.png"
            alt="Milgan Sanctuary Signature"
            className="w-full max-w-[40rem] sm:max-w-[60rem] md:max-w-[75rem] h-auto object-contain select-none opacity-100"
          />
        </div>
      )}
    </>
  );
}


