// NCPOR PolarConnect Portal - app.js
// SIH 2026 | Problem Statement ID 26063
// Existing repository views can fall back to local seed records when offline.
// AI, PDF analysis, translation, metadata extraction, and quizzes use the backend.

var API_BASE = "http://localhost:8000";

// --- SEED DATA (embedded) ---
var SEED_REPOSITORY = [
  {id:1,  title:"43rd Indian Scientific Expedition to Antarctica (ISEA)",        category:"Expedition Reports", description:"Comprehensive field report from the 43rd ISEA covering geological surveys, atmospheric sampling, and marine biodiversity studies at Maitri and Bharati stations. Includes 120 days of continuous ice core data.",            author:"Dr. Sridhar Bhat, NCPOR",           date:"2024-03-15", tags:"Antarctica,Maitri,Bharati,Ice Core,Climate",           station:"Maitri / Bharati", file_size:"2.4 GB",  downloads:1247},
  {id:2,  title:"42nd ISEA Field Operations Summary",                             category:"Expedition Reports", description:"Field operations summary for the 42nd Indian Scientific Expedition to Antarctica covering logistics, scientific objectives, and infrastructure developments at Bharati station.",                                            author:"Dr. M. Ravichandran, NCPOR",         date:"2023-04-10", tags:"Antarctica,Bharati,Logistics,Infrastructure",            station:"Bharati",          file_size:"1.1 GB",  downloads:987},
  {id:3,  title:"12th Indian Arctic Expedition: Svalbard Climate Observations",  category:"Expedition Reports", description:"Detailed observations from Himadri station on Arctic amplification, permafrost thaw dynamics, and glacial retreat patterns in collaboration with Norway Polar Institute.",                                                  author:"Dr. Anoop Mahajan, NCPOR",          date:"2024-09-01", tags:"Arctic,Himadri,Svalbard,Permafrost,Glaciology",          station:"Himadri",          file_size:"890 MB",  downloads:732},
  {id:4,  title:"11th Indian Arctic Expedition: Atmospheric Chemistry Report",   category:"Expedition Reports", description:"Atmospheric chemistry measurements including greenhouse gas concentrations, aerosol optical depth, and ozone column data collected over 60-day campaign period at Himadri station.",                                        author:"Dr. Prabir Patra, NCPOR",           date:"2023-08-22", tags:"Arctic,Himadri,Atmosphere,GHG,Ozone",                   station:"Himadri",          file_size:"560 MB",  downloads:511},
  {id:5,  title:"East Antarctic Ice Core Isotope Record 2000-2024",              category:"Datasets",           description:"High-resolution oxygen isotope time series from 400m deep ice cores drilled at Maitri station. Provides paleoclimate proxy data spanning 50000 years into the past.",                                                      author:"Glaciology Division, NCPOR",        date:"2024-06-01", tags:"Ice Core,Isotope,Paleoclimate,Maitri,Glaciology",        station:"Maitri",           file_size:"4.7 GB",  downloads:2089},
  {id:6,  title:"Microplastic Concentration Survey: Bharati Coastal Waters",     category:"Datasets",           description:"Spatial distribution data of microplastic concentrations across 47 sampling stations in Larsemann Hills coastal waters. Includes polymer type classification via FTIR spectroscopy.",                                       author:"Dr. Neeraj Agarwal, NCPOR",         date:"2024-02-18", tags:"Microplastics,Bharati,Marine,Pollution,FTIR",            station:"Bharati",          file_size:"780 MB",  downloads:1543},
  {id:7,  title:"Arctic Sea Ice Extent Time Series 1980-2024",                   category:"Datasets",           description:"Multi-decadal satellite-derived sea ice extent, concentration, and thickness dataset for the Arctic Ocean. Merged from SMMR, SSM/I, and AMSR-E/2 sensors.",                                                                author:"Remote Sensing Division, NCPOR",    date:"2024-07-15", tags:"Sea Ice,Arctic,Satellite,Climate Change,Remote Sensing",  station:"Himadri",          file_size:"12.3 GB", downloads:3201},
  {id:8,  title:"Southern Ocean CTD Transect Data: Austral Summer 2023",         category:"Datasets",           description:"Conductivity-Temperature-Depth profiles from 142 stations along the 45 degree E transect in the Southern Ocean, including dissolved oxygen, fluorescence, and turbidity measurements.",                                     author:"Physical Oceanography Div., NCPOR", date:"2023-12-10", tags:"Southern Ocean,CTD,Oceanography,Temperature,Salinity",   station:"Bharati",          file_size:"3.1 GB",  downloads:876},
  {id:9,  title:"Accelerating Glacier Retreat in Dronning Maud Land 2010-2024", category:"Publications",        description:"Peer-reviewed study in Nature Climate Change documenting 23 percent increase in glacier mass loss in Dronning Maud Land using multi-source satellite geodesy and ground-truth measurements.",                                 author:"Thamban M., Laluraj C.M., et al.",  date:"2024-05-12", tags:"Glaciology,Satellite,Antarctica,Climate Change,Nature",   station:"Maitri",           file_size:"8.2 MB",  downloads:4521},
  {id:10, title:"Black Carbon Deposition Patterns in Arctic Snow (Svalbard)",    category:"Publications",        description:"Analysis of black carbon aerosol transport pathways from mid-latitude emission sources and their depositional impact on Arctic snow albedo, published in Atmospheric Chemistry and Physics.",                                   author:"Mahajan A.S., Philips D., et al.",  date:"2024-01-30", tags:"Black Carbon,Arctic,Snow,Albedo,Aerosol,ACP",            station:"Himadri",          file_size:"5.8 MB",  downloads:2874},
  {id:11, title:"Phytoplankton Bloom Dynamics in Prydz Bay",                     category:"Publications",        description:"Seasonal variability in phytoplankton biomass and community composition in Prydz Bay linked to sea ice melt timing and mixed layer depth changes. Journal of Geophysical Research: Oceans.",                               author:"Raina J.K., Nuncio M., et al.",     date:"2023-11-05", tags:"Phytoplankton,Prydz Bay,Antarctica,Bloom,JGR",           station:"Bharati",          file_size:"6.4 MB",  downloads:1987},
  {id:12, title:"Methane Fluxes from Arctic Permafrost: Himadri Observations",   category:"Publications",        description:"Eddy covariance measurements of CH4 fluxes from thawing permafrost near Ny-Alesund. Quantifies contribution to Arctic greenhouse gas budget under warming scenarios.",                                                      author:"Sabu P., Rahaman W., et al.",       date:"2023-07-19", tags:"Methane,Permafrost,Arctic,Greenhouse Gas,Flux",          station:"Himadri",          file_size:"4.1 MB",  downloads:2103},
  {id:13, title:"Polar Horizons Documentary Series: Episode 1",                  category:"Media",               description:"First episode of NCPOR flagship documentary following scientists on the 43rd Antarctic Expedition. Covers the 45-day voyage from Goa to Antarctica aboard MV Vasudhara.",                                                   author:"NCPOR Media Cell",                  date:"2024-08-01", tags:"Documentary,Antarctica,Outreach,Video,MV Vasudhara",    station:"Maitri",           file_size:"4.2 GB",  downloads:8932},
  {id:14, title:"Voices from the Ice: Researcher Interviews Collection",         category:"Media",               description:"Curated collection of 24 short-form interviews with NCPOR researchers explaining their polar science work in accessible language for school and college outreach programs.",                                                  author:"NCPOR Outreach Division",           date:"2024-04-22", tags:"Interviews,Outreach,Education,Scientists,Video",         station:"Himadri",          file_size:"18.7 GB", downloads:5612},
  {id:15, title:"NCPOR Antarctica Photo Archive 2019-2024",                      category:"Media",               description:"High-resolution geotagged photograph archive covering Antarctic landscapes, wildlife, scientific activities and infrastructure. Over 12400 images in RAW and JPEG formats.",                                                   author:"NCPOR Photography Team",            date:"2024-07-10", tags:"Photos,Antarctica,Wildlife,Landscape,Archive",           station:"Maitri / Bharati", file_size:"220 GB",  downloads:14022},
];

