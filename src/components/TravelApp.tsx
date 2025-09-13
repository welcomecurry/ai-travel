'use client';

import React, { useState, useEffect } from 'react';
import Landing from './Landing';
import TravelChat from './TravelChat';
import TravelHeader from './TravelHeader';

type AppState = 'landing' | 'transitioning' | 'chat';

const TravelApp: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('landing');
  const [initialMessage, setInitialMessage] = useState<string>('');

  const handleStartChat = (message: string) => {
    setInitialMessage(message);
    setAppState('transitioning');
    
    // Transition to chat after animation
    setTimeout(() => {
      setAppState('chat');
    }, 600); // Match animation duration
  };

  useEffect(() => {
    // If we're transitioning to chat and have an initial message, send it
    if (appState === 'chat' && initialMessage) {
      // This will be handled by TravelChat component
      // Reset the initial message after it's been processed
      setTimeout(() => {
        setInitialMessage('');
      }, 100);
    }
  }, [appState, initialMessage]);

  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col">
      {/* Global Header - Spans full width */}
      <TravelHeader 
        tripName={appState === 'landing' ? "Travel Planning" : "Trip Planning"}
        currentCurrency="USD"
        userInitial="A"
        userColor="#86944d"
      />
      
      {/* Main Content Area */}
      <div className="relative flex-1 overflow-hidden">
        {/* Landing Page */}
        {(appState === 'landing' || appState === 'transitioning') && (
          <div 
            className={`absolute inset-0 z-10 ${
              appState === 'transitioning' ? 'animate-slide-out-left' : 'animate-fade-in-up'
            }`}
          >
            <Landing onSendMessage={handleStartChat} />
          </div>
        )}

        {/* Chat Interface */}
        {(appState === 'transitioning' || appState === 'chat') && (
          <div 
            className={`absolute inset-0 ${
              appState === 'transitioning' 
                ? 'opacity-0 translate-x-full' 
                : 'animate-slide-in-right'
            } transition-all duration-600 ease-out`}
          >
            <TravelChat initialMessage={initialMessage} />
          </div>
        )}
      </div>
    </div>
  );
};

export default TravelApp;