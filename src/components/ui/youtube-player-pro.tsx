"use client";

import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, Volume2, Volume1, VolumeX, Maximize2, RotateCw, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface YouTubePlayerProProps {
  url: string;
  className?: string;
}

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: any;
  }
}

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
};

const extractVideoId = (url: string) => {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[7].length === 11) ? match[7] : null;
};

const YouTubePlayerPro: React.FC<YouTubePlayerProProps> = ({ url, className }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const iframeRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isEnded, setIsEnded] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [showControls, setShowControls] = useState<boolean>(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isReady, setIsReady] = useState<boolean>(false);

  const videoId = extractVideoId(url);

  useEffect(() => {
    if (!videoId) return;

    // Load YouTube API
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        initPlayer();
      };
    } else {
      initPlayer();
    }

    function initPlayer() {
      playerRef.current = new window.YT.Player(iframeRef.current, {
        videoId: videoId,
        playerVars: {
          autoplay: 0,
          controls: 0, // Hide default controls
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          rel: 0,
          iv_load_policy: 3,
        },
        events: {
          onReady: (event: any) => {
            setIsReady(true);
            setDuration(event.target.getDuration());
          },
          onStateChange: (event: any) => {
            // event.data: -1 unstarted, 0 ended, 1 playing, 2 paused, 3 buffering, 5 video cued
            if (event.data === 1) setIsPlaying(true);
            else if (event.data === 2) setIsPlaying(false);
            else if (event.data === 0) {
              setIsEnded(true);
              setIsPlaying(false);
            }
          },
        },
      });
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [videoId]);

  // Sync time
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && isReady && playerRef.current) {
      interval = setInterval(() => {
        const time = playerRef.current.getCurrentTime();
        const dur = playerRef.current.getDuration();
        setCurrentTime(time);
        setProgress((time / dur) * 100);
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isReady]);

  const togglePlay = () => {
    if (!isReady || !playerRef.current) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      if (isEnded) {
        playerRef.current.seekTo(0);
        setIsEnded(false);
      }
      playerRef.current.playVideo();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (percent: number) => {
    if (!isReady || !playerRef.current) return;
    const time = (percent / 100) * duration;
    playerRef.current.seekTo(time, true);
    setProgress(percent);
    setCurrentTime(time);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const toggleMute = () => {
    if (!isReady || !playerRef.current) return;
    if (isMuted) {
      playerRef.current.unMute();
      playerRef.current.setVolume(volume * 100);
    } else {
      playerRef.current.mute();
    }
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (val: number[]) => {
    if (!isReady || !playerRef.current) return;
    const newVol = val[0] / 100;
    playerRef.current.setVolume(val[0]);
    setVolume(newVol);
    if (val[0] === 0) {
      setIsMuted(true);
      playerRef.current.mute();
    } else if (isMuted) {
      setIsMuted(false);
      playerRef.current.unMute();
    }
  };

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isPlaying && showControls) {
      timeout = setTimeout(() => setShowControls(false), 3000);
    }
    return () => clearTimeout(timeout);
  }, [isPlaying, showControls]);

  return (
    <motion.div
      ref={containerRef}
      className={cn("relative w-full overflow-hidden rounded-xl bg-black group", className)}
      onMouseMove={() => setShowControls(true)}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      <div className="w-full h-full pointer-events-none">
          <div ref={iframeRef} className="w-full h-full" />
      </div>

      {/* Transparent Click Layer */}
      <div 
        className="absolute inset-0 z-10 cursor-pointer" 
        onClick={togglePlay}
      />

      {/* Play/Pause Overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
        <AnimatePresence>
            {!isPlaying && !isEnded && isReady && (
                <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 1.2, opacity: 0 }}
                    className="bg-primary/20 backdrop-blur-sm p-6 rounded-full border border-primary/30"
                >
                    <Play className="w-12 h-12 text-primary" />
                </motion.div>
            )}
        </AnimatePresence>
      </div>

      {/* Controls */}
      <AnimatePresence>
        {showControls && isReady && (
          <motion.div
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-[95%] backdrop-blur-xl bg-black/40 border border-white/10 rounded-2xl p-3 flex flex-col gap-3 z-30"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
          >
            {/* Progress */}
            <div
              className="relative w-full h-1.5 bg-white/20 rounded-full cursor-pointer overflow-hidden group/seek"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                handleSeek((x / rect.width) * 100);
              }}
            >
              <div className="absolute inset-y-0 left-0 bg-primary/30 opacity-0 group-hover/seek:opacity-100 transition-opacity w-full" />
              <motion.div
                className="absolute top-0 left-0 h-full bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary),0.5)]"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Control Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={togglePlay}>
                  {isEnded ? <RotateCw className="w-5 h-5" /> : isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </Button>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                      {isMuted ? <VolumeX className="w-5 h-5" /> : volume > 0.5 ? <Volume2 className="w-5 h-5" /> : <Volume1 className="w-5 h-5" />}
                    </Button>
                  </PopoverTrigger>
                    <PopoverContent className="w-32 bg-black/80 border-white/10 backdrop-blur-md p-3" side="top" align="center">
                      <Slider
                        value={[volume * 100]}  
                        onValueChange={handleVolumeChange}
                        step={1}
                        min={0}
                        max={100}
                        className="w-full"
                      />
                    </PopoverContent>
                </Popover>

                <span className="text-white/80 text-xs font-mono">
                  {formatTime(currentTime)} <span className="text-white/30">/</span> {formatTime(duration)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                      <Settings className="w-5 h-5" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="bg-black/90 border-white/10 backdrop-blur-md w-40 p-2" side="top" align="end">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] uppercase tracking-widest font-bold text-white/40 mb-1 px-2">Playback Speed</span>
                      {[0.5, 1, 1.5, 2].map((s) => (
                        <Button
                          key={s}
                          variant="ghost"
                          size="sm"
                          className={cn(
                            "w-full justify-start text-xs",
                            playbackSpeed === s ? "bg-primary/20 text-primary hover:bg-primary/30" : "text-white/70 hover:bg-white/5"
                          )}
                          onClick={() => {
                            if (playerRef.current) playerRef.current.setPlaybackRate(s);
                            setPlaybackSpeed(s);
                          }}
                        >
                          {s === 1 ? 'Normal' : `${s}x`}
                        </Button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>

                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={toggleFullscreen}>
                  <Maximize2 className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default YouTubePlayerPro;