var SEED_EVENTS = [
  {id:1, title:"International Symposium on Antarctic Sciences 2026",         date:"2026-11-10", type:"Symposium",  location:"NCPOR, Goa",           description:"Annual gathering of polar scientists, policymakers, and early-career researchers. Theme: Climate Tipping Points in the Polar Regions.",                                           registration_url:"https://ncpor.res.in"},
  {id:2, title:"NCPOR Public Lecture: Polar Vortex & Indian Monsoon",        date:"2026-10-18", type:"Webinar",    location:"Online (Zoom)",         description:"Open public lecture by Dr. Anoop Mahajan on the teleconnections between Arctic sea ice loss and Indian summer monsoon variability.",                                             registration_url:"https://ncpor.res.in"},
  {id:3, title:"Polar Science for Schools: Outreach Workshop",               date:"2026-10-28", type:"Workshop",   location:"IIT Bombay & Online",   description:"Interactive workshop for high school students exploring careers in polar research with live Q&A from expedition members in Antarctica.",                                      registration_url:"https://ncpor.res.in"},
  {id:4, title:"44th Indian Scientific Expedition: Antarctica Departure",    date:"2026-12-01", type:"Expedition", location:"Mormugao Port, Goa",   description:"Ceremonial flag-off for the 44th ISEA. Objectives include deep ice drilling, autonomous underwater vehicle deployment, and long-term ecosystem monitoring.",           registration_url:"https://ncpor.res.in"},
  {id:5, title:"World Penguin Day: NCPOR Live Stream",                       date:"2027-04-25", type:"Outreach",   location:"Online",                description:"Live footage from Bharati station penguin colonies combined with researcher commentary on behavioral ecology and climate impacts on Antarctic wildlife.",                   registration_url:"https://ncpor.res.in"},
];

// --- STATE ---
var state = {
  activeCategory: "All", searchQuery: "", selectedItem: null,
  aiOutput: null, isGenerating: false, backendOnline: false, nextLocalId: 200,
  chatMessages: [], chatBusy: false, quiz: null, quizIndex: 0, quizChoice: null, quizChecked: false, quizScore: 0,
  repoItems: SEED_REPOSITORY.map(function(r) { return Object.assign({}, r); }),
  events: SEED_EVENTS.map(function(e) { return Object.assign({}, e); }),
};

