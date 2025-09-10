// Destination image service with Unsplash API integration and fallbacks

interface DestinationImage {
  url: string;
  alt: string;
  credit?: string;
}

// Curated high-quality destination images
const DESTINATION_IMAGES: Record<string, DestinationImage> = {
  'London': {
    url: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    alt: 'London skyline with Big Ben and Thames',
    credit: 'Photo by Benjamin Davies on Unsplash'
  },
  'London, UK': {
    url: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    alt: 'London skyline with Big Ben and Thames',
    credit: 'Photo by Benjamin Davies on Unsplash'
  },
  'Paris': {
    url: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2073&q=80',
    alt: 'Paris cityscape with Eiffel Tower',
    credit: 'Photo by Anthony DELANOIX on Unsplash'
  },
  'Paris, France': {
    url: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2073&q=80',
    alt: 'Paris cityscape with Eiffel Tower',
    credit: 'Photo by Anthony DELANOIX on Unsplash'
  },
  'Tokyo': {
    url: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2094&q=80',
    alt: 'Tokyo skyline at sunset',
    credit: 'Photo by Louie Martinez on Unsplash'
  },
  'Tokyo, Japan': {
    url: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2094&q=80',
    alt: 'Tokyo skyline at sunset',
    credit: 'Photo by Louie Martinez on Unsplash'
  },
  'New York': {
    url: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    alt: 'New York City skyline',
    credit: 'Photo by Luca Bravo on Unsplash'
  },
  'New York City': {
    url: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    alt: 'New York City skyline',
    credit: 'Photo by Luca Bravo on Unsplash'
  },
  'Rome': {
    url: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2096&q=80',
    alt: 'Rome Colosseum and ancient architecture',
    credit: 'Photo by David Köhler on Unsplash'
  },
  'Rome, Italy': {
    url: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2096&q=80',
    alt: 'Rome Colosseum and ancient architecture',
    credit: 'Photo by David Köhler on Unsplash'
  },
  'Barcelona': {
    url: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    alt: 'Barcelona cityscape with Sagrada Familia',
    credit: 'Photo by Toa Heftiba on Unsplash'
  },
  'Barcelona, Spain': {
    url: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    alt: 'Barcelona cityscape with Sagrada Familia',
    credit: 'Photo by Toa Heftiba on Unsplash'
  },
  'Amsterdam': {
    url: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    alt: 'Amsterdam canals and historic buildings',
    credit: 'Photo by Adrien Olichon on Unsplash'
  },
  'Amsterdam, Netherlands': {
    url: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    alt: 'Amsterdam canals and historic buildings',
    credit: 'Photo by Adrien Olichon on Unsplash'
  },
  'Dubai': {
    url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    alt: 'Dubai skyline with Burj Khalifa',
    credit: 'Photo by ZQ Lee on Unsplash'
  },
  'Dubai, UAE': {
    url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    alt: 'Dubai skyline with Burj Khalifa',
    credit: 'Photo by ZQ Lee on Unsplash'
  }
};

// Gradient fallbacks for destinations without images
const GRADIENT_FALLBACKS = [
  'bg-gradient-to-br from-blue-500 via-purple-600 to-teal-500',
  'bg-gradient-to-br from-orange-400 via-red-500 to-pink-500',
  'bg-gradient-to-br from-green-400 via-blue-500 to-purple-600',
  'bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500',
  'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500',
  'bg-gradient-to-br from-teal-400 via-cyan-500 to-blue-500'
];

// Function to get destination image
export function getDestinationImage(destination: string): DestinationImage | null {
  // Try exact match first
  if (DESTINATION_IMAGES[destination]) {
    return DESTINATION_IMAGES[destination];
  }
  
  // Try partial matches
  const destinationLower = destination.toLowerCase();
  for (const [key, image] of Object.entries(DESTINATION_IMAGES)) {
    if (destinationLower.includes(key.toLowerCase()) || key.toLowerCase().includes(destinationLower)) {
      return image;
    }
  }
  
  return null;
}

// Function to get gradient fallback
export function getGradientFallback(destination: string): string {
  // Use destination string to consistently pick same gradient
  const hash = destination.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return GRADIENT_FALLBACKS[hash % GRADIENT_FALLBACKS.length];
}

// Function to get Unsplash image URL (for future API integration)
export function getUnsplashImageUrl(destination: string, width = 1920, height = 1080): string {
  const query = encodeURIComponent(`${destination} cityscape landmarks travel`);
  return `https://source.unsplash.com/${width}x${height}/?${query}`;
}

// Airline logos mapping
export const AIRLINE_LOGOS: Record<string, string> = {
  'British Airways': '🇬🇧',
  'Virgin Atlantic': '✈️',
  'American Airlines': '🇺🇸',
  'Delta Air Lines': '🔺',
  'United Airlines': '🌐',
  'Lufthansa': '🇩🇪',
  'Air France': '🇫🇷',
  'KLM': '🇳🇱',
  'Emirates': '🇦🇪',
  'Qatar Airways': '🇶🇦',
  'Singapore Airlines': '🇸🇬',
  'Cathay Pacific': '🇭🇰',
  'Japan Airlines': '🇯🇵',
  'ANA': '🇯🇵'
};

// Hotel amenity icons
export const HOTEL_AMENITIES: Record<string, string> = {
  'Free WiFi': '📶',
  'Pool': '🏊‍♂️',
  'Spa': '🧘‍♀️',
  'Gym': '💪',
  'Restaurant': '🍽️',
  'Bar': '🍸',
  'Room Service': '🛎️',
  'Concierge': '🎩',
  'Parking': '🚗',
  'Pet Friendly': '🐕',
  'Business Center': '💼',
  'Airport Shuttle': '🚐',
  'Breakfast': '🥐',
  'Air Conditioning': '❄️',
  'Laundry': '👕'
};

// Activity type icons
export const ACTIVITY_ICONS: Record<string, string> = {
  'sightseeing': '🏛️',
  'museum': '🏛️',
  'food': '🍽️',
  'shopping': '🛍️',
  'entertainment': '🎭',
  'outdoor': '🌳',
  'culture': '🎨',
  'nightlife': '🌃',
  'adventure': '🏔️',
  'relaxation': '🧘‍♀️',
  'tour': '🚌',
  'experience': '✨'
};
