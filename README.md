<h1 align="center">
  <br>
  🧠 TaskMate AI
  <br>
</h1>

<h4 align="center">An AI-powered productivity dashboard for solo workers and teams — with drag-and-drop Kanban, real-time analytics, smart behavior insights, and a Gemini-powered AI assistant.</h4>

<p align="center">
  <img alt="React" src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white">
  <img alt="Node.js" src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white">
  <img alt="MongoDB" src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white">
  <img alt="Socket.IO" src="https://img.shields.io/badge/Socket.IO-4-010101?style=for-the-badge&logo=socket.io&logoColor=white">
  <img alt="License" src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge">
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-project-structure">Structure</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-api-reference">API Reference</a> •
  <a href="#%EF%B8%8F-environment-variables">Env Variables</a>
</p>

---

## ✨ Features

### 🎯 Task Management
- **Drag-and-Drop Kanban Board** — Three-column layout: `Pending` → `In Progress` → `Completed`
- **Task Detail View** — Click any task card to view full metadata, deadlines, and assignees
- **Category Tagging** — Organize tasks as `Personal` or `Business`
- **Shared Tasks** — Assign tasks to team members with shared visibility
- **Scheduled Tasks** — Set dates and times with deadline tracking

### 🤖 AI-Powered Features
- **Gemini AI Chat Assistant** — Describe your tasks in plain English; the AI creates and organizes them for you
- **Behavior Study & Advice** — Analyzes your task patterns and delivers productivity recommendations
- **Enhanced Prediction Intelligence** — Predicts workload bottlenecks and completion likelihood across the team
- **Daily Report Analysis** — AI-generated end-of-day summaries for solo and team modes

### 👥 Dual Mode Dashboard
- **Solo Mode** — Personal productivity view with solo analytics and your own task columns
- **Team Mode** — Full team Kanban, team analytics graphs, member performance tracking, and shared reporting

### 📊 Analytics & Insights
- **Solo Mode Graphs** — Personal task trends, completion rates, category distribution
- **Team Mode Graphs** — Member-wise performance, team task velocity, bottleneck heatmaps
- **Daily Timeline** — Visual timeline of your scheduled tasks for the day

### 🎨 UI/UX Highlights
- **Dark Mode** — Deep `#0F1115` → `#15181E` gradient background; no eye strain
- **Thanos Snap Effect** — Particle disintegration animation on task completion 💫
- **Welcome Banner** — Personalized onboarding banner with dismissal
- **Reminders Popover** — Bell icon with upcoming task reminders
- **Smooth Animations** — Framer Motion page transitions, layout animations, spring physics

### 🔐 Authentication & Security
- **JWT-based Auth** — Stateless authentication with `jsonwebtoken`
- **Password Hashing** — Passwords secured with `bcrypt`
- **Rate Limiting** — 100 requests per 10-minute window via `express-rate-limit`
- **XSS Protection** — Sanitized inputs with `xss-clean`
- **Helmet** — HTTP header hardening out of the box
- **CORS** — Configured to allow only trusted origins

### ⚡ Real-Time
- **Socket.IO** — Live online-user presence tracking across the team
- **Online Users Broadcast** — All connected clients see who's active in real time

---

## 🛠 Tech Stack

### Frontend (`/client`)
| Technology | Purpose |
|---|---|
| React 18 + TypeScript | Core UI framework |
| Vite | Build tool & dev server |
| Motion (Framer Motion) | Animations & transitions |
| React DnD + HTML5 Backend | Drag-and-drop Kanban |
| Recharts | Charts & data visualization |
| Radix UI (full suite) | Accessible UI primitives |
| Lucide React | Icon library |
| Sonner | Toast notifications |
| React Hook Form | Form state management |
| Socket.IO Client | Real-time presence |
| next-themes | Theme management |
| Tailwind CSS | Utility-first styling |

### Backend (`/server`)
| Technology | Purpose |
|---|---|
| Node.js + Express 4 | REST API server |
| MongoDB + Mongoose | Database & ODM |
| Socket.IO | WebSocket server |
| Google Generative AI (Gemini) | AI chat & analysis |
| JWT + bcrypt | Authentication |
| Helmet + XSS-Clean | Security middleware |
| Morgan | HTTP request logging |
| Nodemon | Dev auto-restart |
| Express Rate Limit | DDoS / abuse protection |
| Express Validator | Request validation |
| Google APIs | OAuth & Sheets integration |

---

## 🗂 Project Structure

