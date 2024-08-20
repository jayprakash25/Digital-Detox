"use client";
import React, { useState, useEffect } from "react";
import {
  Search,
  Menu,
  Bell,
  Youtube,
  Clock,
  Calendar,
  ArrowLeft,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import axios from "axios";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { signOut } from "next-auth/react";

interface VideoMetadata {
  id: string;
  title: string;
  thumbnail: string;
  channelTitle: string;
  publishedTime: Date;
}

interface VideoDetails {
  id: string;
  title: string;
  description: string;
  embedUrl: string;
}

const CuratedFeedPage = () => {
  const [videos, setVideos] = useState<VideoMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedVideo, setSelectedVideo] = useState<VideoDetails | null>(null);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const toggleDescription = () => {
    setIsDescriptionExpanded(!isDescriptionExpanded);
  };

  const categories = [
    "All",
    "Mahindra",
    "Test drives",
    "Music",
    "Machine learning",
    "Computer programming",
    "News",
    "Self-confidence",
    "Entrepreneurship",
    "Thoughts",
    "Money",
  ];

  useEffect(() => {
    const fetchCuratedVideos = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/curated-feed");
        const data = await response.json();
        if (data.success) {
          setVideos(data.videos);
        } else {
          console.error("Failed to fetch curated videos:", data.message);
        }
      } catch (error) {
        console.error("Error fetching curated videos:", error);
      }
      setLoading(false);
    };

    fetchCuratedVideos();
  }, []);

  const handleVideoClick = async (videoId: string) => {
    try {
      const response = await axios.get(`/api/video-details/${videoId}`);
      console.log(response);
      if (response.data) {
        setSelectedVideo(response.data.video);
        console.log(selectedVideo);
      } else {
        console.error("Failed to fetch video details:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching video details:", error);
    }
  };

  const timeSince = (date: Date) => {
    const currentDate = new Date();
    const videoDate = new Date(date);

    const differenceInMilliseconds =
      currentDate.getTime() - videoDate.getTime();

    const differenceInYears = Math.floor(
      differenceInMilliseconds / (1000 * 60 * 60 * 24 * 365)
    );
    if (differenceInYears > 0)
      return `${differenceInYears} year${differenceInYears > 1 ? "s" : ""} ago`;

    const differenceInMonths = Math.floor(
      differenceInMilliseconds / (1000 * 60 * 60 * 24 * 30)
    );
    if (differenceInMonths > 0) {
      return `${differenceInMonths} month${
        differenceInMonths > 1 ? "s" : ""
      } ago`;
    }

    const differenceInDays = Math.floor(
      differenceInMilliseconds / (1000 * 60 * 60 * 24)
    );
    if (differenceInDays > 0) {
      return `${differenceInDays} day${differenceInDays > 1 ? "s" : ""} ago`;
    }

    const differenceInHours = Math.floor(
      differenceInMilliseconds / (1000 * 60 * 60)
    );
    if (differenceInHours > 0) {
      return `${differenceInHours} hour${differenceInHours > 1 ? "s" : ""} ago`;
    }

    const differenceInMinutes = Math.floor(
      differenceInMilliseconds / (1000 * 60)
    );
    if (differenceInMinutes > 0) {
      return `${differenceInMinutes} minute${
        differenceInMinutes > 1 ? "s" : ""
      } ago`;
    }

    return `Just now`;
  };

  const onBack = () => {
    setSelectedVideo(null);
  };

  const formatDescription = (description: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const lines = description.split("\n");

    return lines.map((line, index) => {
      const formattedLine = line.replace(
        urlRegex,
        (url) =>
          `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline inline-flex items-center">
        ${url}<ExternalLink class="w-3 h-3 ml-1" />
      </a>`
      );

      return (
        <React.Fragment key={index}>
          {index > 0 && <br />}
          <span dangerouslySetInnerHTML={{ __html: formattedLine }} />
        </React.Fragment>
      );
    });
  };

  const logOut = () => {
    signOut();
  }
  return (
    <div className="bg-[#0f0f0f] min-h-screen text-white px-4  md:px-10">
      {/* Header and nav remain unchanged */}
      <header className="sticky top-0 z-10 bg-[#0f0f0f] md:p-4 pb-0 pt-2 ">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 cursor-pointer">
            {/* <Button variant="ghost" size="icon"><Menu className="h-6 w-6" /></Button> */}
            <Youtube className="h-6 w-6 text-red-600" />
            <span className="font-bold text-xl">CuratedTube</span>
          </div>
          {/* <div className="flex-grow mx-4 max-w-xl">
            <div className="relative hidden md:block">
              <Input
                type="text"
                placeholder="Search"
                className="w-full bg-[#121212] border-[#303030] focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0"
              >
                <Search className="h-5 w-5 text-[#9b9b9b] " />
              </Button>
            </div>
          </div> */}
          <div className="flex items-center space-x-4 ">
            <Button variant="ghost" size="icon">
              <Bell className="h-6 w-6" />
            </Button>
            <DropdownMenu >
              <DropdownMenuTrigger asChild>
                <Avatar className="h-9 w-9 bg-black cursor-pointer">
                  <AvatarImage src="/placeholder-user.jpg" alt="@shadcn" />
                  <AvatarFallback>JP</AvatarFallback>
                  <span className="sr-only">Toggle user menu</span>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-black border-0 hover:bg-none  text-white">
                <DropdownMenuItem>
                  <Link
                    href="/interests"
                    className="flex items-center gap-2"
                    prefetch={false}
                  >
                    <div className="h-4 w-4" />
                    <span>Change Interests</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="" />
                <DropdownMenuItem className="text-destructive" onClick={logOut}>
                  <Link
                    href="#"
                    className="flex items-center gap-2"
                    prefetch={false}
                  >
                    <div className="h-4 w-4" />
                    <span>Logout</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <nav className="flex items-center sticky top-0 space-x-2 p-4  overflow-hidden overflow-x-hidden">
          {categories.map((category) => (
            <Button
              key={category}
              // variant={activeCategory === category ? 'default' : 'secondary'}
              onClick={() => setActiveCategory(category)}
              className=" py-5 bg-[#212121] text-sm hover:bg-[#ffffff33]"
            >
              {category}
            </Button>
          ))}
        </nav>
      </header>

      <main className="md:p-4">
        {selectedVideo ? (
          <div className="flex relative  gap-8 md:gap-12 w-full max-w-6xl mx-auto py-12 md:py-16">
            <div className="sticky  top-0  rounded-lg max-w-2xl h-96  aspect-video">
              <iframe
                src={selectedVideo.embedUrl}
                frameBorder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={selectedVideo.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1  max-w-md space-y-4  rounded-xl p-4 md:space-y-6 overflow-y-auto  bg-[#212121] text-white">
              <div>
                <h2 className="text-lg md:text-xl font-bold">
                  {selectedVideo.title}
                </h2>
                {/* <p className=" mt-2 md:mt-3 text-sm">{selectedVideo.description}</p> */}
                <div className="mt-2 md:mt-3 relative">
                  <p
                    className={`text-sm  transition-all duration-300  ease-in-out ${
                      isDescriptionExpanded ? "" : "line-clamp-2"
                    }`}
                  >
                    {formatDescription(selectedVideo.description)}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleDescription}
                    className="mt-2 flex items-center gap-1  duration-200"
                  >
                    {isDescriptionExpanded ? (
                      <>
                        Read less <ChevronUp className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        Read more <ChevronDown className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
              <div className="space-y-2 md:space-y-3">
                <div className="flex items-center gap-2">
                  {/* <Clock className="w-5 h-5 text-muted-foreground" /> */}
                  {/* <span className="text-muted-foreground">{selectedVideo.}</span> */}
                </div>
                <div className="flex items-center gap-2">
                  {/* <Calendar className="w-5 h-5 text-muted-foreground" /> */}
                  {/* <span className="text-muted-foreground">{selectedVideo.releaseDate}</span> */}
                </div>
              </div>
              <Button
                onClick={onBack}
                className="mt-4 flex bg-white text-black hover:bg-white items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Feed
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-y-8 gap-4">
            {loading
              ? [...Array(8)].map((_, index) => (
                  <div key={index} className="space-y-2">
                    <Skeleton className="h-52 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-2/4" />
                  </div>
                ))
              : videos.map((video) => (
                  <div
                    key={video.id}
                    className="space-y-2 cursor-pointer"
                    onClick={() => handleVideoClick(video.id)}
                  >
                    <div className="relative aspect-video">
                      <Image
                        src={video.thumbnail}
                        alt={video.title}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-2xl"
                      />
                    </div>
                    <h3 className="font-semibold line-clamp-2">
                      {video.title}
                    </h3>
                    <div className=" flex  items-center space-x-1">
                      <p className="text-sm text-gray-400">
                        {video.channelTitle}
                      </p>
                      <p> · </p>
                      <p className="text-sm text-gray-400">
                        {timeSince(video.publishedTime)}
                      </p>
                    </div>
                  </div>
                ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default CuratedFeedPage;
