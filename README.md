# 🎬 Lumina Studio: AI Video Factory V2.0

> [!IMPORTANT]
> **Production Status:** `v2.0_STABLE_NODE` | **Architecture:** `Dual_Service_Hybrid` (Next.js + FastAPI)

Lumina Studio is an enterprise-grade AI video orchestration factory designed to transform narrative content into cinematic short-form video assets. Built on the **Lumina Protocol**, it leverages multiple AI clusters (Gemini, OpenAI, ElevenLabs, Fal.ai) to automate script generation, visual synthesis, and final assembly.

---

## 🛠️ Repository Architecture

Our repository follows a professional **Split-Node Architecture** to isolate production logic from the user interface:

- 📂 `/frontend`: A high-fidelity **Next.js (Turbopack)** studio dashboard.
- 📂 `/backend`: A robust **FastAPI (Python)** orchestration engine.

> [!NOTE]
> **Data Privacy & Exclusions:**
> To maintain repository efficiency, the `projects/`, `projects_vault/`, and generated `.mp4` artifacts are excluded via `.gitignore`. This ensures your GitHub remains focused on **Source Logic**, while large production binary data remains in your local environment.

---

## 🚀 Setup & Launch Protocol

### 1. Environment Synchronization
Clone the repository and synchronize your credentials:
```bash
cp .env.example .env
# Edit .env with your AI Provider Keys
```

### 2. Frontend Launch (Workshop)
```bash
cd frontend
npm install
npm run dev
```

### 3. Backend Launch (Engine)
```bash
cd backend
pip install -r requirements.txt
python main.py
```

---

## 🏗️ Technology Stack

| Cluster | Technology | Role |
| :--- | :--- | :--- |
| **Logic** | `Google Gemini 3` | Scripting & Narrative Architecture |
| **Interface** | `Next.js + Framer Motion` | Cinematic Studio Dashboard |
| **Engine** | `FastAPI + uvicorn` | Task Orchestration & Data Flux |
| **Synthesis** | `Fal.ai + ElevenLabs` | Image, Video, and Voice Production |
| **Assembly** | `FFmpeg Native` | Local Frame & Audio Composition |

---

## 📜 Development License
Standard Production License - *Designed for the Lumina Protocol.*
