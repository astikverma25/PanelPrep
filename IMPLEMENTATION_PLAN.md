# GD Arena: Senior Developer Implementation Plan & Architecture Blueprint

**Product:** GD Arena (Voice-First Group Discussion Practice Room with AI Participants)  
**Hackathon Target:** 24-Hour Build Window  
**Architecture Paradigm:** Client-side Floor Orchestrator + Stateless Edge API Routes + Multi-Provider LLM Fallbacks

---

## 1. Architectural Blueprint & Data Flow

```
                      +-------------------------------------------------------------+
                      |                      CLIENT (Browser)                       |
                      |                                                             |
                      |  [ UI & Audio Engine ] <-------> [ Zustand Session Store ]  |
                      |          |                               |                  |
                      |  - Web Speech STT                        |                  |
                      |  - Browser / Cloud TTS                   |                  |
                      |  - Audio Analyser (VAD)                  |                  |
                      |          |                               |                  |
                      |          v                               v                  |
                      |  +-------------------------------------------------------+  |
                      |  |             Floor State Machine & Engine              |  |
                      |  | - States: IDLE, STUDENT_SPEAKING, AI_SPEAKING...     |  |
                      |  | - Instant Barge-In (<150ms audio stop & abort)        |  |
                      |  | - Bidding Engine (Urge Score Calculation)             |  |
                      |  | - 2-Turn AI-to-AI Cap & Dead-Air Detection            |  |
                      |  +-------------------------------------------------------+  |
                      |                              |                              |
                      |                              | HTTPS / SSE                  |
                      +------------------------------|------------------------------+
                                                     |
                                                     v
                      +-------------------------------------------------------------+
                      |                 STATELESS API ROUTE LAYER                   |
                      +-------------------------------------------------------------+
                      |                                                             |
                      |  POST /api/turn       -> Streaming Persona Turn (SSE)       |
                      |  POST /api/report     -> Strict Rubric & Evidence Validator |
                      |  POST /api/moderate   -> Topic Safety & Sensitivity Check   |
                      |  POST /api/tts        -> Optional Tier-B Cloud Audio Proxy  |
                      |                                                             |
                      +-------------------------------------------------------------+
                                                     |
                                                     v
                      +-------------------------------------------------------------+
                      |                      LLM PROVIDER TIER                      |
                      +-------------------------------------------------------------+
                      |  Primary: Groq (Llama 3.3 70B) / Gemini 1.5 Flash (TTFT <400ms)
                      |  Fallback: Gemini / OpenAI (Triggered on >4s timeout/error) |
                      |  Fail-Safe: Canned Persona Safe Lines                       |
                      +-------------------------------------------------------------+
```

---

## 2. Production Folder Structure

