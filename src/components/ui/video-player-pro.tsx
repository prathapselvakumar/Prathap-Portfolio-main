"use client";

import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, Volume2, Volume1, VolumeX, Maximize2, RotateCw, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface VideoPlayerProProps {
  src: string;
  className?: string;
}

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
};

const VideoPlayerPro: React.FC<VideoPlayerProProps> = ({ src, className }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isEnded, setIsEnded] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [showControls, setShowControls] = useState<boolean>(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);

  // Play / Pause / Restart
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isEnded) {
      videoRef.current.currentTime = 0;
      setIsEnded(false);
    }
    isPlaying ? videoRef.current.pause() : videoRef.current.play();
    setIsPlaying(!isPlaying);
  };

  // Update progress and time
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const prog = (videoRef.current.currentTime / videoRef.current.duration) * 100;
    setProgress(isFinite(prog) ? prog : 0);
    setCurrentTime(videoRef.current.currentTime);
    setDuration(videoRef.current.duration || 0);
  };

  // Video ended
  const handleEnded = () => {
    setIsEnded(true);
    setIsPlaying(false);
  };

  // Seek
  const handleSeek = (percent: number) => {
    if (!videoRef.current) return;
    const time = (percent / 100) * (videoRef.current.duration || 0);
    if (isFinite(time)) videoRef.current.currentTime = time;
    setProgress(percent);
  };

  // Fullscreen
  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.error("Fullscreen request failed:", err);
      });
    } else {
      document.exitFullscreen().catch((err) => {
        console.error("Exit fullscreen failed:", err);
      });
    }
  };

  // Toggle mute
  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
    const newVol = !isMuted ? 0 : 1;
    setVolume(newVol);
    videoRef.current.volume = newVol;
  };

  // Controls visibility timeout
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
      <video
        ref={videoRef}
        className="w-full h-full object-contain cursor-pointer"
        src={src}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onClick={togglePlay}
      />

      {/* Play/Pause Overlay Toggle */}
      <div 
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        onClick={togglePlay}
      >
        <AnimatePresence>
            {!isPlaying && !isEnded && (
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
        {showControls && (
          <motion.div
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-[95%] backdrop-blur-xl bg-black/40 border border-white/10 rounded-2xl p-3 flex flex-col gap-3 z-20"
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
              <div 
                className="absolute inset-y-0 left-0 bg-primary/30 opacity-0 group-hover/seek:opacity-100 transition-opacity w-full" 
              />
              <motion.div
                className="absolute top-0 left-0 h-full bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary),0.5)]"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Control Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* Play / Pause / Restart */}
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={togglePlay}>
                  {isEnded ? <RotateCw className="w-5 h-5" /> : isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </Button>

                {/* Volume */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                      {isMuted ? <VolumeX className="w-5 h-5" /> : volume > 0.5 ? <Volume2 className="w-5 h-5" /> : <Volume1 className="w-5 h-5" />}
                    </Button>
                  </PopoverTrigger>
                    <PopoverContent className="w-32 bg-black/80 border-white/10 backdrop-blur-md p-3" side="top" align="center">
                      <Slider
                        value={[volume * 100]}  
                        onValueChange={(val: number[]) => {
                          const newVolume = val[0] / 100;
                          if (videoRef.current) videoRef.current.volume = newVolume;
                          setVolume(newVolume);
                          setIsMuted(newVolume === 0);
                        }}
                        step={1}
                        min={0}
                        max={100}
                        className="w-full"
                      />
                    </PopoverContent>
                </Popover>

                {/* Timer */}
                <span className="text-white/80 text-xs font-mono">
                  {formatTime(currentTime)} <span className="text-white/30">/</span> {formatTime(duration)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Settings */}
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
                            if (videoRef.current) videoRef.current.playbackRate = s;
                            setPlaybackSpeed(s);
                          }}
                        >
                          {s === 1 ? 'Normal' : `${s}x`}
                        </Button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>

                {/* Fullscreen */}
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

export default VideoPlayerPro;