// --- UTILITIES ---
function fmt(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return String(n);
}
function esc(s) {
  return String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function fmtDate(d) {
  if (!d) return "-";
  try { var dt = new Date(d); return dt.toLocaleDateString("en-IN", {year: "numeric", month: "short", day: "numeric"}); }
  catch (e) { return d; }
}
function showToast(msg, type) {
  type = type || "info";
  var old = document.querySelector(".toast"); if (old) old.remove();
  var t = document.createElement("div"); t.className = "toast " + type;
  t.innerHTML = "<span>" + esc(msg) + "</span>";
  document.body.appendChild(t);
  setTimeout(function () { t.style.animation = "toastIn 0.3s ease reverse"; setTimeout(function () { t.remove(); }, 300); }, 3500);
}
function iconBg(c) { return {"Expedition Reports": "icon-report", "Datasets": "icon-dataset", "Publications": "icon-pub", "Media": "icon-media"}[c] || "icon-report"; }
function badgeCls(c) { return {"Expedition Reports": "badge-report", "Datasets": "badge-dataset", "Publications": "badge-pub", "Media": "badge-media"}[c] || "badge-report"; }
function catEmoji(c) { return {"Expedition Reports": "\uD83C\uDFD4\uFE0F", "Datasets": "\uD83D\uDCBE", "Publications": "\uD83D\uDCC4", "Media": "\uD83C\uDF9C"}[c] || "\uD83D\uDCC1"; }
function evTypeCls(t) { return {"Symposium": "type-symposium", "Webinar": "type-webinar", "Workshop": "type-workshop", "Expedition": "type-expedition", "Outreach": "type-outreach"}[t] || "type-webinar"; }

// --- BACKEND ---
async function checkBackend() {
  try {
    var ctrl = new AbortController();
    var timer = setTimeout(function () { ctrl.abort(); }, 1500);
    var res = await fetch(API_BASE + "/", {signal: ctrl.signal});
    clearTimeout(timer);
    if (!res.ok) throw new Error("backend offline");
    state.backendOnline = true;
    var statusResponse = await fetch(API_BASE + "/api/status");
    if (!statusResponse.ok) throw new Error("status unavailable");
    var status = await statusResponse.json();
    var badge = document.getElementById("aiStatusBadge");
    if (badge) {
      badge.textContent = status.ai_configured ? "AI READY" : "API KEY REQUIRED";
      badge.style.color = status.ai_configured ? "#34D399" : "#FCD34D";
      badge.style.background = status.ai_configured ? "rgba(16,185,129,0.1)" : "rgba(245,158,11,0.1)";
      badge.style.borderColor = status.ai_configured ? "rgba(16,185,129,0.2)" : "rgba(245,158,11,0.2)";
    }
  } catch (e) {
    state.backendOnline = false;
    var badge = document.getElementById("aiStatusBadge");
    if (badge) { badge.textContent = "BACKEND OFFLINE"; badge.style.color = "#FCA5A5"; badge.style.background = "rgba(239,68,68,0.1)"; badge.style.borderColor = "rgba(239,68,68,0.2)"; }
  }
}
async function apiFetch(path, opts) {
  var res = await fetch(API_BASE + path, Object.assign({headers: {"Content-Type": "application/json"}}, opts || {}));
  if (!res.ok) { var err = await res.json().catch(function () { return {detail: res.statusText}; }); throw new Error(err.detail || "API error"); }
  return res.json();
}

// --- STATS ---
async function loadStats() {
  var g = document.getElementById("statsGrid");
  g.innerHTML = '<div class="loading-spinner" style="grid-column:1/-1;flex-direction:row;padding:1rem"><div class="spinner"></div></div>';
  var d;
  try {
    if (state.backendOnline) { d = await apiFetch("/api/stats"); } else { throw new Error("offline"); }
  } catch (e) {
    var dl = state.repoItems.reduce(function (a, b) { return a + (b.downloads || 0); }, 0);
    d = {total_expeditions: 155, datasets_archived_tb: 1.4, publications: 487, polar_stations: 3, repository_items: state.repoItems.length, total_downloads: dl, active_researchers: 312, partner_nations: 24};
  }
  var rows = [["" + d.total_expeditions + "+", "Expeditions"], [d.datasets_archived_tb + " TB", "Data Archived"], ["" + d.publications + "+", "Publications"], ["" + d.polar_stations, "Polar Stations"], ["" + d.active_researchers + "+", "Researchers"], ["" + d.partner_nations + "+", "Partner Nations"], [fmt(d.total_downloads), "Total Downloads"], ["" + d.repository_items, "Repository Items"]];
  g.innerHTML = rows.map(function (x) { return '<div class="stat-card"><div class="stat-value">' + esc(x[0]) + '</div><div class="stat-label">' + esc(x[1]) + '</div></div>'; }).join("");
}

// --- REPOSITORY ---
async function loadRepository() {
  var g = document.getElementById("repoGrid");
  g.innerHTML = '<div class="loading-spinner" style="grid-column:1/-1"><div class="spinner"></div><span>Loading repository...</span></div>';
  var items;
  try {
    if (state.backendOnline) {
      var url = "/api/repository?limit=100";
      if (state.activeCategory !== "All") url += "&category=" + encodeURIComponent(state.activeCategory);
      if (state.searchQuery) url += "&search=" + encodeURIComponent(state.searchQuery);
      var fetched = await apiFetch(url);
      var local = state.repoItems.filter(function (r) { return r.id >= 200; });
      items = fetched.concat(local); state.repoItems = items;
    } else { throw new Error("offline"); }
  } catch (e) {
    items = state.repoItems.filter(function (item) {
      var mc = state.activeCategory === "All" || item.category === state.activeCategory;
      var q = (state.searchQuery || "").toLowerCase();
      var mq = !q || [item.title, item.description, item.tags, item.author].some(function (f) { return (f || "").toLowerCase().indexOf(q) !== -1; });
      return mc && mq;
    });
  }
  renderRepo(items);
}

function renderRepo(items) {
  var g = document.getElementById("repoGrid");
  if (!items.length) {
    g.innerHTML = '<div class="empty-state" style="grid-column:1/-1"><div class="empty-icon">\uD83D\uDD0D</div><h3 style="color:var(--text-primary);margin-bottom:0.5rem">No results found</h3><p>Try adjusting your search or filter criteria.</p></div>';
    return;
  }
  g.innerHTML = items.map(function (item) {
    var ic = catEmoji(item.category); var ibg = iconBg(item.category); var bc = badgeCls(item.category);
    var tags = (item.tags || "").split(",").filter(Boolean).slice(0, 3);
    return '<div class="card repo-card" onclick="openItemModal(' + item.id + ')">' +
      '<div class="repo-card-header"><div class="repo-icon ' + ibg + '">' + ic + '</div><div class="repo-card-title">' + esc(item.title) + '</div></div>' +
      '<div class="repo-card-desc">' + esc(item.description) + '</div>' +
      '<div style="display:flex;flex-wrap:wrap;gap:0.35rem;margin-bottom:0.75rem">' + tags.map(function (t) { return '<span class="hashtag" style="font-size:0.7rem">#' + esc(t.trim()) + '</span>'; }).join("") + '</div>' +
      '<div class="repo-card-footer"><span class="category-badge ' + bc + '">' + ic + ' ' + esc(item.category) + '</span><div class="downloads-count"><span>\u2B07\uFE0F</span><span>' + fmt(item.downloads || 0) + '</span></div></div>' +
      '</div>';
  }).join("");
}

// --- EVENTS ---
async function loadEvents() {
  var c = document.getElementById("eventsList");
  c.innerHTML = '<div class="loading-spinner"><div class="spinner"></div></div>';
  var evs;
  try { if (state.backendOnline) { evs = await apiFetch("/api/events"); state.events = evs; } else { throw new Error("offline"); } }
  catch (e) { evs = state.events; }
  renderEvents(evs);
}
function renderEvents(evs) {
  var c = document.getElementById("eventsList");
  if (!evs.length) { c.innerHTML = '<div class="empty-state"><div class="empty-icon">\uD83D\uDCC5</div><p>No upcoming events.</p></div>'; return; }
  c.innerHTML = evs.map(function (ev) {
    var d = new Date(ev.date); var day = d.getDate(); var mon = d.toLocaleDateString("en-IN", {month: "short"}); var tc = evTypeCls(ev.type);
    return '<div class="card event-card">' +
      '<div class="event-date-block"><div class="event-day">' + day + '</div><div class="event-month">' + esc(mon) + '</div></div>' +
      '<div class="event-body"><div class="event-title">' + esc(ev.title) + '</div><div class="event-desc">' + esc(ev.description) + '</div>' +
      '<div class="event-meta"><span class="event-type-badge ' + tc + '">' + esc(ev.type) + '</span><span class="text-xs text-muted">\uD83D\uDCCD ' + esc(ev.location) + '</span>' +
      '<a href="' + esc(ev.registration_url) + '" class="btn btn-outline btn-sm" target="_blank">Register \u2192</a></div></div></div>';
  }).join("");
}

// --- MODALS ---
function openItemModal(itemId) {
  var item = state.repoItems.find(function (i) { return i.id === itemId; });
  if (!item) return;
  state.selectedItem = item;
  var ic = catEmoji(item.category); var bc = badgeCls(item.category);
  var tags = (item.tags || "").split(",").filter(Boolean);
  var div = document.createElement("div");
  div.className = "modal-overlay"; div.id = "itemModal";
  div.innerHTML = '<div class="modal" onclick="event.stopPropagation()">' +
    '<div class="modal-header"><div><span class="category-badge ' + bc + '" style="margin-bottom:0.5rem;display:inline-flex">' + ic + ' ' + esc(item.category) + '</span><div class="modal-title">' + esc(item.title) + '</div></div>' +
    '<button class="modal-close" id="closeItemBtn">\u2715</button></div>' +
    '<div class="modal-body"><div class="modal-field"><div class="modal-field-label">Description</div><div class="modal-field-value">' + esc(item.description) + '</div></div>' +
    '<div class="info-grid">' +
    '<div class="info-item"><span class="info-key">Author</span><span class="info-val">' + esc(item.author || "-") + '</span></div>' +
    '<div class="info-item"><span class="info-key">Published</span><span class="info-val">' + fmtDate(item.date) + '</span></div>' +
    '<div class="info-item"><span class="info-key">Station</span><span class="info-val">' + esc(item.station || "-") + '</span></div>' +
    '<div class="info-item"><span class="info-key">File Size</span><span class="info-val">' + esc(item.file_size || "-") + '</span></div>' +
    '<div class="info-item"><span class="info-key">Downloads</span><span class="info-val" style="color:var(--cyan)">' + fmt(item.downloads || 0) + '</span></div>' +
    '<div class="info-item"><span class="info-key">Added</span><span class="info-val">' + fmtDate(item.created_at || item.date) + '</span></div>' +
    '</div><div style="display:flex;flex-wrap:wrap;gap:0.4rem;margin-top:0.75rem">' + tags.map(function (t) { return '<span class="hashtag">#' + esc(t.trim()) + '</span>'; }).join("") + '</div>' +
    '<div class="item-explain"><label class="form-label" for="explainLanguage">Get an explanation in</label>' +
    '<div style="display:flex;gap:0.5rem;margin-top:0.4rem"><select class="form-control" id="explainLanguage"><option>English</option><option>Hindi</option><option>Marathi</option></select>' +
    '<button class="btn btn-outline btn-sm" id="explainItemBtn">Explain</button></div><div id="itemExplanation" class="hidden" aria-live="polite"></div></div></div>' +
    '<div class="modal-footer"><button class="btn btn-ghost btn-sm" id="closeItemBtn2">Close</button><button class="btn btn-primary btn-sm" id="dlItemBtn">' + (item.file_url ? 'Open PDF' : '\u2B07\uFE0F Download') + '</button></div></div>';
  document.body.appendChild(div); document.body.style.overflow = "hidden";
  div.addEventListener("click", function (e) { if (e.target === div) closeModal("itemModal"); });
  document.getElementById("closeItemBtn").onclick = function () { closeModal("itemModal"); };
  document.getElementById("closeItemBtn2").onclick = function () { closeModal("itemModal"); };
  document.getElementById("dlItemBtn").onclick = function () {
    if (item.file_url) window.open(API_BASE + item.file_url, "_blank", "noopener");
    else simulateDownload(item.id);
  };
  document.getElementById("explainItemBtn").onclick = function () { explainRepositoryItem(item); };
}

async function explainRepositoryItem(item) {
  var btn = document.getElementById("explainItemBtn");
  var output = document.getElementById("itemExplanation");
  btn.disabled = true; btn.textContent = "Explaining...";
  output.classList.remove("hidden");
  output.innerHTML = '<div class="text-sm text-muted" style="margin-top:0.75rem">Generating an explanation from this repository item…</div>';
  try {
    var result = await apiFetch("/api/translate", {method: "POST", body: JSON.stringify({item_id: item.id, target_language: document.getElementById("explainLanguage").value})});
    output.innerHTML = '<div class="ai-output-content" style="margin-top:0.75rem">' + esc(result.explanation) + '</div>';
  } catch (e) {
    output.innerHTML = '<div class="text-sm" style="margin-top:0.75rem;color:var(--danger)">' + esc(e.message) + '</div>';
  } finally {
    btn.disabled = false; btn.textContent = "Explain";
  }
}

function simulateDownload(itemId) {
  var item = state.repoItems.find(function (i) { return i.id === itemId; });
  if (item) { item.downloads = (item.downloads || 0) + 1; showToast("Download initiated - open-access dataset (" + item.file_size + ")", "success"); }
}

function openUploadModal() {
  var today = new Date().toISOString().split("T")[0];
  var div = document.createElement("div"); div.className = "modal-overlay"; div.id = "uploadModal";
  div.innerHTML = '<div class="modal" onclick="event.stopPropagation()">' +
    '<div class="modal-header"><div><div class="modal-title">\uD83D\uDCE4 Submit Research Data</div><p class="text-sm text-muted" style="margin-top:0.25rem">Contribute to the NCPOR PolarConnect open-access repository</p></div>' +
    '<button class="modal-close" id="closeUploadBtn">\u2715</button></div>' +
    '<div class="modal-body"><form id="uploadForm">' +
    '<div class="form-group mb-4"><label class="form-label">Title *</label><input class="form-control" id="f_title" required placeholder="e.g., Sea ice thickness at Maitri 2025" /></div>' +
    '<div class="form-group mb-4"><label class="form-label">Category *</label><select class="form-control" id="f_cat" required><option value="">Select...</option><option>Expedition Reports</option><option>Datasets</option><option>Publications</option><option>Media</option></select></div>' +
    '<div class="form-group mb-4"><label class="form-label">Description *</label><textarea class="form-control" id="f_desc" rows="3" required placeholder="Briefly describe the data, methodology and significance..."></textarea></div>' +
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem" class="mb-4"><div class="form-group"><label class="form-label">Author *</label><input class="form-control" id="f_auth" required placeholder="Dr. Name, NCPOR" /></div>' +
    '<div class="form-group"><label class="form-label">Date *</label><input class="form-control" id="f_date" type="date" required value="' + today + '" /></div></div>' +
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem" class="mb-4"><div class="form-group"><label class="form-label">Station</label><select class="form-control" id="f_stn"><option value="">Select...</option><option>Maitri</option><option>Bharati</option><option>Himadri</option><option value="Maitri / Bharati">Both Antarctic Stations</option></select></div>' +
    '<div class="form-group"><label class="form-label">File Size</label><input class="form-control" id="f_sz" placeholder="e.g., 500 MB" /></div></div>' +
    '<div class="form-group mb-4"><label class="form-label">Tags (comma-separated)</label><input class="form-control" id="f_tags" placeholder="e.g., Sea Ice, Temperature, Sensor Data" /></div>' +
    '<input id="pdfFile" type="file" accept="application/pdf,.pdf" hidden />' +
    '<div class="upload-drop" id="dropZone" role="button" tabindex="0"><div class="upload-icon">\uD83D\uDCC2</div><div class="upload-text" id="pdfFileLabel">Select or drop a PDF for AI analysis and repository storage<br/><small>PDF files up to 20 MB</small></div></div>' +
    '<div style="display:flex;gap:0.75rem;justify-content:flex-end;margin-top:1rem"><button type="button" class="btn btn-ghost" id="cancelUploadBtn">Cancel</button><button type="button" class="btn btn-primary" id="submitUploadBtn">\uD83D\uDCE4 Submit Dataset</button></div>' +
    '</form></div></div>';
  document.body.appendChild(div); document.body.style.overflow = "hidden";
  div.addEventListener("click", function (e) { if (e.target === div) closeModal("uploadModal"); });
  document.getElementById("closeUploadBtn").onclick = function () { closeModal("uploadModal"); };
  document.getElementById("cancelUploadBtn").onclick = function () { closeModal("uploadModal"); };
  var pdfInput = document.getElementById("pdfFile");
  var dropZone = document.getElementById("dropZone");
  dropZone.onclick = function () { pdfInput.click(); };
  dropZone.onkeydown = function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pdfInput.click(); } };
  dropZone.ondragover = function (e) { e.preventDefault(); dropZone.classList.add("dragging"); };
  dropZone.ondragleave = function () { dropZone.classList.remove("dragging"); };
  dropZone.ondrop = function (e) {
    e.preventDefault(); dropZone.classList.remove("dragging");
    if (e.dataTransfer.files.length) { pdfInput.files = e.dataTransfer.files; updatePdfFileLabel(); }
  };
  pdfInput.onchange = updatePdfFileLabel;
  document.getElementById("submitUploadBtn").onclick = submitRepository;
}

