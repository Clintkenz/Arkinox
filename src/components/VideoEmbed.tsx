import React from 'react';

interface VideoEmbedProps {
  url: string;
  title?: string;
  className?: string;
}

export default function VideoEmbed({ url, title, className = "" }: VideoEmbedProps) {
  if (!url) return null;

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

        return `https://www.youtube.com/embed/${videoId}?rel=0`;
      }
      
      // Vimeo
      if (urlObj.hostname.includes('vimeo.com')) {
        const videoId = urlObj.pathname.split('/').pop();
        return `https://player.vimeo.com/video/${videoId}`;
      }

      return videoUrl; // Fallback to raw URL
    } catch (e) {
      return videoUrl;
    }
  };

  const isDirectVideo = /\.(mp4|webm|ogg|mov)$/i.test(url);
  const embedUrl = isDirectVideo ? url : getEmbedUrl(url);

  return (
    <div className={`relative aspect-video rounded-3xl overflow-hidden bg-black shadow-2xl ${className}`}>
      {isDirectVideo ? (
        <video 
          src={embedUrl} 
          controls 
          className="absolute inset-0 w-full h-full object-cover"
          poster={url.replace(/\.[^/.]+$/, "") + ".jpg"} // Potential thumbnail fallback
        >
          Your browser does not support the video tag.
        </video>
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
    </div>
  );
}