```
TaskMate-AI/
├── client/                        # Frontend React app
│   ├── src/
│   │   ├── App.tsx                # Root component & state management
│   │   ├── main.tsx               # React entry point
│   │   ├── index.css              # Global styles & design tokens
│   │   ├── api/                   # API client functions
│   │   ├── assets/                # Static assets
│   │   ├── components/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── SignUpPage.tsx
│   │   │   ├── TopBar.tsx
│   │   │   ├── StatsOverview.tsx
│   │   │   ├── NavigationTabs.tsx
│   │   │   ├── AddTaskDialog.tsx
│   │   │   ├── TaskDetailDialog.tsx
│   │   │   ├── DraggableTaskCard.tsx
│   │   │   ├── DroppableColumn.tsx
│   │   │   ├── CompletedTaskCard.tsx
│   │   │   ├── InProgressTaskCard.tsx
│   │   │   ├── PendingTaskCard.tsx
│   │   │   ├── EnhancedAIChatButton.tsx  # AI assistant interface
│   │   │   ├── SoloModeGraphs.tsx
│   │   │   ├── TeamModeGraphs.tsx
│   │   │   ├── TeamDashboard.tsx
│   │   │   ├── BehaviorStudyAdvices.tsx
│   │   │   ├── EnhancedPredictionIntelligence.tsx
│   │   │   ├── DailyReportAnalysis.tsx
│   │   │   ├── DailyTimeline.tsx
│   │   │   ├── SchedulePage.tsx
│   │   │   ├── CategorySummary.tsx
│   │   │   ├── RemindersPopover.tsx
│   │   │   ├── WelcomeBanner.tsx
│   │   │   ├── ThanosSnapOverlay.tsx
│   │   │   └── TaskCompletionOverlay.tsx
│   │   └── styles/
│   ├── vite.config.ts
│   └── tsconfig.json
│
└── server/                        # Backend Express app
    ├── index.js                   # App entry point, middleware, Socket.IO
    ├── config/
    │   └── db.js                  # MongoDB connection
    ├── middleware/
    │   ├── authMiddleware.js      # JWT verification
    │   └── security.js            # Helmet & security setup
    ├── models/                    # Mongoose schemas
    ├── routes/
    │   ├── auth.js                # POST /api/auth/login, /signup
    │   ├── tasks.js               # CRUD /api/tasks
    │   ├── logs.js                # Activity logs
    │   ├── session.js             # Session management
    │   ├── team.js                # Team routes (auth-protected)
    │   └── ai.js                  # Gemini AI routes
    ├── services/                  # Business logic
    ├── utils/                     # Helper functions
    └── store/                     # In-memory / shared state
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **MongoDB** running locally (`mongod`) or a MongoDB Atlas URI
- **npm** v9+
- A **Google Gemini API key** (free at [Google AI Studio](https://aistudio.google.com/))

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/TaskMate-AI.git
cd TaskMate-AI
```

---

### 2. Set Up the Backend

```bash
cd server
npm install
```

Create a `.env` file inside `/server`:

```env
PORT=4000
MONGO_URI=mongodb://127.0.0.1:27017/taskmate
JWT_SECRET=your_super_secret_jwt_key
FRONTEND_URL=http://localhost:5173

GEMINI_API_KEY=your_gemini_api_key_here
```

Start the backend dev server:

```bash
npm run dev
# Server starts on http://localhost:4000
```

---

### 3. Set Up the Frontend

Open a new terminal:

```bash
cd client
npm install
npm run dev
# App starts on http://localhost:5173
```

---

### 4. Open the App

Visit **[http://localhost:5173](http://localhost:5173)** in your browser.

1. Click **Sign Up** to create an account
2. Log in with your credentials
3. Start adding tasks manually or let the **AI chat** create them for you
4. Switch between **Solo Mode** and **Team Mode** at any time

---

## 📡 API Reference

All routes are prefixed with `/api`.

### Auth — `/api/auth`

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/signup` | Register a new user |
| `POST` | `/api/auth/login` | Authenticate & receive JWT token |

### Tasks — `/api/tasks`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/tasks/:userId` | Fetch all tasks for a user |
| `POST` | `/api/tasks` | Create a new task |
| `PUT` | `/api/tasks/:taskId` | Update task (status, progress, etc.) |
| `DELETE` | `/api/tasks/:taskId` | Delete a task |

### AI — `/api/ai`

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/ai/chat` | Send a message to Gemini AI |
| `POST` | `/api/ai/analyze` | Run behavior / report analysis |

### Team — `/api/team` *(JWT required)*

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/team` | Get team members & their task stats |

### Logs — `/api/logs`
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/logs/:userId` | Get activity logs |

---

## ⚙️ Environment Variables

### Server (`server/.env`)

| Variable | Required | Description |
|---|---|---|
| `PORT` | Yes | Port for the Express server (default `4000`) |
| `MONGO_URI` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | Secret key for signing JWTs |
| `FRONTEND_URL` | Yes | Allowed CORS origin (your frontend URL) |
| `GEMINI_API_KEY` | Yes | Google Gemini API key for AI features |
| `GOOGLE_CLIENT_ID` | Optional | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Optional | Google OAuth client secret |

> ⚠️ **Never commit your `.env` file.** It is already listed in `.gitignore`.

---

## 🔌 Socket.IO Events

| Event | Direction | Payload | Description |
|---|---|---|---|
| `userOnline` | Client → Server | `{ username, ... }` | Announce user is online |
| `userOffline` | Client → Server | — | Announce user went offline |
| `onlineUsers` | Server → All Clients | `User[]` | Broadcast current online users |
| `disconnect` | Auto | — | Handles cleanup on socket drop |

---

## 🧪 Development Notes

- The frontend dev server proxies API requests through Vite (`/api → http://localhost:4000`)
- Backend uses `nodemon` for hot-reload during development
- Rate limiting is set to **100 requests / 10 minutes** per IP — disable during load testing
- The Gemini AI route is unauthenticated by default; add `authMiddleware` if you need to protect it

---

## 🏗 Building for Production

### Frontend

```bash
cd client
npm run build
# Output in client/build/
```

### Backend

```bash
cd server
npm start
# Runs with node (no hot-reload)
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgements

- UI inspiration from [Linear](https://linear.app), [Notion](https://notion.so), and [Replit](https://replit.com)
- Icons by [Lucide React](https://lucide.dev)
- UI primitives by [Radix UI](https://www.radix-ui.com)
- AI powered by [Google Gemini](https://deepmind.google/technologies/gemini/)
- Animations by [Framer Motion](https://www.framer.com/motion/)

---

<p align="center">Built with ❤️ — <strong>TaskMate AI</strong></p>