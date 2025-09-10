'use client';

import React, { useState, useEffect } from 'react';

interface TypewriterPlaceholderProps {
  placeholders: string[];
  speed?: number;
  pauseDuration?: number;
  className?: string;
}

const TypewriterPlaceholder: React.FC<TypewriterPlaceholderProps> = ({
  placeholders,
  speed = 100,
  pauseDuration = 2000,
  className = ''
}) => {
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);

  useEffect(() => {
    const currentPlaceholder = placeholders[currentPlaceholderIndex];
    
    if (isTyping) {
      // Typing forward
      if (currentCharIndex < currentPlaceholder.length) {
        const timeout = setTimeout(() => {
          setCurrentText(currentPlaceholder.slice(0, currentCharIndex + 1));
          setCurrentCharIndex(prev => prev + 1);
        }, speed);
        return () => clearTimeout(timeout);
      } else {
        // Finished typing, pause then start backspacing
        const timeout = setTimeout(() => {
          setIsTyping(false);
        }, pauseDuration);
        return () => clearTimeout(timeout);
      }
    } else {
      // Backspacing
      if (currentCharIndex > 0) {
        const timeout = setTimeout(() => {
          setCurrentText(currentPlaceholder.slice(0, currentCharIndex - 1));
          setCurrentCharIndex(prev => prev - 1);
        }, speed / 2); // Backspace faster
        return () => clearTimeout(timeout);
      } else {
        // Finished backspacing, move to next placeholder
        setCurrentPlaceholderIndex(prev => (prev + 1) % placeholders.length);
        setIsTyping(true);
      }
    }
  }, [currentCharIndex, isTyping, currentPlaceholderIndex, placeholders, speed, pauseDuration]);

  return (
    <span className={`${className} opacity-60`}>
      {currentText}
      <span className="animate-pulse opacity-70">|</span>
    </span>
  );
};

export default TypewriterPlaceholder;
