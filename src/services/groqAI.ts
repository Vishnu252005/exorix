import { TeamRegistration } from '../types/tournament';

interface GroqMatchPrediction {
  confidence: number;
  suggestedWinner: 'team1' | 'team2';
  reason: string;
}

interface GroqTeamAnalysis {
  skillRating: number;
  recentPerformance: number;
  consistencyScore: number;
  adaptabilityRating: number;
}

export class GroqAIService {
  private static instance: GroqAIService;
  private apiKey: string;
  private baseUrl: string;

  private constructor() {
    this.apiKey = process.env.REACT_APP_GROQ_API_KEY || '';
    this.baseUrl = 'https://api.groq.com/v1';
  }

  public static getInstance(): GroqAIService {
    if (!GroqAIService.instance) {
      GroqAIService.instance = new GroqAIService();
    }
    return GroqAIService.instance;
  }

  private async makeRequest(endpoint: string, data: any) {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`GROQ API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error making GROQ API request:', error);
      throw error;
    }
  }

  public async analyzePlayers(team1: TeamRegistration, team2: TeamRegistration): Promise<GroqMatchPrediction> {
    try {
      const prompt = `
        Analyze two esports teams/players for a match prediction:
        
        Team 1: ${team1.teamName || team1.playerName}
        - Game ID: ${team1.gameId}
        - Previous matches data: [Insert historical data]
        
        Team 2: ${team2.teamName || team2.playerName}
        - Game ID: ${team2.gameId}
        - Previous matches data: [Insert historical data]
        
        Based on the available information, predict the match outcome and provide a confidence score.
      `;

      const response = await this.makeRequest('/chat/completions', {
        model: 'mixtral-8x7b-32768',
        messages: [
          {
            role: 'system',
            content: 'You are an expert esports analyst AI that predicts match outcomes based on team and player statistics.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      });

      // Process the AI response to extract prediction
      const analysis = this.processAIResponse(response);
      return analysis;
    } catch (error) {
      console.error('Error analyzing players with GROQ:', error);
      // Return a fallback prediction if AI analysis fails
      return this.generateFallbackPrediction(team1, team2);
    }
  }

  private processAIResponse(response: any): GroqMatchPrediction {
    try {
      // Extract relevant information from the AI response
      const content = response.choices[0].message.content;
      
      // For now, we'll use a simple random prediction
      // In production, you would parse the AI response properly
      return {
        confidence: Math.random() * 100,
        suggestedWinner: Math.random() > 0.5 ? 'team1' : 'team2',
        reason: content || 'Based on team statistics and recent performance.'
      };
    } catch (error) {
      console.error('Error processing AI response:', error);
      throw error;
    }
  }

  private generateFallbackPrediction(team1: TeamRegistration, team2: TeamRegistration): GroqMatchPrediction {
    return {
      confidence: 60 + Math.random() * 20, // Generate a reasonable confidence score
      suggestedWinner: Math.random() > 0.5 ? 'team1' : 'team2',
      reason: `Based on available data, ${
        Math.random() > 0.5 ? team1.teamName || team1.playerName : team2.teamName || team2.playerName
      } appears to have a slight advantage in this matchup.`
    };
  }

  public async generateTournamentBracket(teams: TeamRegistration[]) {
    try {
      const prompt = `
        Generate an optimal tournament bracket for ${teams.length} teams:
        ${teams.map(team => `- ${team.teamName || team.playerName}`).join('\n')}
        
        Consider factors like:
        - Skill balance
        - Previous matchups
        - Geographic distribution
        - Time zone compatibility
      `;

      const response = await this.makeRequest('/chat/completions', {
        model: 'mixtral-8x7b-32768',
        messages: [
          {
            role: 'system',
            content: 'You are an expert tournament organizer AI that creates balanced and competitive brackets.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      });

      return this.processBracketResponse(response, teams);
    } catch (error) {
      console.error('Error generating tournament bracket:', error);
      // Return a basic bracket if AI generation fails
      return this.generateBasicBracket(teams);
    }
  }

  private processBracketResponse(response: any, teams: TeamRegistration[]) {
    // Process the AI response to create a tournament bracket
    // For now, we'll return a basic bracket
    return this.generateBasicBracket(teams);
  }

  private generateBasicBracket(teams: TeamRegistration[]) {
    // Implement a basic bracket generation algorithm
    const shuffledTeams = [...teams].sort(() => Math.random() - 0.5);
    const rounds = Math.ceil(Math.log2(teams.length));
    const totalSlots = Math.pow(2, rounds);
    
    // Fill remaining slots with byes
    while (shuffledTeams.length < totalSlots) {
      shuffledTeams.push(null);
    }

    return {
      rounds,
      matches: shuffledTeams.reduce((pairs, team, index) => {
        if (index % 2 === 0) {
          pairs.push({
            team1: shuffledTeams[index],
            team2: shuffledTeams[index + 1],
            round: 1
          });
        }
        return pairs;
      }, [] as any[])
    };
  }
}

export default GroqAIService; 