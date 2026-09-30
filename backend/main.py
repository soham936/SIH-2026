# =============================================================================
# NCPOR PolarConnect Portal — FastAPI Backend
# SIH 2026 | Problem Statement ID 26063
# =============================================================================
import sqlite3, json, os, re, uuid
from datetime import datetime, timedelta
from contextlib import asynccontextmanager
from pathlib import Path
from fastapi import FastAPI, Query, HTTPException, UploadFile, File, Form
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from ai_features import (
    CATEGORIES, LANGUAGES, answer_from_repository, explain_in_language,
    extract_metadata as _extract_metadata, generate_content as _generate_ai_content,
    generate_quiz, summarize_pdf_text,
)

DB_PATH = "polar_portal.db"

# ─────────────────────────────────────────────────────────────────────────────
# DATABASE SETUP & SEED DATA
# ─────────────────────────────────────────────────────────────────────────────
def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

SEED_REPOSITORY = [
    # ── Expedition Reports ─────────────────────────────────────────────────
    {
        "title": "43rd Indian Scientific Expedition to Antarctica (ISEA)",
        "category": "Expedition Reports",
        "description": "Comprehensive field report from the 43rd ISEA covering geological surveys, atmospheric sampling, and marine biodiversity studies at Maitri and Bharati stations. Includes 120 days of continuous ice core data.",
        "author": "Dr. Sridhar Bhat, NCPOR",
        "date": "2024-03-15",
        "tags": "Antarctica,Maitri,Bharati,Ice Core,Climate",
        "station": "Maitri / Bharati",
        "file_size": "2.4 GB",
        "downloads": 1247,
    },
    {
        "title": "42nd ISEA Field Operations Summary",
        "category": "Expedition Reports",
        "description": "Field operations summary for the 42nd Indian Scientific Expedition to Antarctica. Covers logistics, scientific objectives achieved, and infrastructure developments at Bharati station.",
        "author": "Dr. M. Ravichandran, NCPOR",
        "date": "2023-04-10",
        "tags": "Antarctica,Bharati,Logistics,Infrastructure",
        "station": "Bharati",
        "file_size": "1.1 GB",
        "downloads": 987,
    },
    {
        "title": "12th Indian Arctic Expedition — Svalbard Climate Observations",
        "category": "Expedition Reports",
        "description": "Detailed observations from Himadri station on Arctic amplification, permafrost thaw dynamics, and glacial retreat patterns. Collaboration with Norway Polar Institute.",
        "author": "Dr. Anoop Mahajan, NCPOR",
        "date": "2024-09-01",
        "tags": "Arctic,Himadri,Svalbard,Permafrost,Glaciology",
        "station": "Himadri",
        "file_size": "890 MB",
        "downloads": 732,
    },
    {
        "title": "11th Indian Arctic Expedition — Atmospheric Chemistry Report",
        "category": "Expedition Reports",
        "description": "Atmospheric chemistry measurements including greenhouse gas concentrations, aerosol optical depth, and ozone column data collected over 60-day campaign period.",
        "author": "Dr. Prabir Patra, JAMSTEC/NCPOR",
        "date": "2023-08-22",
        "tags": "Arctic,Himadri,Atmosphere,GHG,Ozone",
        "station": "Himadri",
        "file_size": "560 MB",
        "downloads": 511,
    },
    # ── Datasets ────────────────────────────────────────────────────────────
    {
        "title": "East Antarctic Ice Core δ¹⁸O Isotope Record (2000–2024)",
        "category": "Datasets",
        "description": "High-resolution oxygen isotope time series from 400m deep ice cores drilled at Maitri station. Provides paleoclimate proxy data spanning 50,000 years.",
        "author": "Glaciology Division, NCPOR",
        "date": "2024-06-01",
        "tags": "Ice Core,Isotope,Paleoclimate,Maitri,Glaciology",
        "station": "Maitri",
        "file_size": "4.7 GB",
        "downloads": 2089,
    },
    {
        "title": "Microplastic Concentration Survey — Bharati Coastal Waters",
        "category": "Datasets",
        "description": "Spatial distribution data of microplastic concentrations (0.1–5mm) across 47 sampling stations in Larsemann Hills coastal waters. Includes polymer type classification via FTIR spectroscopy.",
        "author": "Dr. Neeraj Agarwal, NCPOR",
        "date": "2024-02-18",
        "tags": "Microplastics,Bharati,Marine,Pollution,FTIR",
        "station": "Bharati",
        "file_size": "780 MB",
        "downloads": 1543,
    },
    {
        "title": "Arctic Sea Ice Extent Time Series 1980–2024",
        "category": "Datasets",
        "description": "Multi-decadal satellite-derived sea ice extent, concentration, and thickness dataset for the Arctic Ocean. Merged from SMMR, SSM/I, and AMSR-E/2 sensors.",
        "author": "Remote Sensing Division, NCPOR",
        "date": "2024-07-15",
        "tags": "Sea Ice,Arctic,Satellite,Climate Change,Remote Sensing",
        "station": "Himadri",
        "file_size": "12.3 GB",
        "downloads": 3201,
    },
    {
        "title": "Southern Ocean CTD Transect Data — Austral Summer 2023",
        "category": "Datasets",
        "description": "Conductivity-Temperature-Depth profiles from 142 stations along the 45°E transect in the Southern Ocean. Includes dissolved oxygen, fluorescence, and turbidity measurements.",
        "author": "Physical Oceanography Div., NCPOR",
        "date": "2023-12-10",
        "tags": "Southern Ocean,CTD,Oceanography,Temperature,Salinity",
        "station": "Bharati",
        "file_size": "3.1 GB",
        "downloads": 876,
    },
    # ── Publications ────────────────────────────────────────────────────────
    {
        "title": "Accelerating Glacier Retreat in Dronning Maud Land: 2010–2024",
        "category": "Publications",
        "description": "Peer-reviewed study published in Nature Climate Change documenting 23% increase in glacier mass loss in Dronning Maud Land using multi-source satellite geodesy and ground-truth measurements.",
        "author": "Thamban M., Laluraj C.M., et al.",
        "date": "2024-05-12",
        "tags": "Glaciology,Satellite,Antarctica,Climate Change,Nature",
        "station": "Maitri",
        "file_size": "8.2 MB",
        "downloads": 4521,
    },
    {
        "title": "Black Carbon Deposition Patterns in Arctic Snow (Svalbard)",
        "category": "Publications",
        "description": "Analysis of black carbon aerosol transport pathways from mid-latitude emission sources and their depositional impact on Arctic snow albedo. Published in Atmospheric Chemistry and Physics.",
        "author": "Mahajan A.S., Philips D., et al.",
        "date": "2024-01-30",
        "tags": "Black Carbon,Arctic,Snow,Albedo,Aerosol,ACP",
        "station": "Himadri",
        "file_size": "5.8 MB",
        "downloads": 2874,
    },
    {
        "title": "Phytoplankton Bloom Dynamics in Prydz Bay",
        "category": "Publications",
        "description": "Seasonal variability in phytoplankton biomass and community composition in Prydz Bay linked to sea ice melt timing and mixed layer depth changes. Journal of Geophysical Research: Oceans.",
        "author": "Raina J.K., Nuncio M., et al.",
        "date": "2023-11-05",
        "tags": "Phytoplankton,Prydz Bay,Antarctica,Bloom,JGR",
        "station": "Bharati",
        "file_size": "6.4 MB",
        "downloads": 1987,
    },
    {
        "title": "Methane Fluxes from Arctic Permafrost — Himadri Observations",
        "category": "Publications",
        "description": "Eddy covariance measurements of CH4 fluxes from thawing permafrost near Ny-Ålesund. Quantifies contribution to Arctic greenhouse gas budget under warming scenarios.",
        "author": "Sabu P., Rahaman W., et al.",
        "date": "2023-07-19",
        "tags": "Methane,Permafrost,Arctic,Greenhouse Gas,Flux",
        "station": "Himadri",
        "file_size": "4.1 MB",
        "downloads": 2103,
    },
    # ── Media ───────────────────────────────────────────────────────────────
    {
        "title": "Polar Horizons: Documentary Series — Episode 1",
        "category": "Media",
        "description": "First episode of NCPOR's flagship documentary series following scientists on the 43rd Antarctic Expedition. Covers the 45-day voyage from Goa to Antarctica aboard MV Vasudhara.",
        "author": "NCPOR Media Cell",
        "date": "2024-08-01",
        "tags": "Documentary,Antarctica,Outreach,Video,MV Vasudhara",
        "station": "Maitri",
        "file_size": "4.2 GB",
        "downloads": 8932,
    },
    {
        "title": "Voices from the Ice: Researcher Interviews Collection",
        "category": "Media",
        "description": "Curated collection of 24 short-form interviews with NCPOR researchers explaining their polar science work in accessible language. Designed for school and college outreach programs.",
        "author": "NCPOR Outreach Division",
        "date": "2024-04-22",
        "tags": "Interviews,Outreach,Education,Scientists,Video",
        "station": "Himadri",
        "file_size": "18.7 GB",
        "downloads": 5612,
    },
    {
        "title": "NCPOR Antarctica Photo Archive 2019–2024",
        "category": "Media",
        "description": "High-resolution geotagged photograph archive covering Antarctic landscapes, wildlife, scientific activities, and infrastructure. 12,400+ images in RAW and JPEG formats.",
        "author": "NCPOR Photography Team",
        "date": "2024-07-10",
        "tags": "Photos,Antarctica,Wildlife,Landscape,Archive",
        "station": "Maitri / Bharati",
        "file_size": "220 GB",
        "downloads": 14022,
    },
]

