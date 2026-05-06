# Developer Collaboration Platform

A production-ready, full-stack real-time collaboration platform for development teams built with Next.js (migrated to Vite), React, Node.js, Express, MongoDB, and Socket.io.

## Features

- ✅ **Real-Time Collaboration** — Socket.io powered live updates for tasks and chat
- ✅ **Team Management** — Create teams, manage members, role-based access control
- ✅ **Project Kanban Boards** — Drag-and-drop task management with real-time sync
- ✅ **Team Chat** — Built-in messaging for seamless communication
- ✅ **JWT Authentication** — Secure token-based auth with refresh tokens
- ✅ **Responsive Design** — Mobile-friendly UI with Tailwind CSS
- ✅ **Optimistic UI** — React Query for optimistic updates and caching

## Tech Stack

### Frontend
- **Vite** — Lightning-fast build tool
- **React 18** — UI library
- **TypeScript** — Type safety
- **Tailwind CSS + shadcn/ui** — Styling and components
- **React Router** — Client-side routing
- **React Query (TanStack)** — Server state management
- **DnD Kit** — Drag-and-drop for Kanban
- **Socket.io Client** — Real-time communication
- **Axios** — HTTP client
- **Sonner** — Toast notifications

### Backend
- **Node.js + Express** — HTTP server
- **MongoDB + Mongoose** — Database and ODM
- **JWT** — Authentication
- **Socket.io** — Real-time events
- **Helmet** — Security headers
- **Express Rate Limiter** — DOS protection
- **bcryptjs** — Password hashing

### Deployment
- **Frontend → Vercel** (or any static host)
- **Backend → Render/Railway** (or any Node host)
- **Database → MongoDB Atlas**

## Project Structure

```
devcolab/
├── client/                 # Vite + React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom hooks
│   │   ├── context/       # React contexts (Auth, Socket)
│   │   ├── services/      # API services
│   │   ├── utils/         # Utility functions
│   │   └── App.tsx        # Main app
│   ├── package.json
│   └── vite.config.ts
│
├── server/                 # Express.js backend
│   ├── src/
│   │   ├── config/        # Database & env config
│   │   ├── controllers/   # Route controllers
│   │   ├── middleware/    # Express middleware
│   │   ├── models/        # Mongoose schemas
│   │   ├── routes/        # API routes
│   │   ├── sockets/       # Socket.io handlers
│   │   ├── utils/         # Utility functions
│   │   └── index.ts       # Server entry point
│   ├── package.json
│   └── tsconfig.json
│
├── .gitignore
├── .env.local             # Client env (local)
├── .env.production        # Client env (production)
└── package.json           # Root workspace config
```

## Getting Started

### Prerequisites
- **Node.js** 18+ and npm/yarn
- **MongoDB Atlas** account (or local MongoDB)
- **Git**

### 1. Clone the Repository
```bash
git clone <repo-url>
cd devcolab
```

### 2. Install Dependencies

**Root:**
```bash
npm install
```

**Client:**
```bash
cd .. && npm install --prefix .
```

**Server:**
```bash
cd server && npm install
```

### 3. Environment Setup

**Server** — Create `server/.env` from `server/.env.example`:
```env
PORT=5000
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/devcolab?retryWrites=true&w=majority
JWT_ACCESS_SECRET=your-super-secret-access-key-change-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d
CLIENT_ORIGIN=http://localhost:5173
NODE_ENV=development
```

**Client** — `.env.local` is already created:
```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_SOCKET_URL=http://localhost:5000
```

### 4. Run Locally

**From root directory, run both in parallel:**
```bash
npm run dev
```

This will start:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000

**Or run separately:**

Terminal 1 (Frontend):
```bash
npm run dev
```

Terminal 2 (Backend):
```bash
npm run dev --prefix server
```

### 5. Test the App

1. Visit http://localhost:5173
2. Register a new account
3. Create or join a team
4. Create projects and tasks
5. Drag tasks on the Kanban board (real-time!)
6. Send messages in team chat

## API Endpoints

All endpoints are prefixed with `/api/v1`

### Authentication
- `POST /auth/register` — Register user
- `POST /auth/login` — Login user
- `POST /auth/logout` — Logout (requires auth)
- `POST /auth/refresh` — Get new access token
- `GET /auth/me` — Get current user (requires auth)

