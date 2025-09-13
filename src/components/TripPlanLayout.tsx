'use client';

import React from 'react';
import { TripPlanData } from './TripPlan';

// Clean interfaces - we'll use TripPlanData directly

interface TripPlanLayoutProps {
  tripData: TripPlanData;
}

const TripTitleSection: React.FC<{ tripData: TripPlanData }> = ({ tripData }) => {
  // Extract duration and travelers from trip data
  const getDuration = () => {
    if (tripData?.duration) return tripData.duration;
    if (tripData?.itinerary?.length) return `${tripData.itinerary.length} days`;
    return '7 days';
  };

  const getTravelers = () => {
    if (tripData?.travelers) {
      const count = tripData.travelers;
      return count === 1 ? '1 traveller' : `${count} travellers`;
    }
    return '1 traveller';
  };

  const getBudget = () => {
    if (tripData?.budget) return tripData.budget;
    if (tripData?.totalCost?.total) return `$${tripData.totalCost.total}`;
    return 'Budget-friendly';
  };

  return (
    <div className="title_and_details" style={{
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      flex: 1,
      height: 'fit-content',
      padding: '30px 24px 24px',
      borderRadius: '16px',
      overflow: 'hidden',
      backgroundColor: '#fff',
      marginBottom: '24px'
    }}>
      <div className="expand_panel_button">
        <button className="expand_panel_button" style={{backgroundColor: 'rgb(243, 243, 243)', border: 'none', borderRadius: '8px', padding: '8px', position: 'static'}}>
          <img alt="expand-panel-button" width="18" height="18" src="/nameChat.svg" style={{color: 'transparent'}} />
        </button>
      </div>

      <div>
        <h1 id="trip-title" className="title_content_title" style={{fontSize: '24px', fontWeight: 'bold', margin: 0, color: '#1f2937'}}>
          {`${getDuration()} ${tripData?.destination || 'Travel'} Adventure`}
        </h1>
      </div>

      <div className="trip_header_buttons">
        <button className="trip_details_button" style={{display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: '#f3f4f6', border: 'none', borderRadius: '8px'}}>
          <small style={{color: '#6b7280'}}>{getDuration()}</small>
          <div className="details_divider" style={{width: '1px', height: '16px', background: '#d1d5db'}}></div>
          <small style={{color: '#6b7280'}}>{getTravelers()}</small>
          <div className="details_divider" style={{width: '1px', height: '16px', background: '#d1d5db'}}></div>
          <small style={{color: '#6b7280'}}>{getBudget()}</small>
        </button>
      </div>

      <div className="tags_container" style={{display: 'flex', gap: '8px', flexWrap: 'wrap'}}>
        {(['adventure', 'sightseeing', 'culture']).map((tag, idx) => (
          <span key={idx} className="tag" style={{padding: '4px 8px', background: '#f3f4f6', borderRadius: '12px', fontSize: '12px', color: '#6b7280'}}>
            {tag}
          </span>
        ))}
      </div>

      <div className="trip_action_buttons" style={{display: 'flex', gap: '12px', marginTop: '16px'}}>
        <button className="download_button" style={{display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: '#f3f4f6', border: 'none', borderRadius: '8px', cursor: 'pointer'}}>
          <img alt="download-icon" width="24" height="24" src="/download-icon.svg" />
          <span style={{fontSize: '14px', color: '#374151'}}>Download</span>
        </button>

        <button className="share_button" style={{display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: '#f3f4f6', border: 'none', borderRadius: '8px', cursor: 'pointer'}}>
          <img alt="share-icon" width="16" height="16" src="/share-icon.svg" />
          <span style={{fontSize: '14px', color: '#374151'}}>Share</span>
        </button>

        <button id="trip-basket-button" className="basket_button" style={{display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: '#00d4aa', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer'}}>
          <img alt="basket-icon" width="16" height="16" src="/basket-white-icon.svg" />
          <span style={{fontSize: '14px'}}>Trip Cart</span>
        </button>
      </div>
    </div>
  );
};

const ItinerarySection: React.FC<{ tripData: TripPlanData }> = ({ tripData }) => {
  const getDestinationImages = (destination: string) => {
    // Enhanced image logic with fallbacks
    const baseUrl = 'https://images.unsplash.com/photo-';
    const destinations: Record<string, string[]> = {
      'paris': ['1502602898536-c296ce2ce835', '1549144511-8a3b4c3e8b8e', '1502602898536-c296ce2ce835', '1549144511-8a3b4c3e8b8e'],
      'tokyo': ['1540959733332-eab4deabeeaf', '1493976040374-85c8e12f0c0e', '1540959733332-eab4deabeeaf', '1493976040374-85c8e12f0c0e'],
      'london': ['1513635269190-d10256305c2c', '1529655683692-39f20c8e5c8e', '1513635269190-d10256305c2c', '1529655683692-39f20c8e5c8e'],
      'rome': ['1552832230-8b3c3c4c8b8e', '1515542622106-78bda8ba0e5b', '1552832230-8b3c3c4c8b8e', '1515542622106-78bda8ba0e5b']
    };
    
    const defaultImages = ['1506905925346-9ac6c8b5c7c7', '1469474968028-56623f02e42e', '1506905925346-9ac6c8b5c7c7', '1469474968028-56623f02e42e'];
    const images = destinations[destination.toLowerCase()] || defaultImages;
    
    return images.map(id => `${baseUrl}${id}?w=800&q=80`);
  };

  const images = getDestinationImages(tripData?.destination || 'travel');

  return (
    <div className="trip_entity_block bg-white rounded-lg p-6 mb-6">
      <h2 className="text-xl font-bold mb-4" style={{color: '#1f2937'}}>Itinerary</h2>

      {/* Destination Photo Grid */}
      <div className="destination_photos_grid mb-6" style={{display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gridTemplateRows: '1fr 1fr', gap: '8px', height: '240px', borderRadius: '12px', overflow: 'hidden'}}>
        <div className="main_photo" style={{gridRow: '1 / 3', position: 'relative'}}>
          <img alt={tripData?.destination} src={images[0]} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        </div>
        <div className="second_photo" style={{position: 'relative'}}>
          <img alt={tripData?.destination} src={images[1]} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        </div>
        <div className="third_photo" style={{position: 'relative'}}>
          <img alt={tripData?.destination} src={images[2]} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        </div>
        <div className="fourth_photo" style={{position: 'relative'}}>
          <div className="photo_count_overlay" style={{position: 'absolute', bottom: '8px', right: '8px', background: 'rgba(0,0,0,0.7)', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px'}}>
            +12
          </div>
          <img alt={tripData?.destination} src={images[3]} style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.7)'}} />
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="trip_nav_bar mb-4">
        <div className="nav_tab active flex items-center gap-2 p-2 bg-gray-100 rounded-lg inline-flex">
          <span className="nav_number bg-black text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">1</span>
          <span style={{color: '#374151', fontSize: '14px', fontWeight: '500'}}>{tripData?.destination || 'Destination'}</span>
        </div>
      </div>
    </div>
  );
};

const FlightsSection: React.FC<{ tripData: TripPlanData }> = ({ tripData }) => {
  const flights = tripData?.flights || [];

  if (flights.length === 0) {
    return (
      <div className="bg-white rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{color: '#1f2937'}}>
          <img alt="flight" width="24" height="24" src="/flight.svg" />
          Flights
        </h3>
        <div className="text-center py-8 text-gray-500">
          Flight information will appear here
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{color: '#1f2937'}}>
        <img alt="flight" width="24" height="24" src="/flight.svg" />
        Flights
      </h3>
      {flights.map((flight, idx) => (
        <div key={flight.id || idx} className="flight_card p-4 border rounded-lg mb-3 flex justify-between items-center" style={{borderColor: '#e5e7eb'}}>
          <div className="flight_info">
            <div className="airline_info flex items-center gap-3 mb-2">
              <div style={{width: '32px', height: '32px', backgroundColor: '#f3f4f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <img alt="flight" width="16" height="16" src="/flight.svg" />
              </div>
              <span className="font-medium" style={{color: '#1f2937'}}>{flight.airline} {flight.flightNumber}</span>
            </div>
            <div className="route_info text-sm" style={{color: '#6b7280'}}>
              <span>{flight.route}</span> • <span>{flight.duration}</span> • <span>{flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}</span>
            </div>
          </div>
          <div className="flight_price text-right">
            <div className="price font-semibold" style={{color: '#1f2937'}}>${flight.price}</div>
            <div className="per_person text-sm" style={{color: '#9ca3af'}}>per person</div>
          </div>
        </div>
      ))}
    </div>
  );
};

const HotelsSection: React.FC<{ tripData: TripPlanData }> = ({ tripData }) => {
  const hotels = tripData?.hotels || [];

  if (hotels.length === 0) {
    return (
      <div className="bg-white rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{color: '#1f2937'}}>
          <img alt="hotel" width="24" height="24" src="/hotel.svg" />
          Accommodation
        </h3>
        <div className="text-center py-8 text-gray-500">
          Hotel information will appear here
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{color: '#1f2937'}}>
        <img alt="hotel" width="24" height="24" src="/hotel.svg" />
        Accommodation
      </h3>
      {hotels.map((hotel, idx) => (
        <div key={hotel.id || idx} className="hotel_card p-4 border rounded-lg mb-3 flex gap-4" style={{borderColor: '#e5e7eb'}}>
          <img alt={hotel.name} width="96" height="96" src={hotel.image || 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=200&h=200&fit=crop'} className="rounded-lg object-cover" style={{minWidth: '96px'}} />
          <div className="hotel_info flex-1">
            <h4 className="font-medium mb-1" style={{color: '#1f2937'}}>{hotel.name}</h4>
            <div className="rating flex items-center gap-2 mb-2">
              <span className="bg-blue-600 text-white px-2 py-1 rounded text-sm">{hotel.rating}</span>
              <span className="text-sm" style={{color: '#6b7280'}}>Excellent (N/A reviews)</span>
            </div>
            <div className="hotel_details text-sm" style={{color: '#6b7280'}}>
              <span>${hotel.pricePerNight} per night</span> • <span>1 guest</span>
            </div>
          </div>
          <div className="hotel_actions">
            <button className="text-blue-600 text-sm" style={{background: 'none', border: 'none', cursor: 'pointer'}}>Replace</button>
          </div>
        </div>
      ))}
    </div>
  );
};

const DailyItinerary: React.FC<{ tripData: TripPlanData }> = ({ tripData }) => {
  const itinerary = tripData?.itinerary || [];
  const [expandedDescriptions, setExpandedDescriptions] = React.useState<Set<number>>(new Set());
  
  if (itinerary.length === 0) {
    return null;
  }

  const toggleDescriptionExpansion = (dayIndex: number) => {
    const newExpanded = new Set(expandedDescriptions);
    if (newExpanded.has(dayIndex)) {
      newExpanded.delete(dayIndex);
    } else {
      newExpanded.add(dayIndex);
    }
    setExpandedDescriptions(newExpanded);
  };

  const formatDate = (dayNumber: number) => {
    const today = new Date();
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + dayNumber - 1);
    return targetDate.toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const getActivityType = (activity: { type?: string; name: string }) => {
    if (activity.type) return activity.type;
    if (activity.name?.toLowerCase().includes('tour')) return 'Activity';
    if (activity.name?.toLowerCase().includes('museum') || 
        activity.name?.toLowerCase().includes('tower') || 
        activity.name?.toLowerCase().includes('cathedral')) return 'Attraction';
    return 'Activity';
  };

  const getActivityImage = (activity: any) => {
    if (activity.image) return activity.image;
    // Default images based on activity type
    const type = getActivityType(activity).toLowerCase();
    if (type === 'attraction') return 'https://images.unsplash.com/photo-1539650116574-75c0c6d73a0e?w=200&h=200&fit=crop';
    return 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=200&h=200&fit=crop';
  };

  return (
    <div className="bg-white rounded-lg p-4">
      <h3 className="text-base font-semibold mb-4" style={{color: '#1f2937'}}>Daily Itinerary</h3>
      
      {itinerary.map((day, dayIdx) => {
        const isDescriptionExpanded = expandedDescriptions.has(dayIdx);
        const dayDate = formatDate(day.day);
        const description = day.description || `Start your day with a leisurely breakfast at a local café, then explore the ${day.activities?.[0]?.name || `best of ${tripData.destination}`} including various attractions and activities.`;
        
        return (
          <div key={dayIdx} className="day-block mb-5 last:mb-0">
            {/* Day Header in Grey Container */}
            <div className="day-header bg-gray-50 rounded-lg p-2.5 mb-2.5 border border-gray-200">
              <h4 className="font-semibold text-base mb-1" style={{color: '#1f2937'}}>
                Day {day.day}: {day.title || `Explore ${tripData.destination} Historic Center`}
              </h4>
              <p className="text-xs mb-2" style={{color: '#6b7280'}}>{dayDate}</p>
              
              {/* Description with Read More */}
              <div className="description-section">
                <p className="text-gray-700 leading-snug text-xs">
                  {isDescriptionExpanded ? description : `${description.substring(0, 100)}...`}
                  {description.split(' ').some(word => word.toLowerCase().includes('café')) && !isDescriptionExpanded && (
                    <span className="text-teal-500 underline cursor-pointer"> Café de Olla</span>
                  )}
                  {description.split(' ').some(word => word.toLowerCase().includes('historic')) && !isDescriptionExpanded && (
                    <span className="text-teal-500 underline cursor-pointer"> Historic Center</span>
                  )}
                </p>
                <button
                  onClick={() => toggleDescriptionExpansion(dayIdx)}
                  className="text-xs font-medium text-gray-600 hover:text-gray-800 mt-0.5"
                  style={{background: 'none', border: 'none', cursor: 'pointer', padding: 0}}
                >
                  {isDescriptionExpanded ? '... Read less' : '... Read more'}
                </button>
              </div>
            </div>

            {/* Activities with Timeline Connectors */}
            <div className="activities-timeline relative">
              {/* Vertical Timeline Line */}
              <div 
                className="timeline-line absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"
                style={{height: `${(day.activities?.length || 0) * 90 + 40}px`}}
              ></div>

              {day.activities?.map((activity, actIdx) => {
                const activityType = getActivityType(activity);
                
                return (
                  <div key={`${day.day}-${actIdx}-${activity.id || activity.name}`} className="activity-item relative mb-3">
                    {/* Timeline Dot */}
                    <div 
                      className="timeline-dot absolute left-5 top-4 w-2.5 h-2.5 rounded-full bg-white border-2 z-10"
                      style={{borderColor: activityType === 'Activity' ? '#059669' : '#7c3aed'}}
                    ></div>

                    {/* Activity Type Label */}
                    <div className="activity-type-label ml-12 mb-1">
                      <span 
                        className="inline-block text-xs font-medium px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: activityType === 'Activity' ? '#fef3c7' : '#e0e7ff',
                          color: activityType === 'Activity' ? '#d97706' : '#5b21b6'
                        }}
                      >
                        {activityType}
                      </span>
                    </div>

                    {/* Activity Card with Hover Actions */}
                    <div 
                      className="activity-card group bg-white border border-gray-200 rounded-lg p-3 ml-12 hover:shadow-md transition-all duration-200 cursor-pointer relative"
                    >
                      {/* Hover Action Icons */}
                      <div className="action-icons absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1">
                        <button 
                          className="action-button p-1.5 rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors"
                          style={{border: '1px solid #e5e7eb'}}
                          title="Delete activity"
                        >
                          <img alt="Delete" width="12" height="12" src="/trash.svg" style={{opacity: 0.7}} />
                        </button>
                        <button 
                          className="action-button p-1.5 rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors"
                          style={{border: '1px solid #e5e7eb'}}
                          title="Replace activity"
                        >
                          <img alt="Replace" width="12" height="12" src="/replace.svg" style={{opacity: 0.7}} />
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        {/* Activity Image */}
                        <div className="activity-image">
                          <img 
                            alt={activity.name} 
                            width="45" 
                            height="45" 
                            src={getActivityImage(activity)} 
                            className="rounded-lg object-cover" 
                            style={{minWidth: '45px', minHeight: '45px'}} 
                          />
                        </div>

                        {/* Activity Details */}
                        <div className="activity-details flex-1">
                          <h5 className="activity-name font-medium text-sm mb-0.5" style={{color: '#1f2937'}}>
                            {activity.name}
                          </h5>
                          <p className="activity-type text-xs mb-0.5" style={{color: '#6b7280'}}>
                            {activityType}
                          </p>
                          {(activity.duration || activity.price) && (
                            <div className="activity-meta flex items-center gap-2 text-xs" style={{color: '#6b7280'}}>
                              {activity.duration && (
                                <span className="duration-info flex items-center gap-1">
                                  <img alt="clock" width="10" height="10" src="/clock.svg" style={{opacity: 0.7}} />
                                  {activity.duration}
                                </span>
                              )}
                              {activity.duration && activity.price && <span>•</span>}
                              {activity.price && <span>1 person</span>}
                            </div>
                          )}
                        </div>

                        {/* Arrow Icon */}
                        <div className="activity-arrow">
                          <img 
                            alt="arrow-right" 
                            width="16" 
                            height="16" 
                            src="/buttons/chevron-right.svg" 
                            style={{opacity: 0.4}} 
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Add Button with Timeline Connection */}
              <div className="add-activity-section relative ml-12 mt-4">
                {/* Timeline Dot for Add Button */}
                <div 
                  className="timeline-dot absolute -left-7 top-2.5 w-2.5 h-2.5 rounded-full bg-gray-300 border-2 border-white"
                ></div>

                <button 
                  className="add-button flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
                  style={{
                    color: '#374151',
                    background: 'white',
                    cursor: 'pointer'
                  }}
                >
                  <img alt="add" width="14" height="14" src="/plus.svg" />
                  <span className="font-medium text-sm">Add</span>
                </button>
              </div>
            </div>

            {/* Day Separator (between days) */}
            {dayIdx < itinerary.length - 1 && (
              <div style={{width: '100%', height: '1px', backgroundColor: '#e5e7eb', margin: '24px 0'}}></div>
            )}
          </div>
        );
      })}
    </div>
  );
};

const TripPlanLayout: React.FC<TripPlanLayoutProps> = ({ tripData }) => {
  return (
    <div className="trip-plan-layout" style={{padding: '0 0 24px 0', height: '100%', overflowY: 'auto'}}>
      <TripTitleSection tripData={tripData} />
      <ItinerarySection tripData={tripData} />
      <FlightsSection tripData={tripData} />
      <HotelsSection tripData={tripData} />
      <DailyItinerary tripData={tripData} />
    </div>
  );
};

export default TripPlanLayout;
