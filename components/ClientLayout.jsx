'use client'

import { usePathname } from 'next/navigation'
import OpenCodeChat from '@/components/OpenCodeChat'

function Footer() {
  return (
    <footer className="text-center py-4 text-sm text-gray-500 dark:text-gray-400">
      © 2026 Dinamiz TIC. Derechos reservados a Luis E. De La Cruz F.
    </footer>
  )
}

export default function ClientLayout({ children }) {
  const pathname = usePathname()
  const showChat = pathname !== '/login'
  
  return (
    <>
      {children}
      {showChat && (
        <>
          <OpenCodeChat />
          <Footer />
        </>
      )}
      {!showChat && (
        <footer className="fixed bottom-0 w-full text-center py-2 text-xs text-gray-400">
          © 2026 Dinamiz TIC. Derechos reservados a Luis E. De La Cruz F.
        </footer>
      )}
    </>
  )
}
