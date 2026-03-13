<<<<<<< HEAD
# PDF-to-Explain AI Tutor

A comprehensive AI-powered learning platform that transforms PDF documents into interactive educational experiences with explanations, diagrams, audio, quizzes, and chat.

## Features

- 📖 **AI Explanations** - Get simplified explanations tailored to your learning level
- 📊 **Visual Diagrams** - Generate Mermaid.js diagrams for better understanding
- 🔊 **Audio Narration** - Convert content to spoken audio with multiple voices
- 📝 **Interactive Quizzes** - Test your knowledge with auto-generated questions
- 🤖 **AI Tutor Chat** - Ask questions and get instant answers
- 🎬 **Step-by-Step Animations** - Visual learning with animated explanations

## Quick Start

### Frontend (React + Vite + TypeScript)

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Add your backend URL if different from localhost:8000
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open browser**
   Navigate to `http://localhost:5173`

### Backend (Python FastAPI)

The frontend is configured to work with a Python FastAPI backend. You'll need to run this separately.

1. **Create backend directory and set up Python environment**
   ```bash
   mkdir backend
   cd backend
   python -m venv venv
   
   # Windows
   venv\Scripts\activate
   
   # Mac/Linux
   source venv/bin/activate
   ```

2. **Create requirements.txt**
   ```txt
   fastapi==0.115.6
   uvicorn[standard]==0.34.0
   python-multipart==0.0.20
   python-dotenv==1.1.0
   pymupdf==1.25.3
   pdfplumber==0.11.6
   openai==1.82.0
   tiktoken==0.9.0
   faiss-cpu==1.11.0
   numpy==2.2.6
   httpx==0.28.1
   aiofiles==24.1.0
   pydantic==2.11.1
   pydantic-settings==2.9.1
   ```

3. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Create .env file**
   ```env
   OPENAI_API_KEY=sk-your-openai-key-here
   TTS_PROVIDER=openai
   ELEVENLABS_API_KEY=
   ELEVENLABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM
   UPLOAD_DIR=./uploads
   AUDIO_OUTPUT_DIR=./audio_output
   MAX_FILE_SIZE_MB=50
   CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
   EMBEDDING_MODEL=text-embedding-3-small
   CHUNK_SIZE=1000
   CHUNK_OVERLAP=200
   ```

5. **Start the backend server**
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

## Project Structure

```
pdf-to-explain-ai-tutor/
├── src/
│   ├── components/          # React components
│   │   ├── FileUpload.tsx
│   │   ├── ExplanationView.tsx
│   │   ├── DiagramView.tsx
│   │   ├── AudioPlayer.tsx
│   │   ├── QuizSection.tsx
│   │   ├── ChatInterface.tsx
│   │   ├── AnimationView.tsx
│   │   ├── KeyPoints.tsx
│   │   ├── DifficultyHighlighter.tsx
│   │   ├── Sidebar.tsx
│   │   └── LoadingSpinner.tsx
│   ├── hooks/               # Custom React hooks
│   │   └── useApi.ts
│   ├── lib/                 # Utilities and API client
│   │   └── api.ts
│   ├── types/               # TypeScript type definitions
│   │   └── index.ts
│   ├── App.tsx              # Main application component
│   ├── main.tsx             # Application entry point
│   └── index.css            # Global styles
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

## Technology Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **React Dropzone** - File uploads
- **Framer Motion** - Animations
- **Mermaid.js** - Diagram rendering
- **Sonner** - Toast notifications

### Backend (Required)
- **FastAPI** - Python web framework
- **OpenAI** - AI processing
- **FAISS** - Vector search
- **PyMuPDF/pdfplumber** - PDF text extraction
- **Uvicorn** - ASGI server

## Usage

1. **Upload a PDF** - Drag and drop or click to upload any PDF document
2. **Get AI Explanations** - Choose your learning level and audience
3. **Explore Features** - Use the sidebar to access different learning modes
4. **Interactive Learning** - Generate diagrams, audio, quizzes, and chat with the AI tutor

## Configuration

### Frontend Environment Variables
- `VITE_API_URL` - Backend API URL (default: http://localhost:8000)

### Backend Environment Variables
- `OPENAI_API_KEY` - Required for AI processing
- `TTS_PROVIDER` - Text-to-speech provider (openai/elevenlabs)
- `ELEVENLABS_API_KEY` - Optional ElevenLabs API key
- `CORS_ORIGINS` - Allowed frontend origins

## Development

### Frontend Development Commands
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

### Adding New Components
1. Create component in `src/components/`
2. Export from component file
3. Import and use in `App.tsx` or other components

### API Integration
The frontend uses a centralized API client in `src/lib/api.ts`. All backend communication goes through this module.

## Troubleshooting

### Common Issues
1. **CORS errors** - Ensure backend CORS origins include your frontend URL
2. **Missing dependencies** - Run `npm install` in frontend directory
3. **Backend connection** - Verify Python backend is running on port 8000
4. **OpenAI API errors** - Check your API key is valid and has sufficient credits

### Development Tips
- The frontend will proxy `/api` requests to the backend automatically
- Use browser dev tools to inspect API calls and responses
- Check the console for any JavaScript errors

# pdf-to-explain-ai-tutor

