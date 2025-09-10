'use client';

import React from 'react';

interface LoadingStage {
  stage: 'searching' | 'flights' | 'hotels' | 'activities' | 'itinerary' | 'complete';
  message: string;
}

interface TripPlanSkeletonProps {
  loadingStage: LoadingStage;
}

const TripPlanSkeleton: React.FC<TripPlanSkeletonProps> = ({ loadingStage }) => {
  const stages = [
    { key: 'searching', icon: '🔍', text: 'Analyzing your request...' },
    { key: 'flights', icon: '✈️', text: 'Finding best flights...' },
    { key: 'hotels', icon: '🏨', text: 'Searching hotels...' },
    { key: 'activities', icon: '🎯', text: 'Curating activities...' },
    { key: 'itinerary', icon: '📅', text: 'Creating your itinerary...' }
  ];

  const currentStageIndex = stages.findIndex(s => s.key === loadingStage.stage);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      {/* Loading Progress */}
      <div className="bg-gradient-to-r from-teal-500 to-blue-600 rounded-2xl p-8 text-white">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">
            {stages[Math.max(0, currentStageIndex)]?.icon || '🔍'}
          </div>
          <h2 className="text-2xl font-bold mb-2">{loadingStage.message}</h2>
          <div className="bg-white/20 rounded-full h-2 w-64 mx-auto">
            <div 
              className="bg-white rounded-full h-2 transition-all duration-500 ease-out"
              style={{ width: `${((currentStageIndex + 1) / stages.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex justify-between items-center">
          {stages.map((stage, index) => (
            <div key={stage.key} className="flex flex-col items-center flex-1">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl mb-2 transition-all duration-300 ${
                index <= currentStageIndex 
                  ? 'bg-teal-100 text-teal-600 scale-110' 
                  : 'bg-gray-100 text-gray-400'
              }`}>
                {stage.icon}
              </div>
              <span className={`text-sm text-center transition-colors duration-300 ${
                index <= currentStageIndex ? 'text-teal-600 font-semibold' : 'text-gray-400'
              }`}>
                {stage.text}
              </span>
              {index < stages.length - 1 && (
                <div className="hidden lg:block absolute h-0.5 bg-gray-200 w-full top-6 left-1/2 transform -translate-y-1/2" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Skeleton Content */}
      {loadingStage.stage !== 'searching' && (
        <>
          {/* Trip Summary Skeleton */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          </div>

          {/* Flights Skeleton */}
          {currentStageIndex >= 1 && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center mb-6">
                <span className="bg-teal-100 text-teal-600 p-2 rounded-lg mr-3">✈️</span>
                <h2 className="text-2xl font-bold">Flight Options</h2>
              </div>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border border-gray-200 rounded-xl p-4 animate-pulse">
                    <div className="flex justify-between items-center">
                      <div className="space-y-2 flex-1">
                        <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                      </div>
                      <div className="text-right space-y-2">
                        <div className="h-6 bg-gray-200 rounded w-20"></div>
                        <div className="h-3 bg-gray-200 rounded w-16"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Hotels Skeleton */}
          {currentStageIndex >= 2 && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center mb-6">
                <span className="bg-teal-100 text-teal-600 p-2 rounded-lg mr-3">🏨</span>
                <h2 className="text-2xl font-bold">Hotel Recommendations</h2>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border border-gray-200 rounded-xl overflow-hidden animate-pulse">
                    <div className="aspect-video bg-gray-200"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-3 bg-gray-200 rounded w-full"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Activities Skeleton */}
          {currentStageIndex >= 3 && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center mb-6">
                <span className="bg-teal-100 text-teal-600 p-2 rounded-lg mr-3">🎯</span>
                <h2 className="text-2xl font-bold">Activities & Experiences</h2>
              </div>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-start space-x-4 p-3 bg-gray-50 rounded-lg animate-pulse">
                    <div className="flex-shrink-0 w-16 h-16 bg-gray-200 rounded-lg"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-5 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                    </div>
                    <div className="text-right space-y-2">
                      <div className="h-5 bg-gray-200 rounded w-16"></div>
                      <div className="h-3 bg-gray-200 rounded w-12"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Itinerary Skeleton */}
          {currentStageIndex >= 4 && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center mb-6">
                <span className="bg-teal-100 text-teal-600 p-2 rounded-lg mr-3">📅</span>
                <h2 className="text-2xl font-bold">Day-by-Day Itinerary</h2>
              </div>
              <div className="space-y-6">
                {[1, 2, 3, 4, 5].map((day) => (
                  <div key={day} className="border border-gray-200 rounded-xl overflow-hidden animate-pulse">
                    <div className="bg-gradient-to-r from-teal-50 to-blue-50 p-4 border-b border-gray-200">
                      <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TripPlanSkeleton;

