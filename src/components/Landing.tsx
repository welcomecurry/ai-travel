'use client';

import React, { useState, useRef } from 'react';
import TypewriterPlaceholder from './TypewriterPlaceholder';

interface LandingProps {
  onSendMessage: (message: string) => void;
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

const Landing: React.FC<LandingProps> = ({ onSendMessage }) => {
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
      onSendMessage(inputValue.trim());
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

  const placeholderTexts = [
    "Best way to explore London...",
    "Best 7-day itinerary for Greece...",
    "Help me with a budget-friendly vacation to Barcelona...",
    "Plan a romantic getaway to Paris...",
    "Find the perfect family trip to Italy...",
    "Design a solo adventure in Japan..."
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-4xl mx-auto text-center">
        {/* Hero Section */}
        <div className="mb-16">
          <h1 className="text-5xl md:text-6xl font-light text-gray-900 mb-8 leading-tight">
            Hey, I'm <span className="font-normal bg-gradient-to-r from-teal-500 to-blue-500 bg-clip-text text-transparent">TravelAI</span>,<br />
            your personal travel agent
          </h1>
          
          <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto font-light">
            Tell me what you want, and I'll handle the rest: flights, hotels, itineraries, in seconds.
          </p>
        </div>

        {/* Input Section */}
        <div className="mb-20">
          <div className="relative bg-white border border-gray-200 rounded-2xl shadow-sm max-w-3xl mx-auto focus-within:border-teal-400 focus-within:ring-2 focus-within:ring-teal-100 transition-all duration-200">
            <div className="flex items-center p-2">
              <div className="flex-1 relative">
                {!inputValue && (
                  <div className="absolute left-6 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <TypewriterPlaceholder 
                      placeholders={placeholderTexts}
                      speed={80}
                      pauseDuration={2000}
                      className="text-lg text-gray-400 font-light"
                    />
                  </div>
                )}
                <textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  className="w-full px-6 py-5 bg-transparent border-none resize-none focus:outline-none text-lg leading-relaxed font-light text-gray-900 min-h-[64px] max-h-[120px]"
                  rows={1}
                />
              </div>
              
              {/* Send Button */}
              <button
                onClick={handleSend}
                disabled={!inputValue.trim()}
                className="w-10 h-10 bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <svg 
                  className="w-5 h-5" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => handleQuickAction(action)}
                className="bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl p-4 text-left transition-all duration-200 group"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-xl opacity-60">{action.icon}</span>
                  <span className="font-light text-gray-700 group-hover:text-gray-900 transition-colors">
                    {action.text}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <button className="inline-flex items-center text-gray-500 hover:text-gray-700 transition-colors font-light group">
            <span>Not sure where to start? See how it works</span>
            <svg className="w-4 h-4 ml-2 transform group-hover:translate-y-0.5 transition-transform" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Landing;
