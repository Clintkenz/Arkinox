import { useEffect } from 'react';

function setMetaTag(attr: 'name' | 'property', key: string, content: string) {
  let el = document.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function toAbsoluteUrl(url: string) {
  try {
    return new URL(url, window.location.origin).toString();
  } catch {
    return url;
  }
}

interface DocumentMetaOptions {
  title: string;
  description?: string;
  image?: string;
  noindex?: boolean;
}

// Keeps the browser tab title, meta description, canonical link, and the
// Open Graph / Twitter Card tags in sync per page. Note this only helps
// visitors and JS-executing crawlers (e.g. Googlebot) - link-preview bots
// (WhatsApp, iMessage, Slack, X, Facebook) fetch index.html without running
// JS, so a shared link's preview always falls back to the static tags in
// index.html regardless of what this hook sets on the live page.
export function useDocumentMeta({ title, description, image, noindex }: DocumentMetaOptions) {
  useEffect(() => {
    document.title = title;
    setMetaTag('property', 'og:title', title);
    setMetaTag('name', 'twitter:title', title);
    setMetaTag('property', 'og:url', window.location.href);

    let canonicalEl = document.querySelector('link[rel="canonical"]');
    if (!canonicalEl) {
      canonicalEl = document.createElement('link');
      canonicalEl.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalEl);
    }
    canonicalEl.setAttribute('href', window.location.href.split('?')[0].split('#')[0]);

    if (description) {
      setMetaTag('name', 'description', description);
      setMetaTag('property', 'og:description', description);
      setMetaTag('name', 'twitter:description', description);
    }

    if (image) {
      const absoluteImage = toAbsoluteUrl(image);
      setMetaTag('property', 'og:image', absoluteImage);
      setMetaTag('name', 'twitter:image', absoluteImage);
    }

    setMetaTag('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow');
  }, [title, description, image, noindex]);
}