function updatePdfFileLabel() {
  var file = document.getElementById("pdfFile").files[0];
  document.getElementById("pdfFileLabel").innerHTML = file ? esc(file.name) + ' <small>(' + fmt(file.size) + ' bytes) · ready for analysis</small>' : 'Select or drop a PDF for AI analysis and repository storage<br/><small>PDF files up to 20 MB</small>';
}

async function submitRepository() {
  var title = document.getElementById("f_title").value.trim();
  var cat = document.getElementById("f_cat").value;
  var desc = document.getElementById("f_desc").value.trim();
  var auth = document.getElementById("f_auth").value.trim();
  var date = document.getElementById("f_date").value;
  if (!title || !cat || !desc || !auth || !date) { showToast("Please fill all required fields.", "error"); return; }
  var payload = {title: title, category: cat, description: desc, author: auth, date: date, tags: document.getElementById("f_tags").value, station: document.getElementById("f_stn").value, file_size: document.getElementById("f_sz").value || "Unknown"};
  var btn = document.getElementById("submitUploadBtn"); btn.disabled = true; btn.textContent = "Submitting...";
  var selectedPdf = document.getElementById("pdfFile").files[0];
  try {
    await checkBackend();
    if (selectedPdf) {
      if (!state.backendOnline) throw new Error("Start the PolarConnect backend to analyze and store a PDF.");
      if (!selectedPdf.name.toLowerCase().endsWith(".pdf")) throw new Error("Choose a PDF file.");
      var form = new FormData();
      Object.keys(payload).forEach(function (key) { form.append(key, payload[key]); });
      form.append("file", selectedPdf);
      btn.textContent = "Analyzing PDF...";
      var analysis = await apiFetch("/api/repository/upload-pdf", {method: "POST", body: form, headers: {}});
      state.repoItems.unshift(analysis.item);
      closeModal("uploadModal");
      showToast("PDF analyzed and added to the repository.", "success");
      await loadRepository(); loadStats(); openPdfSummary(analysis);
    } else {
      var newItem;
      if (state.backendOnline) newItem = await apiFetch("/api/repository", {method: "POST", body: JSON.stringify(payload)});
      else newItem = Object.assign({}, payload, {id: state.nextLocalId++, downloads: 0, created_at: new Date().toISOString()});
      state.repoItems.unshift(newItem);
      closeModal("uploadModal");
      showToast("Dataset submitted successfully! It now appears in the repository.", "success");
      loadRepository(); loadStats();
    }
  } catch (e) {
    showToast(e.message || "The submission failed.", "error");
  } finally {
    btn.disabled = false; btn.textContent = "\uD83D\uDCE4 Submit Dataset";
  }
}

