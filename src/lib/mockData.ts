export interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  class: 'economy' | 'premium' | 'business' | 'first';
  stops: number;
  aircraft: string;
}

export interface Hotel {
  id: string;
  name: string;
  location: string;
  rating: number;
  pricePerNight: number;
  amenities: string[];
  description: string;
  imageUrl: string;
  category: 'budget' | 'mid-range' | 'luxury';
  reviewCount: number;
  reviewScore: number;
}

export interface Activity {
  id: string;
  name: string;
  type: 'attraction' | 'restaurant' | 'tour' | 'entertainment' | 'shopping';
  location: string;
  price: number;
  duration: string;
  rating: number;
  description: string;
  tags: string[];
  operatingHours: string;
  bookingRequired: boolean;
}

// Mock flight data
export const mockFlights: Flight[] = [
  // New York to Paris
  {
    id: 'AF1001',
    airline: 'Air France',
    flightNumber: 'AF 1001',
    origin: 'JFK',
    destination: 'CDG',
    departureTime: '22:30',
    arrivalTime: '12:15+1',
    duration: '7h 45m',
    price: 1245,
    class: 'economy',
    stops: 0,
    aircraft: 'Boeing 777-300ER'
  },
  {
    id: 'DL264',
    airline: 'Delta Air Lines',
    flightNumber: 'DL 264',
    origin: 'JFK',
    destination: 'CDG',
    departureTime: '23:55',
    arrivalTime: '13:40+1',
    duration: '7h 45m',
    price: 1189,
    class: 'economy',
    stops: 0,
    aircraft: 'Airbus A330-300'
  },
  {
    id: 'BA178',
    airline: 'British Airways',
    flightNumber: 'BA 178',
    origin: 'JFK',
    destination: 'CDG',
    departureTime: '09:50',
    arrivalTime: '23:30',
    duration: '10h 40m',
    price: 987,
    class: 'economy',
    stops: 1,
    aircraft: 'Boeing 787-9'
  },
  // New York to Rome
  {
    id: 'AZ608',
    airline: 'ITA Airways',
    flightNumber: 'AZ 608',
    origin: 'JFK',
    destination: 'FCO',
    departureTime: '21:40',
    arrivalTime: '13:55+1',
    duration: '8h 15m',
    price: 1356,
    class: 'economy',
    stops: 0,
    aircraft: 'Airbus A330-200'
  },
  {
    id: 'DL216',
    airline: 'Delta Air Lines',
    flightNumber: 'DL 216',
    origin: 'JFK',
    destination: 'FCO',
    departureTime: '22:25',
    arrivalTime: '14:40+1',
    duration: '8h 15m',
    price: 1278,
    class: 'economy',
    stops: 0,
    aircraft: 'Airbus A330-900neo'
  },
  // Los Angeles to Tokyo
  {
    id: 'NH175',
    airline: 'ANA',
    flightNumber: 'NH 175',
    origin: 'LAX',
    destination: 'NRT',
    departureTime: '11:50',
    arrivalTime: '16:35+1',
    duration: '11h 45m',
    price: 1456,
    class: 'economy',
    stops: 0,
    aircraft: 'Boeing 777-300ER'
  },
  {
    id: 'JL62',
    airline: 'JAL',
    flightNumber: 'JL 62',
    origin: 'LAX',
    destination: 'NRT',
    departureTime: '13:05',
    arrivalTime: '17:50+1',
    duration: '11h 45m',
    price: 1398,
    class: 'economy',
    stops: 0,
    aircraft: 'Boeing 787-9'
  }
];

