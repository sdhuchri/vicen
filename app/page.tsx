"use client";

import { useState, useRef, useEffect } from "react";
import { parseChatHistoryJSON, ChatMessage } from "@/lib/chatHistoryParser";
import { simpleSearch } from "@/lib/simpleRAG";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "你好 Vicen! 💫 Selamat datang di tahun 2026! Gimana nih, excited nggak sama tahun baru ini?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [allMessages, setAllMessages] = useState<ChatMessage[]>([]);
  const [isReady, setIsReady] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat history on mount
  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        const response = await fetch("/message_history.json");
        const data = await response.json();
        
        // Parse chat history
        const parsedMessages = parseChatHistoryJSON(data);
        setAllMessages(parsedMessages);
        setIsReady(true);
        
        console.log("Chat history ready:", parsedMessages.length, "messages");
        console.log("First chat:", parsedMessages[0].date, parsedMessages[0].sender);
      } catch (error) {
        console.error("Error loading chat history:", error);
      }
    };
    
    loadChatHistory();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    if (!isReady || allMessages.length === 0) {
      alert("Chat history masih di-load. Tunggu sebentar ya!");
      return;
    }

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      // Simple but effective search
      const relevantContext = simpleSearch(input, allMessages, 30);
      console.log("Search results:", relevantContext.substring(0, 200));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: `Kamu adalah teman virtual yang hangat dan suportif untuk Vicen Desvillya, seperti teman dekat yang lagi PDKT. Kamu menemani Vicen menyambut Tahun Baru 2026 dengan cara yang friendly dan caring.

KNOWLEDGE BASE TENTANG VICEN:
- Nama: Vicen Desvillya (panggil: Vicen atau Cen)
- Appreciate bilingual Indonesia-Mandarin
- Aplikasi ini: "Vicen's Space" - personal companion untuk tahun 2026

${relevantContext ? `\n${relevantContext}\n` : ''}

ATURAN PENTING - CARA MEMBACA INFORMASI DI ATAS:
1. Di atas ada informasi dari chat history Vicen dan sryndhcrs
2. BACA SEMUA pesan dengan TELITI sebelum menjawab
3. Jawab HANYA berdasarkan informasi yang PERSIS ada di pesan-pesan tersebut
4. Jika informasi tidak ada, katakan dengan JUJUR: "Hmm, aku nggak nemu info itu di chat kita"
5. JANGAN mengarang, menebak, atau membuat asumsi
6. Gunakan detail spesifik dari pesan (tanggal, nama, tempat, angka, dll) jika ada

CONTOH CARA MENJAWAB YANG BENAR:
- Pertanyaan: "kapan pertama kali kita chat?"
  Jawaban: Lihat di "CHAT PERTAMA KALI" atau "Chat pertama kali:" → Jawab dengan tanggal yang PERSIS tertulis
  
- Pertanyaan: "cosplay jadi apa?"
  Jawaban: Cari kata "cosplay" di pesan → Baca pesan yang ada kata "jadi" atau nama karakter → Jawab dengan detail yang ada
  
- Pertanyaan: "umur vicen berapa?"
  Jawaban: Cari kata "umur" atau angka di pesan → Jika ada, jawab dengan angka yang PERSIS tertulis → Jika tidak ada, bilang tidak tahu

KEPRIBADIANMU:
- Hangat tapi nggak terlalu intimate (masih tahap PDKT)
- Suportif dan empati tanpa berlebihan
- Menggunakan bahasa Indonesia casual yang natural
- Sesekali pakai bahasa Mandarin untuk sapaan atau kata-kata manis
- Playful tapi tetap caring
- JUJUR jika tidak tahu sesuatu - ini SANGAT PENTING

GAYA BICARA:
- Panggil dia "Vicen" atau "kamu"
- Gunakan sapaan casual
- JANGAN pakai "sayang", "cinta", atau panggilan terlalu intimate
- Sisipkan kata Mandarin yang cute (1-2 kata per pesan)
- Jangan terlalu panjang, 2-3 kalimat cukup
- Emoji: HANYA gunakan sesekali, TIDAK di setiap jawaban
- Lebih fokus ke konten jawaban daripada emoji

PRIORITAS UTAMA: AKURASI > KEPRIBADIAN
Lebih baik bilang "aku nggak tahu" daripada mengarang informasi yang salah.`,
            },
            ...messages,
            userMessage,
          ],
          temperature: 0.7,
          max_tokens: 150,
        }),
      });

      const data = await response.json();
      const aiMessage: Message = {
        role: "assistant",
        content: data.choices[0].message.content,
      };

      setIsTyping(false);
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Waduh, ada yang error nih... Coba lagi yuk 😅",
        },
      ]);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-pink-50 to-pink-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-pink-200 p-4 lg:p-6 text-center shadow-sm">
        <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-pink-400 to-pink-500 bg-clip-text text-transparent">
          Welcome to 2026 💫 欢迎
        </h1>
        <p className="text-xs lg:text-sm text-pink-400 mt-1">Let&apos;s start this year together · 一起加油</p>
        {isReady && (
          <div className="mt-1 text-xs text-green-500">
            ✓ Chat history ready ({allMessages.length} messages)
          </div>
        )}
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
          >
            <div
              className={`max-w-[80%] p-4 rounded-2xl ${
                msg.role === "user"
                  ? "bg-pink-300 text-slate-800"
                  : "bg-white text-slate-700 border border-pink-200 shadow-sm"
              }`}
            >
              <p className="text-sm leading-relaxed">{msg.content}</p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start animate-fade-in">
            <div className="bg-white border border-pink-200 p-4 rounded-2xl shadow-sm">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-pink-300 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-pink-300 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white/80 backdrop-blur-sm border-t border-pink-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ceritakan harimu hari ini…"
            className="flex-1 bg-pink-50 border border-pink-200 rounded-full px-5 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-300 placeholder-pink-300"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            className="bg-pink-400 hover:bg-pink-500 text-white disabled:opacity-50 disabled:cursor-not-allowed rounded-full px-6 py-3 font-medium transition-all duration-200"
          >
            💕
          </button>
        </div>
      </div>
    </div>
  );
}
