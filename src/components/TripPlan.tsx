'use client';

import React from 'react';

export interface TripPlanData {
  destination: string;
  duration: string;
  budget: string;
  travelers: number;
  flights: FlightOption[];
  hotels: HotelOption[];
  itinerary: DayItinerary[];
  totalCost: {
    flights: number;
    hotels: number;
    activities: number;
    total: number;
  };
}

export interface FlightOption {
  id: string;
  airline: string;
  flightNumber: string;
  route: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  stops: number;
}

export interface HotelOption {
  id: string;
  name: string;
  location: string;
  rating: number;
  pricePerNight: number;
  amenities: string[];
  description: string;
  category: string;
  image: string;
}

export interface Activity {
  id: string;
  name: string;
  type: string;
  duration: string;
  price: number;
  description: string;
  image: string;
  time: string;
}

export interface DayItinerary {
  day: number;
  title: string;
  description: string;
  activities: Activity[];
  image: string;
}

interface TripPlanProps {
  tripData: TripPlanData;
  onBookTrip?: () => void;
}

const TripPlan: React.FC<TripPlanProps> = ({ tripData, onBookTrip }) => {
  return (
    <div className="px-6 py-8 space-y-8">
      {/* Trip Summary Header */}
      <div className="layla-gradient rounded-2xl p-8 text-white layla-shadow-medium">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="mb-6 lg:mb-0">
            <h1 className="text-3xl lg:text-4xl font-bold mb-3 layla-heading">{tripData.destination}</h1>
            <div className="flex flex-wrap gap-6 text-lg opacity-95">
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                {tripData.duration}
              </span>
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
                {tripData.travelers} {tripData.travelers === 1 ? 'traveler' : 'travelers'}
              </span>
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v1.698c.22-.071.412-.164.567-.267C11.93 13.66 12 13.436 12 13.25c0-.114-.07-.34-.433-.582-.155-.103-.346-.196-.567-.267z" />
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                </svg>
                {tripData.budget}
              </span>
            </div>
          </div>
          <button
            onClick={onBookTrip}
            className="bg-white text-teal-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200 flex items-center layla-shadow-soft hover:layla-shadow-medium"
          >
            <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
            </svg>
            <span>Trip Cart ${tripData.totalCost.total.toLocaleString()}</span>
          </button>
        </div>
      </div>

      {/* Flight Options */}
      <div className="layla-card rounded-2xl p-8">
        <h2 className="text-2xl font-semibold layla-text-primary layla-heading mb-8 flex items-center">
          <span className="bg-gradient-to-br from-blue-100 to-teal-100 text-teal-600 p-3 rounded-xl mr-4">
            ✈️
          </span>
          Flight Options
        </h2>
        <div className="space-y-6">
          {tripData.flights.map((flight) => (
            <div key={flight.id} className="layla-card layla-card-hover rounded-xl p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-3">
                    <span className="font-semibold text-xl layla-text-primary">{flight.airline}</span>
                    <span className="layla-text-secondary ml-3 text-sm font-medium">{flight.flightNumber}</span>
                  </div>
                  <div className="layla-text-secondary mb-3 font-medium">{flight.route}</div>
                  <div className="flex items-center text-sm layla-text-secondary font-medium">
                    <span>{flight.departureTime} - {flight.arrivalTime}</span>
                    <span className="mx-3">•</span>
                    <span>{flight.duration}</span>
                    <span className="mx-3">•</span>
                    <span>{flight.stops === 0 ? 'Direct' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}</span>
                  </div>
                </div>
                <div className="mt-6 lg:mt-0 lg:text-right">
                  <div className="text-3xl font-bold text-teal-600">${flight.price.toLocaleString()}</div>
                  <div className="text-sm layla-text-secondary font-medium">per person</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hotel Options */}
      <div className="layla-card rounded-2xl p-8">
        <h2 className="text-2xl font-semibold layla-text-primary layla-heading mb-8 flex items-center">
          <span className="bg-gradient-to-br from-purple-100 to-pink-100 text-purple-600 p-3 rounded-xl mr-4">
            🏨
          </span>
          Hotel Recommendations
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {tripData.hotels.map((hotel) => (
            <div key={hotel.id} className="layla-card layla-card-hover rounded-xl overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <span className="layla-text-secondary text-sm font-medium">Hotel Image</span>
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-xl leading-tight layla-text-primary">{hotel.name}</h3>
                  <span className="bg-gradient-to-r from-teal-100 to-blue-100 text-teal-700 px-3 py-1 rounded-lg text-sm font-semibold ml-3">
                    {hotel.category}
                  </span>
                </div>
                <div className="flex items-center mb-3">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className={`w-4 h-4 ${i < hotel.rating ? 'fill-current' : 'text-gray-300'}`} viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="layla-text-secondary text-sm ml-2 font-medium">{hotel.rating}/5</span>
                </div>
                <p className="layla-text-secondary text-sm mb-4 font-medium">{hotel.location}</p>
                <p className="layla-text-primary text-sm mb-4 line-clamp-2 leading-relaxed">{hotel.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {hotel.amenities.slice(0, 3).map((amenity) => (
                    <span key={amenity} className="bg-gray-100 layla-text-secondary px-3 py-1 rounded-lg text-xs font-medium">
                      {amenity}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-3xl font-bold text-teal-600">${hotel.pricePerNight}</span>
                    <span className="layla-text-secondary text-sm font-medium">/night</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Day-by-Day Itinerary */}
      <div className="layla-card rounded-2xl p-8">
        <h2 className="text-2xl font-semibold layla-text-primary layla-heading mb-8 flex items-center">
          <span className="bg-gradient-to-br from-green-100 to-teal-100 text-green-600 p-3 rounded-xl mr-4">
            📅
          </span>
          Day-by-Day Itinerary
        </h2>
        <div className="space-y-6">
          {tripData.itinerary.map((day) => (
            <div key={day.day} className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="bg-gradient-to-r from-teal-50 to-blue-50 p-4 border-b border-gray-200">
                <h3 className="text-xl font-semibold mb-1">Day {day.day}: {day.title}</h3>
                <p className="text-gray-600">{day.description}</p>
              </div>
              <div className="p-4">
                <div className="grid gap-4">
                  {day.activities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center">
                        <span className="text-xs text-gray-500">IMG</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold text-lg">{activity.name}</h4>
                            <p className="text-gray-600 text-sm mb-1">{activity.description}</p>
                            <div className="flex items-center text-sm text-gray-500">
                              <span>{activity.time}</span>
                              <span className="mx-2">•</span>
                              <span>{activity.duration}</span>
                              <span className="mx-2">•</span>
                              <span className="capitalize">{activity.type}</span>
                            </div>
                          </div>
                          <div className="text-right ml-4">
                            <div className="font-semibold text-teal-600">${activity.price}</div>
                            <div className="text-xs text-gray-500">per person</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cost Breakdown */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <span className="bg-teal-100 text-teal-600 p-2 rounded-lg mr-3">
            💰
          </span>
          Cost Breakdown
        </h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-600">Flights</span>
            <span className="font-semibold">${tripData.totalCost.flights.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-600">Hotels</span>
            <span className="font-semibold">${tripData.totalCost.hotels.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-600">Activities</span>
            <span className="font-semibold">${tripData.totalCost.activities.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center py-3 text-xl font-bold text-teal-600 border-t-2 border-teal-100">
            <span>Total</span>
            <span>${tripData.totalCost.total.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Interactive Map Placeholder */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <span className="bg-teal-100 text-teal-600 p-2 rounded-lg mr-3">
            🗺️
          </span>
          Trip Map
        </h2>
        <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
          <div className="text-center text-gray-500">
            <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <p className="text-lg font-semibold">Interactive Map</p>
            <p className="text-sm">Showing all itinerary locations</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripPlan;