SEED_EVENTS = [
    {
        "title": "International Symposium on Antarctic Sciences 2026",
        "date": "2026-11-10",
        "type": "Symposium",
        "location": "NCPOR, Goa",
        "description": "Annual gathering of polar scientists, policymakers, and early-career researchers. Theme: Climate Tipping Points in the Polar Regions.",
        "registration_url": "https://ncpor.res.in",
    },
    {
        "title": "NCPOR Public Lecture: Polar Vortex & Indian Monsoon Connection",
        "date": "2026-10-18",
        "type": "Webinar",
        "location": "Online (Zoom)",
        "description": "Open public lecture by Dr. Anoop Mahajan on the teleconnections between Arctic sea ice loss and Indian summer monsoon variability.",
        "registration_url": "https://ncpor.res.in",
    },
    {
        "title": "Polar Science for Schools — Outreach Workshop",
        "date": "2026-10-28",
        "type": "Workshop",
        "location": "IIT Bombay & Online",
        "description": "Interactive workshop for high school students exploring careers in polar research. Includes live Q&A with expedition members currently in Antarctica.",
        "registration_url": "https://ncpor.res.in",
    },
    {
        "title": "44th Indian Scientific Expedition to Antarctica — Departure",
        "date": "2026-12-01",
        "type": "Expedition",
        "location": "Mormugao Port, Goa",
        "description": "Ceremonial flag-off for the 44th ISEA. Scientific objectives include deep ice drilling, autonomous underwater vehicle deployment, and long-term ecosystem monitoring.",
        "registration_url": "https://ncpor.res.in",
    },
    {
        "title": "World Penguin Day — NCPOR Live Stream",
        "date": "2027-04-25",
        "type": "Outreach",
        "location": "Online",
        "description": "Live footage from Bharati station penguin colonies combined with researcher commentary on behavioral ecology and climate impacts on Antarctic wildlife.",
        "registration_url": "https://ncpor.res.in",
    },
]

