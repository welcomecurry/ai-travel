// Smart query detection service for follow-up interactions

export type QueryIntent = 'hotel' | 'flight' | 'activity' | 'budget' | 'date' | 'general' | 'multiple';

export interface QueryAnalysis {
  intent: QueryIntent;
  confidence: number;
  targetSection: 'hotels' | 'flights' | 'activities' | 'multiple' | 'general';
  loadingMessage: string;
  keywords: string[];
}

// Keywords for different query types
const QUERY_PATTERNS = {
  hotel: {
    keywords: [
      'hotel', 'hotels', 'accommodation', 'stay', 'room', 'lodge', 'resort', 'inn',
      'cheaper hotel', 'different hotel', 'luxury hotel', 'budget hotel',
      'better hotel', 'another hotel', 'hotel options', 'place to stay'
    ],
    loadingMessages: [
      '🏨 Searching for better hotels...',
      '🏨 Finding cheaper hotel options...',
      '🏨 Looking for luxury accommodations...',
      '🏨 Updating hotel recommendations...',
      '🏨 Finding alternative hotels...'
    ]
  },
  flight: {
    keywords: [
      'flight', 'flights', 'plane', 'airline', 'fly', 'departure', 'arrival',
      'cheaper flight', 'different flight', 'direct flight', 'connecting flight',
      'earlier flight', 'later flight', 'flight options', 'alternative flight'
    ],
    loadingMessages: [
      '✈️ Looking for alternative flights...',
      '✈️ Searching for cheaper flights...',
      '✈️ Finding direct flight options...',
      '✈️ Updating flight recommendations...',
      '✈️ Checking different airlines...'
    ]
  },
  activity: {
    keywords: [
      'activity', 'activities', 'things to do', 'attractions', 'tour', 'tours',
      'museum', 'restaurant', 'food', 'dining', 'sightseeing', 'entertainment',
      'add activities', 'more activities', 'different activities', 'itinerary',
      'schedule', 'plan', 'visit', 'explore', 'experience'
    ],
    loadingMessages: [
      '🎯 Finding new activities...',
      '🎯 Adding more experiences...',
      '🎯 Updating your itinerary...',
      '🎯 Discovering local attractions...',
      '🎯 Planning better activities...'
    ]
  },
  budget: {
    keywords: [
      'budget', 'cheaper', 'expensive', 'cost', 'price', 'affordable', 'money',
      'save money', 'reduce cost', 'lower price', 'budget options', 'economical'
    ],
    loadingMessages: [
      '💰 Checking budget options...',
      '💰 Finding cheaper alternatives...',
      '💰 Optimizing your budget...',
      '💰 Looking for savings...',
      '💰 Updating cost estimates...'
    ]
  },
  date: {
    keywords: [
      'date', 'dates', 'time', 'when', 'schedule', 'calendar', 'day', 'week',
      'change date', 'different date', 'reschedule', 'move trip', 'postpone'
    ],
    loadingMessages: [
      '📅 Updating travel dates...',
      '📅 Checking new availability...',
      '📅 Rescheduling your trip...',
      '📅 Finding options for new dates...',
      '📅 Adjusting your schedule...'
    ]
  }
};

// Detect query intent and return analysis
export function analyzeQuery(query: string): QueryAnalysis {
  const lowerQuery = query.toLowerCase();
  const words = lowerQuery.split(/\s+/);
  
  let bestMatch: QueryAnalysis = {
    intent: 'general',
    confidence: 0,
    targetSection: 'general',
    loadingMessage: '🔍 Processing your request...',
    keywords: []
  };

  // Check each pattern type
  for (const [intentKey, pattern] of Object.entries(QUERY_PATTERNS)) {
    const intent = intentKey as QueryIntent;
    let matchCount = 0;
    const matchedKeywords: string[] = [];

    // Check for keyword matches
    for (const keyword of pattern.keywords) {
      if (lowerQuery.includes(keyword)) {
        matchCount += keyword.split(' ').length; // Multi-word keywords get more weight
        matchedKeywords.push(keyword);
      }
    }

    // Calculate confidence based on matches
    const confidence = matchCount / words.length;
    
    if (confidence > bestMatch.confidence) {
      const targetSection = getTargetSection(intent);
      const loadingMessage = getRandomLoadingMessage(pattern.loadingMessages, lowerQuery);
      
      bestMatch = {
        intent,
        confidence,
        targetSection,
        loadingMessage,
        keywords: matchedKeywords
      };
    }
  }

  // Handle multiple section queries
  const multiSectionKeywords = ['change', 'update', 'modify', 'adjust', 'new'];
  const hasMultiSectionIntent = multiSectionKeywords.some(keyword => lowerQuery.includes(keyword));
  
  if (hasMultiSectionIntent && bestMatch.confidence < 0.3) {
    bestMatch.intent = 'multiple';
    bestMatch.targetSection = 'multiple';
    bestMatch.loadingMessage = '🔄 Updating your trip plan...';
  }

  // Fallback for low confidence
  if (bestMatch.confidence < 0.1) {
    bestMatch.intent = 'general';
    bestMatch.targetSection = 'general';
    bestMatch.loadingMessage = '🤔 Understanding your request...';
  }

  return bestMatch;
}

