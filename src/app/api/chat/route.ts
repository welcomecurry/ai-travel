import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { searchTravel, parseTravelRequest, generateItinerary } from '@/lib/travelService';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const TRAVEL_AGENT_SYSTEM_PROMPT = `You are an expert travel agent with access to real-time flight, hotel, and activity data. 

IMPORTANT: Analyze the user's message to determine if they are:
1. Making an INITIAL travel request (vague like "Plan me a trip to Paris")
2. Providing DETAILED information after follow-up questions

For INITIAL requests (lacking details like dates, budget, travelers, etc.), respond with conversational follow-up questions in this format:
{
  "type": "follow_up",
  "message": "Alright, [destination] it is! 🌍 To tailor this trip perfectly for you, I need a few more details:\\n\\n✈️ **Where are you traveling from?** (So I can figure out flights and transport)\\n📅 **When do you want to go, and for how long?**\\n👥 **Are you flying solo, or bringing company?**\\n🎯 **What's the main purpose of your trip?** (Romantic getaway, sightseeing, food adventure, or just to pretend you're in a movie)\\n\\nHit me with the details!"
}

For DETAILED requests (with sufficient information), respond with structured JSON trip data in this exact format:

{
  "type": "trip_plan",
  "destination": "Paris, France",
  "duration": "5 days",
  "budget": "$2,000",
  "travelers": 2,
  "flights": [
    {
      "id": "AF1001",
      "airline": "Air France",
      "flightNumber": "AF 1001",
      "route": "JFK → CDG",
      "departureTime": "22:30",
      "arrivalTime": "12:15+1",
      "duration": "7h 45m",
      "price": 1245,
      "stops": 0
    }
  ],
  "hotels": [
    {
      "id": "paris-ritz",
      "name": "The Ritz Paris",
      "location": "Place Vendôme, 1st Arrondissement",
      "rating": 5,
      "pricePerNight": 1200,
      "amenities": ["Spa", "Fitness Center", "Restaurant"],
      "description": "Legendary luxury hotel in the heart of Paris",
      "category": "Luxury",
      "image": "ritz-paris.jpg"
    }
  ],
  "itinerary": [
    {
      "day": 1,
      "title": "Arrival and Relaxing Evening",
      "description": "Settle into Paris and enjoy a gentle introduction to the city",
      "activities": [
        {
          "id": "eiffel-tower",
          "name": "Eiffel Tower Skip-the-Line Tour",
          "type": "attraction",
          "duration": "2 hours",
          "price": 89,
          "description": "Skip the lines and ascend to the second floor",
          "image": "eiffel-tower.jpg",
          "time": "3:00 PM"
        }
      ],
      "image": "paris-evening.jpg"
    }
  ],
  "totalCost": {
    "flights": 2490,
    "hotels": 6000,
    "activities": 890,
    "total": 9380
  }
}

Rules:
1. For follow-up responses: Be conversational, friendly, and match the tone shown in the example
2. For trip plans: Use the provided travel data EXACTLY - copy airline names, hotel names, prices, and activity details precisely
3. Create 5-7 days of itinerary with 2-3 activities per day
4. Calculate realistic total costs based on the provided data
5. Include practical time estimates for activities
6. IMPORTANT: For trip plans, ONLY return the JSON structure - no explanatory text, no conversational language, just pure JSON
7. Ensure all JSON is valid and properly formatted
8. The frontend will handle displaying a human-readable confirmation message

CRITICAL: Always determine if this is an initial request needing follow-up or a detailed request ready for trip planning.`;

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory = [] } = await request.json();

    if (!message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json(
        { error: 'Valid message content is required' },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    // Parse travel request and search for relevant data
    const searchCriteria = parseTravelRequest(message);
    let travelData = '';
    let systemPromptWithData = TRAVEL_AGENT_SYSTEM_PROMPT;

    // If this looks like a travel request, get actual data
    if (searchCriteria.destination) {
      const results = await searchTravel(searchCriteria);
      
      if (results.success) {
        travelData = `

CURRENT TRAVEL DATA FOR YOUR RESPONSE:

✈️ AVAILABLE FLIGHTS TO ${searchCriteria.destination?.toUpperCase()}:
${results.flights.flights.slice(0, 3).map(flight => 
  `${flight.airline} ${flight.flightNumber}: ${flight.origin} → ${flight.destination} at ${flight.departureTime}, arrives ${flight.arrivalTime} ($${flight.price})`
).join('\n')}

🏨 AVAILABLE HOTELS IN ${searchCriteria.destination?.toUpperCase()}:
${results.hotels.hotels.slice(0, 3).map(hotel => 
  `${hotel.name}: ${hotel.location}, ${hotel.rating}★ ($${hotel.pricePerNight}/night) - ${hotel.amenities.slice(0, 3).join(', ')}`
).join('\n')}

🎯 AVAILABLE ACTIVITIES IN ${searchCriteria.destination?.toUpperCase()}:
${results.activities.activities.slice(0, 6).map(activity => 
  `${activity.name}: ${activity.type}, ${activity.duration} ($${activity.price}) - ${activity.description}`
).join('\n')}

Use this EXACT data in your response. Reference specific flights, hotels, and activities by name with their actual prices and details.`;

        systemPromptWithData += travelData;
      }
    }

    // Build the conversation context
    const messages = [
      {
        role: 'system' as const,
        content: systemPromptWithData,
      },
      // Include previous conversation history (filtered and sanitized)
      ...conversationHistory
        .filter((msg: any) => msg && msg.content && typeof msg.content === 'string' && msg.content.trim())
        .map((msg: any) => ({
          role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
          content: msg.content.trim(),
        })),
      // Add the current user message
      {
        role: 'user' as const,
        content: message,
      },
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages,
      max_tokens: 1000,
      temperature: 0.7,
      stream: true,
    });

    // Create a readable stream for the response
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        
        try {
          for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
              const data = JSON.stringify({ content });
              controller.enqueue(encoder.encode(`data: ${data}\n\n`));
            }
          }
        } catch (error) {
          console.error('Streaming error:', error);
          controller.error(error);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Chat API error:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: `API Error: ${error.message}` },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
