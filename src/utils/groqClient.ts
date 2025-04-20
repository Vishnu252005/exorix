import { getCachedEvents, Event } from '../hooks/useEvents';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

const GROQ_API_KEY = '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';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Supported languages
export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh', name: 'Chinese' },
  { code: 'hi', name: 'Hindi' },
  { code: 'ar', name: 'Arabic' }
];

const formatEvent = (event: Event) => {
  const formattedDate = event.date?.seconds ? new Date(event.date.seconds * 1000).toLocaleDateString() : 'TBA';
  return `✨ ${event.title} ✨
  
🎮 Game: ${event.game || 'Various Games'}
🏆 Prize Pool: ${event.prize ? '$' + event.prize : 'TBA'}
👥 Registration: ${event.currentParticipants} players
📅 Date: ${formattedDate}
📍 Location: ${event.location}
🎯 Capacity: ${event.capacity} teams
🔥 Status: Registration Open`;
};

const fetchEventsDirectly = async () => {
  try {
    const eventsQuery = query(
      collection(db, 'events'),
      orderBy('date', 'asc')
    );
    const snapshot = await getDocs(eventsQuery);
    const events = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Event[];
    return events.length > 0 ? events : [];
  } catch (error) {
    console.error('Error fetching events directly:', error);
    return [];
  }
};

const getEventsContext = async () => {
  let events = getCachedEvents();
  console.log('Retrieved cached events in groqClient:', events);
  
  if (!events || events.length === 0) {
    console.log('No cached events, fetching directly...');
    events = await fetchEventsDirectly();
  }

  if (events.length === 0) {
    return 'I apologize, but I am having trouble accessing the events data. Please try again in a moment.';
  }

  let contextString = `We have some exciting events happening right now. Let me give you a rundown of what's currently available:\n\n`;
  
  events.forEach((event, index) => {
    contextString += `${index + 1}. ${formatEvent(event)}\n\n`;
  });

  contextString += `🌟 All these events currently have registration open! Let me know if you'd like more details about any specific event or if you need help with registration.`;

  return contextString.trim();
};

export const generateResponse = async (message: string, targetLanguage: string = 'en') => {
  try {
    console.log('Sending request to Groq API with language:', targetLanguage);
    const eventsContext = await getEventsContext();
    
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: `You are Exorix Assistant, a specialized gaming AI assistant for Exorix Gaming Platform. Exorix is a cutting-edge gaming platform that combines AI technology with competitive gaming. Here's what makes us special:

**About Exorix Gaming Platform:**
* AI-Powered Gaming Assistant: Get real-time tips, strategies, and personalized gaming advice
* Competitive Tournaments: Join our regular esports tournaments with exciting prize pools
* Gaming Community: Connect with fellow gamers, form teams, and share strategies
* Live Events: Participate in both online and offline gaming events
* Professional Setup: Experience gaming with top-tier infrastructure and fair play systems

Current Events Data:
${eventsContext}

Response Guidelines:
1. ONLY respond to gaming-related queries
2. For non-gaming questions, politely redirect to gaming topics
3. Use gaming terminology and esports references
4. Format responses with clear spacing and gaming emojis 🎮 🏆 🎯
5. Keep responses focused on improving gaming skills and competitive play
6. Reference specific games and esports events when relevant
7. Highlight our AI-powered features and tournament offerings

If a question is not related to gaming, respond with: "I'm your gaming assistant! I can help you with gaming strategies, esports events, and competitive play. What gaming topic would you like to discuss?"`
          },
          {
            role: 'user',
            content: message
          }
        ],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.5,
        max_tokens: 1024,
        top_p: 1,
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0]?.message?.content) {
      throw new Error('Invalid response format from API');
    }

    const englishResponse = data.choices[0].message.content;

    if (targetLanguage === 'en') {
      return englishResponse;
    }

    const translationResponse = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: `You are a professional translator. Translate the following text to ${SUPPORTED_LANGUAGES.find(lang => lang.code === targetLanguage)?.name}. 
            Important rules:
            1. Maintain all emojis exactly as they appear
            2. Keep all numbers, dates, and proper names unchanged
            3. Preserve all formatting and special characters
            4. Translate naturally while keeping the same tone and style
            5. Do not add any explanations or notes - just translate the text
            6. Keep game names (like CS:GO, VALORANT, Dota 2) unchanged`
          },
          {
            role: 'user',
            content: englishResponse
          }
        ],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.3,
        max_tokens: 2048,
        top_p: 1,
        stream: false
      })
    });

    if (!translationResponse.ok) {
      console.error('Translation failed, returning original response');
      return englishResponse;
    }

    const translationData = await translationResponse.json();
    
    if (!translationData.choices || !translationData.choices[0]?.message?.content) {
      console.error('Invalid translation response format, returning original response');
      return englishResponse;
    }

    return translationData.choices[0].message.content;

  } catch (error) {
    console.error('Error details:', error);
    return "I apologize, but I'm having trouble connecting to my services right now. Please try again later.";
  }
};

// Function to convert audio to text using Groq
export const convertSpeechToText = async (audioBlob: Blob, language: string = 'en') => {
  try {
    // Convert audio blob to base64
    const reader = new FileReader();
    const base64Audio = await new Promise((resolve) => {
      reader.onloadend = () => {
        const base64String = reader.result as string;
        resolve(base64String.split(',')[1]); // Remove data URL prefix
      };
      reader.readAsDataURL(audioBlob);
    });

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: `You are a speech-to-text converter. Convert the audio to text in ${
              SUPPORTED_LANGUAGES.find(lang => lang.code === language)?.name || 'English'
            }. Return only the transcribed text without any additional commentary.`
          },
          {
            role: 'user',
            content: `Audio data (base64): ${base64Audio}`
          }
        ],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.3,
        max_tokens: 1024,
        top_p: 1,
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('Speech to text error:', error);
    throw error;
  }
};

// Optional: Add a function to handle larger files through chunking
export const convertLargeAudioToText = async (audioBlob: Blob, language: string = 'en') => {
  try {
    // If file is smaller than limit, use regular conversion
    if (audioBlob.size <= 40 * 1024 * 1024) {
      return await convertSpeechToText(audioBlob, language);
    }

    // For larger files, we need to implement chunking
    // This is a placeholder for the chunking implementation
    throw new Error('Audio file is too large. Please use a file smaller than 40MB or implement chunking.');
  } catch (error) {
    console.error('Large audio conversion error:', error);
    throw error;
  }
}; 