// RAG (Retrieval-Augmented Generation) for Chat History
import { ChatMessage } from './chatHistoryParser';

export interface ChatHistoryIndex {
  allMessages: ChatMessage[];
  firstMessage: ChatMessage;
  lastMessage: ChatMessage;
  messagesByDate: Map<string, ChatMessage[]>;
  messagesBySender: Map<string, ChatMessage[]>;
}

export function indexChatHistory(messages: ChatMessage[]): ChatHistoryIndex {
  const messagesByDate = new Map<string, ChatMessage[]>();
  const messagesBySender = new Map<string, ChatMessage[]>();
  
  messages.forEach(msg => {
    // Index by date (extract date only, not time)
    const dateOnly = msg.date.split(',')[0]; // Get "15 Apr 2025" from "15 Apr 2025, 19:36"
    if (!messagesByDate.has(dateOnly)) {
      messagesByDate.set(dateOnly, []);
    }
    messagesByDate.get(dateOnly)!.push(msg);
    
    // Index by sender
    if (!messagesBySender.has(msg.sender)) {
      messagesBySender.set(msg.sender, []);
    }
    messagesBySender.get(msg.sender)!.push(msg);
  });
  
  return {
    allMessages: messages,
    firstMessage: messages[messages.length - 1], // Oldest
    lastMessage: messages[0], // Newest
    messagesByDate,
    messagesBySender
  };
}

export function retrieveRelevantMessages(
  query: string, 
  index: ChatHistoryIndex
): string {
  const queryLower = query.toLowerCase();
  
  // Check if asking about first chat
  if (queryLower.includes('pertama') || queryLower.includes('awal')) {
    if (queryLower.includes('chat') || queryLower.includes('ngobrol')) {
      return `INFORMASI CHAT PERTAMA KALI:
Tanggal: ${index.firstMessage.date}
Pengirim: ${index.firstMessage.sender}
Pesan: "${index.firstMessage.message}"

Ini adalah chat pertama kali antara ${index.firstMessage.sender} dan ${index.firstMessage.sender === 'vcn dsvlly`' ? 'sryndhcrs' : 'vcn dsvlly`'}.`;
    }
  }
  
  // Check if asking about last chat
  if (queryLower.includes('terakhir') || queryLower.includes('terbaru')) {
    return `INFORMASI CHAT TERAKHIR:
Tanggal: ${index.lastMessage.date}
Pengirim: ${index.lastMessage.sender}
Pesan: "${index.lastMessage.message}"`;
  }
  
  // Check if asking about specific date
  const dateMatch = query.match(/(\d{1,2})\s*(januari|februari|maret|april|mei|juni|juli|agustus|september|oktober|november|desember)/i);
  if (dateMatch) {
    const day = dateMatch[1];
    const monthMap: {[key: string]: string} = {
      'januari': 'Jan', 'februari': 'Feb', 'maret': 'Mar', 'april': 'Apr',
      'mei': 'Mei', 'juni': 'Jun', 'juli': 'Jul', 'agustus': 'Agu',
      'september': 'Sep', 'oktober': 'Okt', 'november': 'Nov', 'desember': 'Des'
    };
    const month = monthMap[dateMatch[2].toLowerCase()];
    
    // Search for messages on that date
    let foundMessages: ChatMessage[] = [];
    index.messagesByDate.forEach((msgs, date) => {
      if (date.includes(`${day} ${month}`)) {
        foundMessages = msgs;
      }
    });
    
    if (foundMessages.length > 0) {
      let result = `PESAN PADA TANGGAL ${day} ${dateMatch[2].toUpperCase()}:\n`;
      foundMessages.forEach((msg, idx) => {
        result += `${idx + 1}. [${msg.date}] ${msg.sender}: "${msg.message}"\n`;
      });
      return result;
    } else {
      return `TIDAK ADA PESAN pada tanggal ${day} ${dateMatch[2]} di chat history.`;
    }
  }
  
  // Enhanced keyword search - search for multiple related keywords
  const searchTerms: string[] = [];
  
  // Extract keywords from query
  if (queryLower.includes('cosplay')) searchTerms.push('cosplay', 'kostum', 'costume');
  if (queryLower.includes('seragam')) searchTerms.push('seragam', 'uniform', 'baju');
  if (queryLower.includes('umur') || queryLower.includes('usia')) searchTerms.push('umur', 'usia', 'tahun', 'tua');
  if (queryLower.includes('dimana') || queryLower.includes('lokasi')) searchTerms.push('dimana', 'lokasi', 'tempat', 'di ');
  if (queryLower.includes('apa')) searchTerms.push('apa', 'jadi', 'pakai');
  
  // If no specific terms, use words from query
  if (searchTerms.length === 0) {
    searchTerms.push(...queryLower.split(' ').filter(w => w.length > 3));
  }
  
  // Search messages with any of the search terms
  const relevantMessages = index.allMessages.filter(msg => {
    const msgLower = msg.message.toLowerCase();
    return searchTerms.some(term => msgLower.includes(term));
  }).slice(0, 20); // Increase to 20 messages
  
  if (relevantMessages.length > 0) {
    let result = `PESAN YANG RELEVAN (${relevantMessages.length} pesan ditemukan):\n\n`;
    relevantMessages.forEach((msg, idx) => {
      result += `${idx + 1}. [${msg.date}] ${msg.sender}: "${msg.message}"\n`;
    });
    result += `\nGunakan informasi di atas untuk menjawab pertanyaan dengan akurat.`;
    return result;
  }
  
  // Default: return summary
  return `RINGKASAN CHAT HISTORY:
- Chat pertama: ${index.firstMessage.date}
- Chat terakhir: ${index.lastMessage.date}
- Total pesan: ${index.allMessages.length}
- Participants: vcn dsvlly\` (Vicen) dan sryndhcrs

Tidak ditemukan pesan yang relevan dengan pertanyaan. Jika kamu ingin tahu tentang topik tertentu, coba tanya dengan kata kunci yang lebih spesifik.`;
}
