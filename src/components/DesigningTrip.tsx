'use client';

import React from 'react';

const DesigningTrip: React.FC = () => {
  const features = [
    "Share with your companions",
    "Save hours of planning", 
    "Share your trip idea",
    "Bring it to real with ease"
  ];

  return (
    <div className="flex-1 flex items-center justify-center px-6 py-8">
      <div className="text-center max-w-md mx-auto">
        {/* Avatar */}
        <div className="w-32 h-32 mx-auto mb-8 relative animate-float">
          <div className="w-full h-full rounded-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center overflow-hidden layla-shadow-medium">
            {/* Placeholder for woman's photo - using avatar icon for now */}
            <svg className="w-16 h-16 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
          
          {/* Rotating indicator */}
          <div className="absolute -top-2 -right-2 w-8 h-8 layla-gradient rounded-full flex items-center justify-center animate-spin layla-shadow-soft">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-semibold layla-text-primary layla-heading mb-8">
          Designing your trip...
        </h2>

        {/* Animated Features */}
        <div className="space-y-4">
          {features.map((feature, index) => (
            <div 
              key={index}
              className={`flex items-center justify-center p-4 layla-card rounded-xl animate-conveyer-${index + 1}`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 layla-gradient rounded-full animate-pulse"></div>
                <span className="layla-text-primary font-medium">{feature}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Progress dots */}
        <div className="flex justify-center space-x-2 mt-8">
          {[0, 1, 2].map((index) => (
            <div 
              key={index}
              className={`w-2 h-2 rounded-full bg-teal-400 animate-pulse`}
              style={{ animationDelay: `${index * 0.3}s` }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DesigningTrip;
