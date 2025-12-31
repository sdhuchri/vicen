"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { parseChatHistoryJSON } from "@/lib/chatHistoryParser";
import { extractProfileInfo, ProfileInfo } from "@/lib/profileExtractor";

export default function ProfilePage() {
  const [vicenProfile, setVicenProfile] = useState<ProfileInfo | null>(null);
  const [sryndhcrsProfile, setSryndhcrsProfile] = useState<ProfileInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProfiles = async () => {
      try {
        const response = await fetch("/message_history.json");
        const data = await response.json();
        const parsedMessages = parseChatHistoryJSON(data);
        
        const profiles = extractProfileInfo(parsedMessages);
        setVicenProfile(profiles.vicen);
        setSryndhcrsProfile(profiles.sryndhcrs);
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading profiles:", error);
        setIsLoading(false);
      }
    };
    
    loadProfiles();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col h-full bg-gradient-to-b from-pink-50 to-pink-100 items-center justify-center">
        <div className="text-pink-400">Loading profiles... 加载中...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-pink-50 to-pink-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-pink-200 p-4 lg:p-6 text-center shadow-sm">
        <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-pink-400 to-pink-500 bg-clip-text text-transparent">
          Profiles 👥 · 个人资料
        </h1>
        <p className="text-xs lg:text-sm text-pink-400 mt-1">Get to know us better</p>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Vicen's Profile */}
          {vicenProfile && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-pink-200">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-pink-300">
                  <Image
                    src="/profile/606179402_17928038670172959_1072771381004043430_n.jpg"
                    alt="Vicen Desvillya"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">{vicenProfile.displayName}</h2>
                  <p className="text-sm text-pink-400">@{vicenProfile.name}</p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-pink-50 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-pink-500">{vicenProfile.totalMessages}</div>
                    <div className="text-xs text-slate-600">Total Messages</div>
                  </div>
                  <div className="bg-pink-50 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-pink-500">💬</div>
                    <div className="text-xs text-slate-600">Active Chatter</div>
                  </div>
                </div>

                {/* Birthday */}
                <div className="bg-pink-50 rounded-xl p-4">
                  <div className="text-xs font-semibold text-pink-500 mb-2">Birthday · 生日</div>
                  <p className="text-sm text-slate-700">🎂 {vicenProfile.birthday}</p>
                </div>

                {/* First Message */}
                <div className="bg-pink-50 rounded-xl p-4">
                  <div className="text-xs font-semibold text-pink-500 mb-2">First Message · 第一条消息</div>
                  <p className="text-sm text-slate-700">&quot;{vicenProfile.firstMessage}&quot;</p>
                  <p className="text-xs text-slate-400 mt-1">{vicenProfile.firstMessageDate}</p>
                </div>

                {/* Interests */}
                {vicenProfile.interests.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-slate-700 mb-2">Interests · 兴趣爱好</h3>
                    <div className="flex flex-wrap gap-2">
                      {vicenProfile.interests.map((interest, idx) => (
                        <span
                          key={idx}
                          className="bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-xs"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Fun Facts */}
                {vicenProfile.facts.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-slate-700 mb-2">Fun Facts · 有趣的事实</h3>
                    <ul className="space-y-2">
                      {vicenProfile.facts.map((fact, idx) => (
                        <li key={idx} className="text-sm text-slate-600 flex items-start gap-2">
                          <span className="text-pink-400">•</span>
                          <span>{fact}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* sryndhcrs's Profile */}
          {sryndhcrsProfile && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-pink-200">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-purple-300">
                  <Image
                    src="/profile/523346911_18257572123304328_4772477901781581427_n.jpg"
                    alt="sryndhcrs"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">{sryndhcrsProfile.displayName}</h2>
                  <p className="text-sm text-purple-400">@{sryndhcrsProfile.name}</p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-purple-50 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-purple-500">{sryndhcrsProfile.totalMessages}</div>
                    <div className="text-xs text-slate-600">Total Messages</div>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-purple-500">💬</div>
                    <div className="text-xs text-slate-600">Active Chatter</div>
                  </div>
                </div>

                {/* Birthday */}
                {sryndhcrsProfile.birthday !== '-' && (
                  <div className="bg-purple-50 rounded-xl p-4">
                    <div className="text-xs font-semibold text-purple-500 mb-2">Birthday · 生日</div>
                    <p className="text-sm text-slate-700">🎂 {sryndhcrsProfile.birthday}</p>
                  </div>
                )}

                {/* First Message */}
                <div className="bg-purple-50 rounded-xl p-4">
                  <div className="text-xs font-semibold text-purple-500 mb-2">First Message · 第一条消息</div>
                  <p className="text-sm text-slate-700">&quot;{sryndhcrsProfile.firstMessage}&quot;</p>
                  <p className="text-xs text-slate-400 mt-1">{sryndhcrsProfile.firstMessageDate}</p>
                </div>

                {/* Interests */}
                {sryndhcrsProfile.interests.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-slate-700 mb-2">Interests · 兴趣爱好</h3>
                    <div className="flex flex-wrap gap-2">
                      {sryndhcrsProfile.interests.map((interest, idx) => (
                        <span
                          key={idx}
                          className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-xs"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Fun Facts */}
                {sryndhcrsProfile.facts.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-slate-700 mb-2">Fun Facts · 有趣的事实</h3>
                    <ul className="space-y-2">
                      {sryndhcrsProfile.facts.map((fact, idx) => (
                        <li key={idx} className="text-sm text-slate-600 flex items-start gap-2">
                          <span className="text-purple-400">•</span>
                          <span>{fact}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
