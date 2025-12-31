"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { parseChatHistoryJSON } from "@/lib/chatHistoryParser";

export default function SurprisePage() {
  const [isOpened, setIsOpened] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [stats, setStats] = useState({
    totalDays: 0,
    totalMessages: 0,
    firstChatDate: "",
    mostActiveDay: "",
  });
  const [randomPhotos, setRandomPhotos] = useState<string[]>([]);
  const [quote, setQuote] = useState("");

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
  ];

  const quotes = [
    "Vicen itu orang yang spesial banget, bersyukur bisa kenal kamu 💕",
    "Terima kasih sudah jadi bagian penting dari ceritaku ✨",
    "Kamu bikin hari-hari jadi lebih berwarna dan berarti 🌈",
    "Seneng banget bisa kenal seseorang se-amazing kamu 🙏",
    "Vicen itu unik dan spesial dengan caranya sendiri 💫",
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch("/message_history.json");
        const data = await response.json();
        const messages = parseChatHistoryJSON(data);

        const firstDate = new Date(messages[0].timestamp);
        const lastDate = new Date(messages[messages.length - 1].timestamp);
        const daysDiff = Math.floor((lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24));

        setStats({
          totalDays: daysDiff,
          totalMessages: messages.length,
          firstChatDate: messages[0].date,
          mostActiveDay: "Oktober 2025",
        });

        // Random pick 3 photos
        const shuffled = [...allImages].sort(() => Math.random() - 0.5);
        setRandomPhotos(shuffled.slice(0, 3));

        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        setQuote(randomQuote);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    loadData();

    // Auto shake animation every 3 seconds
    const shakeInterval = setInterval(() => {
      if (!isOpened) {
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 500);
      }
    }, 3000);

    return () => clearInterval(shakeInterval);
  }, [isOpened]);

  const handleOpenGift = () => {
    setIsOpened(true);
  };

  // Gift Box Component
  if (!isOpened) {
    return (
      <div className="flex flex-col h-full bg-gradient-to-br from-pink-100 via-purple-100 to-pink-100 items-center justify-center relative overflow-hidden">
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 5}s`,
              }}
            >
              {['✨', '💕', '🎀', '⭐', '💫'][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </div>

        <div className="text-center z-10 space-y-8 px-4">
          {/* Title */}
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">
              Ada Hadiah Untukmu! 🎁
            </h1>
            <p className="text-lg text-slate-600">为你准备了惊喜 · Something special for Vicen</p>
          </div>

          {/* Gift Box */}
          <div 
            className={`relative cursor-pointer transition-transform duration-300 hover:scale-110 ${
              isShaking ? 'animate-shake' : ''
            }`}
            onClick={handleOpenGift}
          >
            {/* Gift Box */}
            <div className="relative w-64 h-64 mx-auto">
              {/* Box Body */}
              <div className="absolute inset-0 bg-gradient-to-br from-pink-400 to-pink-500 rounded-3xl shadow-2xl transform rotate-0 transition-all duration-500">
                {/* Ribbon Vertical */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-full bg-gradient-to-b from-purple-400 to-purple-500"></div>
                {/* Ribbon Horizontal */}
                <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-12 bg-gradient-to-r from-purple-400 to-purple-500"></div>
                {/* Bow */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2">
                  <div className="text-7xl animate-bounce">🎀</div>
                </div>
                {/* Sparkles */}
                <div className="absolute -top-4 -right-4 text-4xl animate-spin-slow">✨</div>
                <div className="absolute -bottom-4 -left-4 text-4xl animate-spin-slow" style={{ animationDelay: '1s' }}>💫</div>
              </div>
            </div>
          </div>

          {/* Instruction */}
          <div className="animate-pulse">
            <p className="text-xl font-semibold text-pink-500 mb-2">Klik kotak hadiah untuk membuka! 👆</p>
            <p className="text-sm text-slate-500">点击礼物盒打开 · Click the gift box to open</p>
          </div>

          {/* Hint */}
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 max-w-md mx-auto border-2 border-pink-200">
            <p className="text-sm text-slate-600">
              💝 Ada sesuatu yang spesial menunggumu di dalam...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Opened Content
  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50 animate-fade-in">
      <header className="backdrop-blur-md bg-white/60 border-b border-white/20 p-6 shadow-sm">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent animate-fade-in">
            Surprise Opened! 🎉
          </h1>
          <p className="text-sm text-slate-500 mt-1">Something special for Vicen · 惊喜已打开</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 lg:p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Hero Card with Random Photos Grid */}
          <div className="relative overflow-hidden rounded-3xl shadow-2xl bg-gradient-to-br from-pink-100 to-purple-100 p-8">
            <div className="mb-6">
              <h2 className="text-4xl font-bold text-slate-800 mb-2">Random Memories 📸</h2>
              <p className="text-lg text-slate-600">{quote}</p>
            </div>
            
            {/* 3 Photos Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Photo 1 */}
              {randomPhotos[0] && (
                <div className="relative aspect-square rounded-2xl overflow-hidden shadow-lg group">
                  <Image
                    src={`/image/${randomPhotos[0]}`}
                    alt="Random memory 1"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-4 left-4 text-white font-semibold">
                      ✨ Memory #1
                    </div>
                  </div>
                </div>
              )}
              
              {/* Photo 2 */}
              {randomPhotos[1] && (
                <div className="relative aspect-square rounded-2xl overflow-hidden shadow-lg group">
                  <Image
                    src={`/image/${randomPhotos[1]}`}
                    alt="Random memory 2"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-4 left-4 text-white font-semibold">
                      💕 Memory #2
                    </div>
                  </div>
                </div>
              )}
              
              {/* Photo 3 */}
              {randomPhotos[2] && (
                <div className="relative aspect-square rounded-2xl overflow-hidden shadow-lg group">
                  <Image
                    src={`/image/${randomPhotos[2]}`}
                    alt="Random memory 3"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-4 left-4 text-white font-semibold">
                      🌸 Memory #3
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="backdrop-blur-md bg-white/50 border-2 border-pink-200 rounded-2xl p-6 text-center hover:scale-105 transition-transform shadow-sm">
              <div className="text-3xl mb-2">📅</div>
              <div className="text-2xl font-bold text-pink-500">{stats.totalDays}</div>
              <div className="text-xs text-slate-600 mt-1">Days Together</div>
            </div>

            <div className="backdrop-blur-md bg-white/50 border-2 border-purple-200 rounded-2xl p-6 text-center hover:scale-105 transition-transform shadow-sm">
              <div className="text-3xl mb-2">💬</div>
              <div className="text-2xl font-bold text-purple-500">{stats.totalMessages}</div>
              <div className="text-xs text-slate-600 mt-1">Messages</div>
            </div>

            <div className="backdrop-blur-md bg-white/50 border-2 border-pink-200 rounded-2xl p-6 text-center hover:scale-105 transition-transform shadow-sm">
              <div className="text-3xl mb-2">🎉</div>
              <div className="text-sm font-bold text-pink-500">15 Apr 2025</div>
              <div className="text-xs text-slate-600 mt-1">First Chat</div>
            </div>

            <div className="backdrop-blur-md bg-white/50 border-2 border-purple-200 rounded-2xl p-6 text-center hover:scale-105 transition-transform shadow-sm">
              <div className="text-3xl mb-2">⭐</div>
              <div className="text-sm font-bold text-purple-500">{stats.mostActiveDay}</div>
              <div className="text-xs text-slate-600 mt-1">Most Active</div>
            </div>
          </div>

          {/* Fun Facts */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="backdrop-blur-md bg-white/50 border-2 border-pink-200 rounded-3xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <span>🎂</span> Birthday Info
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">💕</div>
                  <div>
                    <div className="text-sm font-medium text-slate-700">Vicen</div>
                    <div className="text-xs text-slate-500">30 Januari (14 Feb Imlek)</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="backdrop-blur-md bg-white/50 border-2 border-purple-200 rounded-3xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <span>🌟</span> Fun Facts
              </h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-pink-400">•</span>
                  <span>Suka baca komik & film horror</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-400">•</span>
                  <span>Makanan favorit: Sushi 🍣</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-400">•</span>
                  <span>Hobi: Cosplay 🎭</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Timeline */}
          <div className="backdrop-blur-md bg-white/50 border-2 border-pink-200 rounded-3xl p-8 shadow-sm">
            <h3 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
              <span>📍</span> Our Journey Timeline
            </h3>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-pink-500 flex items-center justify-center text-white font-bold">1</div>
                  <div className="w-0.5 h-full bg-pink-200 mt-2"></div>
                </div>
                <div className="flex-1 pb-8">
                  <div className="text-sm font-semibold text-slate-800">First Chat</div>
                  <div className="text-xs text-slate-500 mb-2">15 April 2025</div>
                  <div className="text-sm text-slate-600">sryndhcrs: &quot;hiii snooopy 😁&quot;</div>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-500 flex items-center justify-center text-white font-bold">2</div>
                  <div className="w-0.5 h-full bg-purple-200 mt-2"></div>
                </div>
                <div className="flex-1 pb-8">
                  <div className="text-sm font-semibold text-slate-800">Getting to Know Each Other</div>
                  <div className="text-xs text-slate-500 mb-2">April - Oktober 2025</div>
                  <div className="text-sm text-slate-600">Sharing stories, hobbies, and daily life</div>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white font-bold">3</div>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-slate-800">Still Going Strong!</div>
                  <div className="text-xs text-slate-500 mb-2">2026 & Beyond</div>
                  <div className="text-sm text-slate-600">Many more memories to create together 💫</div>
                </div>
              </div>
            </div>
          </div>

          {/* Final Message */}
          <div className="relative overflow-hidden rounded-3xl p-12 text-center bg-gradient-to-br from-pink-400 via-purple-400 to-pink-500 shadow-2xl">
            <div className="space-y-6">
              <div className="text-6xl">✨💕✨</div>
              <h2 className="text-4xl md:text-5xl font-bold text-white">Thank You!</h2>
              <p className="text-xl text-white/90">谢谢你 · 感谢有你</p>
              <p className="text-white/90 max-w-2xl mx-auto leading-relaxed text-lg">
                Setiap detik bersamamu adalah hadiah yang berharga. 
                Setiap tawa, setiap cerita, setiap momen kecil yang kita bagi... 
                semua itu jadi kenangan indah yang nggak akan pernah terlupakan. 
                Kamu spesial, dan aku berharap kita bisa terus berbagi lebih banyak momen indah bersama. 
                Here&apos;s to us and all the beautiful moments ahead! 我们一起加油! 💕🎉
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
