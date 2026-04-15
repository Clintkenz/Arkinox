import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { Calendar, Tag, ArrowRight, ChevronRight, MapPin, Briefcase } from 'lucide-react';
import { useFirebase } from '../hooks/useFirebase';
import ReactMarkdown from 'react-markdown';
import { cn, cleanImageUrl } from '../lib/utils';

export function Projects() {
  const { projects, settings } = useFirebase();

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="bg-primary py-24 text-white relative overflow-hidden">
        <div 
          className="absolute inset-0" 
          style={{ opacity: (settings.heroOpacity ?? 15) / 100 }}
        >
          <img 
            src={cleanImageUrl("/Arkinox project-who we are.jpg")} 
            alt="Projects Hero" 
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
            <h1 className="text-5xl md:text-6xl font-display font-bold">Our Portfolio</h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              Explore our track record of excellence in construction, oil & gas support, and supply logistics.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {projects.filter(p => p.isVisible).map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group bg-accent rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500"
              >
                <div className="relative aspect-video overflow-hidden">
                  <img 
                    src={cleanImageUrl(project.imageUrl)} 
                    alt={project.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 bg-secondary text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                    {project.category}
                  </div>
                </div>
                <div className="p-8 space-y-4">
                  <div className="flex items-center gap-4 text-gray-500 text-sm font-medium">
                    <span className="flex items-center gap-2"><Calendar size={14} /> {new Date(project.date).toLocaleDateString()}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-primary group-hover:text-secondary transition-colors line-clamp-1">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 line-clamp-3 leading-relaxed">
                    {project.description}
                  </p>
                  <Link to={`/projects/${project.slug}`} className="bg-primary text-white w-full py-4 rounded-xl font-bold inline-flex items-center justify-center gap-2 hover:bg-secondary transition-all group">
                    View Project Details <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export function ProjectDetail() {
  const { slug } = useParams();
  const { projects, settings } = useFirebase();
  const project = projects.find(p => p.slug === slug);

  if (!project) {
    return (
      <div className="pt-40 pb-20 text-center">
        <h1 className="text-4xl font-bold">Project Not Found</h1>
        <Link to="/projects" className="text-secondary font-bold mt-4 inline-block">Back to Projects</Link>
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
            src={cleanImageUrl(project.imageUrl)} 
            alt={project.title} 
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
            <div className="bg-secondary text-white px-6 py-2 rounded-full text-sm font-bold inline-block mb-4 shadow-lg">
              {project.category}
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-bold">{project.title}</h1>
            <div className="flex flex-wrap gap-6 text-gray-300 font-medium">
              <span className="flex items-center gap-2"><Calendar size={18} className="text-secondary" /> {new Date(project.date).toLocaleDateString()}</span>
              <span className="flex items-center gap-2"><MapPin size={18} className="text-secondary" /> Port Harcourt, Nigeria</span>
              <span className="flex items-center gap-2"><Briefcase size={18} className="text-secondary" /> {project.category} Support</span>
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
                src={cleanImageUrl(project.imageUrl)} 
                alt={project.title} 
                className="w-full h-full object-cover aspect-video"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="markdown-body">
              <ReactMarkdown>{project.content}</ReactMarkdown>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Project Info Card */}
            <div className="bg-accent p-10 rounded-3xl space-y-8 border border-gray-100">
              <h3 className="text-2xl font-bold text-primary">Project Overview</h3>
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                  <span className="text-gray-500 font-medium">Client</span>
                  <span className="font-bold text-primary">Confidential</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                  <span className="text-gray-500 font-medium">Category</span>
                  <span className="font-bold text-primary">{project.category}</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                  <span className="text-gray-500 font-medium">Date</span>
                  <span className="font-bold text-primary">{new Date(project.date).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                  <span className="text-gray-500 font-medium">Location</span>
                  <span className="font-bold text-primary">Port Harcourt</span>
                </div>
              </div>
              <Link to="/contact" className="bg-primary text-white w-full py-4 rounded-xl font-bold block text-center hover:bg-secondary transition-all">
                Inquire About Similar Project
              </Link>
            </div>

            {/* Other Projects */}
            <div className="bg-primary text-white p-10 rounded-3xl space-y-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
              <h3 className="text-2xl font-bold relative z-10">Recent Projects</h3>
              <div className="space-y-4 relative z-10">
                {projects.filter(p => p.slug !== slug && p.isVisible).slice(0, 3).map((p) => (
                  <Link 
                    key={p.id} 
                    to={`/projects/${p.slug}`}
                    className="flex items-center justify-between p-4 bg-white/10 rounded-xl hover:bg-secondary transition-all group border border-white/10"
                  >
                    <span className="font-bold text-sm line-clamp-1">{p.title}</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
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
