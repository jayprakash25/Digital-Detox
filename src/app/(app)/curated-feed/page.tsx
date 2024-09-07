'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Bell, Youtube, ArrowLeft, ChevronUp, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import Image from 'next/image'
import axios from 'axios'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Link from 'next/link'
import { signOut } from 'next-auth/react'

interface VideoMetadata {
  id: string
  title: string
  thumbnail: string
  channelTitle: string
  publishedTime: Date
}

interface VideoDetails {
  id: string
  title: string
  description: string
  embedUrl: string
}

interface VideoGridProps {
  videos: VideoMetadata[]
  loading: boolean
  handleVideoClick: (videoId: string) => void
  lastVideoElementRef: (node: HTMLDivElement | null) => void
  hasMore: boolean
}

const CuratedFeedPage = () => {
  const [videos, setVideos] = useState<VideoMetadata[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedVideo, setSelectedVideo] = useState<VideoDetails | null>(null)
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)
  const [videoLoad, setVideoLoad] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [nextPageToken, setNextPageToken] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)

  const observer = useRef<IntersectionObserver | null>(null)
  const lastVideoElementRef = useCallback((node: HTMLDivElement | null) => {
    if (loading) return
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        fetchCuratedVideos()
      }
    })
    if (node) observer.current.observe(node)
  }, [loading, hasMore])

  useEffect(() => {
    fetchCuratedVideos()
  }, [])


  useEffect(() => {
    if (videoLoad) {
      const interval = setInterval(incrementLoadingProgress, 100)
      return () => clearInterval(interval)
    } else {
      setLoadingProgress(0)
    }
  }, [videoLoad])

  const fetchCuratedVideos = async () => {
    setLoading(true)
    setVideoLoad(true)
    try {
      const response = await fetch(`/api/curated-feed${nextPageToken ? `?pageToken=${nextPageToken}` : ''}`)
      const data = await response.json()
      if (data.success) {
        setVideos(prevVideos => [...prevVideos, ...data.videos])
        setNextPageToken(data.nextPageToken)
        setHasMore(!!data.nextPageToken)
      } else {
        console.error('Failed to fetch curated videos:', data.message)
      }
    } catch (error) {
      console.error('Error fetching curated videos:', error)
    } finally {
      setVideoLoad(false)
      setLoading(false)
    }
  }

  const handleVideoClick = async (videoId: string) => {
    try {
      setVideoLoad(true)
      const response = await axios.get(`/api/video-details/${videoId}`)
      if (response.data) {
        setSelectedVideo(response.data.video)
      } else {
        console.error('Failed to fetch video details:', response.data.message)
      }
    } catch (error) {
      console.error('Error fetching video details:', error)
    } finally {
      setVideoLoad(false)
    }
  }

  const incrementLoadingProgress = () => {
    setLoadingProgress((oldProgress) => {
      const newProgress = oldProgress + 5
      return newProgress > 100 ? 100 : newProgress
    })
  }

  const toggleDescription = () => setIsDescriptionExpanded(!isDescriptionExpanded)

  const onBack = () => setSelectedVideo(null)

  return (
    <div className="bg-[#0f0f0f] min-h-screen text-white ">
    {videoLoad && <LoadingBar progress={loadingProgress} />}
    <div className='px-4 md:px-10'>
      <Header/>
      <main className="md:p-4">
        {selectedVideo ? (
          <VideoPlayer video={selectedVideo} onBack={onBack} isDescriptionExpanded={isDescriptionExpanded} toggleDescription={toggleDescription} />
        ) : (
          <VideoGrid videos={videos} loading={loading} handleVideoClick={handleVideoClick} lastVideoElementRef={lastVideoElementRef} hasMore/>
        )}
      </main>
      </div>
    </div>
  )
}

const Header = () => (
  <header className="sticky top-0 z-10 bg-[#0f0f0f]  pb-0 pt-1">
    <div className="flex items-center md:p-4 justify-between">
      <div className="flex items-center space-x-4 cursor-pointer">
        <Youtube className="h-6 w-6 text-red-600" />
        <span className="font-bold text-xl">CuratedTube</span>
      </div>
      <div className="flex items-center space-x-4">
        <UserMenu />
      </div>
    </div>
  </header>
)

const LoadingBar = ({ progress }: {progress: number}) => (
  <div className="sticky z-20 top-0 left-0 w-full h-0.5 bg-[#303030]">
    <div 
      className="h-full bg-cyan-500 transition-all duration-300 ease-out"
      style={{ width: `${progress}%` }}
    />
  </div>
)

