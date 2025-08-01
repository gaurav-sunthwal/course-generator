"use client"

import React, { useState, useEffect } from 'react';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    const handleMouseMove = (e : {
        clientX: number;
        clientY: number;
    }) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const floatingElements = Array.from({ length: 6 }, (_, i) => (
    <div
      key={i}
      className={`absolute w-4 h-4 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20 animate-bounce`}
      style={{
        left: `${20 + (i * 15)}%`,
        top: `${30 + (i % 3) * 20}%`,
        animationDelay: `${i * 0.3}s`,
        animationDuration: '3s'
      }}
    />
  ));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {floatingElements}
        <div 
          className="absolute w-96 h-96 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl transition-all duration-1000 ease-out"
          style={{
            left: mousePosition.x / 10,
            top: mousePosition.y / 10,
          }}
        />
      </div>

      <div className={`relative z-10 flex flex-col items-center justify-center min-h-screen px-4 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {/* Main 404 Content */}
        <div className="text-center max-w-2xl mx-auto">
          {/* Animated 404 Number */}
          <div className="mb-8">
            <h1 className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent animate-pulse">
              404
            </h1>
            <div className="flex justify-center mt-4">
              <div className="w-32 h-1 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Animated Robot/Astronaut GIF Alternative */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center animate-bounce">
                <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-purple-400 rounded-full animate-ping"></div>
                    <div className="w-3 h-3 bg-pink-400 rounded-full animate-ping" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-8 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-md"></div>
            </div>
          </div>

          {/* Main Text */}
          <div className="mb-8 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-white animate-fadeInUp">
              Oops! Page Not Found
            </h2>
            <p className="text-lg text-gray-300 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
        {`The page you're looking for seems to have wandered off into the digital void. 
        Don't worry, even the best explorers sometimes take a wrong turn!`}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
            <button 
              onClick={() => window.history.back()}
              className="group px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-full transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              <span>Go Back</span>
            </button>
            
            <button 
              onClick={() => window.location.href = '/'}
              className="group px-8 py-3 bg-transparent border-2 border-purple-400 text-purple-400 font-semibold rounded-full transform transition-all duration-300 hover:bg-purple-400 hover:text-white hover:scale-105 hover:shadow-lg hover:shadow-purple-400/25 flex items-center justify-center space-x-2"
            >
              <Home className="w-5 h-5 transition-transform group-hover:scale-110" />
              <span>Go Home</span>
            </button>
          </div>

          {/* Search Suggestion */}
          
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 12 }, (_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full opacity-10 animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}