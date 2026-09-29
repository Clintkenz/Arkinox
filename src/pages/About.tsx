import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Users, Target, Award, CheckCircle2, Plus, Camera } from 'lucide-react';
import { useFirebase } from '../hooks/useFirebase';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { cn, cleanImageUrl } from '../lib/utils';

export default function About() {
  const { teamMembers, settings } = useFirebase();

  useDocumentMeta({
    title: `About Us | ${settings.companyName || 'ARKINOX'}`,
    description: `Learn about ${settings.companyName || 'ARKINOX'}'s mission, values, and the team behind our HSE management, supply coordination, and project management services.`,
    image: settings.heroImageUrl || "/arkinox-headquarters-and-branded-vehicles.png",
  });

  const values = [
    { title: 'Safety First', icon: <ShieldCheck size={32} />, desc: 'We prioritize the health and safety of our people and the environment in everything we do.' },
    { title: 'Integrity', icon: <Award size={32} />, desc: 'We conduct our business with the highest ethical standards and transparency.' },
    { title: 'Excellence', icon: <Target size={32} />, desc: 'We strive for excellence in project delivery and client satisfaction.' },
    { title: 'Collaboration', icon: <Users size={32} />, desc: 'We work closely with our clients and partners to achieve shared goals.' },
  ];

  return (
    <div className="">
      {/* Hero Section */}
      <section className="bg-primary py-24 text-white relative overflow-hidden">
        <div 
          className="absolute inset-0" 
          style={{ opacity: (settings.heroOpacity ?? 30) / 100 }}
        >
          <img 
            src={cleanImageUrl(settings.heroImageUrl || "/arkinox-headquarters-and-branded-vehicles.png")} 
            alt="About Hero" 
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
            <h1 className="text-5xl md:text-6xl font-display font-bold">About ARKINOX</h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              Arkinox Integrated Ltd. is a Nigerian-based, Port Harcourt indigenous company providing HSE management, supply coordination, and project management support.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h2 className="text-4xl font-display font-bold text-primary">Our Story & Mission</h2>
              <div className="w-20 h-1.5 bg-secondary rounded-full" />
            </div>
            <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
              <p>
                Founded in Port Harcourt, Nigeria, Arkinox Integrated Ltd. was established to bridge the gap between complex project requirements and local operational excellence. We understand the unique challenges of the Nigerian industrial landscape, particularly in the oil & gas and construction sectors.
              </p>
              <p>
                Our mission is to empower contractors and firms by providing them with the tools and support they need to deliver projects safely, efficiently, and in full compliance with regulatory standards in Nigeria.
              </p>
              <div className="bg-accent p-8 rounded-2xl border-l-4 border-secondary">
                <p className="font-display font-bold text-primary text-xl italic">
                  "We serve oil & gas service companies, production/construction firms, and individual and enterprise contractors with unwavering dedication."
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1.3 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-1.8"
          >
            <img src={cleanImageUrl("/Arkinox-sand-delivery-with-truck.jpeg")} alt="Team" className="rounded-2xl shadow-lg mt-12" referrerPolicy="no-referrer" />
            <img src={cleanImageUrl("/supply-coordination-1.png")} alt="Team" className="rounded-2xl shadow-lg" referrerPolicy="no-referrer" />
          </motion.div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 bg-accent">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-display font-bold text-primary">Our Core Values</h2>
            <div className="w-20 h-1.5 bg-secondary mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-black p-10 rounded-2xl shadow-sm hover:shadow-2xl hover:shadow-black/20 transition-all text-center group border border-white/5"
              >
                <div className="text-[#FFD700] mb-6 flex justify-center group-hover:scale-110 transition-transform duration-300">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold mb-4 text-white">{value.title}</h3>
                <p className="text-gray-300 leading-relaxed">
                  {value.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-display font-bold text-primary">Management Team</h2>
            <div className="w-20 h-1.5 bg-secondary mx-auto rounded-full" />
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Meet the visionary leaders driving ARKINOX towards operational excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {teamMembers.map((member, i) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group"
              >
                <div className="relative overflow-hidden rounded-3xl aspect-square mb-6 shadow-xl">
                  <img 
                    src={cleanImageUrl(member.imageUrl)} 
                    alt={member.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8">
                    <p className="text-white text-sm leading-relaxed line-clamp-4">
                      {member.bio}
                    </p>
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-primary mb-1">{member.name}</h3>
                  <p className="text-secondary font-bold uppercase tracking-wider text-sm">{member.designation}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-24 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-12">
          <h2 className="text-4xl font-display font-bold">Indigenous Expertise, Global Standards</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <div className="text-secondary text-5xl font-bold">100%</div>
              <p className="text-xl text-gray-300">Nigerian Owned & Operated</p>
            </div>
            <div className="space-y-4">
              <div className="text-secondary text-5xl font-bold">Zero</div>
              <p className="text-xl text-gray-300">LTI (Lost Time Injuries) Record</p>
            </div>
            <div className="space-y-4">
              <div className="text-secondary text-5xl font-bold">24/7</div>
              <p className="text-xl text-gray-300">Support & Coordination</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
