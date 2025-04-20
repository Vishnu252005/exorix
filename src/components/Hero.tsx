import React from 'react';
import { Play, ChevronRight } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 min-h-screen flex items-center">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&q=80"
          alt="Studio Background"
          className="w-full h-full object-cover opacity-20"
        />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
          Bringing Your Digital Vision to Life
        </h1>
        <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto">
          Professional live streaming, media production, and digital marketing solutions
          for creators and businesses worldwide.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a
            href="/contact"
            className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-600 transition-colors"
          >
            Get Started
            <ChevronRight className="ml-2 w-5 h-5" />
          </a>
          <a
            href="/portfolio"
            className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-100 bg-indigo-900 bg-opacity-40 hover:bg-opacity-50 transition-colors"
          >
            View Our Work
            <Play className="ml-2 w-5 h-5" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Hero;