"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: "Chat", path: "/", icon: "💬" },
    { name: "Profile", path: "/profile", icon: "👤" },
    { name: "Memories", path: "/memories", icon: "📸" },
    { name: "Surprise", path: "/surprise", icon: "🎁" },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-pink-400 text-white p-3 rounded-full shadow-lg"
      >
        {isOpen ? "✕" : "☰"}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-pink-200 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Title */}
          <div className="p-6 border-b border-pink-200">
            <h2 className="text-xl font-bold bg-gradient-to-r from-pink-400 to-pink-500 bg-clip-text text-transparent">
              Vicen's Space 💕
            </h2>
            <p className="text-xs text-pink-400 mt-1">Your personal companion · 陪伴你</p>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  pathname === item.path
                    ? "bg-pink-100 text-pink-600 font-medium"
                    : "text-slate-600 hover:bg-pink-50"
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-pink-200">
            <div className="text-xs text-slate-400 text-center">
              Welcome to 2026 💫<br />新年快乐
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
