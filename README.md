<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=17,20,24&height=200&section=header&text=DrapeAI&fontSize=70&fontColor=ffffff&animation=fadeIn&fontAlignY=35&desc=AI%20Virtual%20Try-On%20%7C%20Gemini%202.0%20Flash%20%2B%20Imagen%203%20%2B%20Vertex%20AI&descAlignY=58&descSize=15"/>

<br/>

![Gemini](https://img.shields.io/badge/Gemini_2.0_Flash-4285F4?style=for-the-badge&logo=google&logoColor=white)
![Vertex AI](https://img.shields.io/badge/Vertex_AI-Imagen_3-34A853?style=for-the-badge&logo=google&logoColor=white)
![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)

<br/>

> **See yourself in any outfit — before you buy it.**
> Upload a clothing image from anywhere. Upload your photo. DrapeAI puts you in it — photorealistically.

<br/>

[![GitHub stars](https://img.shields.io/github/stars/Hemkumar247/DrapeAI?style=social)](https://github.com/Hemkumar247/DrapeAI)
[![GitHub forks](https://img.shields.io/github/forks/Hemkumar247/DrapeAI?style=social)](https://github.com/Hemkumar247/DrapeAI/fork)

</div>

---

## 💡 The Problem

Online shopping has a fundamental flaw — **you can't try before you buy.**

Return rates in fashion e-commerce exceed 30%, largely because clothing looks different on a model than it does on your actual body. Size guides don't help. Flat product photos don't help. Customer reviews don't help.

**DrapeAI solves this with a 4-stage AI pipeline** garment analysis, photo validation, photorealistic try-on generation, and intelligent style captioning all in one seamless flow.

---

## 🎬 The Full Pipeline

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  STAGE 1 — GARMENT ANALYSIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  User uploads clothing image (Pinterest / Zara / H&M / any URL)
                      ↓
  Gemini 2.0 Flash Vision analyzes the garment:
  → type, color, pattern, fit, length, fabric, season
  → quality score (0.0–1.0)
  → brand detection
  → validation (rejects blurry / multi-item / non-apparel images)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  STAGE 2 — USER PHOTO VALIDATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  User uploads their full-body photo
                      ↓
  Gemini validates suitability for try-on:
  → full body visible? pose? lighting? single person?
  → returns actionable tip if photo fails
    e.g. "Step back so your full body is visible."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  STAGE 3 — PHOTOREALISTIC TRY-ON GENERATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Person image + garment image sent to Vertex AI
                      ↓
  Imagen 3 Virtual Try-On API generates result:
  → photorealistic image of user wearing the garment
  → preserves body shape, skin tone, lighting
  → supports multi-garment (top + bottom + outer)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  STAGE 4 — AI STYLE CAPTIONING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Generated try-on image sent back to Gemini
                      ↓
  Gemini writes a personal style note:
  → how the garment fits your frame
  → color and tone observations
  → styling suggestions (shoes, accessories, occasion)
```

---

## ✨ Features

```
📸 Universal Garment Input      →  Any clothing image from Pinterest, Zara, H&M, or screenshots
🧠 Gemini Garment Analysis      →  Type, color, fit, fabric, pattern, brand — structured metadata
✅ Smart Photo Validation        →  Actionable rejection tips so every user gets a usable result
🪄 Photorealistic Try-On        →  Imagen 3 on Vertex AI — not a filter, actual AI generation
👗 Multi-Garment Outfits        →  Combine top + bottom + outer for full outfit try-on
🤝 Outfit Compatibility Check   →  AI assesses if pieces work together before generation
💬 Personal Style Caption       →  Gemini writes a style note specific to your result
💾 Save & Share Looks           →  Save to wardrobe, share results, revisit anytime
```

---

## 🛠️ Tech Stack

| Layer | Technology | Role |
|---|---|---|
| **AI — Garment & Validation** | Gemini 2.0 Flash | 4-stage multimodal pipeline |
| **AI — Try-On Generation** | Imagen 3 (Vertex AI) | Photorealistic garment overlay |
| **Backend** | FastAPI (Python) | API orchestration + pipeline logic |
| **Frontend** | React Native + TypeScript | Mobile UI (iOS + Android) |
| **Auth / Database** | Firebase Auth + Firestore | User accounts + saved looks |
| **Storage** | Firebase Cloud Storage | Generated try-on images |
| **Navigation** | React Navigation | Screen flow management |

---

## 🧠 AI Architecture — 4 Gemini Roles

| Role | Trigger | Output |
|---|---|---|
| **Garment Analysis** | User uploads clothing image | Structured JSON metadata + quality score |
| **Photo Validation** | User uploads their photo | Pass/fail + actionable fix tip |
| **Outfit Compatibility** | User adds multiple garments | Compatibility score + styling tip |
| **Style Captioning** | After try-on image generated | 2–3 sentence personal style note |

---

## 📱 Screen Flow

```
HomeScreen
    ├── [+ New Try-On]
    │       ↓
    │   AddGarmentScreen  →  Gemini garment analysis  →  metadata card
    │       ↓
    │   AddUserPhotoScreen  →  Gemini validation  →  pass or tip
    │       ↓
    │   GeneratingScreen
    │       → "Uploading your images..."     (0–25%)
    │       → "Reading your outfit..."       (25–50%)
    │       → "Draping your look..."         (50–85%)
    │       → "Adding final touches..."      (85–100%)
    │       ↓
    │   ResultScreen  →  try-on image + style caption
    │       ├── Save Look
    │       ├── Share
    │       ├── Try Another
    │       └── Find to Buy
    │
    ├── [My Wardrobe]  →  saved garment library
    └── [Saved Looks]  →  generated try-on history
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+
- Google Gemini API key
- Google Cloud project with Vertex AI enabled
- Firebase project (Auth + Firestore + Storage)

### Backend Setup

```bash
# 1. Clone the repo
git clone https://github.com/Hemkumar247/DrapeAI.git
cd DrapeAI/backend

# 2. Install Python dependencies
pip install -r requirements.txt

# 3. Configure environment
cp .env.example .env
# Add: GEMINI_API_KEY, GOOGLE_CLOUD_PROJECT, Firebase credentials

# 4. Authenticate with Google Cloud
gcloud auth application-default login

# 5. Start the FastAPI server
uvicorn main:app --reload
```

### Frontend Setup

```bash
cd DrapeAI/frontend

# Install dependencies
npm install

# Start the app
npx react-native run-android
# or
npx react-native run-ios
```

### API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/analyze-garment` | Gemini garment metadata extraction |
| `POST` | `/validate-user-photo` | Gemini photo suitability check |
| `POST` | `/check-outfit-compatibility` | Multi-garment compatibility check |
| `POST` | `/generate-tryon` | Imagen 3 try-on generation |
| `POST` | `/caption-result` | Gemini style note generation |
| `GET` | `/wardrobe/:userId` | Fetch saved garments |
| `POST` | `/save-look` | Save generated look to Firestore |
| `GET` | `/health` | API health + Gemini connectivity check |

---

## 💰 Cost Per Try-On Session

| Service | Cost (estimate) |
|---|---|
| Gemini 2.0 Flash (4 calls) | ~$0.001 |
| Imagen 3 Virtual Try-On | ~$0.04–0.08 |
| Firebase (early stage) | Free tier |
| **Total per session** | **~$0.05–0.12** |

---

## 🔮 Roadmap

- [ ] Live deployment (Vercel + Cloud Run)
- [ ] "Find to Buy" — reverse image search to purchase the exact item
- [ ] Size recommendation based on body proportions
- [ ] Social sharing with branded DrapeAI watermark
- [ ] Trending looks feed
- [ ] Browser extension — try-on from any product page

---

## 🤝 Contributing

Pull requests and ideas welcome.
Open an [issue](https://github.com/Hemkumar247/DrapeAI/issues) for bugs, features, or collaboration.

---

## 🧑‍💻 Built by

**Hem Kumar** — AI + Full-Stack Developer, Chennai 🇮🇳

Pushing AI into spaces where it genuinely changes how people make decisions.

[![LinkedIn](https://img.shields.io/badge/LinkedIn-hemkumarvitta-0A66C2?style=flat-square&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/hemkumarvitta)
[![GitHub](https://img.shields.io/badge/GitHub-Hemkumar247-181717?style=flat-square&logo=github&logoColor=white)](https://github.com/Hemkumar247)
[![Gmail](https://img.shields.io/badge/Email-hemkumarvitta%40gmail.com-D14836?style=flat-square&logo=gmail&logoColor=white)](mailto:hemkumarvitta@gmail.com)

---

<div align="center">

⭐ **If DrapeAI made you rethink how AI fits into fashion — drop a star.**

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=17,20,24&height=100&section=footer"/>

</div>