def init_db():
    conn = get_db()
    cur = conn.cursor()

    cur.execute("""
        CREATE TABLE IF NOT EXISTS repository (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            title       TEXT    NOT NULL,
            category    TEXT    NOT NULL,
            description TEXT,
            author      TEXT,
            date        TEXT,
            tags        TEXT,
            station     TEXT,
            file_size   TEXT,
            downloads   INTEGER DEFAULT 0,
            created_at  TEXT    DEFAULT (datetime('now')),
            extracted_text TEXT,
            file_path TEXT,
            original_filename TEXT
        )
    """)

    # Additive migration: retain existing repository rows and schema users.
    existing_columns = {row[1] for row in cur.execute("PRAGMA table_info(repository)").fetchall()}
    for column, declaration in (
        ("extracted_text", "TEXT"),
        ("file_path", "TEXT"),
        ("original_filename", "TEXT"),
    ):
        if column not in existing_columns:
            cur.execute(f"ALTER TABLE repository ADD COLUMN {column} {declaration}")

    cur.execute("""
        CREATE TABLE IF NOT EXISTS events (
            id               INTEGER PRIMARY KEY AUTOINCREMENT,
            title            TEXT NOT NULL,
            date             TEXT,
            type             TEXT,
            location         TEXT,
            description      TEXT,
            registration_url TEXT
        )
    """)

    # Seed only if empty
    cur.execute("SELECT COUNT(*) FROM repository")
    if cur.fetchone()[0] == 0:
        for item in SEED_REPOSITORY:
            cur.execute("""
                INSERT INTO repository (title,category,description,author,date,tags,station,file_size,downloads)
                VALUES (?,?,?,?,?,?,?,?,?)
            """, (
                item["title"], item["category"], item["description"],
                item["author"], item["date"], item["tags"],
                item["station"], item["file_size"], item["downloads"]
            ))

    cur.execute("SELECT COUNT(*) FROM events")
    if cur.fetchone()[0] == 0:
        for ev in SEED_EVENTS:
            cur.execute("""
                INSERT INTO events (title,date,type,location,description,registration_url)
                VALUES (?,?,?,?,?,?)
            """, (
                ev["title"], ev["date"], ev["type"],
                ev["location"], ev["description"], ev["registration_url"]
            ))

    conn.commit()
    conn.close()

