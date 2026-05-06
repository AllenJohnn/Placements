# Quick Reference Card

## 🎯 Project Overview
**Developer Collaboration Platform** — Real-time team collaboration for developers with Kanban boards, team chat, and project management.

## 🚀 Quick Commands

```bash
# Install everything
npm install && npm install --prefix server

# Local development (both services)
npm run dev

# Separate terminals:
npm run dev:client      # Frontend on :5173
npm run dev:server      # Backend on :5000

# Production build
npm run build
npm run build:server

# Run tests
npm test
npm test --prefix server

# Lint code
npm lint
```

## 📁 Key File Locations

| What | Where |
|------|-------|
| API client | `src/services/api.ts` |
| Auth context | `src/context/AuthContext.tsx` |
| Socket context | `src/context/SocketContext.tsx` |
| Pages | `src/pages/` |
| Kanban board | `src/components/kanban/` |
| Chat | `src/components/chat/ChatPanel.tsx` |
| Backend entry | `server/src/index.ts` |
| Models | `server/src/models/` |
| Controllers | `server/src/controllers/` |
| Routes | `server/src/routes/` |

## 🔧 Environment Setup

**Server** — Create `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/devcolab?retryWrites=true&w=majority
JWT_ACCESS_SECRET=your-secret-key-here
JWT_REFRESH_SECRET=your-refresh-secret-here
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d
CLIENT_ORIGIN=http://localhost:5173
NODE_ENV=development
```

**Client** — `.env.local` already created:
```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_SOCKET_URL=http://localhost:5000
```

## 🔌 API Base URL
```
http://localhost:5000/api/v1
```

## 🗂️ Folder Structure

```
devcolab/
├── src/                    # Frontend (Vite + React)
│   ├── pages/             # Page components (7 pages)
│   ├── components/        # UI components (25+)
│   ├── context/           # React contexts
│   ├── hooks/             # Custom hooks
│   ├── services/          # API services (6 files)
│   └── utils/             # Utilities
├── server/                # Backend (Express)
│   ├── src/
│   │   ├── models/        # Mongoose schemas
│   │   ├── controllers/   # Route handlers
│   │   ├── routes/        # Express routes
│   │   ├── middleware/    # Custom middleware
│   │   └── sockets/       # Socket.io handlers
│   ├── package.json
│   └── tsconfig.json
├── package.json           # Root workspace
├── README.md              # Setup guide
├── DEPLOYMENT.md          # Deployment guide
└── BUILD_SUMMARY.md       # What was built
```

## 🔑 Key Endpoints

### Auth
- `POST /api/v1/auth/register` — Create account
- `POST /api/v1/auth/login` — Login
- `POST /api/v1/auth/refresh` — Get new access token
- `GET /api/v1/auth/me` — Current user

### Teams
- `POST /api/v1/teams` — Create team
- `GET /api/v1/teams/:id` — Get team
- `POST /api/v1/teams/join` — Join with invite code
- `DELETE /api/v1/teams/:id` — Delete team (admin)

### Projects
- `POST /api/v1/projects` — Create project
- `GET /api/v1/projects/team/:teamId` — Get projects
- `DELETE /api/v1/projects/:id` — Delete project

### Tasks
- `POST /api/v1/tasks` — Create task
- `GET /api/v1/tasks/project/:projectId` — Get tasks
- `PATCH /api/v1/tasks/:id` — Update task
- `PATCH /api/v1/tasks/:id/reorder` — Move task
- `DELETE /api/v1/tasks/:id` — Delete task

### Messages
- `GET /api/v1/messages/:teamId` — Get messages

## 🔌 Socket.io Events

### Chat
```javascript
socket.emit('chat:send', { teamId, content })
socket.on('chat:receive', (message) => {})
```

### Tasks
```javascript
socket.emit('task:moved', { taskId, newStatus, newOrder, projectId })
socket.on('task:updated', (data) => {})
```

## 🧙 Common Tasks

### Add a new API endpoint

1. Create controller in `server/src/controllers/`
```typescript
export async function myHandler(req: Request, res: Response) {
  // Handle request
}
```

2. Add route in `server/src/routes/`
```typescript
router.post('/my-route', authMiddleware, myHandler);
```

3. Create service in `src/services/`
```typescript
export const myService = {
  async myFunction() {
    const res = await api.post('/my-route');
    return res.data;
  }
};
```

4. Use in component with React Query
```typescript
const { data } = useQuery({
  queryKey: ['my-data'],
  queryFn: () => myService.myFunction()
});
```

### Add a new page

1. Create `src/pages/MyPage.tsx`
2. Add route in `src/App.tsx`
3. Add navigation in `AppShell.tsx` if needed

### Add a new component

1. Create `src/components/MyComponent.tsx`
2. Use in pages or other components
3. Add shadcn components: `npx shadcn-ui@latest add button`

### Add Socket event

1. Add handler in `server/src/sockets/`
2. Register in `server/src/index.ts`
3. Emit from client: `socket.emit('event-name', data)`
4. Listen on client: `socket.on('event-name', (data) => {})`

## 🐛 Debugging Tips

### Frontend Issues
- Check **browser console** (F12)
- Check **Network tab** for API calls
- Check **Redux DevTools** if using Redux
- Check **React Query DevTools**

### Backend Issues
- Check **terminal logs** where server runs
- Check **MongoDB Atlas** data
- Use `console.log()` in controllers
- Check `.env` variables

### Socket Issues
- Check browser console for connection errors
- Verify token is being sent
- Check server logs for socket connections
- Test with `socket.io/socket.io.js`

## 📊 Database Schemas

### User
```
{ name, email, password, avatar, createdAt }
```

### Team
```
{ name, inviteCode, inviteCodeExpiresAt, members[], createdBy, createdAt }
```

### Project
```
{ title, description, teamId, createdBy, createdAt }
```

### Task
```
{ title, description, status, assignedTo, deadline, projectId, createdBy, order, createdAt }
```

### Message
```
{ sender, teamId, content, timestamp }
```

## 🔐 Authentication Flow

1. **Register/Login** → Get `accessToken` + store `refreshToken` in cookie
2. **API calls** → Send `Authorization: Bearer accessToken`
3. **Token expires** → Auto-refresh using `refreshToken`
4. **Logout** → Clear token and cookie

## 🎨 Theming

**Colors:**
- Primary: `#6366f1` (indigo)
- Background: `#0f1117` (dark)
- Cards: `#1a1d27` (dark)
- Text: `#e6edf3` (light)

Change in `tailwind.config.ts`

## 📱 Responsive Breakpoints

- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

## 🚢 Deployment Checklist

- [ ] Set all env vars (server & client)
- [ ] Build locally and test: `npm run build`
- [ ] Push to GitHub
- [ ] Deploy backend (Render/Railway)
- [ ] Deploy frontend (Vercel)
- [ ] Test production URLs
- [ ] Monitor logs

See `DEPLOYMENT.md` for details

## 💾 Backing Up Data

MongoDB Atlas automatically backs up data. To export:
1. Go to Clusters → Data Import/Export
2. Click Export → Export to BSON
3. Download backup file

## 🆘 Getting Help

1. **Setup issues** → Check `README.md`
2. **Deployment** → Check `DEPLOYMENT.md`
3. **What was built** → Check `BUILD_SUMMARY.md`
4. **Errors** → Check browser/server console
5. **API issues** → Check Network tab & server logs

---

**Everything you need is in this repo. Happy coding! 🚀**
