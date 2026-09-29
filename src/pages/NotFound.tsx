import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Home, ArrowLeft, Compass } from 'lucide-react';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

export default function NotFound() {
  useDocumentMeta({
    title: 'Page Not Found | ARKINOX',
    description: 'The page you are looking for doesn\'t exist, has been moved, or the link may be broken.',
    noindex: true,
  });

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-24 bg-accent/30">
      <div className="max-w-xl w-full text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-3xl p-10 md:p-14 shadow-xl border border-gray-100"
        >
          <div className="w-20 h-20 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-secondary">
            <Compass size={44} className="animate-spin-slow" />
          </div>

          <span className="text-sm font-bold uppercase tracking-widest text-secondary mb-2 block">
            Error 404
          </span>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-primary mb-4">
            Page Not Found
          </h1>
          <p className="text-gray-600 mb-8 leading-relaxed">
            The page you are looking for doesn't exist, has been moved, or the link may be broken. Please check the URL or return to the homepage.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/"
              className="w-full sm:w-auto bg-primary hover:bg-secondary text-white px-8 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-primary/10"
            >
              <Home size={18} /> Back to Homepage
            </Link>
            <button
              type="button"
              onClick={() => window.history.back()}
              className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <ArrowLeft size={18} /> Go Back
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