```
gd-arena/
├── .env.example                     # Production environment variable specifications
├── .gitignore                       # Clean gitignore excluding keys, dist, and modules
├── package.json                     # Core dependencies (Next 14/15, Zustand, Zod, Lucide, Tailwind)
├── tsconfig.json                    # Strict TypeScript configuration
├── tailwind.config.ts               # Custom palette & micro-animation tokens
├── next.config.mjs                  # Edge optimization and CSP headers
├── public/                          # Static assets and persona avatars
│   └── avatars/                     # Dr. Nair, Arjun, Meera, Kabir, Sana, Rohan
├── src/
│   ├── app/
│   │   ├── layout.tsx               # Root layout with SEO meta & accessibility provider
│   │   ├── page.tsx                 # Landing screen + Room Setup + Patience config
│   │   ├── globals.css              # Glassmorphism, animations, custom scrollbars
│   │   ├── room/
│   │   │   └── page.tsx             # Live Discussion Arena (Floor UI, Timer, Captions)
│   │   ├── report/
│   │   │   └── page.tsx             # Post-session Analytics & Evidence-backed Report
│   │   ├── history/
│   │   │   └── page.tsx             # Local IndexedDB session history & progress tracker
│   │   └── api/
│   │       ├── turn/
│   │       │   └── route.ts         # SSE streaming turn generation with LLM fallback
│   │       ├── report/
│   │       │   └── route.ts         # Post-GD evaluation & quote verification engine
│   │       ├── moderate/
│   │       │   └── route.ts         # Topic moderation validator
│   │       └── tts/
│   │           └── route.ts         # Cloud TTS proxy (Tier B)
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.tsx           # Navigation, status, and theme controls
│   │   │   ├── Footer.tsx           # AI disclosure notice & copyright
│   │   │   ├── Badge.tsx            # AI badge indicator & status tags
│   │   │   ├── Button.tsx           # Accessible button with states
│   │   │   └── Modal.tsx            # Accessible dialog modal
│   │   ├── setup/
│   │   │   ├── TopicSelector.tsx    # Topic chips + Custom topic input with validation
│   │   │   ├── PanelSelector.tsx    # Panel size (3 to 5 personas) selector
│   │   │   ├── PatienceSlider.tsx   # Silence threshold slider (600ms - 2500ms)
│   │   │   └── MicCheckModal.tsx    # VAD meter, permission check, and text mode toggle
│   │   ├── room/
│   │   │   ├── ArenaStage.tsx       # Circular / grid participant cards layout
│   │   │   ├── ParticipantCard.tsx  # Dynamic card (active glow, waveform, avatar, role)
│   │   │   ├── AudioWaveform.tsx    # Real-time WebAudio visualizer
│   │   │   ├── LiveCaptions.tsx     # Low-latency streaming captions banner
│   │   │   ├── TranscriptDrawer.tsx # Real-time chronological speech log
│   │   │   ├── RoomControls.tsx     # Mic toggle, leave button, text input fallback
│   │   │   ├── NudgeToast.tsx       # Silent encouragement toast (e.g. inactive >2 min)
│   │   │   └── DebugOverlay.tsx     # Bidding scores, latency metrics, state viewer
│   │   └── report/
│   │       ├── StatsOverview.tsx    # WPM, talk share, filler words, interruptions
│   │       ├── TalkShareBar.tsx     # Multi-colored segment breakdown bar
│   │       ├── DimensionCard.tsx    # 6-dimension breakdown with score anchors
│   │       ├── EvidenceChip.tsx     # Interactive quote chip linking to transcript
│   │       ├── MissedOpenings.tsx   # "What you could have said" timeline markers
│   │       └── InteractiveTranscript.tsx # Transcript with instant highlight on quote click
│   ├── lib/
│   │   ├── types/
│   │   │   ├── arena.ts             # Session, FloorState, Segment, TurnEvent types
│   │   │   ├── personas.ts          # Persona profile, voice spec, bidding weights
│   │   │   ├── report.ts            # Report schema, dimension, evidence quote types
│   │   │   └── api.ts               # TurnRequest, ReportRequest, ModerateRequest
│   │   ├── orchestrator/
│   │   │   ├── floorStateMachine.ts # Finite state machine managing floor control
│   │   │   ├── biddingEngine.ts     # Urge score calculator & speaker picker
│   │   │   ├── turnIntent.ts        # Dynamic intent selection (challenge, extend, etc.)
│   │   │   └── timerManager.ts      # Discussion phases (Prep, Opening, Live, Closing)
│   │   ├── speech/
│   │   │   ├── sttService.ts        # Web Speech API wrapper with auto-restart
│   │   │   ├── ttsService.ts        # Browser SpeechSynthesis + voice selector
│   │   │   ├── vadDetector.ts       # WebAudio Analyser for voice activity & levels
│   │   │   └── echoFilter.ts        # Heuristic filter to ignore speaker feedback
│   │   ├── ai/
│   │   │   ├── llmClient.ts         # Multi-provider client (Groq / Gemini / OpenAI)
│   │   │   ├── prompts.ts           # Persona prompts, moderator scripts, rubric
│   │   │   ├── evidenceValidator.ts # Substring verification & hallucination scrubber
│   │   │   └── statsCalculator.ts   # Deterministic stats (WPM, gaps, talk share)
│   │   ├── storage/
│   │   │   └── indexedDb.ts         # Zero-backend client storage for sessions & stats
│   │   └── constants/
│   │       ├── personas.ts          # Dr. Nair, Arjun, Meera, Kabir, Sana, Rohan
│   │       ├── topics.ts            # Pre-curated campus placement GD topics
│   │       └── rubrics.ts           # 6-dimension evaluation benchmarks
│   └── hooks/
│       ├── useOrchestrator.ts       # React hook binding UI to Floor State Machine
│       ├── useSpeechRecognition.ts  # Live speech transcription hook
│       ├── useSpeechSynthesis.ts    # Sentence-by-sentence audio queue hook
│       ├── useAudioLevel.ts         # Mic input level hook
│       └── useSessionStore.ts       # Zustand state management
└── scripts/
    └── simulate-gd.ts               # Headless simulation harness for test runs
```

---

## 3. Phase-Wise Implementation Timeline (24 Hours)

### **Phase 1: Foundation & Vertical Slice (Hours 0 – 4)**
- **Goal:** Single end-to-end flow (Student speaks -> Transcription -> 1 AI responds via audio).
- **Deliverables:**
  1. Next.js App Router scaffold with TypeScript and Tailwind CSS.
  2. Core Type Definitions (`arena.ts`, `personas.ts`, `report.ts`).
  3. Persona definitions (Dr. Nair, Arjun, Meera, Kabir, Sana, Rohan).
  4. Web Speech STT integration (`useSpeechRecognition`) with auto-reconnect.
  5. Browser TTS audio queue (`useSpeechSynthesis`) splitting sentences.
  6. `/api/turn` route with Groq / Gemini streaming integration.
  7. Basic Room UI with active speaker highlight.