# ─────────────────────────────────────────────────────────────────────────────
class RepositoryItem(BaseModel):
    title: str
    category: str
    description: str
    author: str
    date: str
    tags: Optional[str] = ""
    station: Optional[str] = ""
    file_size: Optional[str] = "Unknown"

class ContentRequest(BaseModel):
    topic: str
    platform: str
    tone: str

class ChatRequest(BaseModel):
    message: str
    history: Optional[list] = None

class SummarizeRequest(BaseModel):
    item_id: int

class TranslateRequest(BaseModel):
    text: Optional[str] = ""
    title: Optional[str] = "Repository information"
    item_id: Optional[int] = None
    target_language: str

class MetadataRequest(BaseModel):
    title: str
    description: str

class QuizRequest(BaseModel):
    topic: str
    count: int = 5

# ─────────────────────────────────────────────────────────────────────────────
# APP LIFESPAN
# ─────────────────────────────────────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    print("[OK] PolarConnect DB initialised - polar_portal.db")
    yield

app = FastAPI(
    title="NCPOR PolarConnect API",
    description="Integrated Polar Science Outreach & Knowledge Repository API — SIH 2026",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─────────────────────────────────────────────────────────────────────────────
# ROUTES
# ─────────────────────────────────────────────────────────────────────────────

@app.get("/api/stats")
def get_stats():
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT COUNT(*) FROM repository")
    repo_count = cur.fetchone()[0]
    cur.execute("SELECT SUM(downloads) FROM repository")
    total_downloads = cur.fetchone()[0] or 0
    conn.close()
    return {
        "total_expeditions": 155,
        "datasets_archived_tb": 1.4,
        "publications": 487,
        "polar_stations": 3,
        "repository_items": repo_count,
        "total_downloads": total_downloads,
        "active_researchers": 312,
        "partner_nations": 24,
    }


@app.get("/api/repository")
def list_repository(
    category: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    limit: int = Query(50, le=100),
    offset: int = Query(0),
):
    conn = get_db()
    cur = conn.cursor()
    query = "SELECT id,title,category,description,author,date,tags,station,file_size,downloads,created_at,original_filename,file_path FROM repository WHERE 1=1"
    params = []

    if category and category.lower() != "all":
        query += " AND category = ?"
        params.append(category)

    if search:
        query += " AND (title LIKE ? OR description LIKE ? OR tags LIKE ? OR author LIKE ? OR extracted_text LIKE ?)"
        s = f"%{search}%"
        params.extend([s, s, s, s, s])

    query += " ORDER BY downloads DESC LIMIT ? OFFSET ?"
    params.extend([limit, offset])

    cur.execute(query, params)
    rows = [dict(row) for row in cur.fetchall()]
    conn.close()
    for item in rows:
        if item.pop("file_path", None):
            item["file_url"] = f"/api/repository/{item['id']}/file"
    return rows


@app.post("/api/repository", status_code=201)
def create_repository_item(item: RepositoryItem):
    metadata = _extract_metadata(item.title, f"{item.description}\nPublished: {item.date}")
    category = metadata["suggested_category"]
    station = metadata["suggested_station"] or item.station or ""
    tags = list(dict.fromkeys(
        [*metadata["auto_tags"], *([metadata["detected_year"]] if metadata["detected_year"] else []),
         *[tag.strip() for tag in (item.tags or "").split(",") if tag.strip()]]
    ))
    conn = get_db()
    cur = conn.cursor()
    try:
        cur.execute("""
            INSERT INTO repository (title,category,description,author,date,tags,station,file_size,downloads)
            VALUES (?,?,?,?,?,?,?,?,0)
        """, (
            item.title, category, item.description,
            item.author, item.date, ",".join(tags), station, item.file_size
        ))
        conn.commit()
        new_id = cur.lastrowid
        cur.execute("SELECT * FROM repository WHERE id = ?", (new_id,))
        row = cur.fetchone()
        return dict(row)
    finally:
        conn.close()


@app.post("/api/generate-content")
def generate_content(req: ContentRequest):
    if not req.topic.strip():
        raise HTTPException(status_code=400, detail="Topic cannot be empty")
    valid_platforms = {"X/Twitter", "LinkedIn", "Press Release", "Website"}
    valid_tones = {"Scientific", "Public Awareness", "Educational"}
    if req.platform not in valid_platforms:
        raise HTTPException(status_code=400, detail=f"Platform must be one of {valid_platforms}")
    if req.tone not in valid_tones:
        raise HTTPException(status_code=400, detail=f"Tone must be one of {valid_tones}")
    try:
        return _generate_ai_content(req.topic.strip(), req.platform, req.tone)
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=502, detail="AI content generation failed.") from exc