function openPdfSummary(result) {
  var item = result.item; var summary = result.summary;
  var div = document.createElement("div"); div.className = "modal-overlay"; div.id = "pdfSummaryModal";
  div.innerHTML = '<div class="modal" onclick="event.stopPropagation()"><div class="modal-header"><div><div class="modal-title">PDF analysis · ' + esc(item.title) + '</div><p class="text-xs text-muted">' + fmt(summary.word_count) + ' words analyzed</p></div><button class="modal-close" id="closePdfSummary">\u2715</button></div>' +
    '<div class="modal-body"><div class="modal-field-value" style="white-space:pre-wrap;line-height:1.7">' + esc(summary.summary) + '</div>' +
    '<h3 style="color:var(--ice-white);margin-top:1.25rem">Key findings</h3><ul class="pdf-findings">' + (summary.key_findings || []).map(function (finding) { return '<li>' + esc(finding) + '</li>'; }).join("") + '</ul>' +
    '<div class="hashtag-row">' + (summary.key_topics || []).map(function (topic) { return '<span class="hashtag">' + esc(topic) + '</span>'; }).join("") + '</div></div>' +
    '<div class="modal-footer"><button class="btn btn-ghost btn-sm" id="openPdfItem">Repository record</button><button class="btn btn-primary btn-sm" id="downloadPdf">Open PDF</button></div></div>';
  document.body.appendChild(div); document.body.style.overflow = "hidden";
  div.addEventListener("click", function (e) { if (e.target === div) closeModal("pdfSummaryModal"); });
  document.getElementById("closePdfSummary").onclick = function () { closeModal("pdfSummaryModal"); };
  document.getElementById("downloadPdf").onclick = function () { window.open(API_BASE + item.file_url, "_blank", "noopener"); };
  document.getElementById("openPdfItem").onclick = function () { closeModal("pdfSummaryModal"); openItemModal(item.id); };
}

function closeModal(id) {
  var el = document.getElementById(id);
  if (el) { el.style.animation = "fadeIn 0.2s ease reverse"; setTimeout(function () { el.remove(); document.body.style.overflow = ""; }, 180); }
}

