import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShieldCheck, Truck, LayoutDashboard, HardHat, ArrowRight, CheckCircle2, Phone, Mail, Anchor, Play } from 'lucide-react';
import { useFirebase } from '../hooks/useFirebase';
import ReactMarkdown from 'react-markdown';
import { cn, cleanImageUrl } from '../lib/utils';
import VideoEmbed from '../components/VideoEmbed';

const iconMap: Record<string, React.ReactNode> = {
  ShieldCheck: <ShieldCheck size={32} />,
  Truck: <Truck size={32} />,
  LayoutDashboard: <LayoutDashboard size={32} />,
  HardHat: <HardHat size={32} />,
  Anchor: <Anchor size={32} />,
};

export function Services() {
  const { services, settings } = useFirebase();

  return (
    <div className="">
      {/* Hero Section */}
      <section className="bg-primary py-24 text-white relative overflow-hidden">
        <div 
          className="absolute inset-0" 
          style={{ opacity: (settings.heroOpacity ?? 15) / 100 }}
        >
          <img 
            src={cleanImageUrl(settings.heroImageUrl || "/arkinox-machines.png")} 
            alt="Services Hero" 
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
            <h1 className="text-5xl md:text-6xl font-display font-bold">Our Core Services</h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              We provide comprehensive solutions tailored to the needs of the oil & gas and construction industries.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services List */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 space-y-24">
          {services.filter(s => s.isVisible).map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={cn(
                "flex flex-col lg:items-center gap-12 lg:gap-20",
                index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
              )}
            >
              <div className="lg:w-1/2 relative">
                <div className="absolute -inset-4 bg-secondary/10 rounded-3xl -z-10" />
                <img 
                  src={cleanImageUrl(service.imageUrl)} 
                  alt={service.title} 
                  className="w-full rounded-2xl shadow-2xl object-cover aspect-video"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-6 left-6 bg-white p-4 rounded-xl shadow-lg text-secondary">
                  {iconMap[service.icon] || <LayoutDashboard size={32} />}
                </div>
              </div>

              <div className="lg:w-1/2 space-y-8">
                <div className="space-y-4">
                  <h2 className="text-4xl font-display font-bold text-primary">{service.title}</h2>
                  <div className="w-20 h-1.5 bg-secondary rounded-full" />
                </div>
                <p className="text-xl text-gray-600 leading-relaxed">
                  {service.description}
                </p>
                <div className="space-y-4">
                  <Link to={`/services/${service.slug}`} className="bg-primary text-white px-8 py-4 rounded-xl font-bold inline-flex items-center gap-2 hover:bg-secondary transition-all group">
                    Explore Service Details <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Special Note */}
      <section className="py-16 bg-secondary text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-white/10 backdrop-blur-md p-10 rounded-3xl border border-white/20"
          >
            <h3 className="text-3xl font-display font-bold mb-4">Important Note</h3>
            <p className="text-2xl italic">
              “We coordinate supply processes — clients only pay for actual materials.”
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export function ServiceDetail() {
  const { slug } = useParams();
  const { services, settings } = useFirebase();
  const service = services.find(s => s.slug === slug);

  useEffect(() => {
    if (service) {
      document.title = service.metaTitle || `${service.title} | ${settings.companyName || 'ARKINOX'}`;
      
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', service.metaDescription || service.description || '');
      }
    }
  }, [service, settings]);

  if (!service) {
    return (
      <div className="pt-40 pb-20 text-center">
        <h1 className="text-4xl font-bold">Service Not Found</h1>
        <Link to="/services" className="text-secondary font-bold mt-4 inline-block">Back to Services</Link>
      </div>
    );
  }

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="bg-primary py-24 text-white relative overflow-hidden">
        <div 
          className="absolute inset-0" 
          style={{ opacity: (service.heroOpacity ?? 15) / 100 }}
        >
          <img 
            src={cleanImageUrl(service.heroImageUrl) || cleanImageUrl(service.imageUrl)} 
            alt={service.title} 
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
            <div className="bg-secondary p-4 rounded-xl shadow-lg inline-block text-white mb-4">
              {iconMap[service.icon] || <LayoutDashboard size={32} />}
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-bold">{service.title}</h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              {service.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            <div className="markdown-body">
              <ReactMarkdown>{service.content}</ReactMarkdown>
            </div>

            {service.videoUrl && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-primary flex items-center gap-2">
                  <Play className="text-secondary" size={24} /> 
                  Service Video Presentation
                </h3>
                <VideoEmbed 
                  url={service.videoUrl} 
                  title={service.title} 
                  autoPlay={true}
                  loop={false}
                  muted={false}
                  controls={false}
                />
              </div>
            )}
            
            <div className="bg-accent p-10 rounded-3xl space-y-8">
              <h3 className="text-2xl font-bold text-primary">Key Features & Benefits</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  "Expert Guidance & Support",
                  "Regulatory Compliance",
                  "Operational Efficiency",
                  "Cost Reduction",
                  "Safety Assurance",
                  "Real-time Reporting"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 text-gray-700">
                    <CheckCircle2 className="text-secondary shrink-0" size={20} />
                    <span className="font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Sidebar Contact Card */}
            <div className="bg-primary text-white p-10 rounded-3xl space-y-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
              <h3 className="text-2xl font-bold relative z-10">Need this service?</h3>
              <p className="text-gray-300 relative z-10">
                Contact our experts today to discuss how we can support your project.
              </p>
              <div className="space-y-6 relative z-10">
                <a href={`tel:${settings.contactPhone}`} className="flex items-center gap-4 hover:text-secondary transition-colors">
                  <div className="bg-white/10 p-3 rounded-xl"><Phone size={20} /></div>
                  <span className="font-bold">{settings.contactPhone}</span>
                </a>
                <a href={`mailto:${settings.contactEmail}`} className="flex items-center gap-4 hover:text-secondary transition-colors">
                  <div className="bg-white/10 p-3 rounded-xl"><Mail size={20} /></div>
                  <span className="font-bold">{settings.contactEmail}</span>
                </a>
              </div>
              <Link to="/contact" className="bg-secondary text-white w-full py-4 rounded-xl font-bold block text-center hover:bg-white hover:text-secondary transition-all relative z-10">
                Get a Free Quote
              </Link>
            </div>

            {/* Other Services */}
            <div className="bg-accent p-8 rounded-3xl space-y-6">
              <h3 className="text-xl font-bold text-primary">Other Services</h3>
              <div className="space-y-4">
                {services.filter(s => s.slug !== slug && s.isVisible).slice(0, 3).map((s) => (
                  <Link 
                    key={s.id} 
                    to={`/services/${s.slug}`}
                    className="flex items-center justify-between p-4 bg-white rounded-xl hover:bg-secondary hover:text-white transition-all group shadow-sm"
                  >
                    <span className="font-bold">{s.title}</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
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
