// Simple but effective RAG - just give AI all relevant messages
import { ChatMessage } from './chatHistoryParser';

export function simpleSearch(query: string, messages: ChatMessage[], limit: number = 30): string {
  const queryLower = query.toLowerCase();
  
  // Special handling for "first chat" questions
  if (queryLower.includes('pertama') || queryLower.includes('awal')) {
    if (queryLower.includes('chat') || queryLower.includes('ngobrol') || queryLower.includes('bicara')) {
      const firstMessages = messages.slice(0, 10); // Get first 10 messages (after reverse, index 0 = oldest)
      let result = `CHAT PERTAMA KALI:\n\n`;
      result += `Tanggal: ${messages[0].date}\n`;
      result += `Dimulai oleh: ${messages[0].sender}\n\n`;
      result += `10 PESAN PERTAMA:\n`;
      firstMessages.forEach((msg, idx) => {
        result += `${idx + 1}. [${msg.date}] ${msg.sender}: "${msg.message}"\n`;
      });
      return result;
    }
  }
  
  // Extract date if mentioned
  const datePatterns = [
    /(\d{1,2})\s*(januari|februari|maret|april|mei|juni|juli|agustus|september|oktober|november|desember)/i,
    /(\d{1,2})\s*(jan|feb|mar|apr|mei|jun|jul|agu|sep|okt|nov|des)/i,
    /(\d{1,2})\s*oktober/i,
    /tanggal\s*(\d{1,2})/i
  ];
  
  let targetDate: { day: number, month: number } | null = null;
  for (const pattern of datePatterns) {
    const match = query.match(pattern);
    if (match) {
      const monthMap: {[key: string]: number} = {
        'januari': 0, 'jan': 0, 'februari': 1, 'feb': 1, 'maret': 2, 'mar': 2,
        'april': 3, 'apr': 3, 'mei': 4, 'juni': 5, 'jun': 5,
        'juli': 6, 'jul': 6, 'agustus': 7, 'agu': 7, 'september': 8, 'sep': 8,
        'oktober': 9, 'okt': 9, 'november': 10, 'nov': 10, 'desember': 11, 'des': 11
      };
      
      const day = parseInt(match[1]);
      let month = 9; // Default oktober
      
      if (match[2]) {
        month = monthMap[match[2].toLowerCase()];
      }
      
      targetDate = { day, month };
      break;
    }
  }
  
  // If asking about specific date, filter by date
  if (targetDate) {
    const dateMessages = messages.filter(msg => {
      const msgDate = new Date(msg.timestamp);
      return msgDate.getDate() === targetDate!.day && msgDate.getMonth() === targetDate!.month;
    });
    
    if (dateMessages.length > 0) {
      let result = `PESAN PADA TANGGAL ${targetDate.day} BULAN ${targetDate.month + 1} (${dateMessages.length} pesan):\n\n`;
      dateMessages.slice(0, limit).forEach((msg, idx) => {
        result += `${idx + 1}. [${msg.date}] ${msg.sender}: "${msg.message}"\n`;
      });
      return result;
    } else {
      return `TIDAK ADA PESAN pada tanggal ${targetDate.day} bulan ${targetDate.month + 1} di chat history.`;
    }
  }
  
  // Extract keywords with better mapping
  const keywords: string[] = [];
  
  // Birthday related
  if (queryLower.includes('ultah') || queryLower.includes('ulang tahun') || queryLower.includes('lahir') || queryLower.includes('birthday')) {
    keywords.push('ultah', 'ulang tahun', 'lahir', 'birthday', 'januari', 'februari', '30 januari', '14 februari', 'imlek');
  }
  
  // Cosplay related
  if (queryLower.includes('cosplay')) {
    keywords.push('cosplay', 'kostum', 'costume', 'cos', 'jadi');
  }
  
  // Seragam related
  if (queryLower.includes('seragam')) {
    keywords.push('seragam', 'uniform', 'baju', 'pakai');
  }
  
  // Age related
  if (queryLower.includes('umur') || queryLower.includes('usia') || queryLower.includes('tahun')) {
    keywords.push('umur', 'usia', 'tahun', 'tua', 'muda', '19', '20', '21', '22', '23');
  }
  
  // Name related
  if (queryLower.includes('nama')) {
    keywords.push('nama', 'panggil', 'desvillya', 'vicen', 'cen');
  }
  
  // Religion related
  if (queryLower.includes('agama') || queryLower.includes('religion')) {
    keywords.push('agama', 'katolik', 'konghucu', 'budha', 'islam', 'kristen');
  }
  
  // Location related
  if (queryLower.includes('dimana') || queryLower.includes('lokasi') || queryLower.includes('tempat')) {
    keywords.push('dimana', 'lokasi', 'tempat', 'di ', 'ke ');
  }
  
  // If no specific keywords, use all words
  if (keywords.length === 0) {
    keywords.push(...queryLower.split(' ').filter(w => w.length > 2));
  }
  
  // Score each message
  const scored = messages.map((msg, idx) => {
    const msgLower = msg.message.toLowerCase();
    const senderLower = msg.sender.toLowerCase();
    let score = 0;
    
    // Check keywords with partial matching
    keywords.forEach(keyword => {
      if (msgLower.includes(keyword)) {
        score += 5; // Higher score for message content
      }
      if (senderLower.includes(keyword)) {
        score += 2;
      }
    });
    
    // Boost for exact query match
    if (msgLower.includes(queryLower)) {
      score += 10;
    }
    
    // Special boost for birthday-related messages
    if (queryLower.includes('ultah') || queryLower.includes('ulang tahun') || queryLower.includes('lahir')) {
      if (msgLower.includes('30 januari') || msgLower.includes('14 februari') || msgLower.includes('kapan ultah')) {
        score += 20; // Very high boost for birthday info
      }
    }
    
    return { msg, score, idx };
  });
  
  // Get top scored messages
  const relevant = scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(s => s.msg);
  
  if (relevant.length === 0) {
    return `INFORMASI DASAR:
- Chat pertama: ${messages[0].date} - ${messages[0].sender}: "${messages[0].message}"
- Chat terakhir: ${messages[messages.length - 1].date} - ${messages[messages.length - 1].sender}: "${messages[messages.length - 1].message}"
- Total pesan: ${messages.length}
- Ultah Vicen: 30 Januari (14 Februari Imlek)
- Agama Vicen: Konghucu
- Agama sryndhcrs: Katolik

Tidak ditemukan pesan spesifik yang relevan dengan pertanyaan.`;
  }
  
  let result = `PESAN YANG RELEVAN (${relevant.length} dari ${messages.length} pesan):\n\n`;
  relevant.forEach((msg, idx) => {
    result += `${idx + 1}. [${msg.date}] ${msg.sender}: "${msg.message}"\n`;
  });
  
  // Always add first message info and important facts
  result += `\n--- INFO PENTING ---\n`;
  result += `Chat pertama kali: ${messages[0].date} oleh ${messages[0].sender}\n`;
  result += `Pesan pertama: "${messages[0].message}"\n`;
  result += `Ultah Vicen: 30 Januari (14 Februari Imlek)\n`;
  result += `Agama Vicen: Konghucu\n`;
  result += `Agama sryndhcrs: Katolik\n`;
  
  return result;
}
