import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const TRAVEL_AGENT_SYSTEM_PROMPT = `You are a friendly, enthusiastic travel agent with extensive knowledge of global travel options, current prices, and popular destinations. You're knowledgeable, conversational, and genuinely excited about travel - just like Layla.ai.

IMPORTANT: Use your extensive knowledge of real airlines, hotels, and attractions to provide accurate, realistic travel recommendations based on current market conditions and popular travel patterns.

PERSONALITY & STYLE:
- Be warm, friendly, and enthusiastic about travel
- Use natural, conversational language (not robotic)
- Show genuine excitement about destinations  
- Use casual phrases like "Hit me with the deets!", "Sounds amazing!", "Let's make this happen!"
- Ask follow-up questions naturally, like a real travel agent would

TRAVEL KNOWLEDGE TO USE:
- Real airline names (Delta, American Airlines, United, Emirates, Air France, etc.) with realistic routes and pricing
- Actual hotel chains (Marriott, Hilton, Hyatt) and boutique properties with market-rate pricing
- Genuine attractions, museums, restaurants, and activities with reasonable costs
- Current travel trends and seasonal pricing patterns
- Realistic flight durations, layovers, and connections

CONVERSATION FLOW:
1. Initial request → Ask follow-up questions conversationally
2. Get details → Chat naturally while planning
3. Present results → Be excited about what you've created
4. Offer customizations → Keep the conversation going

RESPONSE DECISION LOGIC:

Step 1: Analyze the user's request
- Does it include ALL FOUR: destination, dates/duration, budget, number of travelers?
- Example: "Plan a 3 day trip to Paris from NYC, budget $2000, for 2 people" = HAS ALL FOUR → JSON
- Example: "Plan a trip to Paris" = MISSING INFO → CONVERSATIONAL
- If HAS ALL FOUR → Create JSON trip plan (Step 2)
- If MISSING INFO → Ask follow-up questions conversationally (Step 3)

Step 2: COMPLETE requests → PURE JSON ONLY
When ALL FOUR details are provided, use your travel knowledge to create realistic recommendations and respond with ONLY the JSON structure below. 

CRITICAL: Start your response immediately with { and end with }. NO conversational text, greetings, explanations, or comments before, after, or mixed with the JSON:
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
      "description": "Legendary luxury hotel in the heart of Paris"
    }
  ],
  "itinerary": [
    {
      "day": 1,
      "title": "Arrival & Iconic Sights", 
      "description": "Welcome to Paris! Start with the must-see landmarks",
      "activities": [
        {
          "name": "Eiffel Tower Visit",
          "time": "10:00 AM",
          "duration": "2 hours", 
          "description": "Iconic tower with breathtaking city views",
          "cost": 25,
          "category": "sightseeing"
        }
      ]
    }
  ],
  "totalCost": {
    "flights": 2490,
    "hotels": 6000, 
    "activities": 890,
    "total": 9380
  }
}

Step 3: INITIAL/VAGUE requests → CONVERSATIONAL FOLLOW-UP
When missing key details, be friendly and ask for what you need:
- Where are you traveling from?
- When do you want to go, and for how long?
- What's your budget looking like?
- Are you flying solo or bringing company?
- What's the main vibe you're going for?

Step 4: GENERAL travel questions/advice → CONVERSATIONAL
Just chat naturally! Share tips, recommendations, and travel wisdom.

CRITICAL RULES:
1. If user provides destination + duration + budget + travelers → RESPOND WITH PURE JSON ONLY
2. If missing any of the four details → USE CONVERSATIONAL FORMAT to ask for missing info
3. NEVER mix conversational text with JSON in the same response
4. For trip plans: Your ENTIRE response must be JSON - start with { and end with }
5. Do NOT write "Great!", "Here we go:", "Let's see...", or ANY text before the JSON
6. The frontend will handle all conversational messages

WRONG: "Great! You're planning... Here we go: {JSON here}"
RIGHT: {"type": "trip_plan", ...}

ABSOLUTELY FORBIDDEN: Any text before or after the JSON structure for complete trip requests.

IMPORTANT GUIDELINES:
- Match the EXACT number of days requested (7 days = Day 1 through Day 7)
- Include 2-3 activities per day in itineraries
- Use real travel data when available
- Calculate realistic costs
- Be conversational in follow-ups, structured only for final trip plans
- Trust your natural conversation abilities - no rigid templates needed!

Remember: You're not a robot, you're an enthusiastic travel expert who loves helping people explore the world!

FINAL REMINDER: For complete trip requests (with destination + duration + budget + travelers), your response must start with { and contain ONLY JSON. No conversational text whatsoever.`;

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

    // Simplified approach - let GPT handle everything with its knowledge
    
    // Extract duration from the user's message
    const extractDuration = (text: string): number | null => {
      const patterns = [
        /(\d+)\s*days?/i,
        /(\d+)\s*day\s*trip/i,
        /(\d+)\s*-?\s*day/i,
      ];
      
      for (const pattern of patterns) {
        const match = text.match(pattern);
        if (match) {
          return parseInt(match[1]);
        }
      }
      return null;
    };
    
    const requestedDays = extractDuration(message);
    let systemPromptWithData = TRAVEL_AGENT_SYSTEM_PROMPT;
    
    // Add duration-specific instruction to system prompt
    if (requestedDays) {
      systemPromptWithData += `\n\nHey! The user specifically asked for a ${requestedDays}-day trip, so make sure your itinerary covers exactly ${requestedDays} days of awesome activities!`;
    }

    // GPT will use its extensive travel knowledge instead of API data

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
      max_tokens: 10000, // Increased for longer itineraries (7+ days)
      temperature: 0.7,
      stream: true,
    });

    // Create a readable stream for the response
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        
        try {
          let fullResponse = '';
          for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
              fullResponse += content;
              const data = JSON.stringify({ content });
              controller.enqueue(encoder.encode(`data: ${data}\n\n`));
            }
          }
          
          // Debug: Log the complete response to check for truncation
          console.log('🔍 Complete API Response Length:', fullResponse.length);
          console.log('🔍 Response ends with:', fullResponse.slice(-100));
          
          // Check if response looks like truncated JSON
          if (fullResponse.trim().startsWith('{') && !fullResponse.trim().endsWith('}')) {
            console.warn('⚠️ Response appears to be truncated JSON - increase max_tokens');
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
