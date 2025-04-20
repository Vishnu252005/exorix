import { NextApiRequest, NextApiResponse } from 'next';

const GROQ_API_KEY = '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';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('API endpoint called with method:', req.method);
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { game, currentTitle, currentDescription } = req.body;
    console.log('Received request body:', { game, currentTitle, currentDescription });

    const prompt = `You are an expert esports tournament organizer. Based on the game "${game}", generate creative and professional suggestions for a tournament event title and description. The title should be catchy and appealing to gamers. The description should highlight competitive aspects, prizes, and excitement.

Current title: ${currentTitle || 'None'}
Current description: ${currentDescription || 'None'}

Please provide suggestions in the following format:
Title: [Your title suggestion]
Description: [Your description suggestion]

Make the suggestions different from the current title/description if they exist.`;

    console.log('Sending request to Groq API with prompt:', prompt);

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
            content: 'You are an AI assistant that helps create engaging esports tournament titles and descriptions.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.5,
        max_tokens: 1024,
        top_p: 1,
        stream: false
      }),
    });

    console.log('Groq API response status:', response.status);

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Groq API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Groq API Response data:', data);

    const content = data.choices[0]?.message?.content;
    console.log('Extracted content:', content);

    // Parse the response to extract title and description
    const titleMatch = content.match(/Title: (.*?)(?:\n|$)/);
    const descriptionMatch = content.match(/Description: ([\s\S]*?)(?:\n\n|$)/);

    const titleSuggestion = titleMatch ? titleMatch[1].trim() : '';
    const descriptionSuggestion = descriptionMatch ? descriptionMatch[1].trim() : '';

    console.log('Parsed suggestions:', { titleSuggestion, descriptionSuggestion });

    return res.status(200).json({
      titleSuggestion,
      descriptionSuggestion,
    });
  } catch (error) {
    console.error('Error generating suggestions:', error);
    return res.status(500).json({ error: 'Failed to generate suggestions' });
  }
} 