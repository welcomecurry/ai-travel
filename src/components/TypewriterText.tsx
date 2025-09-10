'use client';

import React, { useState, useEffect } from 'react';

interface TypewriterTextProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
  className?: string;
}

const TypewriterText: React.FC<TypewriterTextProps> = ({ 
  text, 
  speed = 50, 
  onComplete,
  className = '' 
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    } else {
      // Animation complete
      setShowCursor(false);
      if (onComplete) {
        onComplete();
      }
    }
  }, [currentIndex, text, speed, onComplete]);

  // Cursor blinking effect
  useEffect(() => {
    if (currentIndex < text.length || showCursor) {
      const cursorInterval = setInterval(() => {
        setShowCursor(prev => !prev);
      }, 500);

      return () => clearInterval(cursorInterval);
    }
  }, [currentIndex, text.length, showCursor]);

  // Format text with markdown-like syntax
  const formatText = (text: string) => {
    // Replace **text** with bold
    const boldFormatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Replace \n with proper line breaks
    const withLineBreaks = boldFormatted.replace(/\n/g, '<br />');
    
    return withLineBreaks;
  };

  return (
    <span className={className}>
      <span 
        dangerouslySetInnerHTML={{ 
          __html: formatText(displayedText) + (showCursor && currentIndex < text.length ? '<span class="animate-pulse">|</span>' : '') 
        }} 
      />
    </span>
  );
};

export default TypewriterText;
