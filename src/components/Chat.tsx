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
  
  // If it's a trip plan, render the TripPlan component
  if (message.type === 'trip_plan' && message.tripData) {
    return (
      <div className="mb-8 animate-slide-up">
        <TripPlan 
          tripData={message.tripData} 
          onBookTrip={() => console.log('Book trip clicked')}
        />
      </div>
    );
  }
  
  // Regular text message
  return (
    <div 
      className={`flex mb-4 animate-fade-in ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {!isUser && (
        <div className="flex-shrink-0 mr-3">
          <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-blue-500 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      )}
      
      <div className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-3 rounded-2xl break-words ${
        isUser 
          ? 'bg-teal-500 text-white rounded-br-md' 
          : 'bg-gray-100 text-gray-800 rounded-bl-md'
      }`}>
        <p className="text-sm leading-relaxed">{message.content}</p>
        <p className={`text-xs mt-1 ${
          isUser ? 'text-teal-100' : 'text-gray-500'
        }`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
      
      {isUser && (
        <div className="flex-shrink-0 ml-3">
          <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};

const Chat: React.FC = () => {
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
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentInput,
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
          // Create trip plan message
          const tripMessage: Message = {
            id: Date.now().toString() + '-trip',
            content: '',
            sender: 'ai',
            timestamp: new Date(),
            type: 'trip_plan',
            tripData: tripPlanData
          };
          setMessages(prev => [...prev, tripMessage]);
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 shadow-sm">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-blue-500 rounded-full flex items-center justify-center mr-3">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-800">AI Travel Agent</h1>
            <p className="text-sm text-gray-500">Plan your perfect trip</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 scrollbar-hide">
        {/* Show loading skeleton during trip planning */}
        {isLoading ? (
          <TripPlanSkeleton loadingStage={loadingStage} />
        ) : (
          <div className="max-w-6xl mx-auto">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}

            {/* Error message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 animate-fade-in">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
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
        )}
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end space-x-3">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Where would you like to go?"
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent min-h-[48px] max-h-[120px] text-sm leading-relaxed"
                rows={1}
              />
            </div>
            <button
              onClick={handleSend}
              disabled={!inputValue.trim() || isLoading}
              className="bg-teal-500 hover:bg-teal-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-full p-3 transition-colors duration-200 flex-shrink-0"
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
    </div>
  );
};

export default Chat;