// Map intent to target section
function getTargetSection(intent: QueryIntent): 'hotels' | 'flights' | 'activities' | 'multiple' | 'general' {
  switch (intent) {
    case 'hotel':
      return 'hotels';
    case 'flight':
      return 'flights';
    case 'activity':
      return 'activities';
    case 'date':
    case 'budget':
      return 'multiple';
    default:
      return 'general';
  }
}

// Get contextual loading message
function getRandomLoadingMessage(messages: string[], query: string): string {
  // Try to pick most relevant message based on query content
  if (query.includes('cheap') || query.includes('budget')) {
    const budgetMessage = messages.find(msg => msg.includes('cheaper') || msg.includes('budget'));
    if (budgetMessage) return budgetMessage;
  }
  
  if (query.includes('luxury') || query.includes('premium')) {
    const luxuryMessage = messages.find(msg => msg.includes('luxury') || msg.includes('better'));
    if (luxuryMessage) return luxuryMessage;
  }
  
  if (query.includes('different') || query.includes('alternative')) {
    const altMessage = messages.find(msg => msg.includes('alternative') || msg.includes('different'));
    if (altMessage) return altMessage;
  }
  
  // Default to random message
  return messages[Math.floor(Math.random() * messages.length)];
}

// Check if query is a follow-up (vs initial trip planning)
export function isFollowUpQuery(query: string, hasExistingTripData: boolean): boolean {
  if (!hasExistingTripData) return false;
  
  const followUpIndicators = [
    'find', 'get', 'show', 'change', 'update', 'modify', 'adjust',
    'different', 'another', 'alternative', 'better', 'cheaper',
    'add', 'remove', 'replace', 'switch', 'upgrade'
  ];
  
  const lowerQuery = query.toLowerCase();
  return followUpIndicators.some(indicator => lowerQuery.includes(indicator));
}

// Generate section-specific loading states
export interface SectionLoadingState {
  section: 'hotels' | 'flights' | 'activities';
  isLoading: boolean;
  message: string;
}

export function createSectionLoadingState(
  targetSection: 'hotels' | 'flights' | 'activities' | 'multiple' | 'general',
  loadingMessage: string
): SectionLoadingState[] {
  const states: SectionLoadingState[] = [];
  
  if (targetSection === 'multiple') {
    states.push(
      { section: 'hotels', isLoading: true, message: '🏨 Updating hotels...' },
      { section: 'flights', isLoading: true, message: '✈️ Updating flights...' },
      { section: 'activities', isLoading: true, message: '🎯 Updating activities...' }
    );
  } else if (targetSection !== 'general') {
    states.push({
      section: targetSection,
      isLoading: true,
      message: loadingMessage
    });
  }
  
  return states;
}

// Example usage patterns for testing
export const EXAMPLE_QUERIES = {
  hotel: [
    "find me a cheaper hotel",
    "show me luxury hotels",
    "I want a different hotel",
    "any better hotel options?",
    "find hotels under $200"
  ],
  flight: [
    "get me a direct flight",
    "find cheaper flights",
    "show alternative flight options",
    "I need an earlier flight",
    "find flights with different airlines"
  ],
  activity: [
    "add more activities",
    "find things to do",
    "show me museums",
    "add restaurants to the plan",
    "what else can we visit?"
  ],
  budget: [
    "make it cheaper",
    "reduce the cost",
    "find budget options",
    "save money on this trip"
  ],
  date: [
    "change the dates",
    "move the trip to next month",
    "reschedule for different dates"
  ]
};