// Mock hotel data
export const mockHotels: Hotel[] = [
  // Paris Hotels
  {
    id: 'paris-ritz',
    name: 'The Ritz Paris',
    location: 'Place Vendôme, 1st Arrondissement',
    rating: 5,
    pricePerNight: 1200,
    amenities: ['Spa', 'Fitness Center', 'Restaurant', 'Bar', 'Concierge', 'Room Service'],
    description: 'Legendary luxury hotel in the heart of Paris with opulent rooms and world-class service.',
    imageUrl: '/hotels/ritz-paris.jpg',
    category: 'luxury',
    reviewCount: 2847,
    reviewScore: 9.2
  },
  {
    id: 'paris-bristol',
    name: 'Le Bristol Paris',
    location: 'Faubourg Saint-Honoré, 8th Arrondissement',
    rating: 5,
    pricePerNight: 980,
    amenities: ['Spa', 'Pool', 'Restaurant', 'Bar', 'Garden', 'Pet-Friendly'],
    description: 'Palace hotel with exceptional French elegance and Michelin-starred dining.',
    imageUrl: '/hotels/bristol-paris.jpg',
    category: 'luxury',
    reviewCount: 1923,
    reviewScore: 9.1
  },
  {
    id: 'paris-marais',
    name: 'Hotel des Grands Boulevards',
    location: 'Le Marais, 4th Arrondissement',
    rating: 4,
    pricePerNight: 285,
    amenities: ['Restaurant', 'Bar', 'Free WiFi', 'Concierge'],
    description: 'Boutique hotel in historic Marais district with modern amenities and classic charm.',
    imageUrl: '/hotels/marais-paris.jpg',
    category: 'mid-range',
    reviewCount: 1456,
    reviewScore: 8.7
  },
  {
    id: 'paris-budget',
    name: 'Hotel Jeanne d\'Arc',
    location: 'Le Marais, 4th Arrondissement',
    rating: 3,
    pricePerNight: 145,
    amenities: ['Free WiFi', 'Breakfast', '24/7 Reception'],
    description: 'Charming budget hotel in the heart of historic Paris with comfortable rooms.',
    imageUrl: '/hotels/jeanne-arc-paris.jpg',
    category: 'budget',
    reviewCount: 987,
    reviewScore: 8.1
  },
  // Rome Hotels
  {
    id: 'rome-hassler',
    name: 'Hotel Hassler Roma',
    location: 'Spanish Steps, Historic Center',
    rating: 5,
    pricePerNight: 850,
    amenities: ['Spa', 'Restaurant', 'Bar', 'Rooftop Terrace', 'Concierge'],
    description: 'Iconic luxury hotel overlooking the Spanish Steps with breathtaking city views.',
    imageUrl: '/hotels/hassler-rome.jpg',
    category: 'luxury',
    reviewCount: 2341,
    reviewScore: 9.0
  },
  {
    id: 'rome-artemide',
    name: 'Hotel Artemide',
    location: 'Near Termini Station, Historic Center',
    rating: 4,
    pricePerNight: 220,
    amenities: ['Rooftop Restaurant', 'Spa', 'Fitness Center', 'Free WiFi'],
    description: 'Modern 4-star hotel near major attractions with rooftop dining and city views.',
    imageUrl: '/hotels/artemide-rome.jpg',
    category: 'mid-range',
    reviewCount: 1678,
    reviewScore: 8.5
  },
  {
    id: 'rome-budget',
    name: 'The RomeHello',
    location: 'Termini Station Area',
    rating: 3,
    pricePerNight: 89,
    amenities: ['Free WiFi', 'Breakfast', 'Luggage Storage'],
    description: 'Modern budget hotel with great location near transportation and major sites.',
    imageUrl: '/hotels/romehello.jpg',
    category: 'budget',
    reviewCount: 1234,
    reviewScore: 7.9
  },
  // Tokyo Hotels
  {
    id: 'tokyo-mandarin',
    name: 'Mandarin Oriental Tokyo',
    location: 'Nihonbashi, Central Tokyo',
    rating: 5,
    pricePerNight: 720,
    amenities: ['Spa', 'Multiple Restaurants', 'Bar', 'Fitness Center', 'City Views'],
    description: 'Ultra-luxury hotel with stunning Tokyo skyline views and world-class amenities.',
    imageUrl: '/hotels/mandarin-tokyo.jpg',
    category: 'luxury',
    reviewCount: 1876,
    reviewScore: 9.3
  },
  {
    id: 'tokyo-shibuya',
    name: 'Shibuya Excel Hotel Tokyu',
    location: 'Shibuya, Central Tokyo',
    rating: 4,
    pricePerNight: 180,
    amenities: ['Restaurant', 'Free WiFi', 'City Views', 'Shopping Access'],
    description: 'Modern hotel in the heart of Shibuya with direct access to shopping and nightlife.',
    imageUrl: '/hotels/shibuya-excel.jpg',
    category: 'mid-range',
    reviewCount: 2156,
    reviewScore: 8.4
  }
];

