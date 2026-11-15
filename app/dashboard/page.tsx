import {
  Activity,
  Box,
  HardDrive,
  Image,
  Network,
  Server,
  ShieldAlert,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const plannedResources = [
  {
    title: 'Containers',
    description: 'Live container state, resource usage, logs, and lifecycle controls.',
    icon: Box,
  },
  {
    title: 'Images',
    description: 'Available images, image metadata, and registry operations.',
    icon: Image,
  },
  {
    title: 'Networks',
    description: 'Docker networks, connected containers, and network configuration.',
    icon: Network,
  },
  {
    title: 'Volumes',
    description: 'Persistent volumes, mount details, and storage usage.',
    icon: HardDrive,
  },
  {
    title: 'Host metrics',
    description: 'CPU, memory, disk, and host availability from a connected agent.',
    icon: Activity,
  },
]

export default function DashboardOverview() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Dashboard Overview
          </h1>
          <Badge variant="outline">Host not connected</Badge>
        </div>
        <p className="text-muted-foreground">
          Connect an authorized Docker host to view live infrastructure data.
        </p>
      </div>

      <Card className="border-dashed">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-amber-500/10 p-3">
              <ShieldAlert className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="space-y-1">
              <CardTitle>No Docker host connected</CardTitle>
              <CardDescription>
                Live container and system information is not available yet.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm leading-6 text-muted-foreground">
            This dashboard is not currently connected to a Docker Engine or TJ Studios host agent.
            Metrics, container lists, and resource counts are intentionally left empty rather than
            displaying sample values that could be mistaken for real infrastructure data.
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Server className="h-4 w-4" />
            <span>Connection status: awaiting host configuration</span>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Planned live resources</h2>
          <p className="text-sm text-muted-foreground">
            These sections will populate only after a secure host connection is established.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {plannedResources.map((resource) => {
            const Icon = resource.icon

            return (
              <Card key={resource.title}>
                <CardHeader className="flex flex-row items-start gap-3 space-y-0">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <CardTitle className="text-base">{resource.title}</CardTitle>
                    <CardDescription>{resource.description}</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