### Teams
- `POST /teams` — Create team (requires auth)
- `GET /teams/:id` — Get team details (requires auth)
- `POST /teams/join` — Join via invite code (requires auth)
- `GET /teams/:id/members` — List members (requires auth)
- `DELETE /teams/:id/members/:uid` — Remove member (admin only)
- `POST /teams/:id/regenerate-invite` — New invite code (admin only)
- `DELETE /teams/:id` — Delete team (admin only)

### Projects
- `POST /projects` — Create project (admin only)
- `GET /projects/team/:teamId` — Get team projects (requires auth)
- `GET /projects/:id` — Get project details (requires auth)
- `DELETE /projects/:id` — Delete project (admin only)

### Tasks
- `POST /tasks` — Create task (requires auth)
- `GET /tasks/project/:projectId` — Get project tasks (requires auth)
- `PATCH /tasks/:id` — Update task (requires auth)
- `PATCH /tasks/:id/reorder` — Move task (requires auth)
- `DELETE /tasks/:id` — Delete task (requires auth)

### Messages
- `GET /messages/:teamId` — Get team messages (requires auth)

## WebSocket Events

### Connection
Client connects with `auth` header containing JWT:
```javascript
const socket = io(socketUrl, {
  auth: { token: accessToken }
});
```

### Chat
- **Client emit**: `chat:send` → `{ teamId, content }`
- **Server broadcast**: `chat:receive` ← `{ sender, content, timestamp, teamId }`

### Tasks (Kanban)
- **Client emit**: `task:moved` → `{ taskId, newStatus, newOrder, projectId }`
- **Server broadcast**: `task:updated` ← `{ task }`
- **Client emit**: `task:created` → `{ task, projectId }`
- **Server broadcast**: `task:new` ← `{ task }`
- **Client emit**: `task:deleted` → `{ taskId, projectId }`
- **Server broadcast**: `task:removed` ← `{ taskId }`

### Rooms
- Join team: `socket.join(`team:${teamId}`)`
- Join project: `socket.join(`project:${projectId}`)`

## Deployment

### Frontend (Vercel)

```bash
# Build
npm run build

# Deploy
vercel deploy --prod
```

Set env vars in Vercel dashboard:
```
VITE_API_URL=https://api.devcolab.com/api/v1
VITE_SOCKET_URL=https://api.devcolab.com
```

### Backend (Render.com)

1. Push code to GitHub
2. Create new Web Service on Render
3. Connect repo
4. Set build command: `npm install && npm run build`
5. Set start command: `npm start`
6. Add environment variables
7. Deploy

### Database (MongoDB Atlas)

1. Create account at mongodb.com/cloud/atlas
2. Create cluster (M0 free tier is fine)
3. Get connection string
4. Add IP whitelist (or allow 0.0.0.0/0 for dev)
5. Use connection string in `MONGODB_URI` env var

## Security Checklist

- ✅ Passwords hashed with bcryptjs (12 rounds)
- ✅ JWT access token in memory only (not localStorage)
- ✅ Refresh token in httpOnly, SameSite=Strict cookie
- ✅ Helmet.js for security headers
- ✅ Rate limiting on auth endpoints
- ✅ Role-based access control (RBAC)
- ✅ CORS restricted to frontend origin
- ✅ Socket.io JWT validation on handshake
- ✅ Input validation with express-validator
- ✅ All secrets in environment variables

## Testing

Run tests:
```bash
# Frontend
npm test

# Backend
npm test --prefix server
```

## Troubleshooting

### "Cannot connect to MongoDB"
- Check `MONGODB_URI` in `.env`
- Verify IP is whitelisted in MongoDB Atlas
- Check network connectivity

### "Socket.io connection failed"
- Check `VITE_SOCKET_URL` in `.env.local`
- Verify backend is running on port 5000
- Check CORS origin in server/src/index.ts

### "JWT invalid token"
- Tokens expire after 15 minutes
- Client should auto-refresh using cookie
- Try logging out and back in

## Future Enhancements

- [ ] File uploads (Cloudinary)
- [ ] Push notifications (Novu)
- [ ] AI task generation (OpenAI)
- [ ] GitHub integration
- [ ] Activity logs
- [ ] Video meetings (Daily.co)
- [ ] Dark/light theme toggle
- [ ] Email notifications
- [ ] Advanced permissions
- [ ] Project templates

## License

MIT

## Support

For questions or issues, open a GitHub issue or contact the development team.

---

**Thanks for using DevColab!**