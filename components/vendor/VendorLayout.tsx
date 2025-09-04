import type React from "react"
import VendorSidebar from "./VendorSidebar"
import ProtectedRoute from "@/components/auth/ProtectedRoute"

interface VendorLayoutProps {
  children: React.ReactNode
}

export default function VendorLayout({ children }: VendorLayoutProps) {
  return (
    <ProtectedRoute requiredRole="vendor">
      <div className="flex h-screen bg-background">
        <VendorSidebar />
        <main className="flex-1 md:ml-64 overflow-auto">
          <div className="p-6 pt-16 md:pt-6">{children}</div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
