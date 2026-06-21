import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Phone, Mail, MapPin, Send, CheckCircle2, Facebook, Instagram, Linkedin } from 'lucide-react';
import { useFirebase } from '../hooks/useFirebase';
import { db, collection, setDoc, doc } from '../firebase';
import { cn, cleanImageUrl } from '../lib/utils';

export default function Contact() {
  const { settings } = useFirebase();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const messageId = Math.random().toString(36).substring(2, 15);
      await setDoc(doc(collection(db, 'messages'), messageId), {
        ...formData,
        createdAt: new Date().toISOString()
      });
      setIsSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.error('Error submitting message:', err);
      setError('Failed to send message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="bg-primary py-24 text-white relative overflow-hidden">
        <div 
          className="absolute inset-0" 
          style={{ opacity: (settings.heroOpacity ?? 15) / 100 }}
        >
          <img 
            src={cleanImageUrl(settings.heroImageUrl || "/arkinox-headquarters-and-branded-vehicles-1.png")} 
            alt="Contact Hero" 
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
            <h1 className="text-5xl md:text-6xl font-display font-bold">Get In Touch</h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              Have a question or need a quote? Our team is ready to assist you with your project needs.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-12"
          >
            <div className="space-y-4">
              <h2 className="text-4xl font-display font-bold text-primary">Contact Information</h2>
              <div className="w-20 h-1.5 bg-secondary rounded-full" />
              <p className="text-lg text-gray-600 leading-relaxed">
                Reach out to us via any of the channels below. We aim to respond to all inquiries within 24 hours.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <a 
                href={`tel:${settings.contactPhone}`}
                className="bg-accent p-8 rounded-3xl space-y-4 border border-gray-100 hover:shadow-xl transition-all group block"
              >
                <div className="bg-primary text-white p-4 rounded-xl w-fit group-hover:bg-secondary transition-colors">
                  <Phone size={24} />
                </div>
                <h3 className="text-xl font-bold text-primary">Call Us</h3>
                <p className="text-gray-600 font-medium">{settings.contactPhone}</p>
              </a>

              <a 
                href={`mailto:${settings.contactEmail}`}
                className="bg-accent p-8 rounded-3xl space-y-4 border border-gray-100 hover:shadow-xl transition-all group block"
              >
                <div className="bg-primary text-white p-4 rounded-xl w-fit group-hover:bg-secondary transition-colors">
                  <Mail size={24} />
                </div>
                <h3 className="text-xl font-bold text-primary">Email Us</h3>
                <p className="text-gray-600 font-medium">{settings.contactEmail}</p>
              </a>

              <div className="bg-accent p-8 rounded-3xl space-y-4 border border-gray-100 hover:shadow-xl transition-all group md:col-span-2">
                <div className="bg-primary text-white p-4 rounded-xl w-fit group-hover:bg-secondary transition-colors">
                  <MapPin size={24} />
                </div>
                <h3 className="text-xl font-bold text-primary">Our Office</h3>
                <p className="text-gray-600 font-medium">{settings.address}</p>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-primary">Follow Us</h3>
              <div className="flex gap-4">
                {settings.socialLinks.facebook && <a href={settings.socialLinks.facebook} className="bg-primary text-white p-4 rounded-2xl hover:bg-secondary transition-all shadow-lg"><Facebook size={24} /></a>}
                {settings.socialLinks.instagram && <a href={settings.socialLinks.instagram} className="bg-primary text-white p-4 rounded-2xl hover:bg-secondary transition-all shadow-lg"><Instagram size={24} /></a>}
                {settings.socialLinks.linkedin && <a href={settings.socialLinks.linkedin} className="bg-primary text-white p-4 rounded-2xl hover:bg-secondary transition-all shadow-lg"><Linkedin size={24} /></a>}
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-accent p-10 md:p-16 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            
            {isSubmitted ? (
              <div className="text-center space-y-8 py-12 relative z-10">
                <div className="bg-green-100 text-green-600 p-6 rounded-full w-fit mx-auto">
                  <CheckCircle2 size={64} />
                </div>
                <h3 className="text-3xl font-display font-bold text-primary">Message Sent!</h3>
                <p className="text-lg text-gray-600">
                  Thank you for reaching out. We have received your message and will get back to you shortly.
                </p>
                <button 
                  onClick={() => setIsSubmitted(false)}
                  className="bg-primary text-white px-10 py-4 rounded-xl font-bold hover:bg-secondary transition-all"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form className="space-y-8 relative z-10" onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <h3 className="text-3xl font-display font-bold text-primary">Send a Message</h3>
                  <p className="text-gray-600">Fill out the form below and we'll be in touch.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-primary uppercase tracking-wider">Full Name</label>
                    <input 
                      required
                      type="text" 
                      placeholder="John Doe"
                      className="w-full bg-white border border-gray-200 rounded-xl p-4 focus:outline-none focus:border-secondary transition-all shadow-sm"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-primary uppercase tracking-wider">Email Address</label>
                    <input 
                      required
                      type="email" 
                      placeholder="john@example.com"
                      className="w-full bg-white border border-gray-200 rounded-xl p-4 focus:outline-none focus:border-secondary transition-all shadow-sm"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-primary uppercase tracking-wider">Subject</label>
                  <input 
                    required
                    type="text" 
                    placeholder="Project Inquiry"
                    className="w-full bg-white border border-gray-200 rounded-xl p-4 focus:outline-none focus:border-secondary transition-all shadow-sm"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-primary uppercase tracking-wider">Your Message</label>
                  <textarea 
                    required
                    rows={5}
                    placeholder="How can we help you?"
                    className="w-full bg-white border border-gray-200 rounded-xl p-4 focus:outline-none focus:border-secondary transition-all shadow-sm resize-none"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                {error && <p className="text-red-500 font-medium">{error}</p>}

                <button 
                  disabled={isSubmitting}
                  type="submit"
                  className="bg-primary text-white w-full py-5 rounded-xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-secondary transition-all shadow-xl disabled:opacity-50 group"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                  <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      {/* Interactive Map */}
      <section className="h-[500px] bg-accent relative overflow-hidden">
        <iframe
          title="ARKINOX Office Location"
          width="100%"
          height="100%"
          frameBorder="0"
          style={{ border: 0 }}
          src={`https://maps.google.com/maps?q=${encodeURIComponent(settings.address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="grayscale hover:grayscale-0 transition-all duration-700"
        />
        <div className="absolute bottom-8 left-8 bg-white p-6 rounded-2xl shadow-2xl border border-gray-100 hidden md:block max-w-xs">
          <div className="flex items-center gap-3 text-secondary mb-2">
            <MapPin size={20} />
            <span className="font-bold">Our Office</span>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            {settings.address}
          </p>
          <a 
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.address)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-primary hover:text-secondary transition-colors mt-4 inline-block"
          >
            Get Directions →
          </a>
        </div>
      </section>
    </div>
  );
}
