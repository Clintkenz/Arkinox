import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Mail, MapPin, Facebook, Instagram, Linkedin, ChevronRight, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useFirebase } from '../hooks/useFirebase';
import { cn, cleanImageUrl } from '../lib/utils';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { settings, isAdmin, user } = useFirebase();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const logoMaxHeight = settings.logoMaxHeight ?? 80;
  const logoMaxWidth = settings.logoMaxWidth ?? 220;
  const logoAspectRatio = settings.logoAspectRatio ?? 'auto';
  const logoSmartFraming = settings.logoSmartFraming ?? true;
  const logoBgColor = settings.logoBgColor ?? 'transparent';

  const headerLogoStyle: React.CSSProperties = {
    maxHeight: `${isScrolled ? Math.min(60, logoMaxHeight) : logoMaxHeight}px`,
    maxWidth: `${logoMaxWidth}px`,
    aspectRatio: logoAspectRatio !== 'auto' ? logoAspectRatio.replace('/', ' / ') : undefined,
    objectFit: 'contain',
    backgroundColor: logoBgColor !== 'transparent' ? logoBgColor : undefined,
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Projects', path: '/projects' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Bar */}
      <div className="bg-primary text-white py-2 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-sm">
          <div className="flex gap-6">
            <a href={`tel:${settings.contactPhone}`} className="flex items-center gap-2 hover:text-secondary transition-colors">
              <Phone size={14} /> {settings.contactPhone}
            </a>
            <a href={`mailto:${settings.contactEmail}`} className="flex items-center gap-2 hover:text-secondary transition-colors">
              <Mail size={14} /> {settings.contactEmail}
            </a>
          </div>
          <div className="flex gap-4 items-center">
            {settings.socialLinks.facebook && <a href={settings.socialLinks.facebook} target="_blank" rel="noreferrer"><Facebook size={16} className="hover:text-secondary" /></a>}
            {settings.socialLinks.instagram && <a href={settings.socialLinks.instagram} target="_blank" rel="noreferrer"><Instagram size={16} className="hover:text-secondary" /></a>}
            {settings.socialLinks.linkedin && <a href={settings.socialLinks.linkedin} target="_blank" rel="noreferrer"><Linkedin size={16} className="hover:text-secondary" /></a>}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <header className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        isScrolled ? "bg-white shadow-md py-1" : "bg-white/90 backdrop-blur-md py-1"
      )}>
        <nav className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3">
            <div className={cn(
              "flex items-center justify-center transition-all duration-300",
              logoSmartFraming && "bg-white p-2 rounded-xl border border-gray-100 shadow-sm"
            )}>
              <img 
                src={settings.logoUrl ? cleanImageUrl(settings.logoUrl) : cleanImageUrl("/arkinox-header.png")} 
                alt={settings.companyName || "Logo"} 
                style={headerLogoStyle}
                className="w-auto h-auto transition-all" 
                referrerPolicy="no-referrer" 
              />
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "font-medium transition-colors hover:text-secondary",
                  location.pathname === link.path ? "text-secondary" : "text-primary"
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden text-primary" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </nav>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t overflow-hidden"
            >
              <div className="flex flex-col p-4 gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={cn(
                      "text-lg font-medium py-2 border-b border-gray-100",
                      location.pathname === link.path ? "text-secondary" : "text-primary"
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-primary text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div 
                className="bg-white p-4 rounded-2xl flex items-center justify-center overflow-hidden shadow-sm animate-fade-in"
                style={{
                  height: `${logoMaxHeight > 100 ? 100 : Math.max(64, logoMaxHeight)}px`,
                  maxWidth: `${logoMaxWidth > 240 ? 240 : Math.max(120, logoMaxWidth)}px`,
                }}
              >
                <img 
                  src={settings.logoUrl ? cleanImageUrl(settings.logoUrl) : cleanImageUrl("/arkinox_logo_RC_1.jpeg")} 
                  alt={settings.companyName || "Logo"} 
                  style={{
                    maxHeight: '100%',
                    maxWidth: '100%',
                    aspectRatio: logoAspectRatio !== 'auto' ? logoAspectRatio.replace('/', ' / ') : undefined,
                    objectFit: 'contain',
                  }}
                  referrerPolicy="no-referrer" 
                />
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Arkinox Integrated Ltd. is a Nigerian-based, Port Harcourt indigenous company providing HSE management, supply coordination, and project management support.
            </p>
            <div className="flex gap-4">
              {settings.socialLinks.facebook && <a href={settings.socialLinks.facebook} className="bg-white/10 p-2 rounded-full hover:bg-secondary transition-colors"><Facebook size={20} /></a>}
              {settings.socialLinks.instagram && <a href={settings.socialLinks.instagram} className="bg-white/10 p-2 rounded-full hover:bg-secondary transition-colors"><Instagram size={20} /></a>}
              {settings.socialLinks.linkedin && <a href={settings.socialLinks.linkedin} className="bg-white/10 p-2 rounded-full hover:bg-secondary transition-colors"><Linkedin size={20} /></a>}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-6 border-b border-white/10 pb-2">Quick Links</h3>
            <ul className="space-y-4">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-gray-300 hover:text-secondary flex items-center gap-2 transition-colors">
                    <ChevronRight size={14} /> {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xl font-bold mb-6 border-b border-white/10 pb-2">Our Services</h3>
            <ul className="space-y-4">
              <li><Link to="/services/hse-management" className="text-gray-300 hover:text-secondary flex items-center gap-2 transition-colors"><ChevronRight size={14} /> HSE Management</Link></li>
              <li><Link to="/services/supply-coordination" className="text-gray-300 hover:text-secondary flex items-center gap-2 transition-colors"><ChevronRight size={14} /> Supply Coordination</Link></li>
              <li><Link to="/services/project-coordination" className="text-gray-300 hover:text-secondary flex items-center gap-2 transition-colors"><ChevronRight size={14} /> Site Coordination</Link></li>
              <li><Link to="/services/machinery-leasing" className="text-gray-300 hover:text-secondary flex items-center gap-2 transition-colors"><ChevronRight size={14} /> Machinery Leasing</Link></li>
              <li><Link to="/services/marine-logistics" className="text-gray-300 hover:text-secondary flex items-center gap-2 transition-colors"><ChevronRight size={14} /> Marine Logistics & Support</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-6 border-b border-white/10 pb-2">Contact Us</h3>
            <ul className="space-y-6">
              <li className="flex gap-4 group">
                <MapPin className="text-secondary shrink-0 group-hover:scale-110 transition-transform" size={20} />
                <div className="space-y-2">
                  <span className="text-gray-300 block">{settings.address}</span>
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-secondary hover:text-white transition-colors inline-flex items-center gap-1"
                  >
                    View on Map <ChevronRight size={12} />
                  </a>
                </div>
              </li>
              <li>
                <a href={`tel:${settings.contactPhone}`} className="flex gap-4 group">
                  <Phone className="text-secondary shrink-0 group-hover:scale-110 transition-transform" size={20} />
                  <span className="text-gray-300 group-hover:text-secondary transition-colors">{settings.contactPhone}</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${settings.contactEmail}`} className="flex gap-4 group">
                  <Mail className="text-secondary shrink-0 group-hover:scale-110 transition-transform" size={20} />
                  <span className="text-gray-300 group-hover:text-secondary transition-colors">{settings.contactEmail}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 mt-16 pt-8 border-t border-white/10 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} ARKINOX Integrated Ltd. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}