@app.get("/api/events")
def list_events():
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT * FROM events ORDER BY date ASC")
    rows = cur.fetchall()
    conn.close()
    return [dict(row) for row in rows]


# ─────────────────────────────────────────────────────────────────────────────
@app.post("/api/chat")
def chat(req: ChatRequest):
    if not req.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")
    conn = get_db()
    try:
        items = [dict(row) for row in conn.execute("SELECT * FROM repository").fetchall()]
    finally:
        conn.close()
    result = answer_from_repository(req.message.strip(), items, req.history or [])
    return {
        "question": req.message,
        "answer": result["answer"],
        "sources": result["sources"],
        "timestamp": datetime.now().isoformat(),
    }


# ─────────────────────────────────────────────────────────────────────────────
# FEATURE 2: AI PDF / Document Summarization
# ─────────────────────────────────────────────────────────────────────────────
@app.post("/api/summarize-pdf")
def summarize_pdf(req: SummarizeRequest):
    conn = get_db()
    try:
        row = conn.execute("SELECT title, extracted_text FROM repository WHERE id = ?", (req.item_id,)).fetchone()
    finally:
        conn.close()
    if not row or not row["extracted_text"]:
        raise HTTPException(status_code=404, detail="No extracted PDF text is available for this repository item.")
    return {"item_id": req.item_id, "title": row["title"], **summarize_pdf_text(row["title"], row["extracted_text"])}


# ─────────────────────────────────────────────────────────────────────────────
@app.post("/api/translate")
def translate(req: TranslateRequest):
    lang = req.target_language
    if lang not in LANGUAGES:
        raise HTTPException(status_code=400, detail=f"Language must be one of {sorted(LANGUAGES)}")
    title = req.title or "Repository information"
    text = req.text or ""
    if req.item_id is not None:
        conn = get_db()
        try:
            row = conn.execute("SELECT title,description,extracted_text FROM repository WHERE id = ?", (req.item_id,)).fetchone()
        finally:
            conn.close()
        if not row:
            raise HTTPException(status_code=404, detail="Repository item not found.")
        title = row["title"]
        text = row["extracted_text"] or row["description"] or ""
    if not text.strip():
        raise HTTPException(status_code=400, detail="Information to explain cannot be empty.")
    return {
        "title": title,
        "explanation": explain_in_language(title, text.strip(), lang),
        "target_language": lang,
        "generated_at": datetime.now().isoformat(),
    }


# ─────────────────────────────────────────────────────────────────────────────
# FEATURE 5: AI Metadata Extraction
# ─────────────────────────────────────────────────────────────────────────────
@app.post("/api/extract-metadata")
def api_extract_metadata(req: MetadataRequest):
    if not req.title.strip():
        raise HTTPException(status_code=400, detail="Title is required")
    result = _extract_metadata(req.title.strip(), req.description.strip())
    return {
        **result,
        "title": req.title,
        "generated_at": datetime.now().isoformat(),
    }


