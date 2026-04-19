import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Truck, LayoutDashboard, HardHat, ArrowRight, CheckCircle2, Users, Briefcase, Globe, Anchor, LogIn, ChevronRight } from 'lucide-react';
import { useFirebase } from '../hooks/useFirebase';
import { cn, cleanImageUrl } from '../lib/utils';

const iconMap: Record<string, React.ReactNode> = {
  ShieldCheck: <ShieldCheck size={40} />,
  Truck: <Truck size={40} />,
  LayoutDashboard: <LayoutDashboard size={40} />,
  HardHat: <HardHat size={40} />,
  Anchor: <Anchor size={40} />,
};

export default function Home() {
  const { services, projects, blogPosts, teamMembers, settings } = useFirebase();
  const [showLoginLinks, setShowLoginLinks] = useState(false);

  const stats = [
    { label: 'Projects Completed', value: '50+', icon: <Briefcase /> },
    { label: 'Happy Clients', value: '100+', icon: <Users /> },
    { label: 'Safety Record', value: '100%', icon: <ShieldCheck /> },
    { label: 'Local Network', value: '200+', icon: <Globe /> },
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center bg-primary overflow-hidden">
        <div className="absolute inset-0 opacity-100">
          <img 
            src={cleanImageUrl("/Arkinox-machines.png.png")} 
            alt="Hero Background" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 w-full">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl text-white space-y-8"
          >
            <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight">
              Building Excellence, <span className="text-secondary">Ensuring Safety.</span>
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              Arkinox Integrated Ltd. provides world-class HSE management, supply coordination, and project support for the oil & gas and construction sectors in Nigeria.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link to="/services" className="bg-secondary text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-secondary transition-all flex items-center gap-2 group">
                Our Services <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/contact" className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-primary transition-all">
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-12 bg-secondary text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl font-display font-medium italic"
          >
            “We help contractors win jobs, pass audits, and deliver projects safely while reducing operational overhead.”
          </motion.p>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-accent">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-display font-bold text-primary">Core Services</h2>
            <div className="w-20 h-1.5 bg-secondary mx-auto rounded-full" />
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              We provide specialized support to ensure your projects are managed efficiently and safely.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.filter(s => s.isVisible).map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all group border border-gray-100"
              >
                <div className="text-secondary mb-6 group-hover:scale-110 transition-transform duration-300">
                  {iconMap[service.icon] || <Briefcase size={40} />}
                </div>
                <h3 className="text-xl font-bold mb-4 text-primary">{service.title}</h3>
                <p className="text-grey-600 mb-6 line-clamp-3">
                  {service.description}
                </p>
                <Link to={`/services/${service.slug}`} className="text-primary font-bold flex items-center gap-2 group-hover:text-secondary transition-colors">
                  Learn More <ArrowRight size={16} />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-4xl font-display font-bold text-primary">Why Choose Us?</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              At ARKINOX, we combine local expertise with international standards to deliver exceptional value to our clients.
            </p>
            <ul className="space-y-4">
              {[
                "HSE-trained leadership",
                "Compliance-focused execution",
                "Flexible engagement models",
                "Cost-effective service delivery",
                "Strong local vendor network"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-4 text-lg text-gray-700">
                  <CheckCircle2 className="text-secondary shrink-0" size={24} />
                  {item}
                </li>
              ))}
            </ul>
            <div className="pt-4">
              <Link to="/about" className="bg-primary text-white px-8 py-4 rounded-lg font-bold hover:bg-secondary transition-all">
                About Our Company
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <img 
              src={cleanImageUrl("/Arkinox headquarters and branded vehicles.png")} 
              alt="Arkinox headqurters" 
              className="rounded-2xl shadow-2xl"
              referrerPolicy="no-referrer"
            />
            <div className="absolute -bottom-3 -left-3 bg-secondary p-1 rounded-1xl shadow-xl hidden md:block">
              <p className="text-white font-bold text-2xl">5+</p>
              <p className="text-white/80 font-medium">Years of Experience</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="space-y-4"
            >
              <div className="text-secondary flex justify-center">
                {React.cloneElement(stat.icon as React.ReactElement<any>, { size: 40 })}
              </div>
              <p className="text-4xl font-bold font-display">{stat.value}</p>
              <p className="text-gray-400 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Latest Projects */}
      <section className="py-24 bg-accent">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-16">
            <div className="space-y-4">
              <h2 className="text-4xl font-display font-bold text-primary">Recent Projects</h2>
              <div className="w-20 h-1.5 bg-secondary rounded-full" />
            </div>
            <Link to="/projects" className="text-primary font-bold flex items-center gap-2 hover:text-secondary transition-colors hidden md:flex">
              View All Projects <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.filter(p => p.isVisible).slice(0, 2).map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group relative overflow-hidden rounded-2xl aspect-video"
              >
                <img 
                  src={cleanImageUrl(project.imageUrl)} 
                  alt={project.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8">
                  <p className="text-secondary font-bold mb-2">{project.category}</p>
                  <h3 className="text-2xl font-bold text-white mb-4">{project.title}</h3>
                  <Link to={`/projects/${project.slug}`} className="bg-white text-primary px-6 py-2 rounded-lg font-bold self-start hover:bg-secondary hover:text-white transition-all">
                    View Details
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-primary rounded-3xl p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
            
            <div className="relative z-10 space-y-8">
              <h2 className="text-4xl md:text-5xl font-display font-bold">Ready to start your next project?</h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Contact us today for a consultation on how we can support your construction or oil & gas operations.
              </p>
              <div className="flex flex-wrap justify-center gap-4 pt-4">
                <Link to="/contact" className="bg-secondary text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-secondary transition-all">
                  Get a Quote
                </Link>
                <a href={`tel:${settings.contactPhone}`} className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-10 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-primary transition-all">
                  Call Us Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Custom Bottom Section for Private Links */}
      <section className="py-12 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div>
            <h3 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
              Quick Links
            </h3>
            <div className="space-y-4">
              <button 
                onClick={() => setShowLoginLinks(!showLoginLinks)}
                className="text-gray-500 hover:text-secondary flex items-center gap-2 transition-colors font-medium text-sm"
              >
                <LogIn size={14} /> Login
              </button>
              
              <AnimatePresence>
                {showLoginLinks && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="pl-6 space-y-3 overflow-hidden"
                  >
                    <Link to="/author" className="text-gray-400 hover:text-secondary flex items-center gap-2 text-sm transition-colors">
                      <ChevronRight size={12} /> Author Login
                    </Link>
                    <Link to="/admin" className="text-gray-400 hover:text-secondary flex items-center gap-2 text-sm transition-colors">
                      <ChevronRight size={12} /> Admin Login
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
