'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { TripPlanData } from './TripPlan';

// Dynamic import to avoid SSR issues with Leaflet
const DynamicMap = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="h-full bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
        <p className="text-sm text-gray-500">Loading map...</p>
      </div>
    </div>
  )
});

interface MapLocation {
  id: string;
  name: string;
  coordinates: [number, number];
  type: 'hotel' | 'activity' | 'restaurant' | 'attraction';
  details?: {
    price?: number;
    pricePerNight?: number;
    duration?: string;
    description?: string;
    rating?: number;
  };
}

interface DestinationMapProps {
  tripData?: TripPlanData;
}

const MapLegend: React.FC = () => {
  return (
    <div className="absolute top-4 right-4 bg-white p-3 rounded-lg shadow-lg z-[1000] border">
      <h4 className="font-medium text-sm mb-2" style={{color: '#1f2937'}}>Legend</h4>
      <div className="space-y-2 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span style={{color: '#6b7280'}}>Hotels</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span style={{color: '#6b7280'}}>Attractions</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span style={{color: '#6b7280'}}>Activities</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
          <span style={{color: '#6b7280'}}>Restaurants</span>
        </div>
      </div>
    </div>
  );
};

const DestinationMap: React.FC<DestinationMapProps> = ({ tripData }) => {
  const [isClient, setIsClient] = useState(false);
  const [visibleLayers, setVisibleLayers] = useState({
    hotels: true,
    activities: true,
    restaurants: true,
    attractions: true
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Get destination coordinates (default to Paris)
  const getDestinationCoordinates = (destination?: string): [number, number] => {
    const coordinates: Record<string, [number, number]> = {
      'paris': [48.8566, 2.3522],
      'tokyo': [35.6762, 139.6503],
      'london': [51.5074, -0.1278],
      'rome': [41.9028, 12.4964],
      'new york': [40.7128, -74.0060],
      'barcelona': [41.3851, 2.1734],
      'amsterdam': [52.3676, 4.9041],
      'berlin': [52.5200, 13.4050]
    };

    const key = destination?.toLowerCase() || 'paris';
    return coordinates[key] || [48.8566, 2.3522];
  };

  // Generate map locations from trip data
  const generateMapLocations = (): MapLocation[] => {
    const locations: MapLocation[] = [];
    const baseCoords = getDestinationCoordinates(tripData?.destination);

    // Add hotels
    tripData?.hotels?.forEach((hotel, idx) => {
      // Generate coordinates around the destination
      const lat = baseCoords[0] + (Math.random() - 0.5) * 0.02;
      const lng = baseCoords[1] + (Math.random() - 0.5) * 0.02;
      
      locations.push({
        id: `hotel-${idx}`,
        name: hotel.name,
        coordinates: [lat, lng],
        type: 'hotel',
        details: {
          pricePerNight: hotel.pricePerNight,
          rating: hotel.rating,
          description: `${hotel.rating}/10 rating`
        }
      });
    });

    // Add activities from itinerary
    tripData?.itinerary?.forEach((day, dayIdx) => {
      day.activities?.forEach((activity, actIdx) => {
        const lat = baseCoords[0] + (Math.random() - 0.5) * 0.03;
        const lng = baseCoords[1] + (Math.random() - 0.5) * 0.03;
        
        const type = activity.name?.toLowerCase().includes('restaurant') || 
                    activity.name?.toLowerCase().includes('café') || 
                    activity.name?.toLowerCase().includes('food') ? 'restaurant' :
                    activity.name?.toLowerCase().includes('museum') ||
                    activity.name?.toLowerCase().includes('tower') ||
                    activity.name?.toLowerCase().includes('cathedral') ? 'attraction' : 'activity';

        locations.push({
          id: `activity-${dayIdx}-${actIdx}`,
          name: activity.name,
          coordinates: [lat, lng],
          type,
          details: {
            duration: activity.duration || '2 hours',
            description: activity.description,
            price: activity.price
          }
        });
      });
    });

    return locations;
  };

  const mapPosition = getDestinationCoordinates(tripData?.destination);
  const mapLocations = generateMapLocations();

  const toggleLayer = (layer: keyof typeof visibleLayers) => {
    setVisibleLayers(prev => ({
      ...prev,
      [layer]: !prev[layer]
    }));
  };

  const getMarkerColor = (type: string) => {
    switch (type) {
      case 'hotel': return '#ef4444';
      case 'attraction': return '#3b82f6';
      case 'activity': return '#10b981';
      case 'restaurant': return '#f97316';
      default: return '#6b7280';
    }
  };

  if (!isClient) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-4 border-b bg-white">
          <h3 className="font-semibold text-lg" style={{color: '#1f2937'}}>Map</h3>
          <p className="text-sm" style={{color: '#6b7280'}}>{tripData?.destination || 'Paris, France'}</p>
        </div>
        <div className="flex-1 bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <p className="text-sm text-gray-500">Loading map...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Map Header */}
      <div className="p-4 border-b bg-white">
        <h3 className="font-semibold text-lg" style={{color: '#1f2937'}}>Map</h3>
        <p className="text-sm" style={{color: '#6b7280'}}>{tripData?.destination || 'Paris, France'}</p>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative">
        <DynamicMap 
          center={mapPosition}
          locations={mapLocations}
          visibleLayers={visibleLayers}
        />
        
        {/* Map Legend */}
        <MapLegend />
      </div>

      {/* Map Controls */}
      <div className="p-4 border-t bg-white">
        <div className="flex flex-wrap gap-2 mb-3">
          <button
            className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm transition-all ${
              visibleLayers.hotels ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-500'
            }`}
            onClick={() => toggleLayer('hotels')}
          >
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            Hotels ({mapLocations.filter(l => l.type === 'hotel').length})
          </button>
          
          <button
            className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm transition-all ${
              visibleLayers.attractions ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
            }`}
            onClick={() => toggleLayer('attractions')}
          >
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            Attractions ({mapLocations.filter(l => l.type === 'attraction').length})
          </button>
          
          <button
            className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm transition-all ${
              visibleLayers.activities ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
            }`}
            onClick={() => toggleLayer('activities')}
          >
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            Activities ({mapLocations.filter(l => l.type === 'activity').length})
          </button>
          
          <button
            className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm transition-all ${
              visibleLayers.restaurants ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-500'
            }`}
            onClick={() => toggleLayer('restaurants')}
          >
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            Restaurants ({mapLocations.filter(l => l.type === 'restaurant').length})
          </button>
        </div>

        <div className="text-xs" style={{color: '#9ca3af'}}>
          Click markers to view details • Zoom to explore locations
        </div>
      </div>
    </div>
  );
};

export default DestinationMap;