// --- AI CONTENT GENERATOR ---
async function generateContent() {
  if (state.isGenerating) return;
  var topic = document.getElementById("aiTopic").value.trim();
  var platform = document.getElementById("aiPlatform").value;
  var tone = document.getElementById("aiTone").value;
  if (!topic) { showToast("Please enter a research topic first.", "error"); document.getElementById("aiTopic").focus(); return; }
  state.isGenerating = true;
  var btn = document.getElementById("generateBtn"); btn.disabled = true; btn.textContent = "Generating...";
  var out = document.getElementById("aiOutput");
  out.innerHTML = '<div class="ai-output"><div style="text-align:center;padding:1.5rem"><div class="thinking-dots" style="display:inline-flex;align-items:center;gap:4px;margin-bottom:0.75rem"><span></span><span></span><span></span></div><p class="text-muted text-sm">Generating your ' + esc(platform) + ' post...</p></div></div>';
  out.classList.remove("hidden");
  try {
    await checkBackend();
    if (!state.backendOnline) throw new Error("Start the PolarConnect backend to generate content.");
    var result = await apiFetch("/api/generate-content", {method: "POST", body: JSON.stringify({topic: topic, platform: platform, tone: tone})});
    state.aiOutput = result; renderAIOutput(result);
  } catch (e) {
    out.innerHTML = '<div class="ai-output text-sm" style="color:var(--danger)">' + esc(e.message) + '</div>';
  } finally {
    state.isGenerating = false; btn.disabled = false; btn.innerHTML = "\u2728 Generate Media Post";
  }
}

function renderAIOutput(r) {
  var out = document.getElementById("aiOutput"); var over = r.char_count > r.char_limit;
  out.innerHTML = '<div class="ai-output">' +
    '<div class="ai-output-header"><div style="display:flex;align-items:center;gap:0.75rem"><div><div style="font-weight:700;color:var(--ice-white)">' + esc(r.platform) + ' Post</div>' +
    '<div class="text-xs text-muted">' + esc(r.tone) + ' tone - Generated ' + new Date(r.generated_at).toLocaleTimeString() + '</div></div></div>' +
    '<div style="display:flex;gap:0.5rem"><button class="btn btn-outline btn-sm" id="copyBtn">\uD83D\uDCCB Copy</button><button class="btn btn-ghost btn-sm" id="regenBtn">\uD83D\uDD04 Regenerate</button></div></div>' +
    '<div class="ai-output-content" id="aiContentText">' + esc(r.content) + '</div>' +
    '<div class="char-counter' + (over ? ' over' : '') + '">' + r.char_count + ' / ' + r.char_limit + ' characters' + (over ? ' - Over limit' : ' \u2713') + '</div>' +
    '<div class="hashtag-row"><span class="text-xs text-muted" style="align-self:center">Suggested tags:</span>' + r.hashtags.map(function (h) { return '<span class="hashtag">' + esc(h) + '</span>'; }).join("") + '</div></div>';
  document.getElementById("copyBtn").onclick = copyAIContent;
  document.getElementById("regenBtn").onclick = generateContent;
}

function copyAIContent() {
  var el = document.getElementById("aiContentText"); if (!el) return;
  navigator.clipboard.writeText(el.textContent).then(function () { showToast("Copied to clipboard!", "success"); }).catch(function () {
    var r = document.createRange(); r.selectNodeContents(el); window.getSelection().removeAllRanges(); window.getSelection().addRange(r); document.execCommand("copy"); window.getSelection().removeAllRanges(); showToast("Copied!", "success");
  });
}

// --- POLARAI REPOSITORY CHAT ---
function renderPolarChat(loading) {
  var box = document.getElementById("polarChatMessages");
  if (!state.chatMessages.length) {
    box.innerHTML = '<div class="text-sm text-muted">Ask about research, stations, expeditions, datasets, or uploaded PDFs in the repository.</div>';
    return;
  }
  box.innerHTML = state.chatMessages.map(function (message) {
    var cls = message.role === "user" ? "chat-user" : (message.role === "error" ? "chat-error" : "chat-assistant");
    var sources = (message.sources || []).map(function (source) {
      return '<button class="chip" onclick="openItemModal(' + Number(source.id) + ')">' + esc(source.title) + '</button>';
    }).join("");
    return '<div class="chat-message ' + cls + '">' + esc(message.content) + (sources ? '<div class="chat-sources"><span class="text-xs text-muted">Sources:</span> ' + sources + '</div>' : '') + '</div>';
  }).join("") + (loading ? '<div class="chat-message chat-assistant"><span class="thinking-dots"><span></span><span></span><span></span></span> Searching repository…</div>' : '');
  box.scrollTop = box.scrollHeight;
}

async function sendPolarMessage() {
  if (state.chatBusy) return;
  var input = document.getElementById("polarChatInput");
  var question = input.value.trim();
  if (!question) { input.focus(); return; }
  state.chatBusy = true; state.chatMessages.push({role: "user", content: question}); input.value = "";
  var btn = document.getElementById("polarChatSend"); btn.disabled = true; btn.textContent = "Searching…";
  renderPolarChat(true);
  try {
    await checkBackend();
    if (!state.backendOnline) throw new Error("Start the PolarConnect backend to search the repository.");
    var history = state.chatMessages.slice(0, -1).filter(function (message) { return message.role === "user" || message.role === "assistant"; }).slice(-8);
    var result = await apiFetch("/api/chat", {method: "POST", body: JSON.stringify({message: question, history: history})});
    state.chatMessages.push({role: "assistant", content: result.answer, sources: result.sources || []});
  } catch (e) {
    state.chatMessages.push({role: "error", content: e.message || "PolarAI could not complete this request."});
  } finally {
    state.chatBusy = false; btn.disabled = false; btn.textContent = "Ask"; renderPolarChat(false);
  }
}

// --- STUDENT LEARNING QUIZ ---
async function startQuiz() {
  var topic = document.getElementById("quizTopic").value.trim();
  var output = document.getElementById("quizOutput");
  if (!topic) { showToast("Enter a repository topic for the quiz.", "error"); return; }
  var btn = document.getElementById("quizStartBtn"); btn.disabled = true; btn.textContent = "Creating…";
  output.classList.remove("hidden"); output.innerHTML = '<div class="loading-spinner"><div class="spinner"></div><span>Preparing repository-based questions…</span></div>';
  try {
    await checkBackend();
    if (!state.backendOnline) throw new Error("Start the PolarConnect backend to create a repository-based quiz.");
    state.quiz = await apiFetch("/api/quiz", {method: "POST", body: JSON.stringify({topic: topic, count: parseInt(document.getElementById("quizCount").value, 10)})});
    state.quizIndex = 0; state.quizChoice = null; state.quizChecked = false; state.quizScore = 0;
    renderQuiz();
  } catch (e) {
    output.innerHTML = '<div class="ai-output text-sm" style="color:var(--danger)">' + esc(e.message) + '</div>';
  } finally {
    btn.disabled = false; btn.textContent = "Generate quiz";
  }
}

