'use client';

import React, { useState, useEffect } from 'react';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  fallbackGradient?: string;
  showShimmer?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  className = '',
  fallbackGradient = 'bg-gradient-to-br from-gray-300 to-gray-400',
  showShimmer = false,
  onLoad,
  onError
}) => {
  const [imageState, setImageState] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [imageSrc, setImageSrc] = useState<string>('');

  useEffect(() => {
    if (!src) {
      setImageState('error');
      return;
    }

    setImageState('loading');
    const img = new Image();
    
    img.onload = () => {
      setImageSrc(src);
      setImageState('loaded');
      onLoad?.();
    };
    
    img.onerror = () => {
      setImageState('error');
      onError?.();
    };
    
    img.src = src;
  }, [src, onLoad, onError]);

  if (imageState === 'error' || !src) {
    return (
      <div className={`${className} ${fallbackGradient} flex items-center justify-center`}>
        <div className="text-white/80 text-center">
          <svg className="w-8 h-8 mx-auto mb-2 opacity-60" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
          <span className="text-xs font-medium opacity-80">Image</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Loading shimmer */}
      {imageState === 'loading' && (
        <div className={`absolute inset-0 ${fallbackGradient} ${showShimmer ? 'animate-pulse' : ''} flex items-center justify-center`}>
          <div className="text-white/60">
            <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="m100-200c0-8.284-6.716-15-15-15-8.284 0-15 6.716-15 15 0 8.284 6.716 15 15 15 8.284 0 15-6.716 15-15zm-1.5 0c0 7.456-6.044 13.5-13.5 13.5-7.456 0-13.5-6.044-13.5-13.5 0-7.456 6.044-13.5 13.5-13.5 7.456 0 13.5 6.044 13.5 13.5z"></path>
            </svg>
          </div>
        </div>
      )}
      
      {/* Actual image */}
      {imageState === 'loaded' && (
        <img 
          src={imageSrc} 
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${imageState === 'loaded' ? 'opacity-100' : 'opacity-0'}`}
        />
      )}
    </div>
  );
};

export default ImageWithFallback;


