import { Flight, Hotel, Activity, mockFlights, mockHotels, mockActivities } from './mockData';

export interface SearchCriteria {
  destination?: string;
  origin?: string;
  checkIn?: string;
  checkOut?: string;
  budget?: number;
  travelers?: number;
  preferences?: string[];
}

export interface FlightSearchResult {
  flights: Flight[];
  totalResults: number;
  searchCriteria: SearchCriteria;
}

export interface HotelSearchResult {
  hotels: Hotel[];
  totalResults: number;
  searchCriteria: SearchCriteria;
}

export interface ActivitySearchResult {
  activities: Activity[];
  totalResults: number;
  searchCriteria: SearchCriteria;
}

// Flight search service
export const searchFlights = async (criteria: SearchCriteria): Promise<FlightSearchResult> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const { destination, origin, budget } = criteria;
  
  let filteredFlights = [...mockFlights];

  // Filter by destination
  if (destination) {
    const destCode = getAirportCode(destination);
    filteredFlights = filteredFlights.filter(flight => 
      flight.destination === destCode
    );
  }

  // Filter by origin
  if (origin) {
    const originCode = getAirportCode(origin);
    filteredFlights = filteredFlights.filter(flight => 
      flight.origin === originCode
    );
  }

  // Filter by budget
  if (budget) {
    filteredFlights = filteredFlights.filter(flight => 
      flight.price <= budget
    );
  }

  // Sort by price
  filteredFlights.sort((a, b) => a.price - b.price);

  return {
    flights: filteredFlights,
    totalResults: filteredFlights.length,
    searchCriteria: criteria
  };
};

// Hotel search service
export const searchHotels = async (criteria: SearchCriteria): Promise<HotelSearchResult> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));

  const { destination, budget, travelers = 1 } = criteria;
  
  let filteredHotels = [...mockHotels];

  // Filter by destination
  if (destination) {
    const normalizedDest = destination.toLowerCase();
    filteredHotels = filteredHotels.filter(hotel =>
      hotel.location.toLowerCase().includes(normalizedDest) ||
      hotel.id.includes(normalizedDest)
    );
  }

  // Filter by budget (per night)
  if (budget) {
    const maxPricePerNight = budget / 5; // Assume 5 nights for budget calculation
    filteredHotels = filteredHotels.filter(hotel => 
      hotel.pricePerNight <= maxPricePerNight
    );
  }

  // Sort by value (rating vs price)
  filteredHotels.sort((a, b) => {
    const aValue = a.rating / (a.pricePerNight / 100);
    const bValue = b.rating / (b.pricePerNight / 100);
    return bValue - aValue;
  });

  return {
    hotels: filteredHotels,
    totalResults: filteredHotels.length,
    searchCriteria: criteria
  };
};

// Activity search service
export const searchActivities = async (criteria: SearchCriteria): Promise<ActivitySearchResult> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 400));

  const { destination, budget, preferences = [] } = criteria;
  
  let filteredActivities = [...mockActivities];

  // Filter by destination
  if (destination) {
    const normalizedDest = destination.toLowerCase();
    filteredActivities = filteredActivities.filter(activity =>
      activity.location.toLowerCase().includes(normalizedDest) ||
      activity.id.includes(normalizedDest)
    );
  }

  // Filter by preferences/interests
  if (preferences.length > 0) {
    filteredActivities = filteredActivities.filter(activity =>
      preferences.some(pref => 
        activity.tags.some(tag => 
          tag.toLowerCase().includes(pref.toLowerCase()) ||
          pref.toLowerCase().includes(tag.toLowerCase())
        ) ||
        activity.type.toLowerCase().includes(pref.toLowerCase()) ||
        activity.name.toLowerCase().includes(pref.toLowerCase())
      )
    );
  }

  // Filter by budget (optional - total activity budget)
  if (budget) {
    const maxActivityBudget = budget * 0.3; // Assume 30% of total budget for activities
    filteredActivities = filteredActivities.filter(activity => 
      activity.price <= maxActivityBudget / 3 // Assume 3 activities
    );
  }

  // Sort by rating
  filteredActivities.sort((a, b) => b.rating - a.rating);

  return {
    activities: filteredActivities,
    totalResults: filteredActivities.length,
    searchCriteria: criteria
  };
};

// Comprehensive travel search
export const searchTravel = async (criteria: SearchCriteria) => {
  try {
    const [flightResults, hotelResults, activityResults] = await Promise.all([
      searchFlights(criteria),
      searchHotels(criteria),
      searchActivities(criteria)
    ]);

    return {
      flights: flightResults,
      hotels: hotelResults,
      activities: activityResults,
      success: true
    };
  } catch (error) {
    console.error('Travel search error:', error);
    return {
      flights: { flights: [], totalResults: 0, searchCriteria: criteria },
      hotels: { hotels: [], totalResults: 0, searchCriteria: criteria },
      activities: { activities: [], totalResults: 0, searchCriteria: criteria },
      success: false,
      error: 'Failed to search travel options'
    };
  }
};