function renderQuiz() {
  var output = document.getElementById("quizOutput"); output.classList.remove("hidden");
  if (!state.quiz || state.quizIndex >= state.quiz.questions.length) {
    output.innerHTML = '<div class="ai-output"><h3 style="color:var(--ice-white)">Quiz complete</h3><p class="text-sm">You answered ' + state.quizScore + ' of ' + state.quiz.questions.length + ' correctly.</p></div>';
    return;
  }
  var question = state.quiz.questions[state.quizIndex];
  output.innerHTML = '<div class="ai-output"><div class="text-xs text-muted">Question ' + (state.quizIndex + 1) + ' of ' + state.quiz.questions.length + '</div>' +
    '<h3 class="quiz-question">' + esc(question.question) + '</h3><div class="quiz-options">' + question.options.map(function (option, index) {
      var cls = "quiz-option" + (state.quizChoice === index ? " selected" : "") + (state.quizChecked && index === question.correct_index ? " correct" : "") + (state.quizChecked && index === state.quizChoice && index !== question.correct_index ? " incorrect" : "");
      return '<button type="button" class="' + cls + '" ' + (state.quizChecked ? "disabled" : "") + ' onclick="selectQuizAnswer(' + index + ')">' + esc(option) + '</button>';
    }).join("") + '</div>' +
    (state.quizChecked ? '<div class="quiz-feedback"><strong>' + (state.quizChoice === question.correct_index ? 'Correct.' : 'Review this answer.') + '</strong> ' + esc(question.explanation) + '<div class="text-xs text-muted" style="margin-top:0.5rem">Source: ' + esc(question.source.title) + '</div></div>' : '') +
    '<div style="display:flex;justify-content:flex-end;margin-top:1rem">' +
    (state.quizChecked ? '<button class="btn btn-primary btn-sm" onclick="nextQuizQuestion()">' + (state.quizIndex + 1 === state.quiz.questions.length ? 'See result' : 'Next question') + ' →</button>' : '<button class="btn btn-primary btn-sm" ' + (state.quizChoice === null ? 'disabled' : '') + ' onclick="checkQuizAnswer()">Check answer</button>') +
    '</div></div>';
}

function selectQuizAnswer(index) { if (!state.quizChecked) { state.quizChoice = index; renderQuiz(); } }
function checkQuizAnswer() {
  if (state.quizChoice === null || state.quizChecked) return;
  state.quizChecked = true;
  if (state.quizChoice === state.quiz.questions[state.quizIndex].correct_index) state.quizScore += 1;
  renderQuiz();
}
function nextQuizQuestion() { state.quizIndex += 1; state.quizChoice = null; state.quizChecked = false; renderQuiz(); }

// --- INTERACTIVE POLAR STATION MAP ---
var POLAR_STATIONS = [
  {name: "Maitri", hemisphere: "south", lat: -70.75, lon: 11.73, coords: "70°45′S, 11°44′E"},
  {name: "Bharati", hemisphere: "south", lat: -69.40, lon: 76.18, coords: "69°24′S, 76°11′E"},
  {name: "Himadri", hemisphere: "north", lat: 78.92, lon: 11.93, coords: "78°55′N, 11°56′E"}
];
var polarHemisphere = "south";

function setPolarHemisphere(hemisphere) {
  polarHemisphere = hemisphere;
  document.getElementById("southMapBtn").classList.toggle("active", hemisphere === "south");
  document.getElementById("northMapBtn").classList.toggle("active", hemisphere === "north");
  renderPolarMap();
  var first = POLAR_STATIONS.find(function (station) { return station.hemisphere === hemisphere; });
  if (first) showPolarStation(first.name);
}

function renderPolarMap() {
  var svg = document.getElementById("polarMapSvg"); if (!svg) return;
  var cx = 300, cy = 190, edge = 145;
  var latitudes = polarHemisphere === "south" ? [60, 70, 80] : [60, 70, 80];
  var lines = '<rect x="0" y="0" width="600" height="400" rx="12" fill="rgba(15,23,42,0.72)" />' +
    '<text x="300" y="28" text-anchor="middle" class="map-title">' + (polarHemisphere === "south" ? 'ANTARCTIC POLAR VIEW' : 'ARCTIC POLAR VIEW') + '</text>';
  latitudes.forEach(function (latitude) {
    var r = (90 - latitude) / 30 * edge;
    lines += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" class="map-grid-ring" />' +
      '<text x="' + (cx + 5) + '" y="' + (cy - r + 13) + '" class="map-grid-label">' + latitude + '° ' + (polarHemisphere === "south" ? 'S' : 'N') + '</text>';
  });
  for (var lon = 0; lon < 360; lon += 30) {
    var angle = (polarHemisphere === "south" ? -lon : lon) * Math.PI / 180;
    var x = cx + edge * Math.sin(angle), y = cy - edge * Math.cos(angle);
    lines += '<line x1="' + cx + '" y1="' + cy + '" x2="' + x.toFixed(1) + '" y2="' + y.toFixed(1) + '" class="map-grid-line" />';
    var tx = cx + (edge + 17) * Math.sin(angle), ty = cy - (edge + 17) * Math.cos(angle) + 4;
    lines += '<text x="' + tx.toFixed(1) + '" y="' + ty.toFixed(1) + '" text-anchor="middle" class="map-grid-label">' + lon + '°</text>';
  }
  lines += '<circle cx="' + cx + '" cy="' + cy + '" r="4" class="map-pole" /><text x="' + cx + '" y="' + (cy + 20) + '" text-anchor="middle" class="map-grid-label">' + (polarHemisphere === "south" ? 'South Pole' : 'North Pole') + '</text>';
  POLAR_STATIONS.filter(function (station) { return station.hemisphere === polarHemisphere; }).forEach(function (station) {
    var r = (90 - Math.abs(station.lat)) / 30 * edge;
    var angle = (polarHemisphere === "south" ? -station.lon : station.lon) * Math.PI / 180;
    var x = cx + r * Math.sin(angle), y = cy - r * Math.cos(angle);
    lines += '<g class="map-station" role="button" tabindex="0" aria-label="' + esc(station.name + ' Station, ' + station.coords) + '" onclick="showPolarStation(\'' + station.name + '\')" onkeydown="if(event.key===\'Enter\'||event.key===\' \'){showPolarStation(\'' + station.name + '\')}" style="cursor:pointer">' +
      '<title>' + esc(station.name + ' Station · ' + station.coords) + '</title><circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="8" class="map-marker" />' +
      '<text x="' + (x + 12).toFixed(1) + '" y="' + (y + 4).toFixed(1) + '" class="map-station-label">' + esc(station.name) + '</text></g>';
  });
  svg.innerHTML = lines;
}

