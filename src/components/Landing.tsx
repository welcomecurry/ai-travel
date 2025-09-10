'use client';

import React, { useState, useRef } from 'react';

interface LandingProps {
  onStartChat: (message: string) => void;
}

interface QuickAction {
  icon: string;
  text: string;
  prompt: string;
}

const quickActions: QuickAction[] = [
  {
    icon: '✈️',
    text: 'Create a new trip',
    prompt: 'Plan me a trip to '
  },
  {
    icon: '🗺️',
    text: 'Inspire me where to go',
    prompt: 'Suggest 3 amazing destinations for a vacation with detailed recommendations'
  },
  {
    icon: '🚗',
    text: 'Build a road trip',
    prompt: 'Plan a scenic road trip itinerary with stops, hotels, and attractions'
  },
  {
    icon: '⚡',
    text: 'Plan a last minute getaway',
    prompt: 'Help me find a last-minute weekend getaway with flights and hotels'
  }
];

const Landing: React.FC<LandingProps> = ({ onStartChat }) => {
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 150) + 'px';
    }
  };

  const handleSend = () => {
    if (inputValue.trim()) {
      onStartChat(inputValue.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickAction = (action: QuickAction) => {
    setInputValue(action.prompt);
    // Focus the textarea
    if (textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 150) + 'px';
    }
  };

  const handleMicrophoneClick = () => {
    setIsListening(!isListening);
    // Here you would implement speech recognition
    // For now, just toggle the visual state
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-3xl mx-auto text-center">
        {/* Hero Section */}
        <div className="mb-12">
          <div className="w-20 h-20 layla-gradient rounded-full flex items-center justify-center mx-auto mb-8 layla-shadow-medium">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold layla-text-primary layla-heading mb-6 leading-tight">
            Hey, I'm <span className="layla-gradient bg-clip-text text-transparent">TravelAI</span>,<br />
            your personal travel agent
          </h1>
          
          <p className="text-xl md:text-2xl layla-text-secondary leading-relaxed max-w-2xl mx-auto">
            Tell me what you want, and I'll handle the rest: flights, hotels, itineraries, in seconds.
          </p>
        </div>

        {/* Input Section */}
        <div className="mb-12">
          <div className="relative layla-card rounded-2xl p-2 layla-shadow-medium max-w-2xl mx-auto">
            <div className="flex items-end space-x-3">
              <div className="flex-1 relative">
                <textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Help me plan a budget-friendly vacation to..."
                  className="w-full px-6 py-4 bg-transparent border-none resize-none focus:outline-none text-lg leading-relaxed font-medium layla-text-primary placeholder:layla-text-secondary min-h-[60px] max-h-[150px]"
                  rows={1}
                />
              </div>
              
              {/* Microphone Button */}
              <button
                onClick={handleMicrophoneClick}
                className={`p-3 rounded-xl transition-all duration-200 ${
                  isListening 
                    ? 'bg-red-500 text-white animate-pulse' 
                    : 'bg-gray-100 layla-text-secondary hover:bg-gray-200'
                }`}
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                </svg>
              </button>

              {/* Send Button */}
              <button
                onClick={handleSend}
                disabled={!inputValue.trim()}
                className="layla-button layla-button-primary px-6 py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg 
                  className="w-6 h-6 transform rotate-45" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => handleQuickAction(action)}
                className={`layla-card layla-card-hover rounded-xl p-4 text-left transition-all duration-200 group animate-stagger-${index + 1}`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{action.icon}</span>
                  <span className="font-medium layla-text-primary group-hover:text-teal-600 transition-colors">
                    {action.text}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <button className="inline-flex items-center text-lg layla-text-secondary hover:text-teal-600 transition-colors font-medium group">
            <span>Not sure where to start? See how it works</span>
            <svg className="w-5 h-5 ml-2 transform group-hover:translate-y-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Landing;