// Mock activities data
export const mockActivities: Activity[] = [
  // Paris Activities
  {
    id: 'eiffel-tower',
    name: 'Eiffel Tower Skip-the-Line Tour',
    type: 'attraction',
    location: 'Champ de Mars, 7th Arrondissement',
    price: 89,
    duration: '2 hours',
    rating: 4.7,
    description: 'Skip the lines and ascend to the second floor of Paris\'s most iconic landmark.',
    tags: ['iconic', 'views', 'photography', 'must-see'],
    operatingHours: '9:30 AM - 11:45 PM',
    bookingRequired: true
  },
  {
    id: 'louvre-tour',
    name: 'Louvre Museum Guided Tour',
    type: 'attraction',
    location: '1st Arrondissement',
    price: 65,
    duration: '3 hours',
    rating: 4.6,
    description: 'Expert-guided tour of the world\'s largest art museum including the Mona Lisa.',
    tags: ['art', 'culture', 'history', 'guided'],
    operatingHours: '9:00 AM - 6:00 PM',
    bookingRequired: true
  },
  {
    id: 'seine-cruise',
    name: 'Seine River Evening Cruise with Dinner',
    type: 'tour',
    location: 'Seine River',
    price: 125,
    duration: '2.5 hours',
    rating: 4.5,
    description: 'Romantic dinner cruise along the Seine with views of illuminated landmarks.',
    tags: ['romantic', 'dinner', 'views', 'evening'],
    operatingHours: '7:30 PM - 10:00 PM',
    bookingRequired: true
  },
  {
    id: 'montmartre-walk',
    name: 'Montmartre Walking Tour',
    type: 'tour',
    location: 'Montmartre, 18th Arrondissement',
    price: 35,
    duration: '2 hours',
    rating: 4.4,
    description: 'Explore the artistic quarter of Montmartre with Sacré-Cœur and local cafés.',
    tags: ['walking', 'art', 'history', 'neighborhood'],
    operatingHours: '10:00 AM - 6:00 PM',
    bookingRequired: false
  },
  {
    id: 'le-comptoir',
    name: 'Le Comptoir du Relais',
    type: 'restaurant',
    location: 'Saint-Germain, 6th Arrondissement',
    price: 75,
    duration: '2 hours',
    rating: 4.3,
    description: 'Authentic French bistro experience with traditional dishes and wine pairing.',
    tags: ['french cuisine', 'bistro', 'wine', 'authentic'],
    operatingHours: '12:00 PM - 2:00 PM, 7:00 PM - 11:00 PM',
    bookingRequired: true
  },
  // Rome Activities
  {
    id: 'colosseum-tour',
    name: 'Colosseum Underground Tour',
    type: 'attraction',
    location: 'Historic Center',
    price: 95,
    duration: '3 hours',
    rating: 4.8,
    description: 'Exclusive access to the underground chambers and arena floor of the Colosseum.',
    tags: ['history', 'ancient', 'underground', 'exclusive'],
    operatingHours: '8:30 AM - 7:00 PM',
    bookingRequired: true
  },
  {
    id: 'vatican-tour',
    name: 'Vatican Museums & Sistine Chapel Tour',
    type: 'attraction',
    location: 'Vatican City',
    price: 78,
    duration: '4 hours',
    rating: 4.7,
    description: 'Comprehensive tour of Vatican Museums, Sistine Chapel, and St. Peter\'s Basilica.',
    tags: ['art', 'religion', 'history', 'michelangelo'],
    operatingHours: '8:00 AM - 6:00 PM',
    bookingRequired: true
  },
  {
    id: 'trastevere-food',
    name: 'Trastevere Food Walking Tour',
    type: 'tour',
    location: 'Trastevere',
    price: 89,
    duration: '3.5 hours',
    rating: 4.6,
    description: 'Taste authentic Roman cuisine while exploring the charming Trastevere neighborhood.',
    tags: ['food', 'walking', 'local', 'authentic'],
    operatingHours: '6:00 PM - 9:30 PM',
    bookingRequired: true
  },
  {
    id: 'roman-forum',
    name: 'Roman Forum and Palatine Hill',
    type: 'attraction',
    location: 'Historic Center',
    price: 45,
    duration: '2.5 hours',
    rating: 4.4,
    description: 'Explore the ruins of ancient Rome with skip-the-line access.',
    tags: ['ancient', 'ruins', 'history', 'archaeology'],
    operatingHours: '8:30 AM - 7:00 PM',
    bookingRequired: false
  },
  {
    id: 'da-enzo',
    name: 'Da Enzo al 29',
    type: 'restaurant',
    location: 'Trastevere',
    price: 55,
    duration: '1.5 hours',
    rating: 4.5,
    description: 'Family-run trattoria serving traditional Roman dishes in an intimate setting.',
    tags: ['roman cuisine', 'family-run', 'traditional', 'intimate'],
    operatingHours: '12:30 PM - 3:00 PM, 7:30 PM - 11:00 PM',
    bookingRequired: true
  },
  // Tokyo Activities
  {
    id: 'tsukiji-tour',
    name: 'Tsukiji Outer Market Food Tour',
    type: 'tour',
    location: 'Tsukiji',
    price: 98,
    duration: '3 hours',
    rating: 4.8,
    description: 'Early morning tour of the famous fish market with fresh sushi breakfast.',
    tags: ['food', 'market', 'sushi', 'early morning'],
    operatingHours: '5:00 AM - 8:00 AM',
    bookingRequired: true
  },
  {
    id: 'senso-ji',
    name: 'Senso-ji Temple and Asakusa District',
    type: 'attraction',
    location: 'Asakusa',
    price: 0,
    duration: '2 hours',
    rating: 4.5,
    description: 'Visit Tokyo\'s oldest temple and explore traditional shopping streets.',
    tags: ['temple', 'traditional', 'free', 'culture'],
    operatingHours: '6:00 AM - 5:00 PM',
    bookingRequired: false
  },
  {
    id: 'shibuya-crossing',
    name: 'Shibuya Sky Observation Deck',
    type: 'attraction',
    location: 'Shibuya',
    price: 28,
    duration: '1 hour',
    rating: 4.6,
    description: 'Panoramic views of Tokyo from the famous Shibuya crossing area.',
    tags: ['views', 'modern', 'cityscape', 'photography'],
    operatingHours: '9:00 AM - 11:00 PM',
    bookingRequired: false
  },
  {
    id: 'jiro-sushi',
    name: 'Sukiyabashi Jiro Experience',
    type: 'restaurant',
    location: 'Ginza',
    price: 450,
    duration: '30 minutes',
    rating: 4.9,
    description: 'World-renowned sushi experience at the legendary three-Michelin-starred restaurant.',
    tags: ['sushi', 'michelin', 'legendary', 'expensive'],
    operatingHours: '11:30 AM - 2:00 PM, 5:00 PM - 8:30 PM',
    bookingRequired: true
  }
];

// Helper function to get destination-specific data
export const getDestinationData = (destination: string) => {
  const normalizedDest = destination.toLowerCase();
  
  const flights = mockFlights.filter(flight => 
    flight.destination.toLowerCase().includes(normalizedDest) ||
    flight.destination === 'CDG' && normalizedDest.includes('paris') ||
    flight.destination === 'FCO' && normalizedDest.includes('rome') ||
    flight.destination === 'NRT' && normalizedDest.includes('tokyo')
  );

  const hotels = mockHotels.filter(hotel =>
    hotel.location.toLowerCase().includes(normalizedDest) ||
    hotel.id.includes(normalizedDest)
  );

  const activities = mockActivities.filter(activity =>
    activity.location.toLowerCase().includes(normalizedDest) ||
    activity.id.includes(normalizedDest)
  );

  return { flights, hotels, activities };
};