// Helper functions
const getAirportCode = (location: string): string => {
  const locationMap: { [key: string]: string } = {
    'new york': 'JFK',
    'nyc': 'JFK',
    'jfk': 'JFK',
    'paris': 'CDG',
    'france': 'CDG',
    'cdg': 'CDG',
    'rome': 'FCO',
    'italy': 'FCO',
    'fco': 'FCO',
    'tokyo': 'NRT',
    'japan': 'NRT',
    'nrt': 'NRT',
    'los angeles': 'LAX',
    'la': 'LAX',
    'lax': 'LAX'
  };

  const normalized = location.toLowerCase();
  return locationMap[normalized] || 'JFK'; // Default to JFK if not found
};

// Generate itinerary helper
export const generateItinerary = (
  destination: string,
  days: number,
  hotels: Hotel[],
  activities: Activity[]
): string => {
  const selectedHotel = hotels[0]; // Best value hotel
  const topActivities = activities.slice(0, Math.min(days * 2, activities.length));
  
  let itinerary = `## ${days}-Day ${destination} Itinerary\n\n`;
  
  if (selectedHotel) {
    itinerary += `**🏨 Recommended Hotel:** ${selectedHotel.name}\n`;
    itinerary += `📍 ${selectedHotel.location}\n`;
    itinerary += `⭐ ${selectedHotel.rating}/5 stars • $${selectedHotel.pricePerNight}/night\n`;
    itinerary += `${selectedHotel.description}\n\n`;
  }

  for (let day = 1; day <= days; day++) {
    itinerary += `### Day ${day}\n`;
    
    const dayActivities = topActivities.slice((day - 1) * 2, day * 2);
    
    if (dayActivities.length > 0) {
      dayActivities.forEach((activity, index) => {
        const timeSlot = index === 0 ? '🌅 Morning' : '🌆 Evening';
        itinerary += `**${timeSlot}: ${activity.name}**\n`;
        itinerary += `📍 ${activity.location} • ${activity.duration} • $${activity.price}\n`;
        itinerary += `⭐ ${activity.rating}/5 • ${activity.description}\n`;
        itinerary += `⏰ ${activity.operatingHours}\n\n`;
      });
    } else {
      itinerary += `**Free Day**: Explore ${destination} at your own pace\n\n`;
    }
  }

  return itinerary;
};

// Parse travel request from natural language
export const parseTravelRequest = (message: string): SearchCriteria => {
  const criteria: SearchCriteria = {};
  
  // Extract destination
  const destinations = ['paris', 'rome', 'tokyo', 'japan', 'italy', 'france'];
  for (const dest of destinations) {
    if (message.toLowerCase().includes(dest)) {
      criteria.destination = dest;
      break;
    }
  }

  // Extract budget
  const budgetMatch = message.match(/\$(\d+(?:,\d+)?)/);
  if (budgetMatch) {
    criteria.budget = parseInt(budgetMatch[1].replace(',', ''));
  }

  // Extract number of travelers
  const travelerMatch = message.match(/(\d+)\s+(?:people|person|traveler|guest)/i);
  if (travelerMatch) {
    criteria.travelers = parseInt(travelerMatch[1]);
  }

  // Extract preferences
  const preferenceKeywords = ['food', 'culture', 'history', 'art', 'romantic', 'family', 'adventure', 'luxury', 'budget'];
  criteria.preferences = preferenceKeywords.filter(keyword => 
    message.toLowerCase().includes(keyword)
  );

  // Extract dates (basic patterns)
  const datePatterns = [
    /next month/i,
    /(\d+)\s+days?/i,
    /(\d+)\s+weeks?/i
  ];

  for (const pattern of datePatterns) {
    const match = message.match(pattern);
    if (match) {
      if (pattern.source.includes('month')) {
        const nextMonth = new Date();
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        criteria.checkIn = nextMonth.toISOString().split('T')[0];
      } else if (pattern.source.includes('days')) {
        const days = parseInt(match[1]);
        const checkIn = new Date();
        checkIn.setDate(checkIn.getDate() + 7); // Start in a week
        criteria.checkIn = checkIn.toISOString().split('T')[0];
        
        const checkOut = new Date(checkIn);
        checkOut.setDate(checkOut.getDate() + days);
        criteria.checkOut = checkOut.toISOString().split('T')[0];
      }
      break;
    }
  }

  return criteria;
};
