// Semantic Search RAG using OpenAI Embeddings
import { ChatMessage } from './chatHistoryParser';

export interface EmbeddedMessage extends ChatMessage {
  embedding?: number[];
}

// Calculate cosine similarity between two vectors
function cosineSimilarity(a: number[], b: number[]): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Get embedding for a text
export async function getEmbedding(text: string, apiKey: string): Promise<number[]> {
  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'text-embedding-3-large',
      input: text
    })
  });
  
  const data = await response.json();
  return data.data[0].embedding;
}

// Embed all messages (do this once on load)
export async function embedMessages(
  messages: ChatMessage[], 
  apiKey: string,
  onProgress?: (current: number, total: number) => void
): Promise<EmbeddedMessage[]> {
  const embedded: EmbeddedMessage[] = [];
  
  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];
    try {
      const embedding = await getEmbedding(
        `${msg.sender}: ${msg.message}`, 
        apiKey
      );
      embedded.push({ ...msg, embedding });
      
      if (onProgress) {
        onProgress(i + 1, messages.length);
      }
      
      // Rate limiting - wait 50ms between requests
      await new Promise(resolve => setTimeout(resolve, 50));
    } catch (error) {
      console.error('Error embedding message:', error);
      embedded.push({ ...msg }); // Add without embedding
    }
  }
  
  return embedded;
}

// Search messages using semantic similarity
export async function semanticSearch(
  query: string,
  embeddedMessages: EmbeddedMessage[],
  apiKey: string,
  topK: number = 10
): Promise<ChatMessage[]> {
  // Get query embedding
  const queryEmbedding = await getEmbedding(query, apiKey);
  
  // Calculate similarity scores
  const scored = embeddedMessages
    .filter(msg => msg.embedding) // Only messages with embeddings
    .map(msg => ({
      message: msg,
      score: cosineSimilarity(queryEmbedding, msg.embedding!)
    }))
    .sort((a, b) => b.score - a.score) // Sort by similarity (highest first)
    .slice(0, topK); // Take top K
  
  return scored.map(s => s.message);
}

// Format results for AI
export function formatSemanticResults(messages: ChatMessage[], query: string): string {
  if (messages.length === 0) {
    return `TIDAK DITEMUKAN pesan yang relevan dengan pertanyaan: "${query}"`;
  }
  
  let result = `PESAN YANG PALING RELEVAN (${messages.length} pesan ditemukan menggunakan semantic search):\n\n`;
  messages.forEach((msg, idx) => {
    result += `${idx + 1}. [${msg.date}] ${msg.sender}: "${msg.message}"\n`;
  });
  result += `\nGunakan informasi di atas untuk menjawab pertanyaan dengan akurat. Jika jawaban tidak ada di pesan-pesan ini, katakan dengan jujur.`;
  
  return result;
}
