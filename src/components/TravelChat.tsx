'use client';

import React, { useState, useRef, useEffect } from 'react';
import TripPlan, { TripPlanData } from './TripPlan';
import TripPlanSkeleton from './TripPlanSkeleton';
import DesigningTrip from './DesigningTrip';
import TypewriterText from './TypewriterText';
import IncrementalTripPlan from './IncrementalTripPlan';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'text' | 'trip_plan' | 'follow_up';
  tripData?: TripPlanData;
  isTyping?: boolean;
}

type ConversationPhase = 'initial' | 'follow_up' | 'generating' | 'complete';
type LoadingPhase = 'idle' | 'analyzing' | 'flights' | 'hotels' | 'activities' | 'complete';

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
      className={`flex mb-6 animate-fade-in ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {!isUser && (
        <div className="flex-shrink-0 mr-4">
          <div className="w-10 h-10 layla-gradient rounded-full flex items-center justify-center shadow-sm">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      )}
      
      <div className="flex flex-col max-w-lg">
        <div className={`px-5 py-4 rounded-2xl break-words ${
          isUser 
            ? 'layla-gradient text-white rounded-br-lg shadow-sm' 
            : 'bg-gray-50 border border-gray-100 text-gray-700 rounded-bl-lg shadow-sm'
        }`}>
          {message.isTyping ? (
            <>
              <TypewriterText 
                text={message.content || ''}
                speed={25}
                className="text-sm leading-relaxed font-normal"
                isLoading={message.content?.includes('...') || false}
              />
              {message.content?.includes('...') && (
                <div className="mt-3 mb-1">
                  <div className="w-full bg-gray-200 rounded-full h-1">
                    <div className="bg-teal-500 h-1 rounded-full animate-pulse" style={{ width: '45%', transition: 'width 2s ease-in-out' }}></div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div 
              className="text-sm leading-relaxed font-normal"
              dangerouslySetInnerHTML={{ 
                __html: (message.content || '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br />') 
              }}
            />
          )}
        </div>
        <p className={`text-xs mt-2 px-2 ${
          isUser ? 'text-gray-400 text-right' : 'text-gray-500'
        }`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
      
      {isUser && (
        <div className="flex-shrink-0 ml-4">
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center shadow-sm">
            <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
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
  const [conversationPhase, setConversationPhase] = useState<ConversationPhase>('initial');
  const [loadingPhase, setLoadingPhase] = useState<LoadingPhase>('idle');
  const [phaseMessage, setPhaseMessage] = useState<string>('');
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
    if (initialMessage && !isLoading && conversationPhase === 'initial') {
      setInputValue(initialMessage);
      // Auto-send the initial message after a brief delay
      const timeoutId = setTimeout(() => {
        if (initialMessage.trim()) {
          const userMessage: Message = {
            id: 'initial-user-' + Date.now().toString(),
            content: initialMessage.trim(),
            sender: 'user',
            timestamp: new Date(),
            type: 'text'
          };
          setMessages(prev => {
            // Prevent duplicate initial messages
            const hasInitialMessage = prev.some(msg => msg.id.startsWith('initial-user-'));
            if (hasInitialMessage) return prev;
            return [...prev, userMessage];
          });
          setInputValue('');
          setError(null);
          setIsLoading(true);
          setConversationPhase('follow_up');
          
          // Make API call
          handleAPICall(initialMessage.trim());
        }
      }, 500);

      return () => clearTimeout(timeoutId);
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

  const simulateIncrementalLoading = (tripData?: TripPlanData) => {
    const phases = [
      { phase: 'analyzing' as LoadingPhase, message: 'Analyzing your request...', delay: 2000 },
      { phase: 'flights' as LoadingPhase, message: 'Finding best flights...', delay: 2500 },
      { phase: 'hotels' as LoadingPhase, message: 'Searching hotels...', delay: 2200 },
      { phase: 'activities' as LoadingPhase, message: 'Planning activities...', delay: 2800 },
      { phase: 'complete' as LoadingPhase, message: 'Complete!', delay: 1000 }
    ];

    let currentIndex = 0;
    
    const runNextPhase = () => {
      if (currentIndex < phases.length) {
        const currentPhase = phases[currentIndex];
        setLoadingPhase(currentPhase.phase);
        setPhaseMessage(currentPhase.message);
        
        // If we have trip data and we're past analyzing, set it
        if (tripData && currentPhase.phase !== 'analyzing') {
          setCurrentTripPlan(tripData);
        }
        
        setTimeout(() => {
          currentIndex++;
          runNextPhase();
        }, currentPhase.delay);
      } else {
        // All phases complete
        setIsLoading(false);
        setConversationPhase('complete');
      }
    };

    runNextPhase();
  };

  const showThinkingMessages = (userMessage: string) => {
    // Start the generating phase and incremental loading immediately
    setConversationPhase('generating');
    setLoadingPhase('analyzing');
    setPhaseMessage('Analyzing your preferences...');
    
    // Create a single thinking message that will be updated
    const thinkingMessageId = Date.now().toString() + '-thinking';
    const initialThinkingMessage: Message = {
      id: thinkingMessageId,
      content: '🤔 Analyzing your preferences...',
      sender: 'ai',
      timestamp: new Date(),
      type: 'text',
      isTyping: true
    };

    setMessages(prev => [...prev, initialThinkingMessage]);

    // Start the actual API call immediately - no need to show multiple thinking messages
    // The incremental loading will handle the visual feedback
    setTimeout(() => {
      handleAPICall(userMessage, thinkingMessageId);
    }, 1500);
  };

  const handleAPICall = async (message: string, thinkingMessageId?: string) => {
    // Validate message input
    if (!message || typeof message !== 'string' || !message.trim()) {
      setError('Please enter a valid message');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          conversationHistory: messages
            .slice(-10)
            .filter(msg => msg && msg.content && typeof msg.content === 'string' && msg.content.trim())
            .map(msg => ({
              sender: msg.sender,
              content: msg.content.trim()
            })),
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
        const responseData = JSON.parse(accumulatedContent);
        
        if (responseData.type === 'follow_up') {
          // This is a follow-up response - stay in follow_up phase
          if (thinkingMessageId) {
            // Update the existing thinking message
            setMessages(prev => prev.map(msg => 
              msg.id === thinkingMessageId 
                ? { ...msg, content: responseData.message || 'Processing your request...', isTyping: true, type: 'follow_up' }
                : msg
            ));
          } else {
            // Add new message if no thinking message exists
            const followUpMessage: Message = {
              id: Date.now().toString() + '-followup',
              content: responseData.message || 'I need some more information to help you better.',
              sender: 'ai',
              timestamp: new Date(),
              type: 'follow_up',
              isTyping: true
            };
            setMessages(prev => [...prev, followUpMessage]);
          }
          
        } else if (responseData.type === 'trip_plan') {
          // This is a complete trip plan - start incremental loading
          const confirmContent = `Perfect! I've crafted an amazing ${responseData.duration || 'trip'} to ${responseData.destination || 'your destination'} just for you! ✨\n\nI'm now building your personalized itinerary step by step. Watch the right side as I find flights, select hotels, and plan activities!`;
          
          if (thinkingMessageId) {
            // Update the existing thinking message with confirmation
            setMessages(prev => prev.map(msg => 
              msg.id === thinkingMessageId 
                ? { ...msg, content: confirmContent, isTyping: true, type: 'text' }
                : msg
            ));
          } else {
            // Add new message if no thinking message exists
            const confirmMessage: Message = {
              id: Date.now().toString() + '-confirm',
              content: confirmContent,
              sender: 'ai',
              timestamp: new Date(),
              type: 'text',
              isTyping: true
            };
            setMessages(prev => [...prev, confirmMessage]);
          }
          
          // Start incremental loading with the trip data
          simulateIncrementalLoading(responseData);
        } else {
          // Fallback to text message - but check if it's JSON first
          let displayContent = accumulatedContent || 'I received your message and I\'m working on a response.';
          
          // If content looks like JSON, show a generic message instead
          if (accumulatedContent && (accumulatedContent.trim().startsWith('{') || accumulatedContent.trim().startsWith('['))) {
            displayContent = 'I\'ve processed your request! Let me know if you need any adjustments or have other questions.';
          }
          
          const textMessage: Message = {
            id: Date.now().toString() + '-text',
            content: displayContent,
            sender: 'ai',
            timestamp: new Date(),
            type: 'text'
          };
          setMessages(prev => [...prev, textMessage]);
        }
      } catch (parseError) {
        // If JSON parsing fails, treat as regular text message
        let displayContent = accumulatedContent || 'I received your request, but I\'m having trouble processing it right now. Please try again.';
        
        // If content looks like JSON, show a generic message instead
        if (accumulatedContent && (accumulatedContent.trim().startsWith('{') || accumulatedContent.trim().startsWith('['))) {
          displayContent = 'I\'ve processed your request, but there was a formatting issue. Please try asking again.';
        }
        
        const textMessage: Message = {
          id: Date.now().toString() + '-text',
          content: displayContent,
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
      // Don't set isLoading to false here if we're in incremental loading mode
      // The incremental loading will handle this
      if (loadingPhase === 'idle' || loadingPhase === 'analyzing') {
        setIsLoading(false);
      }
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

    // If we're in follow_up phase and user is providing details, show thinking messages
    if (conversationPhase === 'follow_up') {
      // Check if this looks like detailed information (has numbers, dates, etc.)
      const hasDetails = /\d/.test(currentInput) || currentInput.split(' ').length > 10;
      if (hasDetails) {
        setConversationPhase('generating');
        // Show thinking messages instead of direct API call
        showThinkingMessages(currentInput);
        setIsLoading(false); // Reset loading since thinking messages handle it
        return;
      }
    }

    // Make API call for other phases
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
          {messages
            .filter(message => message && message.content !== undefined && message.id)
            .map((message) => (
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

        {/* Chat Input - Exact Layla.ai Style */}
        <div className="bg-white border-t border-gray-100 px-6 py-4">
          <div className="relative">
            <div className="bg-white border border-gray-200 rounded-2xl layla-shadow-soft focus-within:border-teal-400 focus-within:ring-2 focus-within:ring-teal-100 transition-all duration-200">
              <div className="flex items-center pr-2">
                <div className="flex-1 relative">
                  <textarea
                    ref={textareaRef}
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    placeholder="Where would you like to go?"
                    className="w-full px-4 py-3 bg-transparent border-none resize-none focus:outline-none text-sm leading-relaxed font-normal text-gray-800 placeholder:text-gray-400 min-h-[44px] max-h-[120px]"
                    rows={1}
                    disabled={isLoading}
                  />
                </div>
                <button
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isLoading}
                  className="w-8 h-8 layla-gradient rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex-shrink-0"
                >
                  {isLoading ? (
                    <svg className="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="m100-200c0-8.284-6.716-15-15-15-8.284 0-15 6.716-15 15 0 8.284 6.716 15 15 15 8.284 0 15-6.716 15-15zm-1.5 0c0 7.456-6.044 13.5-13.5 13.5-7.456 0-13.5-6.044-13.5-13.5 0-7.456 6.044-13.5 13.5-13.5 7.456 0 13.5 6.044 13.5 13.5z"></path>
                    </svg>
                  ) : (
                    <svg 
                      className="w-4 h-4 text-white" 
                      fill="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Itinerary Column - Right Side (60%) */}
      <div className="hidden lg:flex lg:w-3/5 flex-col bg-gray-50">
        {(() => {
          switch (conversationPhase) {
            case 'initial':
              return (
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
              );
            
            case 'follow_up':
              return <DesigningTrip />;
            
            case 'generating':
            case 'complete':
              return (
                <IncrementalTripPlan
                  loadingPhase={loadingPhase}
                  tripData={currentTripPlan || undefined}
                  phaseMessage={phaseMessage}
                />
              );
            
            default:
              return <DesigningTrip />;
          }
        })()}
      </div>
    </div>
  );
};

export default TravelChat;
