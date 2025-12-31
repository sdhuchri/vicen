# Vicen's Space - Welcome to 2026 💫

Aplikasi chat AI personal untuk Vicen Desvillya dengan companion virtual yang hangat dan suportif untuk menyambut Tahun Baru 2026.

## 🎨 Fitur

- **Mobile-First Design**: Tampilan optimal untuk smartphone
- **UI Feminin & Lembut**: Warna pink, lavender, dan ungu dengan efek glow
- **Kepribadian AI Hangat**: Suportif, empati, dan menenangkan
- **Real-time Chat**: Integrasi langsung dengan OpenAI API
- **Animasi Smooth**: Typing indicator dan fade-in effects

## 🚀 Cara Menjalankan

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Setup OpenAI API Key**:
   - Copy file `.env.local.example` menjadi `.env.local`:
     ```bash
     copy .env.local.example .env.local
     ```
   - Buka file `.env.local`
   - Ganti `your_openai_api_key_here` dengan API key OpenAI Anda
   - Dapatkan API key di: https://platform.openai.com/api-keys

3. **Jalankan development server**:
   ```bash
   npm run dev
   ```

4. **Buka browser**:
   - Akses `http://localhost:3000`
   - Untuk testing mobile, gunakan Chrome DevTools (F12) dan toggle device toolbar

## 🎯 Teknologi

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS v4**
- **OpenAI API** (GPT-3.5-turbo)

## 💡 Catatan

- Aplikasi ini menggunakan **server-side API route** untuk keamanan API key
- API key disimpan di `.env.local` yang tidak akan ter-upload ke Git
- Untuk production, set environment variable `OPENAI_API_KEY` di hosting platform (Vercel/Netlify)
- Desain dioptimalkan untuk viewport mobile (max-width: 448px)

## 🎨 Penyesuaian

Anda bisa mengubah:
- **Warna tema**: Edit di `app/page.tsx` (gradient colors)
- **Kepribadian AI**: Edit system prompt di fungsi `sendMessage()`
- **Pesan pembuka**: Edit di `useState` initial message

## 📱 Best Experience

Untuk pengalaman terbaik:
- Gunakan di smartphone atau mode mobile browser
- Portrait orientation
- Dark mode environment

---

Selamat menyambut 2026! ✨💕
