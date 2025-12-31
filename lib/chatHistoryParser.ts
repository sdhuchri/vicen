// Parse chat history from JSON file
export interface ChatMessage {
  sender: string;
  message: string;
  timestamp: number;
  date: string;
}

export function parseChatHistoryJSON(data: any): ChatMessage[] {
  const messages: ChatMessage[] = [];
  
  if (data.messages && Array.isArray(data.messages)) {
    data.messages.forEach((msg: any) => {
      if (msg.content) {
        messages.push({
          sender: msg.sender_name,
          message: msg.content,
          timestamp: msg.timestamp_ms,
          date: new Date(msg.timestamp_ms).toLocaleString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
        });
      }
    });
  }
  
  return messages.reverse(); // Reverse to get chronological order (oldest first)
}

export function formatChatHistoryForAI(messages: ChatMessage[], limit: number = 100): string {
  // Get recent messages for AI context (increase to 100 for better coverage)
  const recentMessages = messages.slice(-limit);
  
  // Get first and last message for summary
  const firstMessage = messages[messages.length - 1]; // Oldest (first chat)
  const lastMessage = messages[0]; // Newest
  
  let context = "\n\n=== RINGKASAN CHAT HISTORY ===\n";
  context += `Chat pertama kali: ${firstMessage.date} - ${firstMessage.sender}: "${firstMessage.message}"\n`;
  context += `Chat terakhir: ${lastMessage.date} - ${lastMessage.sender}: "${lastMessage.message}"\n`;
  context += `Total pesan yang dimuat: ${recentMessages.length} pesan\n`;
  context += `Participants: vcn dsvlly\` (Vicen) dan sryndhcrs\n\n`;
  
  context += "=== CHAT HISTORY LENGKAP (${recentMessages.length} Pesan Terakhir) ===\n";
  context += "Format: [Tanggal] Pengirim: Pesan\n";
  context += "Urutan: Pesan TERBARU di atas, pesan TERLAMA di bawah\n\n";
  
  recentMessages.forEach((msg, idx) => {
    context += `${idx + 1}. [${msg.date}] ${msg.sender}: ${msg.message}\n`;
  });
  
  context += "\n=== AKHIR CHAT HISTORY ===\n\n";
  context += "INSTRUKSI PENTING:\n";
  context += "- Chat PERTAMA KALI ada di pesan nomor TERBESAR (paling bawah)\n";
  context += "- Chat TERAKHIR ada di pesan nomor 1 (paling atas)\n";
  context += "- Jika ditanya 'kapan pertama kali chat', jawab berdasarkan pesan nomor terbesar\n";
  context += "- Jika ditanya tentang tanggal tertentu, cari di chat history berdasarkan tanggal\n";
  context += "- Jika informasi tidak ada di chat history, katakan dengan jujur\n";
  context += "- Jawab berdasarkan data yang PERSIS ada di chat history\n";
  
  return context;
}
