'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { DashboardNavbar } from '@/components/dashboard/navbar'
import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { MobileSidebar } from '@/components/dashboard/mobile-sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false)
  const [mobileOpen, setMobileOpen] = React.useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <DashboardNavbar onMenuClick={() => setMobileOpen(true)} />

      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <DashboardSidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar open={mobileOpen} onOpenChange={setMobileOpen} />

      {/* Main Content */}
      <main
        className={cn(
          'min-h-[calc(100vh-4rem)] pt-16 transition-all duration-300 ease-in-out',
          sidebarCollapsed ? 'md:pl-16' : 'md:pl-64'
        )}
      >
        <div className="p-4 md:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  )
}
