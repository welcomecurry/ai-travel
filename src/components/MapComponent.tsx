'use client';

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

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

interface MapComponentProps {
  center: [number, number];
  locations: MapLocation[];
  visibleLayers: {
    hotels: boolean;
    activities: boolean;
    restaurants: boolean;
    attractions: boolean;
  };
}

const MapComponent: React.FC<MapComponentProps> = ({ center, locations, visibleLayers }) => {
  const getMarkerColor = (type: string) => {
    switch (type) {
      case 'hotel': return '#ef4444';
      case 'attraction': return '#3b82f6';
      case 'activity': return '#10b981';
      case 'restaurant': return '#f97316';
      default: return '#6b7280';
    }
  };

  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ height: '100%', width: '100%' }}
      zoomControl={true}
      {...({} as any)}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Render markers based on visible layers */}
      {locations
        .filter(location => visibleLayers[location.type + 's' as keyof typeof visibleLayers])
        .map((location) => {
          // Create custom marker using divIcon
          const L = require('leaflet');
          const customIcon = new L.divIcon({
            className: 'custom-marker',
            html: `<div style="
              width: 24px; 
              height: 24px; 
              background-color: ${getMarkerColor(location.type)}; 
              border: 2px solid white; 
              border-radius: 50%; 
              box-shadow: 0 2px 4px rgba(0,0,0,0.2);
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 10px;
              color: white;
              font-weight: bold;
            ">
              ${location.type === 'hotel' ? '🏨' : 
                location.type === 'restaurant' ? '🍽️' : 
                location.type === 'attraction' ? '🏛️' : '🎯'}
            </div>`,
            iconSize: [24, 24],
            iconAnchor: [12, 12]
          });

          return (
            <Marker key={location.id} position={location.coordinates} icon={customIcon}>
              <Popup>
                <div className="p-2 min-w-[200px]">
                  <h4 className="font-medium mb-1" style={{color: '#1f2937'}}>{location.name}</h4>
                  <p className="text-xs mb-2" style={{
                    color: getMarkerColor(location.type),
                    textTransform: 'capitalize',
                    fontWeight: '500'
                  }}>
                    {location.type}
                  </p>
                  
                  {location.details?.pricePerNight && (
                    <p className="text-sm" style={{color: '#059669'}}>
                      ${location.details.pricePerNight}/night
                    </p>
                  )}
                  
                  {location.details?.price && (
                    <p className="text-sm" style={{color: '#059669'}}>
                      ${location.details.price}
                    </p>
                  )}
                  
                  {location.details?.duration && (
                    <p className="text-sm" style={{color: '#6b7280'}}>
                      Duration: {location.details.duration}
                    </p>
                  )}
                  
                  {location.details?.rating && (
                    <p className="text-sm" style={{color: '#6b7280'}}>
                      Rating: {location.details.rating}/10
                    </p>
                  )}
                  
                  {location.details?.description && (
                    <p className="text-xs mt-1" style={{color: '#9ca3af'}}>
                      {location.details.description}
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
    </MapContainer>
  );
};

export default MapComponent;
