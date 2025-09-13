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
  const [expandedDays, setExpandedDays] = React.useState<Set<number>>(new Set());
  
  if (itinerary.length === 0) {
    return null;
  }

  const toggleDayExpansion = (dayIndex: number) => {
    const newExpanded = new Set(expandedDays);
    if (newExpanded.has(dayIndex)) {
      newExpanded.delete(dayIndex);
    } else {
      newExpanded.add(dayIndex);
    }
    setExpandedDays(newExpanded);
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

  return (
    <div className="bg-white rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-6" style={{color: '#1f2937'}}>Daily Itinerary</h3>
      
      {itinerary.map((day, dayIdx) => {
        const isExpanded = expandedDays.has(dayIdx);
        const dayDate = formatDate(day.day);
        
        return (
          <div key={dayIdx} className="day-block mb-6">
            {/* Day Header */}
            <div className="day-header-block mb-4">
              <div className="day-title-wrapper mb-3">
                <div className="day-title-content">
                  <h4 className="font-semibold text-lg mb-1" style={{color: '#1f2937'}}>
                    Day {day.day}: {day.title || `${tripData.destination} Exploration`}
                  </h4>
                  <small style={{color: '#9ca3af'}}>{dayDate}</small>
                </div>
              </div>

              {/* Expandable Day Overview */}
              <div className="day-overview-wrapper">
                <div 
                  className={`day-overview-content transition-all duration-300 ${
                    isExpanded ? 'max-h-none' : 'max-h-12 overflow-hidden'
                  }`}
                  style={{
                    lineHeight: '24px',
                    color: '#6b7280'
                  }}
                >
                  {day.description || `Explore the best of ${tripData.destination} with carefully curated activities including ${day.activities?.slice(0, 2).map(a => a.name).join(' and ')}${day.activities && day.activities.length > 2 ? ' among other amazing experiences' : ''}.`}
                </div>
                
                {(day.description || day.activities?.length > 0) && (
                  <button
                    onClick={() => toggleDayExpansion(dayIdx)}
                    className="read-more-button mt-2 text-sm font-medium transition-colors"
                    style={{
                      color: '#3b82f6',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    {isExpanded ? '... Read less' : '... Read more'}
                  </button>
                )}
              </div>
            </div>

            {/* Day Separator */}
            <div style={{width: '100%', height: '1px', backgroundColor: '#e5e7eb', margin: '16px 0'}}></div>

            {/* Activities */}
            <div className="day-activities">
              {day.activities?.map((activity, actIdx) => {
                const activityType = getActivityType(activity);
                
                return (
                  <React.Fragment key={`${day.day}-${actIdx}-${activity.id || activity.name}`}>
                    <div className="activity-block">
                      {/* Activity Label */}
                      <div className="activity-header flex justify-between items-center mb-3">
                        <p 
                          className="activity-label text-sm font-medium"
                          style={{
                            color: activityType === 'Activity' ? '#059669' : '#7c3aed',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                          }}
                        >
                          {activityType}
                        </p>
                        
                        {/* Action Icons */}
                        <div className="action-icons flex gap-2">
                          <button 
                            className="action-button p-1 rounded hover:bg-gray-100 transition-colors"
                            style={{border: 'none', background: 'none', cursor: 'pointer'}}
                            title="Delete activity"
                          >
                            <img alt="Delete" width="16" height="16" src="/trash.svg" style={{opacity: 0.6}} />
                          </button>
                          <button 
                            className="action-button p-1 rounded hover:bg-gray-100 transition-colors"
                            style={{border: 'none', background: 'none', cursor: 'pointer'}}
                            title="Replace activity"
                          >
                            <img alt="Replace" width="16" height="16" src="/replace.svg" style={{opacity: 0.6}} />
                          </button>
                        </div>
                      </div>

                      {/* Activity Card */}
                      <div 
                        className="activity-card flex gap-4 p-4 border rounded-lg hover:shadow-md transition-all duration-200 cursor-pointer"
                        style={{borderColor: '#e5e7eb', backgroundColor: '#fafafa'}}
                      >
                        {/* Activity Photo */}
                        <div className="activity-photo">
                          <img 
                            alt={activity.name} 
                            width="56" 
                            height="56" 
                            src={activity.image || 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=200&h=200&fit=crop'} 
                            className="rounded-lg object-cover" 
                            style={{minWidth: '56px', minHeight: '56px'}} 
                          />
                        </div>

                        {/* Activity Info */}
                        <div className="activity-info-wrapper flex-1">
                          <div className="activity-info-block">
                            <h5 className="activity-title font-medium mb-1" style={{color: '#1f2937'}}>
                              {activity.name}
                            </h5>
                            <div className="activity-meta flex items-center gap-2 text-sm" style={{color: '#6b7280'}}>
                              <span className="duration-info flex items-center gap-1">
                                <img alt="clock" width="12" height="12" src="/clock.svg" style={{opacity: 0.7}} />
                                {activity.duration || '2 hours'}
                              </span>
                              <small className="separator">•</small>
                              <span>1 person</span>
                              {activity.price && (
                                <>
                                  <small className="separator">•</small>
                                  <span className="price font-medium" style={{color: '#059669'}}>
                                    ${activity.price}
                                  </span>
                                </>
                              )}
                            </div>
                            {activity.description && (
                              <p className="activity-description text-sm mt-2" style={{color: '#6b7280'}}>
                                {activity.description}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Chevron */}
                        <div className="chevron-container flex items-center">
                          <img 
                            alt="arrow-right" 
                            width="20" 
                            height="20" 
                            src="/buttons/chevron-right.svg" 
                            style={{opacity: 0.4}} 
                          />
                        </div>
                      </div>
                    </div>

                    {/* Activity Separator */}
                    {actIdx < (day.activities?.length || 0) - 1 && (
                      <div style={{width: '100%', height: '1px', backgroundColor: '#f3f4f6', margin: '16px 0'}}></div>
                    )}
                  </React.Fragment>
                );
              })}

              {/* Add Activity Button */}
              <div className="add-activity-section mt-6 pt-4" style={{borderTop: '1px dashed #d1d5db'}}>
                <div className="add-tooltip mb-3 p-3 rounded-lg" style={{backgroundColor: '#f8fafc', border: '1px solid #e2e8f0'}}>
                  <p className="text-sm font-medium mb-2" style={{color: '#374151'}}>What are you planning?</p>
                  <div className="tooltip-options flex gap-4">
                    <div className="option flex items-center gap-2 text-sm" style={{color: '#6b7280'}}>
                      <img alt="activity" width="16" height="16" src="/attraction-icon-black.svg" />
                      Activity
                    </div>
                    <div className="option flex items-center gap-2 text-sm" style={{color: '#6b7280'}}>
                      <img alt="attraction" width="16" height="16" src="/attraction-icon-black.svg" />
                      Attraction
                    </div>
                  </div>
                </div>
                
                <button 
                  className="add-button flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-dashed hover:border-solid hover:bg-blue-50 transition-all duration-200"
                  style={{
                    borderColor: '#3b82f6',
                    color: '#3b82f6',
                    background: 'none',
                    cursor: 'pointer',
                    width: '100%',
                    justifyContent: 'center'
                  }}
                >
                  <img alt="add" width="16" height="16" src="/plus.svg" />
                  Add Activity
                </button>
              </div>
            </div>

            {/* Day Separator (between days) */}
            {dayIdx < itinerary.length - 1 && (
              <div style={{width: '100%', height: '2px', backgroundColor: '#e5e7eb', margin: '32px 0'}}></div>
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
