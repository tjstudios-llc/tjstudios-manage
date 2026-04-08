'use client'

import * as React from 'react'
import {
  Image as ImageIcon,
  Search,
  RefreshCw,
  Download,
  Trash2,
  Play,
  Eye,
  MoreHorizontal,
  X,
  AlertCircle,
  Tag,
  Calendar,
  HardDrive,
  Layers,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'

// Types
interface DockerImage {
  id: string
  repository: string
  tag: string
  size: string
  created: string
  layers: number
  labels: Record<string, string>
}

// Empty state component
function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType
  title: string
  description: string
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-muted p-4">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-sm">{description}</p>
    </div>
  )
}

// Table skeleton
function TableSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center gap-4 py-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24 ml-auto" />
        </div>
      ))}
    </div>
  )
}

function ImageInspectSheet({
  image,
  open,
  onOpenChange,
}: {
  image: DockerImage | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  if (!image) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-primary" />
            {image.repository}:{image.tag}
          </SheetTitle>
          <SheetDescription>
            Image details and layer information
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-120px)] pr-4">
          <div className="space-y-6 py-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground">Image Information</h4>
              <div className="grid gap-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">ID</span>
                  <code className="rounded bg-muted px-2 py-0.5 text-xs font-mono">
                    {image.id.slice(0, 12)}
                  </code>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Repository</span>
                  <span className="font-medium text-foreground">{image.repository}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tag</span>
                  <Badge variant="outline">{image.tag}</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Size</span>
                  <span className="text-foreground">{image.size}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Layers</span>
                  <span className="text-foreground">{image.layers}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Created</span>
                  <span className="text-foreground">
                    {new Date(image.created).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Labels */}
            {Object.keys(image.labels).length > 0 && (
              <>
                <Separator />
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-foreground">Labels</h4>
                  <div className="space-y-2">
                    {Object.entries(image.labels).map(([key, value]) => (
                      <div key={key} className="flex justify-between text-sm">
                        <code className="text-xs text-muted-foreground">{key}</code>
                        <code className="rounded bg-muted px-2 py-0.5 text-xs max-w-[200px] truncate">
                          {value}
                        </code>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

function PullImageDialog({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = React.useState(false)
  const [isPulling, setIsPulling] = React.useState(false)
  const [pullProgress, setPullProgress] = React.useState(0)
  const [imageName, setImageName] = React.useState('')

  const handlePull = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsPulling(true)
    setPullProgress(0)

    try {
      // TODO: Replace with actual API call with SSE for progress
      // const eventSource = new EventSource(`/api/docker/images/pull?image=${encodeURIComponent(imageName)}`)
      // eventSource.onmessage = (event) => {
      //   const data = JSON.parse(event.data)
      //   if (data.progress) setPullProgress(data.progress)
      //   if (data.complete) {
      //     eventSource.close()
      //     setOpen(false)
      //     onSuccess()
      //   }
      // }

      // Simulate pull progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise((resolve) => setTimeout(resolve, 200))
        setPullProgress(i)
      }
      
      setOpen(false)
      setImageName('')
      onSuccess()
    } catch (error) {
      console.error('Failed to pull image:', error)
    } finally {
      setIsPulling(false)
      setPullProgress(0)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Download className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Pull Image</span>
          <span className="sm:hidden">Pull</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5 text-primary" />
            Pull Image
          </DialogTitle>
          <DialogDescription>
            Download a Docker image from a registry.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handlePull} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="imageName">Image Name <span className="text-destructive">*</span></Label>
            <Input
              id="imageName"
              placeholder="e.g., nginx:latest, postgres:16-alpine"
              value={imageName}
              onChange={(e) => setImageName(e.target.value)}
              required
              disabled={isPulling}
            />
            <p className="text-xs text-muted-foreground">
              Format: repository:tag or registry/repository:tag
            </p>
          </div>
          
          {isPulling && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Pulling image...</span>
                <span className="font-medium text-foreground">{pullProgress}%</span>
              </div>
              <Progress value={pullProgress} className="h-2" />
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isPulling}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPulling}>
              {isPulling ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Pulling...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Pull Image
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function RunContainerDialog({ image, onSuccess }: { image: DockerImage; onSuccess: () => void }) {
  const [open, setOpen] = React.useState(false)
  const [isCreating, setIsCreating] = React.useState(false)
  const [containerName, setContainerName] = React.useState('')
  const [ports, setPorts] = React.useState('')

  const handleRun = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsCreating(true)

    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/docker/containers', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     image: `${image.repository}:${image.tag}`,
      //     name: containerName || undefined,
      //     ports: ports.split(',').map(p => p.trim()).filter(Boolean),
      //   }),
      // })
      // if (!response.ok) throw new Error('Failed to create container')

      await new Promise((resolve) => setTimeout(resolve, 1000))
      
      setOpen(false)
      setContainerName('')
      setPorts('')
      onSuccess()
    } catch (error) {
      console.error('Failed to run container:', error)
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <Play className="mr-2 h-4 w-4" />
          Run Container
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Play className="h-5 w-5 text-primary" />
            Run Container
          </DialogTitle>
          <DialogDescription>
            Create and start a new container from {image.repository}:{image.tag}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleRun} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="containerName">Container Name</Label>
            <Input
              id="containerName"
              placeholder="Leave empty for auto-generated"
              value={containerName}
              onChange={(e) => setContainerName(e.target.value)}
              disabled={isCreating}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ports">Port Mappings</Label>
            <Input
              id="ports"
              placeholder="e.g., 8080:80, 443:443"
              value={ports}
              onChange={(e) => setPorts(e.target.value)}
              disabled={isCreating}
            />
            <p className="text-xs text-muted-foreground">
              Comma-separated host:container port pairs
            </p>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isCreating}>
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating}>
              {isCreating ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Run
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default function ImagesPage() {
  const [images, setImages] = React.useState<DockerImage[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [searchQuery, setSearchQuery] = React.useState('')
  const [isRefreshing, setIsRefreshing] = React.useState(false)
  const [selectedImage, setSelectedImage] = React.useState<DockerImage | null>(null)
  const [inspectOpen, setInspectOpen] = React.useState(false)

  const fetchImages = React.useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setIsRefreshing(true)
    } else {
      setLoading(true)
    }
    setError(null)

    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/docker/images')
      // if (!response.ok) throw new Error('Failed to fetch images')
      // const data = await response.json()
      // setImages(data.images)

      await new Promise((resolve) => setTimeout(resolve, 500))
      setImages([])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }, [])

  React.useEffect(() => {
    fetchImages()
  }, [fetchImages])

  const filteredImages = React.useMemo(() => {
    return images.filter((image) =>
      image.repository.toLowerCase().includes(searchQuery.toLowerCase()) ||
      image.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      image.id.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [images, searchQuery])

  const handleDeleteImage = async (image: DockerImage) => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/docker/images/${image.id}`, {
      //   method: 'DELETE',
      // })
      // if (!response.ok) throw new Error('Failed to delete image')

      await new Promise((resolve) => setTimeout(resolve, 1000))
      await fetchImages(true)
    } catch (error) {
      console.error('Failed to delete image:', error)
    }
  }

  const handleInspect = (image: DockerImage) => {
    setSelectedImage(image)
    setInspectOpen(true)
  }

  // Calculate stats
  const totalSize = images.reduce((acc, img) => {
    const sizeMatch = img.size.match(/^([\d.]+)/)
    return acc + (sizeMatch ? parseFloat(sizeMatch[1]) : 0)
  }, 0)
  const totalLayers = images.reduce((acc, img) => acc + img.layers, 0)

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Images
          </h1>
          <p className="text-muted-foreground">
            Manage Docker images
          </p>
        </div>
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <AlertCircle className="h-12 w-12 text-destructive" />
            <h3 className="mt-4 text-lg font-semibold text-foreground">
              Failed to load images
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">{error}</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => fetchImages()}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Images
          </h1>
          <p className="text-muted-foreground">
            Manage Docker images
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => fetchImages(true)}
            disabled={isRefreshing}
            className="shrink-0"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="sr-only">Refresh</span>
          </Button>
          <PullImageDialog onSuccess={() => fetchImages(true)} />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Images</p>
                {loading ? (
                  <Skeleton className="h-8 w-8 mt-1" />
                ) : (
                  <p className="text-2xl font-bold text-foreground">{images.length}</p>
                )}
              </div>
              <div className="rounded-full bg-primary/10 p-2">
                <ImageIcon className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Size</p>
                {loading ? (
                  <Skeleton className="h-8 w-16 mt-1" />
                ) : (
                  <p className="text-2xl font-bold text-foreground">{totalSize.toFixed(1)} GB</p>
                )}
              </div>
              <div className="rounded-full bg-amber-100 p-2 dark:bg-amber-900">
                <HardDrive className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Layers</p>
                {loading ? (
                  <Skeleton className="h-8 w-12 mt-1" />
                ) : (
                  <p className="text-2xl font-bold text-foreground">{totalLayers}</p>
                )}
              </div>
              <div className="rounded-full bg-purple-100 p-2 dark:bg-purple-900">
                <Layers className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search images by repository, tag, or ID..."
              className="pl-9 pr-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
                onClick={() => setSearchQuery('')}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Clear search</span>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Images Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-primary" />
            Image List
          </CardTitle>
          <CardDescription>
            {loading
              ? 'Loading images...'
              : `${filteredImages.length} image${filteredImages.length !== 1 ? 's' : ''} found`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <TableSkeleton />
          ) : filteredImages.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Repository</TableHead>
                    <TableHead>Tag</TableHead>
                    <TableHead className="hidden sm:table-cell">ID</TableHead>
                    <TableHead className="hidden md:table-cell">Size</TableHead>
                    <TableHead className="hidden lg:table-cell">Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredImages.map((image) => (
                    <TableRow key={image.id}>
                      <TableCell>
                        <span className="font-medium text-foreground">{image.repository}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="gap-1">
                          <Tag className="h-3 w-3" />
                          {image.tag}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <code className="text-xs text-muted-foreground font-mono">
                          {image.id.slice(0, 12)}
                        </code>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground">
                        {image.size}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(image.created).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleInspect(image)}
                          >
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">Inspect</span>
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">More actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-44">
                              <RunContainerDialog image={image} onSuccess={() => fetchImages(true)} />
                              <DropdownMenuItem onClick={() => handleInspect(image)}>
                                <Eye className="mr-2 h-4 w-4" />
                                Inspect
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem
                                    className="text-destructive focus:text-destructive"
                                    onSelect={(e) => e.preventDefault()}
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Image</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete <span className="font-semibold">{image.repository}:{image.tag}</span>?
                                      This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      onClick={() => handleDeleteImage(image)}
                                    >
                                      Delete Image
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : images.length === 0 ? (
            <EmptyState
              icon={ImageIcon}
              title="No images found"
              description="Pull your first image from a Docker registry to get started."
            />
          ) : (
            <EmptyState
              icon={Search}
              title="No matching images"
              description="Try adjusting your search criteria."
            />
          )}
        </CardContent>
      </Card>

      {/* Inspect Sheet */}
      <ImageInspectSheet
        image={selectedImage}
        open={inspectOpen}
        onOpenChange={setInspectOpen}
      />
    </div>
  )
}
