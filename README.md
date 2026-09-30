# NCPOR PolarConnect Portal — README

## Quick Start (2 Commands)

### 1. Start the Backend
```bash
cd polarconnect-portal/backend
pip install -r requirements.txt
export OPENAI_API_KEY="your-provider-key"
# Optional for OpenAI-compatible providers:
export OPENAI_MODEL="gpt-4o-mini"
# export OPENAI_BASE_URL="https://your-provider.example/v1"
python main.py
```
> Backend runs at http://localhost:8000
> Interactive API docs: http://localhost:8000/docs

### 2. Open the Frontend
```bash
# Option A: Just open the file directly in your browser:
# polarconnect-portal/frontend/index.html

# Option B: Serve with Python (recommended to avoid CORS on file://)
cd polarconnect-portal/frontend
python -m http.server 5500
```
> Frontend at http://localhost:5500

---

## Project Structure

```
polarconnect-portal/
├── backend/
│   ├── main.py            # FastAPI server — SQLite DB, repository, and document routes
│   ├── ai_features.py     # Repository-grounded AI and metadata services
│   └── requirements.txt   # FastAPI, PDF extraction, and upload dependencies
├── frontend/
│   ├── index.html         # Single-page application (all 5 sections)
│   ├── styles.css         # Ocean/Polar themed CSS design system
│   └── app.js             # Dynamic API integration, modals, AI output renderer
└── README.md
```

## API Endpoints

| Method | Endpoint              | Description                                               |
|--------|-----------------------|-----------------------------------------------------------|
| GET    | /api/stats            | Portal metrics: expeditions, datasets, publications        |
| GET    | /api/repository       | List items — filter by ?category= and ?search=             |
| POST   | /api/repository       | Submit new research data or report                         |
| POST   | /api/generate-content | AI content: { topic, platform, tone }                      |
| GET    | /api/events           | Upcoming NCPOR events and expeditions                      |
| POST   | /api/chat             | Repository-grounded PolarAI answers                        |
| POST   | /api/repository/upload-pdf | Extract, summarize, classify, and store an uploaded PDF |
| POST   | /api/translate        | Explain repository information in English, Hindi, or Marathi |
| POST   | /api/quiz             | Generate a repository-grounded student quiz                |
| POST   | /api/extract-metadata | Extract repository category, station, year, and tags       |

## Features

- Knowledge Repository — Searchable archive of 15 seed items across 4 categories
- AI Outreach Engine — Generate X/Twitter, LinkedIn, Press Release, and website content
- PolarAI — Repository-grounded answers with source links
- PDF analysis — Upload, summarize, classify, and store searchable PDFs
- Multilingual explanations — English, Hindi, and Marathi
- Automatic AI metadata extraction and repository classification
- Interactive Arctic and Antarctic polar station map
- Student quizzes generated from repository information
- Expedition Gallery — 12 polar station visual cards
- Station Info — Maitri, Bharati, Himadri detailed cards
- Event Timeline — 5 upcoming NCPOR events
- Upload Modal — POST /api/repository live data ingestion

AI endpoints require `OPENAI_API_KEY`. `OPENAI_MODEL` and `OPENAI_BASE_URL` are optional. PDF uploads are limited to 20 MB and require selectable text; the backend stores uploaded PDFs under `backend/uploads` and keeps their extracted text in the existing SQLite repository table.

## SIH 2026

Problem Statement ID: 26063
Organisation: NCPOR, Ministry of Earth Sciences
Category: Software
