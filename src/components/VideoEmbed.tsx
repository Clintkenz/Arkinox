import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface VideoEmbedProps {
  url: string;
  title?: string;
  className?: string;
  rounded?: string;
  shadow?: string;
  aspect?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
}

export default function VideoEmbed({ 
  url, 
  title, 
  className = "", 
  rounded = "rounded-3xl", 
  shadow = "shadow-2xl",
  aspect = "aspect-video",
  autoPlay = false,
  loop = false,
  muted = false,
  controls = true
}: VideoEmbedProps) {
  const [isMuted, setIsMuted] = useState(muted);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInViewport, setIsInViewport] = useState(false);

  if (!url) return null;

  // Use IntersectionObserver to track when the video is in viewport (scrolled/navigated to)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInViewport(entry.isIntersecting);
      },
      {
        threshold: 0.15, // Trigger when 15% of the video container is visible
      }
    );

    observer.observe(container);
    return () => {
      observer.disconnect();
    };
  }, []);

  // Sync state with HTML video element directly when state changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // Handle play/pause based on viewport visibility and auto-unmute on user interaction
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !autoPlay) return;

    let removeListeners: (() => void) | null = null;

    if (isInViewport) {
      video.muted = isMuted;
      const playPromise = video.play();

      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.warn("Autoplay with sound was prevented by browser security. Playback started in muted mode:", error);
          
          setIsMuted(true);
          if (videoRef.current) {
            videoRef.current.muted = true;
            videoRef.current.play().catch((err) => console.error("Muted fallback autoplay failed:", err));
          }

          // Define the auto-unmute handler once user interacts with the page
          const triggerUnmute = () => {
            if (videoRef.current) {
              setIsMuted(false);
              videoRef.current.muted = false;
            }
            if (removeListeners) removeListeners();
          };

          removeListeners = () => {
            document.removeEventListener('click', triggerUnmute);
            document.removeEventListener('touchstart', triggerUnmute);
            document.removeEventListener('keydown', triggerUnmute);
            document.removeEventListener('scroll', triggerUnmute);
          };

          document.addEventListener('click', triggerUnmute, { once: true, passive: true });
          document.addEventListener('touchstart', triggerUnmute, { once: true, passive: true });
          document.addEventListener('keydown', triggerUnmute, { once: true, passive: true });
          document.addEventListener('scroll', triggerUnmute, { once: true, passive: true });
        });
      }
    } else {
      video.pause();
    }

    return () => {
      if (removeListeners) {
        removeListeners();
      }
    };
  }, [isInViewport, autoPlay]);

  // Function to convert YouTube/Vimeo URLs to embed URLs
  const getEmbedUrl = (videoUrl: string) => {
    try {
      // Check if it's a direct video file path or URL
      const isDirectVideo = /\.(mp4|webm|ogg|mov)$/i.test(videoUrl);
      if (isDirectVideo) return null; // We'll handle this in the return JSX

      const urlObj = new URL(videoUrl);
      
      // YouTube
      if (urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('youtu.be')) {
        let videoId = '';
        if (urlObj.hostname.includes('youtu.be')) {
          videoId = urlObj.pathname.slice(1);
        } else {
          videoId = urlObj.searchParams.get('v') || '';
        }

        if (!videoId && urlObj.pathname.includes('/embed/')) {
          return videoUrl;
        }

        const params = new URLSearchParams();
        if (autoPlay) {
          params.append('autoplay', '1');
          params.append('mute', '1'); // Autoplay requires mute in browsers
        } else if (muted) {
          params.append('mute', '1');
        }
        if (loop) {
          params.append('loop', '1');
          params.append('playlist', videoId); // YouTube loop requires playlist param
        }
        if (!controls) {
          params.append('controls', '0');
          params.append('disablekb', '1');
          params.append('fs', '0');
        }
        params.append('rel', '0');
        params.append('modestbranding', '1');

        return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
      }
      
      // Vimeo
      if (urlObj.hostname.includes('vimeo.com')) {
        const videoId = urlObj.pathname.split('/').pop();
        const params = new URLSearchParams();
        if (autoPlay) {
          params.append('autoplay', '1');
          params.append('muted', '1'); // Autoplay requires mute in browsers
        } else if (muted) {
          params.append('muted', '1');
        }
        if (loop) {
          params.append('loop', '1');
        }
        if (!controls) {
          params.append('controls', '0');
          params.append('background', '1'); // Removes chromes and controls
        }
        return `https://player.vimeo.com/video/${videoId}?${params.toString()}`;
      }

      return videoUrl; // Fallback to raw URL
    } catch (e) {
      return videoUrl;
    }
  };

  const isDirectVideo = /\.(mp4|webm|ogg|mov)$/i.test(url);
  const embedUrl = isDirectVideo ? url : getEmbedUrl(url);

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
  };

  return (
    <div ref={containerRef} className={`relative ${aspect} ${rounded} ${shadow} overflow-hidden bg-black ${className}`}>
      {isDirectVideo ? (
        <>
          <video 
            ref={videoRef}
            src={embedUrl} 
            controls={controls} 
            autoPlay={autoPlay}
            loop={loop}
            muted={isMuted}
            playsInline
            disablePictureInPicture={!controls}
            controlsList={!controls ? "nodownload nofullscreen noremoteplayback" : undefined}
            className={`absolute inset-0 w-full h-full object-cover ${!controls ? 'pointer-events-none select-none' : ''}`}
            poster={url.replace(/\.[^/.]+$/, "") + ".jpg"} // Potential thumbnail fallback
          >
            Your browser does not support the video tag.
          </video>
          
          {/* Custom Speaker overlay for unmuting direct loop/autoplay videos */}
          {!controls && (
            <button
              onClick={toggleMute}
              className="absolute bottom-6 right-6 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md transition-all hover:bg-black/80 hover:scale-105 active:scale-95 cursor-pointer shadow-lg"
              title={isMuted ? "Unmute sound" : "Mute sound"}
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
          )}
        </>
      ) : (
        <iframe
          src={embedUrl || ''}
          title={title || "Video player"}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        ></iframe>
      )}
      
      {/* If controls are disabled, block pointer interactions with the iframe but allow overlay clicks */}
      {!controls && !isDirectVideo && (
        <div className="absolute inset-0 bg-transparent cursor-default pointer-events-auto select-none" />
      )}
    </div>
  );
}
