import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { Calendar, User, Tag, ArrowRight, ChevronRight, Clock, Share2, Linkedin, Twitter, Facebook, Instagram, Music2 } from 'lucide-react';
import { useFirebase } from '../hooks/useFirebase';
import ReactMarkdown from 'react-markdown';
import { cn, cleanImageUrl } from '../lib/utils';

export function Blog() {
  const { blogPosts, settings, allUsers } = useFirebase();

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="bg-primary py-24 text-white relative overflow-hidden">
        <div 
          className="absolute inset-0" 
          style={{ opacity: (settings.heroOpacity ?? 15) / 100 }}
        >
          <img 
            src={cleanImageUrl(settings.heroImageUrl || "/arkinox-machines.png")} 
            alt="Blog Hero" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl space-y-6"
          >
            <h1 className="text-5xl md:text-6xl font-display font-bold">Blog & Insights</h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              Stay updated with the latest trends and insights in HSE, logistics, and project management.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {blogPosts.filter(p => p.isVisible).map((post, index) => {
              const postAuthor = allUsers.find(u => u.uid === post.authorId);
              const displayName = postAuthor?.displayName || post.authorName || post.author || 'Author';
              
              return (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group bg-accent rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col"
                >
                  <div className="relative aspect-video overflow-hidden">
                    <img 
                      src={cleanImageUrl(post.imageUrl)} 
                      alt={post.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute bottom-4 left-4 flex gap-2">
                      {post.tags?.slice(0, 2).map((tag, i) => (
                        <span key={i} className="bg-secondary text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="p-8 space-y-4 flex-grow flex flex-col">
                    <div className="flex items-center gap-4 text-gray-500 text-xs font-medium">
                      <span className="flex items-center gap-2"><Calendar size={14} /> {new Date(post.publishedAt).toLocaleDateString()}</span>
                      <span className="flex items-center gap-2"><User size={14} /> {displayName}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-primary group-hover:text-secondary transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 line-clamp-3 leading-relaxed flex-grow">
                      {post.excerpt}
                    </p>
                    <Link to={`/blog/${post.slug}`} className="bg-primary text-white w-full py-4 rounded-xl font-bold inline-flex items-center justify-center gap-2 hover:bg-secondary transition-all group mt-4">
                      Read Full Article <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

export function BlogPostDetail() {
  const { slug } = useParams();
  const { blogPosts, settings, allUsers } = useFirebase();
  const post = blogPosts.find(p => p.slug === slug);

  useEffect(() => {
    if (post) {
      document.title = post.metaTitle || `${post.title} | ${settings.companyName || 'ARKINOX'}`;
      
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', post.metaDescription || post.excerpt || '');
      }
    }
  }, [post, settings]);

  const author = allUsers.find(u => u.uid === post?.authorId);
  const authorName = author?.displayName || post?.authorName || post?.author || 'ARKINOX Author';
  const authorImage = author?.photoURL || post?.authorImage || "/arkinox-header.png";
  const authorBio = author?.bio || post?.authorBio || "HSE and Logistics expert at ARKINOX Integrated Ltd., dedicated to operational excellence and safety standards.";
  const authorLinkedin = author?.linkedin || post?.authorLinkedin;
  const authorInstagram = author?.instagram || post?.authorInstagram;

  if (!post) {
    return (
      <div className="pt-40 pb-20 text-center">
        <h1 className="text-4xl font-bold">Post Not Found</h1>
        <Link to="/blog" className="text-secondary font-bold mt-4 inline-block">Back to Blog</Link>
      </div>
    );
  }

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="bg-primary py-24 text-white relative overflow-hidden">
        <div 
          className="absolute inset-0" 
          style={{ opacity: (settings.heroOpacity ?? 15) / 100 }}
        >
          <img 
            src={cleanImageUrl(post.imageUrl)} 
            alt={post.title} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl space-y-6"
          >
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags?.map((tag, i) => (
                <span key={i} className="bg-secondary text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-bold leading-tight">{post.title}</h1>
            <div className="flex flex-wrap gap-6 text-gray-300 font-medium">
              <span className="flex items-center gap-2"><Calendar size={18} className="text-secondary" /> {new Date(post.publishedAt).toLocaleDateString()}</span>
              <span className="flex items-center gap-2"><User size={18} className="text-secondary" /> {authorName}</span>
              <span className="flex items-center gap-2"><Clock size={18} className="text-secondary" /> 5 min read</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            <div className="rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src={cleanImageUrl(post.imageUrl)} 
                alt={post.title} 
                className="w-full h-full object-cover aspect-video"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="markdown-body">
              {post.content.includes('<') && post.content.includes('>') ? (
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              ) : (
                <ReactMarkdown>{post.content}</ReactMarkdown>
              )}
            </div>

            {/* Author Bio Section */}
            <div className="bg-accent rounded-3xl p-8 flex flex-col md:flex-row items-center md:items-start gap-8 border border-gray-100">
              <div className="shrink-0 text-center space-y-2">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg mx-auto">
                  <img 
                    src={cleanImageUrl(authorImage)} 
                    alt={authorName} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <h4 className="font-bold text-primary text-sm uppercase tracking-wider">{authorName}</h4>
              </div>
              <div className="flex-1 space-y-4 text-center md:text-left">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-primary">About the Author</h3>
                  <div className="w-12 h-1 bg-secondary mx-auto md:mx-0 rounded-full" />
                </div>
                <p className="text-gray-600 leading-relaxed italic">
                  {authorBio}
                </p>
                <div className="flex justify-center md:justify-start gap-4">
                  {authorLinkedin && (
                    <a href={authorLinkedin} target="_blank" rel="noopener noreferrer" className="text-[#0077b5] hover:scale-110 transition-transform">
                      <Linkedin size={20} />
                    </a>
                  )}
                  {authorInstagram && (
                    <a href={authorInstagram} target="_blank" rel="noopener noreferrer" className="text-[#e1306c] hover:scale-110 transition-transform">
                      <Instagram size={20} />
                    </a>
                  )}
                </div>
              </div>
            </div>
            
            {/* Share Section */}
            <div className="border-t border-gray-100 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className="font-bold text-primary">Share this post:</span>
                <div className="flex gap-3">
                  <a 
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-accent p-3 rounded-xl hover:bg-[#0077b5] hover:text-white transition-all shadow-sm"
                    title="Share on LinkedIn"
                  >
                    <Linkedin size={20} />
                  </a>
                  <a 
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-accent p-3 rounded-xl hover:bg-[#1da1f2] hover:text-white transition-all shadow-sm"
                    title="Share on Twitter"
                  >
                    <Twitter size={20} />
                  </a>
                  <a 
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-accent p-3 rounded-xl hover:bg-[#1877f2] hover:text-white transition-all shadow-sm"
                    title="Share on Facebook"
                  >
                    <Facebook size={20} />
                  </a>
                  <a 
                    href={`https://www.tiktok.com/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-accent p-3 rounded-xl hover:bg-[#000000] hover:text-white transition-all shadow-sm"
                    title="Share on TikTok"
                  >
                    <Music2 size={20} />
                  </a>
                </div>
              </div>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Link copied to clipboard!');
                }}
                className="text-sm font-bold text-secondary hover:underline flex items-center gap-2"
              >
                <Share2 size={16} /> Copy Link
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Newsletter Card */}
            <div className="bg-primary text-white p-10 rounded-3xl space-y-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
              <h3 className="text-2xl font-bold relative z-10">Stay Updated</h3>
              <p className="text-gray-300 relative z-10">
                Subscribe to our newsletter to receive the latest insights directly in your inbox.
              </p>
              <form className="space-y-4 relative z-10" onSubmit={(e) => e.preventDefault()}>
                <input 
                  type="email" 
                  placeholder="Your Email Address" 
                  className="w-full bg-white/10 border border-white/20 rounded-xl p-4 focus:outline-none focus:border-secondary transition-all"
                />
                <button className="bg-secondary text-white w-full py-4 rounded-xl font-bold block text-center hover:bg-white hover:text-secondary transition-all">
                  Subscribe Now
                </button>
              </form>
            </div>

            {/* Recent Posts */}
            <div className="bg-accent p-8 rounded-3xl space-y-6">
              <h3 className="text-xl font-bold text-primary">Recent Articles</h3>
              <div className="space-y-6">
                {blogPosts.filter(p => p.slug !== slug && p.isVisible).slice(0, 3).map((p) => (
                  <Link 
                    key={p.id} 
                    to={`/blog/${p.slug}`}
                    className="flex gap-4 group"
                  >
                    <img 
                      src={cleanImageUrl(p.imageUrl)} 
                      alt={p.title} 
                      className="w-20 h-20 rounded-xl object-cover shrink-0 group-hover:scale-105 transition-transform"
                      referrerPolicy="no-referrer"
                    />
                    <div className="space-y-1">
                      <h4 className="font-bold text-primary text-sm line-clamp-2 group-hover:text-secondary transition-colors">{p.title}</h4>
                      <p className="text-xs text-gray-500">{new Date(p.publishedAt).toLocaleDateString()}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
