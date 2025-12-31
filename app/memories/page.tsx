"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { parseChatHistoryJSON, ChatMessage } from "@/lib/chatHistoryParser";

export default function MemoriesPage() {
  const allImages = [
    "018FCA5B-D5A3-4BDF-BAA2-476CFCDC7735.JPG",
    "22D76129-E6AE-440B-B28C-0FFB166BB381.JPG",
    "2850DD3D-E22C-4228-A7E4-A35AE05D740E.JPG",
    "37C811AE-02D9-4894-A197-F40D9DAB95AD.JPG",
    "44275DAE-1764-4EF2-82D2-CAE08887BCE3.JPG",
    "4C074072-C6A6-4855-B389-E4AA3FCF968D.JPG",
    "5090EC77-D04F-4899-A33C-7E173F172087.JPG",
    "54F31B30-A4B0-4001-99D7-B370639D8E75.JPG",
    "59642466-A569-4654-BCA6-F41BC980609E.JPG",
    "6D9765A3-88EF-4E42-B988-ED74EACCBEC0.JPG",
    "7799D109-0C8F-431E-A207-02A1E7967F3F.JPG",
    "9B21C83D-DCDE-4A97-872E-64C523B2106A.JPG",
    "A46DE2FD-9B78-44E6-8DC9-2A81DC78690C.JPG",
    "A61A1A30-449A-4371-A69E-10A9ADCA0394.JPG",
    "B33883FA-9E18-425F-ADCA-0AC37BE17531.JPG",
    "CDB05A69-6C09-4279-AD7E-258BD8A93F78.JPG",
    "CFD3856E-A065-4B3C-BCF4-10F7AA5D88E0.JPG",
    "E3B32B3D-0BCE-4DB7-8BB2-AD90D4BBE17C.JPG",
    "E4DEBF1B-B7AD-4061-8BFF-111B46C3CCE4.JPG",
    "F683B821-A36A-443F-B11D-373C70A5CB54.JPG",
    "F777FC8A-1A7A-45D4-BEE3-5DF697C382EE.JPG",
    "FD768C8D-7878-41FA-B948-98D8465C1B6C.JPG",
  ];

  const allVideos = [
    "727188770396841.mp4",
  ];

  const [favoriteImages, setFavoriteImages] = useState<string[]>([]);
  const [firstChat, setFirstChat] = useState<ChatMessage | null>(null);
  const [firstChatVicen, setFirstChatVicen] = useState<ChatMessage | null>(null);
  const [lastChat, setLastChat] = useState<ChatMessage | null>(null);

  useEffect(() => {
    // Random pick 3 images as favorites
    const shuffled = [...allImages].sort(() => Math.random() - 0.5);
    setFavoriteImages(shuffled.slice(0, 3));
    
    // Load chat history to get first and last chat
    const loadChatHistory = async () => {
      try {
        const response = await fetch("/message_history.json");
        const data = await response.json();
        const parsedMessages = parseChatHistoryJSON(data);
        
        if (parsedMessages.length > 0) {
          // First message overall (from sryndhcrs)
          setFirstChat(parsedMessages[0]);
          
          // First message from Vicen
          const firstVicenMsg = parsedMessages.find(msg => 
            msg.sender.toLowerCase().includes('vcn') || 
            msg.sender.toLowerCase().includes('dsvlly')
          );
          setFirstChatVicen(firstVicenMsg || null);
          
          // Last message
          setLastChat(parsedMessages[parsedMessages.length - 1]);
        }
      } catch (error) {
        console.error("Error loading chat history:", error);
      }
    };
    
    loadChatHistory();
  }, []);

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-pink-50 to-pink-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-pink-200 p-4 lg:p-6 text-center shadow-sm">
        <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-pink-400 to-pink-500 bg-clip-text text-transparent">
          Memories 📸 · 回忆
        </h1>
        <p className="text-xs lg:text-sm text-pink-400 mt-1">Our special moments together</p>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Favorite Photos Section */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-pink-200">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-lg font-semibold text-slate-800">💕 Favorite Moments</h2>
              <span className="text-xs text-pink-400">· 最爱的时刻</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {favoriteImages.map((img, idx) => (
                <div
                  key={idx}
                  className="relative aspect-square rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow group"
                >
                  <Image
                    src={`/image/${img}`}
                    alt={`Favorite moment ${idx + 1}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-3 left-3 text-white text-sm font-medium">
                      ⭐ Favorite #{idx + 1}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Videos Section */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-pink-200">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-lg font-semibold text-slate-800">🎬 Videos</h2>
              <span className="text-xs text-pink-400">· 视频</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allVideos.map((video, idx) => (
                <div
                  key={idx}
                  className="relative rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow bg-slate-100"
                >
                  <video
                    controls
                    className="w-full h-auto"
                    preload="metadata"
                  >
                    <source src={`/video/${video}`} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Memories */}
          <div>
            <h2 className="text-lg font-semibold text-slate-800 mb-4 px-2">💬 Chat History</h2>
            <div className="space-y-4">
              {/* First Chat from sryndhcrs */}
              {firstChat && (
                <div className="bg-white rounded-xl p-4 shadow-sm border border-pink-200 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">🎉</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-slate-800">First Chat · 第一次聊天</h3>
                        <span className="text-xs text-pink-400">{firstChat.date}</span>
                      </div>
                      <p className="text-sm text-slate-600 mb-2">
                        <span className="font-medium">{firstChat.sender}:</span> &quot;{firstChat.message}&quot;
                      </p>
                      <p className="text-xs text-pink-400">Our journey started here! 💫</p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* First Chat from Vicen */}
              {firstChatVicen && (
                <div className="bg-white rounded-xl p-4 shadow-sm border border-pink-200 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">💕</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-slate-800">Vicen&apos;s First Reply · Vicen 第一次回复</h3>
                        <span className="text-xs text-pink-400">{firstChatVicen.date}</span>
                      </div>
                      <p className="text-sm text-slate-600 mb-2">
                        <span className="font-medium">{firstChatVicen.sender}:</span> &quot;{firstChatVicen.message}&quot;
                      </p>
                      <p className="text-xs text-pink-400">The beginning of something special! ✨</p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Last Chat */}
              {lastChat && (
                <div className="bg-white rounded-xl p-4 shadow-sm border border-pink-200 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">✨</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-slate-800">Latest Chat · 最新聊天</h3>
                        <span className="text-xs text-pink-400">{lastChat.date}</span>
                      </div>
                      <p className="text-sm text-slate-600 mb-2">
                        <span className="font-medium">{lastChat.sender}:</span> &quot;{lastChat.message}&quot;
                      </p>
                      <p className="text-xs text-pink-400">Still going strong! 💪</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* All Photos Gallery */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-pink-200">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-lg font-semibold text-slate-800">📷 All Photos</h2>
              <span className="text-xs text-pink-400">· 所有照片</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {allImages.map((img, idx) => (
                <div
                  key={idx}
                  className="relative aspect-square rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <Image
                    src={`/image/${img}`}
                    alt={`Memory ${idx + 1}`}
                    fill
                    className="object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