const UserMenu = () => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Avatar className="h-9 w-9 bg-black cursor-pointer">
        <AvatarImage src="/placeholder-user.jpg" alt="@shadcn" />
        <AvatarFallback>JP</AvatarFallback>
        <span className="sr-only">Toggle user menu</span>
      </Avatar>
    </DropdownMenuTrigger>
    <DropdownMenuContent className="bg-black border-0 rounded mr-10 hover:bg-none text-white">
      <DropdownMenuItem>
        <Link href="/interests" className="flex items-center gap-2" prefetch={false}>
          <div className="h-4 w-4" />
          <span>Change Interests</span>
        </Link>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem className="text-destructive" onClick={() => signOut()}>
        <Link href="#" className="flex items-center gap-2" prefetch={false}>
          <div className="h-4 w-4" />
          <span>Logout</span>
        </Link>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
)

const VideoPlayer = ({ video, onBack, isDescriptionExpanded, toggleDescription }: { video: VideoDetails, onBack: () => void, isDescriptionExpanded: boolean, toggleDescription: () => void }) => (
  <div className="md:flex relative gap-8 md:gap-12 w-full max-w-6xl mx-auto py-12 md:py-16">
    <div className="sticky top-0 rounded-lg md:max-w-2xl md:h-96 aspect-video">
      <iframe
        src={video.embedUrl}
        frameBorder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title={video.title}
        className="w-full h-full object-cover"
      />
    </div>
    <div className="flex-1 max-w-md space-y-4 rounded-xl p-4 md:space-y-6 overflow-y-auto bg-[#212121] text-white">
      <div>
        <h2 className="text-lg md:text-xl font-bold">{video.title}</h2>
        <div className="mt-2 md:mt-3 relative">
          <p className={`text-sm transition-all duration-300 ease-in-out ${isDescriptionExpanded ? '' : 'line-clamp-2'}`}>
            {formatDescription(video.description)}
          </p>
          <Button variant="ghost" size="sm" onClick={toggleDescription} className="mt-2 flex items-center gap-1 rounded duration-200">
            {isDescriptionExpanded ? (
              <>Read less <ChevronUp className="w-4 h-4" /></>
            ) : (
              <>Read more <ChevronDown className="w-4 h-4" /></>
            )}
          </Button>
        </div>
      </div>
      <Button onClick={onBack} className="mt-4 flex bg-white rounded text-black hover:bg-white items-center gap-2">
        <ArrowLeft className="w-4 h-4" />
        Back to Feed
      </Button>
    </div>
  </div>
)


const VideoGrid: React.FC<VideoGridProps> = ({ videos, loading, handleVideoClick, lastVideoElementRef, hasMore }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-8 gap-4">
    {videos.map((video, index) => (
      <div 
        key={video.id} 
        ref={index === videos.length - 1 ? lastVideoElementRef : null}
      >
        <VideoCard video={video} onClick={() => handleVideoClick(video.id)} />
      </div>
    ))}
    {(loading || hasMore) && (
      <div className="col-span-full">
        <div className="grid grid-cols-3 gap-3 items-center p-4">
        <VideoSkeleton />
        <VideoSkeleton />
        <VideoSkeleton />
        </div>
      </div>
    )}
  </div>
)

const VideoSkeleton = () => (
  <div className="space-y-2">
    <Skeleton className="h-52 w-full" />
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-4 w-2/4" />
  </div>
)

const VideoCard = ({ video, onClick }: { video: VideoMetadata, onClick: () => void }) => (
  <div className="space-y-2 cursor-pointer" onClick={onClick}>
    <div className="relative aspect-video">
      <Image
        src={video.thumbnail}
        alt={video.title}
        layout="fill"
        objectFit="cover"
        className="rounded-2xl"
      />
    </div>
    <h3 className="font-semibold line-clamp-2">{video.title}</h3>
    <div className="flex items-center space-x-1">
      <p className="text-sm text-gray-400">{video.channelTitle}</p>
      <p> · </p>
      <p className="text-sm text-gray-400">{timeSince(video.publishedTime)}</p>
    </div>
  </div>
)

const formatDescription = (description: string) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g
  const lines = description.split('\n')

  return lines.map((line, index) => {
    const formattedLine = line.replace(
      urlRegex,
      (url) =>
        `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline inline-flex items-center">
          ${url}<ExternalLink class="w-3 h-3 ml-1" />
        </a>`
    )

    return (
      <React.Fragment key={index}>
        {index > 0 && <br />}
        <span dangerouslySetInnerHTML={{ __html: formattedLine }} />
      </React.Fragment>
    )
  })
}

const timeSince = (date: Date) => {
  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
    { label: 'second', seconds: 1 }
  ]

  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  const interval = intervals.find(i => i.seconds < seconds)

  if (interval) {
    const count = Math.floor(seconds / interval.seconds)
    return `${count} ${interval.label}${count !== 1 ? 's' : ''} ago`
  }

  return 'Just now'
}

export default CuratedFeedPage