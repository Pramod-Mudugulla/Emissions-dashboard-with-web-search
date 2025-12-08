# Emissions Dashboard with Web Search

A full-stack emissions tracking dashboard with AI-powered chat that can search the internet for real-time information.

## 🌟 Features

- **Interactive Dashboard**: Visualize emissions data by industry and sector
- **AI Chat Assistant**: Ask questions about emissions data
- **Web Search Integration**: Powered by Gemini with Google Search grounding
- **Source Citations**: Verifiable links from web searches

## 🏗️ Architecture

- **Frontend**: React + Vite + TailwindCSS + Recharts
- **Backend**: Django REST Framework
- **AI**: Google Gemini 2.5 Flash with Google Search

## 🚀 Setup

### Backend
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac
pip install -r requirements.txt
python seed_data.py  # Seed database
python manage.py runserver
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Environment Variables
Create `backend/.env`:
```
GEMINI_API_KEY=your_api_key_here
```

## 📊 Data Model

- **Industry**: Energy, Transportation, Manufacturing, Agriculture
- **Sector**: Sub-categories like Power Generation, Aviation, Steel
- **EmissionData**: Yearly emission values per sector

## 🤖 AI Features

The chatbot uses Gemini's Google Search grounding to:
- Answer questions with real-time web data
- Provide source citations for verification
- Combine internal database context with web search

## 📝 License

MIT
