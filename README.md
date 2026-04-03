# Rezmé — AI Resume Builder

An AI-powered resume builder with ATS optimization, professional templates, and smart CV import.

## Tech Stack

- **Frontend**: Next.js 14, React 18, Redux Toolkit, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express, MongoDB Atlas, Mongoose
- **AI**: Google Gemini API (for CV import, content generation, ATS analysis)

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier)
- Google Gemini API key

### Setup

1. **Clone the repo**
   ```bash
   git clone https://github.com/Swastik-Pradhan/Rezm-.git
   cd Rezm-
   ```

2. **Backend**
   ```bash
   cd backend
   cp .env.example .env
   # Fill in your MongoDB URI and Gemini API key in .env
   npm install
   npm run dev
   ```

3. **Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000)

## Features

- 📝 Multiple professional templates (Classic, Modern, Bold, Harvard, Jake's, Deedy)
- 🤖 AI-powered content generation and rewriting
- 📊 Real ATS scoring with keyword analysis
- 📄 Smart CV import — upload and clone any resume layout
- 🔒 JWT authentication with refresh tokens
- 🛡️ Security: Helmet, rate limiting, DOMPurify

## Environment Variables

See `backend/.env.example` for required config.

## License

MIT
