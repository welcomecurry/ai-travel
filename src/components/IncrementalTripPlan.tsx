'use client';

import React from 'react';
import { TripPlanData } from './TripPlan';
import { getDestinationImage, getGradientFallback, getUnsplashImageUrl, getHotelImageUrl, getActivityImageUrl, AIRLINE_LOGOS, HOTEL_AMENITIES, ACTIVITY_ICONS } from '../lib/destinationImages';
import { SectionLoadingState } from '../lib/queryDetection';
import ImageWithFallback from './ImageWithFallback';

type LoadingPhase = 'idle' | 'analyzing' | 'flights' | 'hotels' | 'activities' | 'complete';

interface IncrementalTripPlanProps {
  loadingPhase: LoadingPhase;
  tripData?: TripPlanData;
  phaseMessage: string;
  sectionLoadingStates?: SectionLoadingState[];
  isFollowUpQuery?: boolean;
}

const IncrementalTripPlan: React.FC<IncrementalTripPlanProps> = ({ 
  loadingPhase, 
  tripData, 
  phaseMessage,
  sectionLoadingStates = [],
  isFollowUpQuery = false
}) => {
  
  // Helper function to check if a section is loading
  const isSectionLoading = (section: 'hotels' | 'flights' | 'activities'): boolean => {
    const isLoading = sectionLoadingStates.some(state => state.section === section && state.isLoading);
    console.log(`🔍 Checking ${section} loading state:`, { isLoading, sectionLoadingStates });
    return isLoading;
  };
  
  // Helper function to get section loading message
  const getSectionLoadingMessage = (section: 'hotels' | 'flights' | 'activities'): string => {
    const state = sectionLoadingStates.find(state => state.section === section && state.isLoading);
    return state?.message || '';
  };
  const renderDestinationHeader = () => {
    if (loadingPhase === 'analyzing' || !tripData) {
      return (
        <div className="relative h-80 overflow-hidden">
          {/* Loading skeleton with gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-400 via-slate-500 to-slate-600 animate-pulse">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          </div>
          
          {/* Loading content */}
          <div className="relative h-full flex flex-col justify-end p-8">
            <div className="animate-pulse">
              <div className="h-12 bg-white/20 rounded-lg w-1/2 mb-4"></div>
              <div className="flex flex-wrap gap-3 mb-6">
                <div className="h-8 bg-white/20 rounded-full w-32"></div>
                <div className="h-8 bg-white/20 rounded-full w-28"></div>
                <div className="h-8 bg-white/20 rounded-full w-36"></div>
              </div>
            </div>
            <div className="absolute top-6 right-6">
              <div className="h-12 bg-white/20 rounded-xl w-36"></div>
            </div>
          </div>
        </div>
      );
    }

    // Get destination image or fallback
    const destinationImage = getDestinationImage(tripData.destination);
    const gradientFallback = getGradientFallback(tripData.destination);

    return (
      <div className="relative h-80 overflow-hidden rounded-t-2xl">
        {/* Hero background image or gradient */}
        <ImageWithFallback
          src={destinationImage?.url || getUnsplashImageUrl(tripData.destination, 1920, 1080)}
          alt={destinationImage?.alt || `${tripData.destination} cityscape`}
          className="absolute inset-0 w-full h-full object-cover"
          fallbackGradient={gradientFallback}
          showShimmer={true}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
        
        {/* Content overlay */}
        <div className="relative h-full flex flex-col justify-end p-8">
          {/* Trip Cart Button - Top Right */}
          <button className="absolute top-6 right-6 bg-white text-gray-800 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200 flex items-center shadow-lg hover:shadow-xl group">
            <svg className="w-5 h-5 mr-2 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
            </svg>
            <span className="text-teal-600 font-bold">${tripData.totalCost.total.toLocaleString()}</span>
          </button>

          {/* Destination title */}
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 drop-shadow-lg">
            {tripData.destination}
          </h1>
          
          {/* Trip details badges */}
          <div className="flex flex-wrap gap-3">
            <div className="bg-white/90 backdrop-blur-sm text-gray-800 px-4 py-2 rounded-full font-medium flex items-center shadow-lg">
              <span className="mr-2">📅</span>
              {tripData.duration}
            </div>
            <div className="bg-white/90 backdrop-blur-sm text-gray-800 px-4 py-2 rounded-full font-medium flex items-center shadow-lg">
              <span className="mr-2">👤</span>
              {tripData.travelers} {tripData.travelers === 1 ? 'traveler' : 'travelers'}
            </div>
            <div className="bg-white/90 backdrop-blur-sm text-gray-800 px-4 py-2 rounded-full font-medium flex items-center shadow-lg">
              <span className="mr-2">💰</span>
              {tripData.budget}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderFlightSection = () => {
    const isFlightLoading = isSectionLoading('flights');
    const flightLoadingMessage = getSectionLoadingMessage('flights');
    
    // Show targeted loading for follow-up queries
    if (isFollowUpQuery && isFlightLoading && tripData?.flights) {
      return (
        <div className="p-6 pb-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 transition-all duration-500">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <div className="bg-blue-50 text-blue-600 p-3 rounded-xl mr-4">
                  ✈️
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Flight Options</h2>
              </div>
              <div className="flex items-center bg-orange-50 text-orange-600 px-4 py-2 rounded-full">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse mr-1"></div>
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse mr-1" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse mr-2" style={{ animationDelay: '0.4s' }}></div>
                </div>
                <span className="font-medium text-sm">{flightLoadingMessage.replace('✈️ ', '')}</span>
              </div>
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border border-gray-100 rounded-xl p-6 animate-pulse opacity-60">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-5 bg-gray-200 rounded w-32 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-48 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-24"></div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="h-8 bg-gray-200 rounded w-20 mb-1"></div>
                      <div className="h-3 bg-gray-200 rounded w-16"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }
    
    // Initial loading state
    if (loadingPhase === 'flights' && (!tripData || !tripData.flights)) {
      return (
        <div className="p-6 pb-8">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <div className="bg-blue-50 text-blue-600 p-3 rounded-xl mr-4">
                  ✈️
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Flight Options</h2>
              </div>
              <div className="flex items-center bg-orange-50 text-orange-600 px-4 py-2 rounded-full">
                <svg className="w-4 h-4 animate-spin mr-2" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="m100-200c0-8.284-6.716-15-15-15-8.284 0-15 6.716-15 15 0 8.284 6.716 15 15 15 8.284 0 15-6.716 15-15zm-1.5 0c0 7.456-6.044 13.5-13.5 13.5-7.456 0-13.5-6.044-13.5-13.5 0-7.456 6.044-13.5 13.5-13.5 7.456 0 13.5 6.044 13.5 13.5z"></path>
                </svg>
                <span className="font-medium text-sm">Searching...</span>
              </div>
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border border-gray-100 rounded-xl p-6 animate-pulse">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-5 bg-gray-200 rounded w-32 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-48 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-24"></div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="h-8 bg-gray-200 rounded w-20 mb-1"></div>
                      <div className="h-3 bg-gray-200 rounded w-16"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (tripData && tripData.flights && loadingPhase !== 'analyzing' && !isFlightLoading) {
      // Show actual flight data (only if not currently loading)
      return (
        <div className="p-6 pb-8">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <div className="bg-blue-50 text-blue-600 p-3 rounded-xl mr-4">
                  ✈️
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Flight Options</h2>
              </div>
              <div className="flex items-center bg-green-50 text-green-600 px-4 py-2 rounded-full">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium text-sm">Found!</span>
              </div>
            </div>
            <div className="space-y-4">
              {tripData.flights.map((flight) => (
                <div key={flight.id} className="border border-gray-100 rounded-xl p-6 hover:shadow-md transition-all duration-200 hover:border-teal-200">
                  <div className="flex items-center justify-between">
                    {/* Airline and route info */}
                    <div className="flex items-center space-x-6 flex-1">
                      {/* Airline logo/icon */}
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-teal-50 rounded-full flex items-center justify-center text-2xl mb-1">
                          {AIRLINE_LOGOS[flight.airline] || '✈️'}
                        </div>
                        <span className="text-xs text-gray-500 font-medium">{flight.flightNumber}</span>
                      </div>
                      
                      {/* Flight details */}
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h3 className="font-bold text-lg text-gray-900 mr-3">{flight.airline}</h3>
                          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs font-medium">
                            {flight.stops === 0 ? 'Direct' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
                          </span>
                        </div>
                        
                        {/* Route with arrow */}
                        <div className="flex items-center text-gray-600 mb-2">
                          <span className="font-mono text-lg font-bold">{flight.route.split(' → ')[0] || 'JFK'}</span>
                          <svg className="w-5 h-5 mx-3 text-teal-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                          <span className="font-mono text-lg font-bold">{flight.route.split(' → ')[1] || 'LHR'}</span>
                        </div>
                        
                        {/* Time details */}
                        <div className="flex items-center text-sm text-gray-500">
                          <span className="font-medium">{flight.departureTime} - {flight.arrivalTime}</span>
                          <span className="mx-2">•</span>
                          <span className="font-medium">{flight.duration}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Price */}
                    <div className="text-right ml-6">
                      <div className="text-3xl font-bold text-teal-600 mb-1">${flight.price.toLocaleString()}</div>
                      <div className="text-sm text-gray-500 font-medium">per person</div>
                      <button className="mt-3 bg-teal-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-teal-700 transition-colors text-sm">
                        Select
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // Fallback: if we have flight data but no loading state, show the data
    if (tripData && tripData.flights && loadingPhase !== 'analyzing') {
      console.log('🔄 Flight section fallback - showing data despite loading state');
      return (
        <div className="p-6 pb-8">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <div className="bg-blue-50 text-blue-600 p-3 rounded-xl mr-4">
                  ✈️
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Flight Options</h2>
              </div>
              <div className="flex items-center bg-green-50 text-green-600 px-4 py-2 rounded-full">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium text-sm">Found!</span>
              </div>
            </div>
            <div className="space-y-4">
              {tripData.flights.map((flight) => (
                <div key={flight.id} className="border border-gray-100 rounded-xl p-6 hover:shadow-md transition-all duration-200 hover:border-teal-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6 flex-1">
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-teal-50 rounded-full flex items-center justify-center text-2xl mb-1">
                          {AIRLINE_LOGOS[flight.airline] || '✈️'}
                        </div>
                        <span className="text-xs text-gray-500 font-medium">{flight.flightNumber}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h3 className="font-bold text-lg text-gray-900 mr-3">{flight.airline}</h3>
                          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs font-medium">
                            {flight.stops === 0 ? 'Direct' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
                          </span>
                        </div>
                        <div className="flex items-center text-gray-600 mb-2">
                          <span className="font-mono text-lg font-bold">{flight.route.split(' → ')[0] || 'JFK'}</span>
                          <svg className="w-5 h-5 mx-3 text-teal-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                          <span className="font-mono text-lg font-bold">{flight.route.split(' → ')[1] || 'LHR'}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <span className="font-medium">{flight.departureTime} - {flight.arrivalTime}</span>
                          <span className="mx-2">•</span>
                          <span className="font-medium">{flight.duration}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right ml-6">
                      <div className="text-3xl font-bold text-teal-600 mb-1">${flight.price.toLocaleString()}</div>
                      <div className="text-sm text-gray-500 font-medium">per person</div>
                      <button className="mt-3 bg-teal-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-teal-700 transition-colors text-sm">
                        Select
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  const renderHotelSection = () => {
    const isHotelLoading = isSectionLoading('hotels');
    const hotelLoadingMessage = getSectionLoadingMessage('hotels');
    
    // Show targeted loading for follow-up queries
    if (isFollowUpQuery && isHotelLoading && tripData?.hotels) {
      return (
        <div className="p-6 pb-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 transition-all duration-500">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <div className="bg-purple-50 text-purple-600 p-3 rounded-xl mr-4">
                  🏨
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Hotel Recommendations</h2>
              </div>
              <div className="flex items-center bg-orange-50 text-orange-600 px-4 py-2 rounded-full">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse mr-1"></div>
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse mr-1" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse mr-2" style={{ animationDelay: '0.4s' }}></div>
                </div>
                <span className="font-medium text-sm">{hotelLoadingMessage.replace('🏨 ', '')}</span>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <div key={i} className="border border-gray-100 rounded-xl overflow-hidden animate-pulse opacity-60">
                  <div className="aspect-[4/3] bg-gray-200"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                    <div className="flex items-center mb-3">
                      <div className="flex space-x-1">
                        {[...Array(5)].map((_, j) => (
                          <div key={j} className="w-4 h-4 bg-gray-200 rounded"></div>
                        ))}
                      </div>
                      <div className="h-4 bg-gray-200 rounded w-12 ml-2"></div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <div className="h-6 bg-gray-200 rounded w-16"></div>
                      <div className="h-6 bg-gray-200 rounded w-20"></div>
                      <div className="h-6 bg-gray-200 rounded w-14"></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="h-8 bg-gray-200 rounded w-24"></div>
                      <div className="h-8 bg-gray-200 rounded w-20"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }
    
    // Initial loading state
    if (loadingPhase === 'hotels' && (!tripData || !tripData.hotels)) {
      return (
        <div className="p-6 pb-8">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <div className="bg-purple-50 text-purple-600 p-3 rounded-xl mr-4">
                  🏨
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Hotel Recommendations</h2>
              </div>
              <div className="flex items-center bg-orange-50 text-orange-600 px-4 py-2 rounded-full">
                <svg className="w-4 h-4 animate-spin mr-2" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="m100-200c0-8.284-6.716-15-15-15-8.284 0-15 6.716-15 15 0 8.284 6.716 15 15 15 8.284 0 15-6.716 15-15zm-1.5 0c0 7.456-6.044 13.5-13.5 13.5-7.456 0-13.5-6.044-13.5-13.5 0-7.456 6.044-13.5 13.5-13.5 7.456 0 13.5 6.044 13.5 13.5z"></path>
                </svg>
                <span className="font-medium text-sm">Searching...</span>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <div key={i} className="border border-gray-100 rounded-xl overflow-hidden animate-pulse">
                  <div className="aspect-[4/3] bg-gray-200"></div>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-6 bg-gray-200 rounded w-16 ml-3"></div>
                    </div>
                    <div className="flex items-center mb-3">
                      <div className="flex space-x-1">
                        {[...Array(5)].map((_, j) => (
                          <div key={j} className="w-4 h-4 bg-gray-200 rounded"></div>
                        ))}
                      </div>
                      <div className="h-4 bg-gray-200 rounded w-12 ml-2"></div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <div className="h-6 bg-gray-200 rounded w-16"></div>
                      <div className="h-6 bg-gray-200 rounded w-20"></div>
                      <div className="h-6 bg-gray-200 rounded w-14"></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="h-8 bg-gray-200 rounded w-24"></div>
                      <div className="h-8 bg-gray-200 rounded w-20"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (tripData && tripData.hotels && ['hotels', 'activities', 'complete'].includes(loadingPhase) && !isHotelLoading) {
      // Show actual hotel data (only if not currently loading)
      return (
        <div className="p-6 pb-8">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <div className="bg-purple-50 text-purple-600 p-3 rounded-xl mr-4">
                  🏨
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Hotel Recommendations</h2>
              </div>
              <div className="flex items-center bg-green-50 text-green-600 px-4 py-2 rounded-full">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium text-sm">Found!</span>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {tripData.hotels.map((hotel) => (
                  <div key={hotel.id} className="border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200 hover:border-purple-200">
                    {/* Hotel Image */}
                    <div className="aspect-[4/3] relative overflow-hidden">
                      <ImageWithFallback
                        src={getHotelImageUrl(hotel.name, hotel.location)}
                        alt={`${hotel.name} hotel`}
                        className="w-full h-full object-cover"
                        fallbackGradient="bg-gradient-to-br from-purple-100 to-pink-100"
                        showShimmer={true}
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-white/90 backdrop-blur-sm text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">
                          {hotel.category}
                        </span>
                      </div>
                    </div>
                  
                  <div className="p-6">
                    {/* Hotel name and rating */}
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-bold text-xl text-gray-900 leading-tight">{hotel.name}</h3>
                    </div>
                    
                    {/* Rating stars */}
                    <div className="flex items-center mb-3">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className={`w-5 h-5 ${i < hotel.rating ? 'fill-current' : 'text-gray-300'}`} viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-gray-600 text-sm ml-2 font-medium">{hotel.rating}/5</span>
                      <span className="text-gray-400 text-sm ml-1">• {hotel.location}</span>
                    </div>
                    
                    {/* Description */}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">{hotel.description}</p>
                    
                    {/* Amenities with icons */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {hotel.amenities.slice(0, 4).map((amenity) => (
                        <div key={amenity} className="flex items-center bg-gray-50 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                          <span className="mr-1">{HOTEL_AMENITIES[amenity] || '•'}</span>
                          {amenity}
                        </div>
                      ))}
                    </div>
                    
                    {/* Price and action */}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-3xl font-bold text-purple-600">${hotel.pricePerNight}</span>
                        <span className="text-gray-500 text-sm font-medium">/night</span>
                      </div>
                      <button className="bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors text-sm">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  const renderItinerarySection = () => {
    const isActivityLoading = isSectionLoading('activities');
    const activityLoadingMessage = getSectionLoadingMessage('activities');
    
    // Show targeted loading for follow-up queries
    if (isFollowUpQuery && isActivityLoading && tripData?.itinerary) {
      return (
        <div className="p-6 pb-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 transition-all duration-500">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <div className="bg-green-50 text-green-600 p-3 rounded-xl mr-4">
                  📅
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Day-by-Day Itinerary</h2>
              </div>
              <div className="flex items-center bg-orange-50 text-orange-600 px-4 py-2 rounded-full">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse mr-1"></div>
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse mr-1" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse mr-2" style={{ animationDelay: '0.4s' }}></div>
                </div>
                <span className="font-medium text-sm">{activityLoadingMessage.replace('🎯 ', '').replace('📅 ', '')}</span>
              </div>
            </div>
            
            {/* Timeline skeleton with reduced opacity */}
            <div className="relative opacity-60">
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>
              {[1, 2, 3].map((day) => (
                <div key={day} className="relative mb-8 last:mb-0">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-16 h-16 bg-gray-200 rounded-full animate-pulse flex items-center justify-center relative z-10">
                      <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                    </div>
                    <div className="ml-6 flex-1">
                      <div className="bg-gray-50 rounded-xl p-6 animate-pulse">
                        <div className="h-6 bg-gray-200 rounded w-1/3 mb-3"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                        <div className="space-y-3">
                          {[1, 2].map((activity) => (
                            <div key={activity} className="flex items-center space-x-4 p-3 bg-white rounded-lg">
                              <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                              <div className="flex-1">
                                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                              </div>
                              <div className="h-4 bg-gray-200 rounded w-12"></div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }
    
    // Initial loading state
    if (loadingPhase === 'activities' && (!tripData || !tripData.itinerary)) {
      return (
        <div className="p-6 pb-8">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <div className="bg-green-50 text-green-600 p-3 rounded-xl mr-4">
                  📅
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Day-by-Day Itinerary</h2>
              </div>
              <div className="flex items-center bg-orange-50 text-orange-600 px-4 py-2 rounded-full">
                <svg className="w-4 h-4 animate-spin mr-2" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="m100-200c0-8.284-6.716-15-15-15-8.284 0-15 6.716-15 15 0 8.284 6.716 15 15 15 8.284 0 15-6.716 15-15zm-1.5 0c0 7.456-6.044 13.5-13.5 13.5-7.456 0-13.5-6.044-13.5-13.5 0-7.456 6.044-13.5 13.5-13.5 7.456 0 13.5 6.044 13.5 13.5z"></path>
                </svg>
                <span className="font-medium text-sm">Planning...</span>
              </div>
            </div>
            
            {/* Timeline skeleton */}
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>
              {[1, 2, 3].map((day) => (
                <div key={day} className="relative mb-8 last:mb-0">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-16 h-16 bg-gray-200 rounded-full animate-pulse flex items-center justify-center relative z-10">
                      <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                    </div>
                    <div className="ml-6 flex-1">
                      <div className="bg-gray-50 rounded-xl p-6 animate-pulse">
                        <div className="h-6 bg-gray-200 rounded w-1/3 mb-3"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                        <div className="space-y-3">
                          {[1, 2].map((activity) => (
                            <div key={activity} className="flex items-center space-x-4 p-3 bg-white rounded-lg">
                              <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                              <div className="flex-1">
                                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                              </div>
                              <div className="h-4 bg-gray-200 rounded w-12"></div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (tripData && tripData.itinerary && loadingPhase === 'complete' && !isActivityLoading) {
      // Show actual itinerary data with timeline (only if not currently loading)
      return (
        <div className="p-6 pb-8">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <div className="bg-green-50 text-green-600 p-3 rounded-xl mr-4">
                  📅
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Day-by-Day Itinerary</h2>
              </div>
              <div className="flex items-center bg-green-50 text-green-600 px-4 py-2 rounded-full">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium text-sm">Complete!</span>
              </div>
            </div>
            
            {/* Timeline view */}
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-teal-200 via-green-200 to-blue-200"></div>
              {tripData.itinerary.map((day, dayIndex) => (
                <div key={day.day} className="relative mb-8 last:mb-0">
                  <div className="flex items-start">
                    {/* Day number circle */}
                    <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-teal-500 to-green-500 rounded-full flex items-center justify-center relative z-10 shadow-lg">
                      <span className="text-white font-bold text-xl">{day.day}</span>
                    </div>
                    
                    {/* Day content */}
                    <div className="ml-6 flex-1">
                      <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 shadow-sm border border-gray-100">
                        {/* Day header */}
                        <div className="mb-6">
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">{day.title}</h3>
                          <p className="text-gray-600 leading-relaxed">{day.description}</p>
                        </div>
                        
                        {/* Activities */}
                        <div className="space-y-4">
                          {day.activities.map((activity, activityIndex) => (
                            <div key={activity.id} className="flex items-start space-x-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
                              {/* Activity image */}
                              <div className="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden relative">
                                <ImageWithFallback
                                  src={getActivityImageUrl(activity.name, tripData.destination)}
                                  alt={activity.name}
                                  className="w-full h-full object-cover"
                                  fallbackGradient="bg-gradient-to-br from-teal-100 to-blue-100"
                                  showShimmer={true}
                                />
                                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/20"></div>
                                <div className="absolute bottom-1 right-1 text-white text-lg">
                                  {ACTIVITY_ICONS[activity.type] || '✨'}
                                </div>
                              </div>
                              
                              {/* Activity details */}
                              <div className="flex-1">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center mb-2">
                                      <h4 className="font-bold text-lg text-gray-900 mr-3">{activity.name}</h4>
                                      <span className="bg-teal-50 text-teal-700 px-2 py-1 rounded-md text-xs font-medium capitalize">
                                        {activity.type}
                                      </span>
                                    </div>
                                    <p className="text-gray-600 text-sm mb-3 leading-relaxed">{activity.description}</p>
                                    <div className="flex items-center text-sm text-gray-500">
                                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                      </svg>
                                      <span className="font-medium mr-4">{activity.time}</span>
                                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                      </svg>
                                      <span className="font-medium">{activity.duration}</span>
                                    </div>
                                  </div>
                                  <div className="text-right ml-4">
                                    <div className="text-2xl font-bold text-green-600 mb-1">${activity.price}</div>
                                    <div className="text-xs text-gray-500 font-medium">per person</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Cost summary */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="bg-gradient-to-r from-teal-50 to-green-50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="mr-2">💰</span>
                  Total Trip Cost
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">${tripData.totalCost.flights.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Flights</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">${tripData.totalCost.hotels.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Hotels</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">${tripData.totalCost.activities.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Activities</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-teal-600">${tripData.totalCost.total.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Total</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  const renderLoadingMessage = () => {
    if (loadingPhase !== 'complete' && loadingPhase !== 'idle') {
      return (
        <div className="p-6">
          <div className="bg-gradient-to-r from-teal-500 to-blue-600 rounded-2xl p-6 text-white text-center shadow-lg">
            <div className="flex items-center justify-center mb-4">
              <svg className="w-6 h-6 animate-spin mr-3" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="m100-200c0-8.284-6.716-15-15-15-8.284 0-15 6.716-15 15 0 8.284 6.716 15 15 15 8.284 0 15-6.716 15-15zm-1.5 0c0 7.456-6.044 13.5-13.5 13.5-7.456 0-13.5-6.044-13.5-13.5 0-7.456 6.044-13.5 13.5-13.5 7.456 0 13.5 6.044 13.5 13.5z"></path>
              </svg>
              <span className="text-xl font-bold">{phaseMessage}</span>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-full h-3 max-w-sm mx-auto">
              <div 
                className="bg-white rounded-full h-3 transition-all duration-1000 ease-out shadow-sm"
                style={{ 
                  width: `${
                    loadingPhase === 'analyzing' ? 20 : 
                    loadingPhase === 'flights' ? 40 : 
                    loadingPhase === 'hotels' ? 60 : 
                    loadingPhase === 'activities' ? 80 : 100
                  }%` 
                }}
              />
            </div>
            <div className="mt-3 text-sm text-white/80">
              Building your perfect trip...
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  if (loadingPhase === 'idle') {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-32 h-32 bg-gradient-to-br from-teal-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
            <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Plan Your Dream Trip?
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-8">
            Tell me where you'd like to go and I'll create a personalized itinerary with flights, hotels, and activities just for you.
          </p>
          <div className="grid grid-cols-1 gap-3 text-left">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <span className="text-gray-800 font-medium">"Plan me a 5-day trip to Paris under $2000"</span>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <span className="text-gray-800 font-medium">"Find a romantic getaway to Rome"</span>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <span className="text-gray-800 font-medium">"Plan a family trip to Tokyo for 7 days"</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto scrollbar-hide bg-gray-50">
      {renderLoadingMessage()}
      {renderDestinationHeader()}
      {renderFlightSection()}
      {renderHotelSection()}
      {renderItinerarySection()}
    </div>
  );
};

export default IncrementalTripPlan;
