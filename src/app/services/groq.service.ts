import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

@Injectable({ providedIn: 'root' })
export class GroqService {
  private apiUrl = environment.groqApiUrl;
  private apiKey = environment.groqApiKey;
  private model = environment.groqModel;

  async generateLivabilityReport(placeName: string): Promise<string> {
    const prompt = `You are NeighborIQ, an expert AI neighborhood analyst. Generate a comprehensive livability report for "${placeName}".

Return a JSON object (no markdown, just raw JSON) with this exact structure:
{
  "overview": "2-3 sentence overview of the neighborhood/city",
  "scores": {
    "safety": { "score": 0-100, "summary": "1 sentence" },
    "walkability": { "score": 0-100, "summary": "1 sentence" },
    "transit": { "score": 0-100, "summary": "1 sentence" },
    "nightlife": { "score": 0-100, "summary": "1 sentence" },
    "schools": { "score": 0-100, "summary": "1 sentence" },
    "costOfLiving": { "score": 0-100, "summary": "1 sentence, where 100=very affordable" },
    "healthcare": { "score": 0-100, "summary": "1 sentence" },
    "greenSpaces": { "score": 0-100, "summary": "1 sentence" }
  },
  "overallScore": 0-100,
  "bestFor": ["type1", "type2", "type3"],
  "considerations": ["con1", "con2", "con3"],
  "avgRent": "$X,XXX/mo for 1BR",
  "population": "approximate",
  "climate": "brief description",
  "topAttractions": ["place1", "place2", "place3", "place4", "place5"]
}

Be realistic and accurate. Scores should reflect genuine livability data.`;

    return this.complete(prompt);
  }

  async generateComparison(place1: string, place2: string): Promise<string> {
    const prompt = `Compare "${place1}" vs "${place2}" as places to live. Return JSON (no markdown):
{
  "place1": { "name": "${place1}", "overallScore": 0-100, "scores": { "safety": 0-100, "walkability": 0-100, "transit": 0-100, "nightlife": 0-100, "schools": 0-100, "costOfLiving": 0-100, "healthcare": 0-100, "greenSpaces": 0-100 }, "strengths": ["s1","s2","s3"], "avgRent": "$X,XXX/mo" },
  "place2": { "name": "${place2}", "overallScore": 0-100, "scores": { "safety": 0-100, "walkability": 0-100, "transit": 0-100, "nightlife": 0-100, "schools": 0-100, "costOfLiving": 0-100, "healthcare": 0-100, "greenSpaces": 0-100 }, "strengths": ["s1","s2","s3"], "avgRent": "$X,XXX/mo" },
  "verdict": "2-3 sentence comparison verdict",
  "recommendedFor": { "${place1}": "best for...", "${place2}": "best for..." }
}`;
    return this.complete(prompt);
  }

  async chat(messages: ChatMessage[]): Promise<string> {
    const systemMsg: ChatMessage = {
      role: 'system',
      content: 'You are NeighborIQ AI, a friendly and knowledgeable neighborhood intelligence assistant. Answer questions about neighborhoods, cities, cost of living, safety, amenities, lifestyle, real estate, and local insights. Be concise but helpful. Use bullet points and clear formatting.'
    };
    return this.complete('', [systemMsg, ...messages]);
  }

  async getLocalInsights(placeName: string): Promise<string> {
    const prompt = `Give 6 unique local insider tips about living in "${placeName}". Return JSON (no markdown):
{ "tips": [{ "icon": "emoji", "title": "short title", "detail": "1-2 sentences" }] }`;
    return this.complete(prompt);
  }

  private async complete(prompt: string, messages?: ChatMessage[]): Promise<string> {
    const body = {
      model: this.model,
      messages: messages || [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 2048
    };

    const res = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!res.ok) throw new Error(`Groq API error: ${res.status}`);
    const data = await res.json();
    return data.choices[0].message.content;
  }
}