function showPolarStation(name) {
  var station = POLAR_STATIONS.find(function (item) { return item.name === name; });
  if (!station) return;
  document.getElementById("polarMapDetails").innerHTML = '<strong style="color:var(--ice-white)">' + esc(station.name) + ' Station</strong> · ' + esc(station.coords) + ' <span class="text-muted">· Select a marker or hemisphere to explore station locations.</span>';
}

// --- FILTER & SEARCH ---
function setCategory(cat) {
  state.activeCategory = cat;
  document.querySelectorAll("#repository .filter-chips .chip").forEach(function (c) { c.classList.toggle("active", c.dataset.cat === cat); });
  loadRepository();
}
var _st;
function onSearch(q) { clearTimeout(_st); state.searchQuery = q; _st = setTimeout(loadRepository, 350); }

// --- GALLERY ---
// Real Unsplash photos — each URL is a specific polar/Arctic/Antarctic themed image
var GALLERY = [
  {l: "Maitri Station",      s: "Queen Maud Land, Antarctica",     bg: "linear-gradient(135deg,#0F172A,#0284C7)", img: "https://images.unsplash.com/photo-1589802931095-6fee9c3a6a31?w=800&h=600&fit=crop&auto=format&q=80"},
  {l: "Bharati Research Lab",s: "Larsemann Hills, East Antarctica", bg: "linear-gradient(135deg,#0F172A,#0EA5E9)", img: "https://images.unsplash.com/photo-1532094344901-23c4b8e74097?w=800&h=600&fit=crop&auto=format&q=80"},
  {l: "Ice Core Sampling",   s: "400m deep glacial drilling",       bg: "linear-gradient(135deg,#0F172A,#38BDF8)", img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop&auto=format&q=80"},
  {l: "Southern Ocean",      s: "45\u00b0E Transect, 60\u00b0S",   bg: "linear-gradient(135deg,#0F172A,#0369A1)", img: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=800&h=600&fit=crop&auto=format&q=80"},
  {l: "Penguin Colony",      s: "Prydz Bay, Bharati vicinity",      bg: "linear-gradient(135deg,#1E293B,#0284C7)", img: "https://images.unsplash.com/photo-1551986782-d0169b3f8fa7?w=800&h=600&fit=crop&auto=format&q=80"},
  {l: "Aurora Australis",    s: "Maitri Station, June 2024",        bg: "linear-gradient(135deg,#0F172A,#4C1D95)", img: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&h=600&fit=crop&auto=format&q=80"},
  {l: "Himadri Station",     s: "Ny-\u00c5lesund, Svalbard, Arctic",bg: "linear-gradient(135deg,#0F172A,#0F766E)", img: "https://images.unsplash.com/photo-1547721064-da6cfb341d50?w=800&h=600&fit=crop&auto=format&q=80"},
  {l: "Arctic Fox",          s: "Near Himadri, Svalbard",           bg: "linear-gradient(135deg,#1E293B,#0F766E)", img: "https://images.unsplash.com/photo-1520038408219-1544b93745d1?w=800&h=600&fit=crop&auto=format&q=80"},
  {l: "MV Vasudhara",        s: "Research vessel, Southern Ocean",  bg: "linear-gradient(135deg,#0F172A,#1D4ED8)", img: "https://images.unsplash.com/photo-1506905493538-73593ba02d1c?w=800&h=600&fit=crop&auto=format&q=80"},
  {l: "Permafrost Monitoring",s: "Arctic sensor array, Svalbard",   bg: "linear-gradient(135deg,#1E293B,#0284C7)", img: "https://images.unsplash.com/photo-1516912481800-cf3bcee27a39?w=800&h=600&fit=crop&auto=format&q=80"},
  {l: "Glacial Retreat",     s: "Satellite imagery 2010 vs 2024",   bg: "linear-gradient(135deg,#0F172A,#0E7490)", img: "https://images.unsplash.com/photo-1525490829609-d166ddb58678?w=800&h=600&fit=crop&auto=format&q=80"},
  {l: "Blizzard Conditions", s: "Wind speed 90 km/h, Maitri",       bg: "linear-gradient(135deg,#1E293B,#1E40AF)", img: "https://images.unsplash.com/photo-1467657726966-be2bb6f5e7fc?w=800&h=600&fit=crop&auto=format&q=80"},
];
function renderGallery() {
  var g = document.getElementById("galleryGrid");
  g.innerHTML = GALLERY.map(function (item) {
    return '<div class="gallery-item" onclick="showToast(\'' + item.l.replace(/'/g, "") + ' - High-res image available in Media Repository\',\'info\')">' +
      '<div class="gallery-img" style="background:' + item.bg + ';position:relative;overflow:hidden;">' +
        '<img src="' + item.img + '" alt="' + esc(item.l) + '" loading="lazy" ' +
          'style="width:100%;height:100%;object-fit:cover;display:block;position:absolute;top:0;left:0;" ' +
          'onerror="this.style.display=\'none\'" />' +
      '</div>' +
      '<div class="gallery-overlay"><div class="gallery-label">' + esc(item.l) + '</div><div class="gallery-sub">' + esc(item.s) + '</div></div></div>';
  }).join("");
}

// --- NAV ---
function scrollToSection(id) { var el = document.getElementById(id); if (el) el.scrollIntoView({behavior: "smooth", block: "start"}); }
function initScrollSpy() {
  var secs = ["repository", "ai-generator", "gallery", "events"];
  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { document.querySelectorAll(".nav-links a").forEach(function (a) { a.classList.toggle("active", a.dataset.section === e.target.id); }); } });
  }, {threshold: 0.3});
  secs.forEach(function (id) { var el = document.getElementById(id); if (el) obs.observe(el); });
}

// --- INIT ---
document.addEventListener("DOMContentLoaded", function () {
  renderGallery(); loadStats(); loadRepository(); loadEvents(); initScrollSpy();
  renderPolarMap(); showPolarStation("Maitri");
  checkBackend().then(function () { if (state.backendOnline) { loadStats(); loadRepository(); loadEvents(); } });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") { ["itemModal", "uploadModal", "pdfSummaryModal"].forEach(function (id) { if (document.getElementById(id)) closeModal(id); }); } });
  var ai = document.getElementById("aiTopic");
  if (ai) { ai.addEventListener("keydown", function (e) { if (e.key === "Enter") generateContent(); }); }
  var chatInput = document.getElementById("polarChatInput");
  if (chatInput) { chatInput.addEventListener("keydown", function (e) { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendPolarMessage(); } }); }
  console.log("NCPOR PolarConnect Portal SIH 2026 - Initialised (offline-capable)");
});
