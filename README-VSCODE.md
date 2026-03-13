# PDF-to-Explain AI Tutor - VS Code Setup

## 🚀 Quick Start in VS Code

### 1. Open Project
- Open VS Code
- File → Open Folder
- Navigate to: `C:\Users\Divya Rapelli\CascadeProjects\pdf-to-explain-ai-tutor`

### 2. Install Extensions
Press `Ctrl+Shift+X` and install:
- Python (Microsoft)
- Prettier - Code formatter
- Tailwind CSS IntelliSense
- TypeScript Importer

### 3. Run Development Servers

#### Method 1: Using VS Code Tasks (Recommended)
1. Press `Ctrl+Shift+P`
2. Type "Tasks: Run Task"
3. Choose "Start Frontend" for React dev server
4. Choose "Start Backend" for Python API server

#### Method 2: Using Terminal
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend  
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

#### Method 3: Using Debug Panel
1. Press `Ctrl+Shift+D`
2. Select "Run Full Stack" to start both servers
3. Or run individually: "Frontend (React)" or "Backend (Python)"

### 4. Access Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Health: http://localhost:8000/api/health

### 5. Project Structure
```
pdf-to-explain-ai-tutor/
├── src/                    # React frontend
│   ├── components/         # React components
│   ├── lib/              # API functions
│   └── types/            # TypeScript types
├── backend/                # Python FastAPI
│   ├── main.py            # Main API server
│   ├── requirements.txt    # Python dependencies
│   └── uploads/           # PDF uploads
├── .vscode/               # VS Code configuration
└── package.json           # Node.js dependencies
```

### 6. Development Workflow
1. Make changes to frontend/backend code
2. Servers auto-reload with changes
3. Test in browser at http://localhost:5173
4. Upload PDFs and test all features

### 7. Key Features
- ✅ PDF Upload & Processing
- ✅ AI Explanations (Free alternative)
- ✅ Interactive Diagrams
- ✅ Step-by-Step Animations  
- ✅ Audio Generation
- ✅ Smart Quiz Creation
- ✅ Chat with Document

### 8. Troubleshooting
- If frontend doesn't load: Check `npm run dev` is running
- If backend errors: Check Python dependencies installed
- If upload fails: Ensure both servers are running
- If content is generic: Backend is using smart fallbacks (works without OpenAI)

### 9. Free Version Features
This version works completely free without OpenAI credits:
- Smart content detection from PDFs
- Topic-specific explanations, diagrams, animations
- Management, Organization, Motivation focused content
- Generic fallback for other subjects
