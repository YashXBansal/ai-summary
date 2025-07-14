# 🧠 AI PDF Summarizer

A modern, beautifully designed web app that lets you **upload PDF documents**, generate **AI-powered summaries**, and view them in a clean, shareable format.  
Built with the latest **Next.js App Router**, **Tailwind CSS**, **shadcn/ui**, and **Clerk** for authentication.

> ⚡ Optimized for desktop & mobile. Includes Web Share support and clipboard fallback!

---

## ✨ Features

- 📄 Upload PDF documents
- 🤖 AI-based summary generation (Gemini/OpenAI/LangChain)
- 🖋️ Beautifully rendered summaries with Markdown & syntax highlighting
- 📤 Share summary via Web Share API or copy to clipboard
- 🧮 Word count of the summarized text
- 🔗 Link to view original uploaded PDF
- 🔐 Clerk-powered authentication (sign-in/out)
- 🧩 Modular component-based architecture
- 🌙 Light/dark mode support

---

## 🛠 Tech Stack

| Category       | Tools                                                                       |
| -------------- | --------------------------------------------------------------------------- |
| Framework      | [Next.js 15](https://nextjs.org) (App Router)                               |
| Styling        | [Tailwind CSS](https://tailwindcss.com), [shadcn/ui](https://ui.shadcn.dev) |
| Authentication | [Clerk.dev](https://clerk.dev)                                              |
| Markdown       | `react-markdown` + `rehype-highlight`                                       |
| Icons          | [`lucide-react`](https://lucide.dev)                                        |
| Hosting        | [Vercel](https://vercel.com)                                                |
| AI Integration | Gemini / OpenAI / LangChain                                                 |

---

## 🚀 Getting Started

### 1. Clone the repo

````bash
git clone https://github.com/YOUR_USERNAME/ai-pdf-summarizer.git
cd ai-pdf-summarizer
````

### 2. Install dependencies
````bash
npm install
# or
yarn
# or
pnpm install
````

### 3. Configure environment variables

# Clerk Authentication
````bash
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key 
`````

# AI Provider Key (Gemini or OpenAI)
````bash
AI_API_KEY=your_gemini_or_openai_key
````

# UploadThing Configuration (for handling file uploads)
````bash
UPLOADTHING_SECRET=your_uploadthing_secret
UPLOADTHING_APP_ID=your_uploadthing_app_id
````

### 4. Run the App

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```
