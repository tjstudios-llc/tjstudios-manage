import {
  Box,
  Network,
  HardDrive,
  Image,
  Play,
  Pause,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Cpu,
  MemoryStick,
  HardDriveDownload,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

// Sample data for the dashboard
const stats = [
  {
    title: 'Running Containers',
    value: '12',
    change: '+2',
    trend: 'up',
    icon: Box,
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/50',
  },
  {
    title: 'Networks',
    value: '5',
    change: '0',
    trend: 'neutral',
    icon: Network,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    title: 'Volumes',
    value: '8',
    change: '+1',
    trend: 'up',
    icon: HardDrive,
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-50 dark:bg-amber-950/50',
  },
  {
    title: 'Images',
    value: '24',
    change: '-3',
    trend: 'down',
    icon: Image,
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-50 dark:bg-purple-950/50',
  },
]

const containers = [
  {
    id: 'abc123def',
    name: 'nginx-proxy',
    image: 'nginx:latest',
    status: 'running',
    cpu: '2.3%',
    memory: '128MB',
    ports: '80:80, 443:443',
    uptime: '5d 12h',
  },
  {
    id: 'xyz789ghi',
    name: 'postgres-db',
    image: 'postgres:15',
    status: 'running',
    cpu: '5.1%',
    memory: '512MB',
    ports: '5432:5432',
    uptime: '5d 12h',
  },
  {
    id: 'mno456pqr',
    name: 'redis-cache',
    image: 'redis:7-alpine',
    status: 'running',
    cpu: '0.8%',
    memory: '64MB',
    ports: '6379:6379',
    uptime: '3d 8h',
  },
  {
    id: 'stu123vwx',
    name: 'app-backend',
    image: 'node:20-slim',
    status: 'paused',
    cpu: '0%',
    memory: '256MB',
    ports: '3000:3000',
    uptime: '1d 4h',
  },
  {
    id: 'yza789bcd',
    name: 'monitoring',
    image: 'grafana/grafana:latest',
    status: 'stopped',
    cpu: '0%',
    memory: '0MB',
    ports: '3001:3000',
    uptime: '-',
  },
]

const systemResources = {
  cpu: { used: 34, total: 100 },
  memory: { used: 8.2, total: 16 },
  disk: { used: 156, total: 500 },
}

function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline', icon: React.ElementType }> = {
    running: { variant: 'default', icon: Play },
    paused: { variant: 'secondary', icon: Pause },
    stopped: { variant: 'destructive', icon: AlertCircle },
  }

  const config = variants[status] || variants.stopped
  const Icon = config.icon

  return (
    <Badge variant={config.variant} className="gap-1 capitalize">
      <Icon className="h-3 w-3" />
      {status}
    </Badge>
  )
}

export default function DashboardOverview() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          Dashboard Overview
        </h1>
        <p className="text-muted-foreground">
          Monitor your Docker environment and manage resources efficiently.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`rounded-lg p-2 ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-foreground">{stat.value}</span>
                  {stat.trend !== 'neutral' && (
                    <span
                      className={`flex items-center text-sm font-medium ${
                        stat.trend === 'up'
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      {stat.trend === 'up' ? (
                        <ArrowUpRight className="h-4 w-4" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4" />
                      )}
                      {stat.change}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* System Resources */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                System Resources
              </CardTitle>
              <CardDescription>
                Current resource utilization of your Docker host
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              View Details
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            {/* CPU */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">CPU Usage</span>
                </div>
                <span className="text-sm font-semibold text-foreground">
                  {systemResources.cpu.used}%
                </span>
              </div>
              <Progress value={systemResources.cpu.used} className="h-2" />
            </div>

            {/* Memory */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MemoryStick className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">Memory</span>
                </div>
                <span className="text-sm font-semibold text-foreground">
                  {systemResources.memory.used}GB / {systemResources.memory.total}GB
                </span>
              </div>
              <Progress
                value={(systemResources.memory.used / systemResources.memory.total) * 100}
                className="h-2"
              />
            </div>

            {/* Disk */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HardDriveDownload className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">Disk Space</span>
                </div>
                <span className="text-sm font-semibold text-foreground">
                  {systemResources.disk.used}GB / {systemResources.disk.total}GB
                </span>
              </div>
              <Progress
                value={(systemResources.disk.used / systemResources.disk.total) * 100}
                className="h-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Containers Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Box className="h-5 w-5 text-primary" />
                Recent Containers
              </CardTitle>
              <CardDescription>
                Overview of your container instances
              </CardDescription>
            </div>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Box className="mr-2 h-4 w-4" />
              New Container
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden sm:table-cell">Image</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">CPU</TableHead>
                  <TableHead className="hidden md:table-cell">Memory</TableHead>
                  <TableHead className="hidden lg:table-cell">Ports</TableHead>
                  <TableHead className="hidden lg:table-cell">Uptime</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {containers.map((container) => (
                  <TableRow key={container.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground">{container.name}</span>
                        <span className="text-xs text-muted-foreground">{container.id}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <code className="rounded bg-muted px-1.5 py-0.5 text-xs text-foreground">
                        {container.image}
                      </code>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={container.status} />
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-foreground">{container.cpu}</TableCell>
                    <TableCell className="hidden md:table-cell text-foreground">{container.memory}</TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <code className="text-xs text-muted-foreground">{container.ports}</code>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-foreground">{container.uptime}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        Manage
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="group cursor-pointer transition-all hover:border-primary hover:shadow-md">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-primary/10 p-3 transition-colors group-hover:bg-primary/20">
              <Box className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground">Create Container</p>
              <p className="text-sm text-muted-foreground">Deploy a new instance</p>
            </div>
          </CardContent>
        </Card>

        <Card className="group cursor-pointer transition-all hover:border-primary hover:shadow-md">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-primary/10 p-3 transition-colors group-hover:bg-primary/20">
              <Image className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground">Pull Image</p>
              <p className="text-sm text-muted-foreground">Download from registry</p>
            </div>
          </CardContent>
        </Card>

        <Card className="group cursor-pointer transition-all hover:border-primary hover:shadow-md">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-primary/10 p-3 transition-colors group-hover:bg-primary/20">
              <Network className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground">Create Network</p>
              <p className="text-sm text-muted-foreground">Set up networking</p>
            </div>
          </CardContent>
        </Card>

        <Card className="group cursor-pointer transition-all hover:border-primary hover:shadow-md">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-primary/10 p-3 transition-colors group-hover:bg-primary/20">
              <HardDrive className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground">Create Volume</p>
              <p className="text-sm text-muted-foreground">Add persistent storage</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
