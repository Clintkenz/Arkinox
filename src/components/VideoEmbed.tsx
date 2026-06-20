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
  // If autoPlay is enabled, we MUST start muted to satisfy browser security restrictions
  const [isMuted, setIsMuted] = useState(autoPlay ? true : muted);
  const videoRef = useRef<HTMLVideoElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
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

  const isDirectVideo = /\.(mp4|webm|ogg|mov)$/i.test(url);

  // Handle play/pause and iframe messaging based on viewport visibility
  useEffect(() => {
    if (!autoPlay) return;

    if (isDirectVideo) {
      const video = videoRef.current;
      if (!video) return;

      if (isInViewport) {
        // Ensure muted property matches state before playing
        video.muted = isMuted;
        const playPromise = video.play();

        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.warn("Autoplay was prevented by browser restrictions. Falling back to muted autoplay:", error);
            setIsMuted(true);
            video.muted = true;
            video.play().catch((err) => console.error("Muted fallback autoplay failed:", err));
          });
        }
      } else {
        video.pause();
      }
    } else {
      // It is an iframe (YouTube or Vimeo)
      const iframe = iframeRef.current;
      if (!iframe || !iframe.contentWindow) return;

      const isYouTube = url.includes('youtube.com') || url.includes('youtu.be');
      const isVimeo = url.includes('vimeo.com');

      // We send control instructions via postMessage
      try {
        if (isInViewport) {
          if (isYouTube) {
            iframe.contentWindow.postMessage(JSON.stringify({
              event: 'command',
              func: 'playVideo',
              args: ''
            }), '*');
          } else if (isVimeo) {
            iframe.contentWindow.postMessage(JSON.stringify({
              method: 'play'
            }), '*');
          }
        } else {
          if (isYouTube) {
            iframe.contentWindow.postMessage(JSON.stringify({
              event: 'command',
              func: 'pauseVideo',
              args: ''
            }), '*');
          } else if (isVimeo) {
            iframe.contentWindow.postMessage(JSON.stringify({
              method: 'pause'
            }), '*');
          }
        }
      } catch (err) {
        console.warn("Failed to send postMessage to iframe:", err);
      }
    }
  }, [isInViewport, autoPlay, isDirectVideo, url]);

  // Function to convert YouTube/Vimeo URLs to embed URLs
  const getEmbedUrl = (videoUrl: string) => {
    try {
      const isDirectVideoUrl = /\.(mp4|webm|ogg|mov)$/i.test(videoUrl);
      if (isDirectVideoUrl) return null;

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
          // If already embed style, make sure we append enablejsapi
          const baseEmbedUrl = videoUrl.split('?')[0];
          const queryParams = new URL(videoUrl).searchParams;
          queryParams.set('enablejsapi', '1');
          if (autoPlay) {
            queryParams.set('autoplay', '1');
            queryParams.set('mute', '1');
          }
          return `${baseEmbedUrl}?${queryParams.toString()}`;
        }

        const params = new URLSearchParams();
        params.append('enablejsapi', '1'); // REQUIRED for postMessage controls
        if (autoPlay) {
          params.append('autoplay', '1');
          params.append('mute', '1'); // Autoplay requires mute in browsers
        } else if (muted) {
          params.append('mute', '1');
        }
        if (loop) {
          params.append('loop', '1');
          params.append('playlist', videoId);
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
          params.append('muted', '1');
        } else if (muted) {
          params.append('muted', '1');
        }
        if (loop) {
          params.append('loop', '1');
        }
        if (!controls) {
          params.append('controls', '0');
          params.append('background', '1');
        }
        return `https://player.vimeo.com/video/${videoId}?${params.toString()}`;
      }

      return videoUrl;
    } catch (e) {
      return videoUrl;
    }
  };

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
            src={embedUrl || undefined} 
            controls={controls} 
            autoPlay={autoPlay}
            loop={loop}
            muted={isMuted}
            playsInline
            disablePictureInPicture={!controls}
            controlsList={!controls ? "nodownload nofullscreen noremoteplayback" : undefined}
            className={`absolute inset-0 w-full h-full object-cover ${!controls ? 'pointer-events-none select-none' : ''}`}
          >
            Your browser does not support the video tag.
          </video>
          
          {/* Custom Speaker overlay for unmuting direct loop/autoplay videos */}
          {!controls && (
            <div className="absolute bottom-6 right-6 z-20 flex items-center gap-2">
              {isMuted && (
                <span className="bg-black/60 text-white text-xs font-bold px-3 py-1.5 rounded-xl backdrop-blur-md shadow-lg pointer-events-none whitespace-nowrap animate-pulse">
                  Click for Sound
                </span>
              )}
              <button
                onClick={toggleMute}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md transition-all hover:bg-black/80 hover:scale-105 active:scale-95 cursor-pointer shadow-lg border border-white/10"
                title={isMuted ? "Unmute sound" : "Mute sound"}
              >
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
            </div>
          )}
        </>
      ) : (
        <iframe
          ref={iframeRef}
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
