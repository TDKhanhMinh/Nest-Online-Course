"use client"

import Footer from "@/components/footer"
import Header from "@/components/header"
import { usePathname } from "next/navigation"

interface MainLayoutWrapperProps {
  children: React.ReactNode
}

export function MainLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Regex to check if the path contains 'instructor' or 'admin' as a segment
  // This handles /en/instructor, /vi/admin/dashboard, etc.
  const isExcludedRoute = /\/(instructor|admin)(\/|$)/.test(pathname || "")

  if (isExcludedRoute) {
    return <>{children}</>
  }

  return (
    <>
      <Header />
      <div className="flex-1">
        {children}
      </div>
      <Footer />
    </>
  )
}
