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
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

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

interface MobileSidebarProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MobileSidebar({ open, onOpenChange }: MobileSidebarProps) {
  const pathname = usePathname()

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-72 p-0">
        <SheetHeader className="border-b border-border px-4 py-4">
          <SheetTitle className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-sky-600 shadow-lg shadow-primary/20">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-5 w-5 text-primary-foreground"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 12.5c0 1.5-1 2.5-2 2.5s-2-1-2-2.5c0-1.5 1-2.5 2-2.5s2 1 2 2.5z" />
                <path d="M2 12.5c0-1.5 1-2.5 2-2.5h14c1 0 2 1 2 2.5" />
                <rect x="6" y="7" width="3" height="3" rx="0.5" />
                <rect x="10.5" y="7" width="3" height="3" rx="0.5" />
                <rect x="6" y="11.5" width="3" height="3" rx="0.5" />
                <rect x="10.5" y="11.5" width="3" height="3" rx="0.5" />
              </svg>
            </div>
            <span className="text-lg font-semibold">tjstudios-manage</span>
          </SheetTitle>
        </SheetHeader>

        <nav className="flex flex-col gap-1 p-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/dashboard' && pathname.startsWith(item.href))
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => onOpenChange(false)}
                className={cn(
                  'group flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'border-l-[3px] border-primary bg-primary/10 text-primary'
                    : 'border-l-[3px] border-transparent text-muted-foreground hover:bg-accent hover:text-foreground'
                )}
              >
                <Icon
                  className={cn(
                    'h-5 w-5 shrink-0 transition-colors',
                    isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
                  )}
                />
                <span>{item.title}</span>
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-border p-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>Docker Engine Running</span>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
