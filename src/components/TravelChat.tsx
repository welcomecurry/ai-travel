'use client';

import React, { useState, useRef, useEffect } from 'react';
import TripPlan, { TripPlanData } from './TripPlan';
import TripPlanSkeleton from './TripPlanSkeleton';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'text' | 'trip_plan';
  tripData?: TripPlanData;
}

interface LoadingStage {
  stage: 'searching' | 'flights' | 'hotels' | 'activities' | 'itinerary' | 'complete';
  message: string;
}

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  
  return (
    <div 
      className={`flex mb-4 animate-fade-in ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {!isUser && (
        <div className="flex-shrink-0 mr-3">
          <div className="w-8 h-8 layla-gradient rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      )}
      
      <div className={`max-w-xs lg:max-w-sm px-4 py-3 rounded-2xl break-words ${
        isUser 
          ? 'layla-gradient text-white rounded-br-md' 
          : 'layla-card border border-gray-200 layla-text-primary rounded-bl-md'
      }`}>
        <p className="text-sm leading-relaxed font-medium">{message.content}</p>
        <p className={`text-xs mt-2 ${
          isUser ? 'text-white/70' : 'layla-text-secondary'
        }`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
      
      {isUser && (
        <div className="flex-shrink-0 ml-3">
          <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};

interface TravelChatProps {
  initialMessage?: string;
}

const TravelChat: React.FC<TravelChatProps> = ({ initialMessage }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m your AI travel assistant. Where would you like to go on your next adventure?',
      sender: 'ai',
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState<LoadingStage>({ stage: 'searching', message: 'Analyzing your request...' });
  const [currentTripPlan, setCurrentTripPlan] = useState<TripPlanData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle initial message from landing page
  useEffect(() => {
    if (initialMessage && !isLoading) {
      setInputValue(initialMessage);
      // Auto-send the initial message after a brief delay
      setTimeout(() => {
        if (initialMessage.trim()) {
          const userMessage: Message = {
            id: Date.now().toString(),
            content: initialMessage.trim(),
            sender: 'user',
            timestamp: new Date(),
            type: 'text'
          };
          setMessages(prev => [...prev, userMessage]);
          setInputValue('');
          setError(null);
          setIsLoading(true);
          simulateLoadingStages();
          
          // Make API call
          handleAPICall(initialMessage.trim());
        }
      }, 500);
    }
  }, [initialMessage]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  };

  const simulateLoadingStages = () => {
    const stages = [
      { stage: 'searching' as const, message: 'Analyzing your request...', delay: 1000 },
      { stage: 'flights' as const, message: 'Finding best flights...', delay: 1500 },
      { stage: 'hotels' as const, message: 'Searching hotels...', delay: 1200 },
      { stage: 'activities' as const, message: 'Curating activities...', delay: 1300 },
      { stage: 'itinerary' as const, message: 'Creating your itinerary...', delay: 1000 }
    ];

    let currentIndex = 0;
    const runNextStage = () => {
      if (currentIndex < stages.length) {
        const stage = stages[currentIndex];
        setLoadingStage(stage);
        setTimeout(() => {
          currentIndex++;
          runNextStage();
        }, stage.delay);
      }
    };

    runNextStage();
  };

  const handleAPICall = async (message: string) => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          conversationHistory: messages.slice(-10),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response');
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let accumulatedContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.content) {
                accumulatedContent += data.content;
              }
            } catch (e) {
              // Ignore parsing errors for malformed chunks
            }
          }
        }
      }

      // Try to parse the complete response as JSON
      try {
        const tripPlanData = JSON.parse(accumulatedContent);
        
        if (tripPlanData.type === 'trip_plan') {
          // Set trip plan data for right column
          setCurrentTripPlan(tripPlanData);
          
          // Add AI confirmation message
          const confirmMessage: Message = {
            id: Date.now().toString() + '-confirm',
            content: `I've created a ${tripPlanData.duration} itinerary for ${tripPlanData.destination}! Check out your trip plan on the right. Let me know if you'd like me to adjust anything.`,
            sender: 'ai',
            timestamp: new Date(),
            type: 'text'
          };
          setMessages(prev => [...prev, confirmMessage]);
        } else {
          // Fallback to text message
          const textMessage: Message = {
            id: Date.now().toString() + '-text',
            content: accumulatedContent,
            sender: 'ai',
            timestamp: new Date(),
            type: 'text'
          };
          setMessages(prev => [...prev, textMessage]);
        }
      } catch (parseError) {
        // If JSON parsing fails, treat as regular text message
        const textMessage: Message = {
          id: Date.now().toString() + '-text',
          content: accumulatedContent || 'I received your request, but I\'m having trouble processing it right now. Please try again.',
          sender: 'ai',
          timestamp: new Date(),
          type: 'text'
        };
        setMessages(prev => [...prev, textMessage]);
      }

    } catch (error) {
      console.error('Chat error:', error);
      setError(error instanceof Error ? error.message : 'Something went wrong');
      
      // Add error message
      const errorMessage: Message = {
        id: Date.now().toString() + '-error',
        content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Something went wrong'}. Please try again.`,
        sender: 'ai',
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setLoadingStage({ stage: 'complete', message: 'Complete!' });
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    // Add user message and clear input
    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue.trim();
    setInputValue('');
    setError(null);
    setIsLoading(true);

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    // Start loading animation
    simulateLoadingStages();

    // Make API call
    await handleAPICall(currentInput);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Chat Column - Left Side (40%) */}
      <div className="w-full lg:w-2/5 flex flex-col bg-white layla-shadow-soft">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-100 px-6 py-6">
          <div className="flex items-center">
            <div className="w-12 h-12 layla-gradient rounded-xl flex items-center justify-center mr-4">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-semibold layla-text-primary layla-heading">AI Travel Agent</h1>
              <p className="text-sm layla-text-secondary">Plan your perfect trip</p>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 scrollbar-hide">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}

          {/* Error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 animate-fade-in">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700 font-medium">{error}</p>
                </div>
                <div className="ml-auto pl-3">
                  <button
                    onClick={() => setError(null)}
                    className="text-red-400 hover:text-red-600"
                  >
                    <span className="sr-only">Dismiss</span>
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <div className="bg-white border-t border-gray-100 px-6 py-6">
          <div className="flex items-end layla-grid-16">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Where would you like to go?"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent min-h-[48px] max-h-[120px] text-sm leading-relaxed font-medium"
                rows={1}
                disabled={isLoading}
              />
            </div>
            <button
              onClick={handleSend}
              disabled={!inputValue.trim() || isLoading}
              className="layla-button layla-button-primary px-4 py-3 rounded-xl"
            >
              {isLoading ? (
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="m100-200c0-8.284-6.716-15-15-15-8.284 0-15 6.716-15 15 0 8.284 6.716 15 15 15 8.284 0 15-6.716 15-15zm-1.5 0c0 7.456-6.044 13.5-13.5 13.5-7.456 0-13.5-6.044-13.5-13.5 0-7.456 6.044-13.5 13.5-13.5 7.456 0 13.5 6.044 13.5 13.5z"></path>
                </svg>
              ) : (
                <svg 
                  className="w-5 h-5 transform rotate-45" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Itinerary Column - Right Side (60%) */}
      <div className="hidden lg:flex lg:w-3/5 flex-col bg-gray-50">
        {isLoading ? (
          <TripPlanSkeleton loadingStage={loadingStage} />
        ) : currentTripPlan ? (
          <div className="h-full overflow-y-auto scrollbar-hide">
            <TripPlan 
              tripData={currentTripPlan} 
              onBookTrip={() => console.log('Book trip clicked')}
            />
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center max-w-md mx-auto px-6">
              <div className="w-24 h-24 layla-gradient rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold layla-text-primary layla-heading mb-4">
                Ready to Plan Your Trip?
              </h2>
              <p className="layla-text-secondary text-lg leading-relaxed">
                Tell me where you'd like to go and I'll create a personalized itinerary with flights, hotels, and activities just for you.
              </p>
              <div className="mt-8 space-y-3">
                <p className="text-sm layla-text-secondary font-medium">Try asking:</p>
                <div className="space-y-2">
                  <div className="layla-card rounded-lg p-3 text-left">
                    <p className="text-sm layla-text-primary">"Plan me a 5-day trip to Paris under $2000"</p>
                  </div>
                  <div className="layla-card rounded-lg p-3 text-left">
                    <p className="text-sm layla-text-primary">"Find a romantic getaway to Rome"</p>
                  </div>
                  <div className="layla-card rounded-lg p-3 text-left">
                    <p className="text-sm layla-text-primary">"Plan a family trip to Tokyo for 7 days"</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TravelChat;