### **Phase 2: Multi-Persona Orchestrator & Bidding Engine (Hours 4 – 8)**
- **Goal:** Full panel discussion with natural turn-taking ready for **Round 1 Demo**.
- **Deliverables:**
  1. Floor State Machine (`IDLE`, `STUDENT_SPEAKING`, `AI_THINKING`, `AI_SPEAKING`, `CLOSING`).
  2. Bidding Engine implementing Urge Score formula.
  3. Instant Barge-In (<150ms cancellation of speech synthesis and LLM stream abort).
  4. 2-AI Turn Cap & Dead-Air recovery (6s trigger).
  5. Moderator script phases (20s Prep, Opening, 50% Time Check, 1m Closing Round).
  6. Setup Screen (Topic selection, Custom topic, Panel size 3-5, Patience slider).
  7. Mic Check Modal with VAD volume meter and Typing Mode fallback.

### **Phase 3: Deterministic Analytics & Evidence-Validated Report (Hours 8 – 12)**
- **Goal:** Robust post-session reporting where every feedback point cites a real quote.
- **Deliverables:**
  1. Deterministic Stats Engine (`statsCalculator.ts`: Talk share, WPM, Interruptions, Fillers).
  2. `/api/report` LLM route with structured JSON schema.
  3. Evidence Verification Engine (`evidenceValidator.ts`: drops hallucinated quotes).
  4. Report UI: Stats cards, Talk-share multi-color bar, 6-Dimension Feedback cards.
  5. Interactive Quote Chips scrolling directly to matching transcript lines.
  6. IndexedDB storage layer (`indexedDb.ts`) to persist user session history.

### **Phase 4: Polish, Failure Hardening & Advanced Features (Hours 12 – 16)**
- **Goal:** Elevate UX, add differentiators, and guarantee bulletproof reliability.
- **Deliverables:**
  1. **Feature S1:** "What you could have said" replay suggestions on missed openings.
  2. **Feature S2:** Silent real-time nudges for inactive participants.
  3. **Feature S3:** Dynamic patience slider affecting speech merge threshold.
  4. Echo mitigation heuristic (filters recognized text matching active AI speech).
  5. Multi-provider LLM fallback (`Groq -> Gemini -> Canned lines`).
  6. Offline & network loss banner with session pause/resume.
  7. Full Accessibility pass (WCAG AA contrast, keyboard navigation, live captions).

### **Phase 5: Simulation, Soak Testing & Demo Prep (Hours 16 – 20)**
- **Goal:** Zero crashes, verified latency budgets, and polished presentation assets.
- **Deliverables:**
  1. Run `simulate-gd.ts` simulation harness across 20 automated iterations.
  2. Back-to-back 8-minute soak tests on mobile and desktop browsers.
  3. Debug Overlay (`Shift + D`) displaying live bidding scores and LLM latency.
  4. Comprehensive README.md formatted according to hackathon submission rules.
  5. Pre-warm script and backup demo video recording.

### **Phase 6: Buffer & Final Rehearsals (Hours 20 – 24)**
- **Goal:** Final deploy verification and pitch rehearsal.
- **Deliverables:**
  1. Production Vercel deploy verification and environment variable lock.
  2. Double rehearsal of the 3-minute Round 1 and 6-minute Final demo scripts.

---

## 4. Key Engineering Safeguards

| Component | Technical Implementation |
| :--- | :--- |
| **Instant Barge-In** | Client-side `SpeechRecognition.onspeechstart` triggers `window.speechSynthesis.cancel()` immediately and aborts the in-flight `fetch` `AbortController` in under 150ms. |
| **Latency Budget (<2.0s p50)** | Server uses streaming SSE. Client splits streamed tokens by punctuation (`.`, `!`, `?`) and dispatches the first sentence to TTS immediately without waiting for the full response. |
| **Evidence Validation** | Every transcript utterance carries a unique `segment_id`. Post-generation, the server performs normalized substring matching. Any quote failing the match is scrubbed before reaching the client. |
| **Speaker Echo Suppression** | While an AI is speaking, recognized interim words that match >75% similarity to the current playing sentence are dropped unless speech persists >300ms. |
| **Provider Fallback** | `llmClient.ts` races the primary provider with a 4-second timeout. If failed or timed out, it automatically fails over to the secondary provider, followed by persona-specific canned fallback phrases. |
