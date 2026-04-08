'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Box,
  Network,
  HardDrive,
  Image,
  Code2,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface NavItem {
  title: string
  href: string
  icon: React.ElementType
}

const navItems: NavItem[] = [
  { title: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { title: 'Containers', href: '/dashboard/containers', icon: Box },
  { title: 'Networks', href: '/dashboard/networks', icon: Network },
  { title: 'Volumes', href: '/dashboard/volumes', icon: HardDrive },
  { title: 'Images', href: '/dashboard/images', icon: Image },
  { title: 'Compose Stacks', href: '/dashboard/stacks', icon: Code2 },
  { title: 'Coding Environments', href: '/dashboard/environments', icon: Code2 },
  { title: 'User Management', href: '/dashboard/users', icon: Users },
  { title: 'Settings', href: '/dashboard/settings', icon: Settings },
]

interface DashboardSidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export function DashboardSidebar({ collapsed, onToggle }: DashboardSidebarProps) {
  const pathname = usePathname()

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          'fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] border-r border-border bg-sidebar transition-all duration-300 ease-in-out',
          collapsed ? 'w-16' : 'w-64'
        )}
      >
        {/* Toggle Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="absolute -right-3 top-6 z-50 hidden h-6 w-6 rounded-full border border-border bg-background shadow-md hover:bg-accent md:flex"
        >
          {collapsed ? (
            <ChevronRight className="h-3 w-3 text-foreground" />
          ) : (
            <ChevronLeft className="h-3 w-3 text-foreground" />
          )}
          <span className="sr-only">Toggle sidebar</span>
        </Button>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 p-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/dashboard' && pathname.startsWith(item.href))
            const Icon = item.icon

            const linkContent = (
              <Link
                href={item.href}
                className={cn(
                  'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'border-l-[3px] border-primary bg-primary/10 text-primary'
                    : 'border-l-[3px] border-transparent text-muted-foreground hover:bg-accent hover:text-foreground',
                  collapsed && 'justify-center px-2'
                )}
              >
                <Icon
                  className={cn(
                    'h-5 w-5 shrink-0 transition-colors',
                    isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
                  )}
                />
                {!collapsed && (
                  <span className="truncate">{item.title}</span>
                )}
              </Link>
            )

            if (collapsed) {
              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                  <TooltipContent side="right" className="font-medium">
                    {item.title}
                  </TooltipContent>
                </Tooltip>
              )
            }

            return <React.Fragment key={item.href}>{linkContent}</React.Fragment>
          })}
        </nav>

        {/* Footer */}
        {!collapsed && (
          <div className="absolute bottom-0 left-0 right-0 border-t border-border p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>Docker Engine Running</span>
            </div>
          </div>
        )}
      </aside>
    </TooltipProvider>
  )
}