@app.post("/api/repository/upload-pdf", status_code=201)
async def upload_repository_pdf(
    file: UploadFile = File(...),
    title: str = Form(...),
    category: str = Form(...),
    description: str = Form(...),
    author: str = Form(...),
    date: str = Form(...),
    tags: str = Form(""),
    station: str = Form(""),
):
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=415, detail="Choose a PDF file.")
    raw = await file.read(20 * 1024 * 1024 + 1)
    if len(raw) > 20 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="PDF files must be 20 MB or smaller.")
    if not raw.startswith(b"%PDF-"):
        raise HTTPException(status_code=415, detail="The selected file is not a valid PDF.")
    try:
        from io import BytesIO
        # pyrefly: ignore [missing-import]
        from pypdf import PdfReader
        reader = PdfReader(BytesIO(raw), strict=False)
        extracted_text = "\n".join(page.extract_text() or "" for page in reader.pages).strip()
    except ImportError as exc:
        raise HTTPException(status_code=503, detail="PDF support is unavailable. Install backend requirements.") from exc
    except Exception as exc:
        raise HTTPException(status_code=422, detail="The PDF could not be read.") from exc
    if not extracted_text:
        raise HTTPException(status_code=422, detail="No readable text was found in this PDF.")

    metadata = _extract_metadata(title.strip(), f"{description.strip()}\nPublished: {date}\n{extracted_text[:12000]}")
    summary = summarize_pdf_text(title.strip(), extracted_text)
    merged_tags = list(dict.fromkeys(
        [*metadata["auto_tags"], *([metadata["detected_year"]] if metadata["detected_year"] else []),
         *[tag.strip() for tag in tags.split(",") if tag.strip()]]
    ))
    uploads_dir = Path(__file__).resolve().parent / "uploads"
    uploads_dir.mkdir(exist_ok=True)
    stored_path = uploads_dir / (uuid.uuid4().hex + ".pdf")
    stored_path.write_bytes(raw)
    conn = get_db()
    try:
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO repository
                (title,category,description,author,date,tags,station,file_size,downloads,extracted_text,file_path,original_filename)
            VALUES (?,?,?,?,?,?,?,?,0,?,?,?)
        """, (
            title.strip(), metadata["suggested_category"], description.strip(), author.strip(), date,
            ",".join(merged_tags), metadata["suggested_station"] or station,
            f"{len(raw) / (1024 * 1024):.1f} MB", extracted_text[:500000],
            stored_path.name, Path(file.filename).name,
        ))
        conn.commit()
        item_id = cur.lastrowid
        item = dict(conn.execute("SELECT * FROM repository WHERE id = ?", (item_id,)).fetchone())
        item["file_url"] = f"/api/repository/{item_id}/file"
        item.pop("extracted_text", None)
        item.pop("file_path", None)
        return {"item": item, "summary": summary}
    except Exception:
        stored_path.unlink(missing_ok=True)
        raise
    finally:
        conn.close()


@app.get("/api/repository/{item_id}/file")
def get_repository_file(item_id: int):
    conn = get_db()
    try:
        row = conn.execute(
            "SELECT file_path, original_filename FROM repository WHERE id = ?", (item_id,)
        ).fetchone()
    finally:
        conn.close()
    if not row or not row["file_path"]:
        raise HTTPException(status_code=404, detail="This repository item has no stored PDF.")
    uploads_dir = Path(__file__).resolve().parent / "uploads"
    path = uploads_dir / Path(row["file_path"]).name
    if path.parent != uploads_dir or not path.is_file():
        raise HTTPException(status_code=404, detail="The PDF file is not available.")
    return FileResponse(path, media_type="application/pdf", filename=row["original_filename"] or path.name)


@app.post("/api/quiz")
def create_quiz(req: QuizRequest):
    if not req.topic.strip():
        raise HTTPException(status_code=400, detail="Enter a quiz topic.")
    if req.count < 1 or req.count > 10:
        raise HTTPException(status_code=400, detail="Quiz length must be between 1 and 10 questions.")
    conn = get_db()
    try:
        items = [dict(row) for row in conn.execute("SELECT * FROM repository").fetchall()]
    finally:
        conn.close()
    return generate_quiz(req.topic.strip(), items, req.count)


@app.get("/api/status")
def get_status():
    return {"online": True, "ai_configured": bool(os.getenv("OPENAI_API_KEY", "").strip())}


@app.get("/")
def root():
    return {
        "message": "NCPOR PolarConnect API is running 🧊",
        "docs": "/docs",
        "version": "1.0.0"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
