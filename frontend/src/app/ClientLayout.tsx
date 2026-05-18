"use client";
import { usePathname } from 'next/navigation';
import Navbar from '../components/Navbar';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');

  return (
    <>
      {!isAdminPage && <Navbar />}
      <main className={!isAdminPage ? "pt-24" : ""}>
        {children}
      </main>
    </>
  );
}
