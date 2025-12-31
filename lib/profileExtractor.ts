// Extract profile information from chat history
import { ChatMessage } from './chatHistoryParser';

export interface ProfileInfo {
  name: string;
  displayName: string;
  birthday: string;
  facts: string[];
  interests: string[];
  totalMessages: number;
  firstMessage: string;
  firstMessageDate: string;
}

export function extractProfileInfo(messages: ChatMessage[]): { vicen: ProfileInfo; sryndhcrs: ProfileInfo } {
  const vicenMessages = messages.filter(m => 
    m.sender.toLowerCase().includes('vcn') || 
    m.sender.toLowerCase().includes('dsvlly')
  );
  
  const sryndhcrsMessages = messages.filter(m => 
    m.sender.toLowerCase().includes('sryndhcrs')
  );
  
  // Extract Vicen's info
  const vicenFacts: string[] = [];
  const vicenInterests: string[] = [];
  
  // Add religion info
  vicenFacts.push('Agama: Konghucu ☯️');
  
  vicenMessages.forEach(msg => {
    const content = msg.message.toLowerCase();
    
    // Interests
    if (content.includes('suka baca komik')) {
      vicenInterests.push('Baca komik 📚');
    }
    if (content.includes('suka horror') || content.includes('takut tpi suka')) {
      vicenInterests.push('Film horror 👻');
    }
    if (content.includes('suka shushi') || content.includes('suka pling shushi')) {
      vicenInterests.push('Sushi 🍣');
    }
    if (content.includes('physical touch') || content.includes('physical attack')) {
      vicenFacts.push('Suka physical touch & playful');
    }
    if (content.includes('cosplay')) {
      vicenInterests.push('Cosplay 🎭');
    }
    if (content.includes('gasuka ingris') || content.includes('gasukaaa ingrsis')) {
      vicenFacts.push('Tidak suka bahasa Inggris');
    }
  });
  
  // Extract sryndhcrs's info
  const sryndFacts: string[] = [];
  const sryndInterests: string[] = [];
  
  // Add religion info
  sryndFacts.push('Agama: Katolik ✝️');
  
  sryndhcrsMessages.forEach(msg => {
    const content = msg.message.toLowerCase();
    
    if (content.includes('suka berbagi')) {
      sryndFacts.push('Suka berbagi dengan orang lain');
    }
    if (content.includes('kamu cina aku suka')) {
      sryndFacts.push('Appreciate Chinese culture');
    }
  });
  
  // Get first messages
  const vicenFirst = vicenMessages[0];
  const sryndFirst = sryndhcrsMessages[0];
  
  return {
    vicen: {
      name: 'vcn dsvlly`',
      displayName: 'Vicen Desvillya',
      birthday: '30 Januari (14 Februari Imlek)', // From chat: "i 30 januari" & "klo cina 14 februari"
      facts: [...new Set(vicenFacts)].slice(0, 5),
      interests: [...new Set(vicenInterests)].slice(0, 6),
      totalMessages: vicenMessages.length,
      firstMessage: vicenFirst?.message || '',
      firstMessageDate: vicenFirst?.date || ''
    },
    sryndhcrs: {
      name: 'sryndhcrs',
      displayName: 'sryndhcrs',
      birthday: '-', // Not mentioned in chat history
      facts: [...new Set(sryndFacts)].slice(0, 5),
      interests: [...new Set(sryndInterests)].slice(0, 6),
      totalMessages: sryndhcrsMessages.length,
      firstMessage: sryndFirst?.message || '',
      firstMessageDate: sryndFirst?.date || ''
    }
  };
}
