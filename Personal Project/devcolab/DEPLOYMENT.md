# Deployment Guide

This guide covers deploying the Developer Collaboration Platform to production.

## Prerequisites

- GitHub repository with code pushed
- Accounts at:
  - [Vercel](https://vercel.com) (Frontend)
  - [Render.com](https://render.com) or [Railway.app](https://railway.app) (Backend)
  - [MongoDB Atlas](https://cloud.mongodb.com) (Database)

## Database Setup (MongoDB Atlas)

1. **Create Account** → https://cloud.mongodb.com
2. **Create Cluster**
   - Choose free M0 tier
   - Select region close to users
   - Wait for deployment (5-10 min)
3. **Create Database User**
   - Go to Database Access
   - Click "Add New User"
   - Set username and password
   - Grant "Read and Write to any Database"
4. **Whitelist IP**
   - Go to Network Access
   - Click "Add IP Whitelist"
   - Add `0.0.0.0/0` (or specific IP)
5. **Get Connection String**
   - Click "Connect"
   - Choose "Connect to your application"
   - Copy connection string
   - Replace `<password>` with your password

Connection string format:
```
mongodb+srv://username:password@cluster.mongodb.net/devcolab?retryWrites=true&w=majority
```

## Backend Deployment (Render.com)

### 1. Connect GitHub Repository

1. Go to https://render.com
2. Sign up/Login
3. Click "New" → "Web Service"
4. Connect your GitHub account
5. Select the repository
6. Choose branch (usually `main`)

### 2. Configure Web Service

**Basic Settings:**
- **Name**: `devcolab-api` (or similar)
- **Environment**: Node
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Plan**: Free tier (can upgrade later)

### 3. Set Environment Variables

Click "Environment" and add:
```
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/devcolab?retryWrites=true&w=majority
JWT_ACCESS_SECRET=<generate-random-key>
JWT_REFRESH_SECRET=<generate-random-key>
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d
CLIENT_ORIGIN=https://your-frontend-domain.vercel.app
NODE_ENV=production
```

**Generate random keys:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Deploy

Click "Create Web Service" and wait for deployment (3-5 min)

Get your backend URL: `https://devcolab-api.onrender.com`

## Frontend Deployment (Vercel)

### 1. Import Project

1. Go to https://vercel.com
2. Click "New Project"
3. Import the GitHub repository
4. Select the project

### 2. Configure Build

Vercel auto-detects Vite, but verify:
- **Framework**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm ci`

### 3. Set Environment Variables

Add in "Environment Variables":
```
VITE_API_URL=https://devcolab-api.onrender.com/api/v1
VITE_SOCKET_URL=https://devcolab-api.onrender.com
```

### 4. Deploy

Click "Deploy" and wait (1-2 min)

Your site is now live at: `https://devcolab-[random].vercel.app`

## Custom Domain

### Add Domain to Frontend (Vercel)

1. Go to project Settings
2. Click "Domains"
3. Add your custom domain
4. Follow DNS instructions
5. Point nameservers or add CNAME records

### Add Domain to Backend (Render)

1. Go to Web Service Settings
2. Scroll to "Custom Domain"
3. Add your domain
4. Follow CNAME instructions

## Environment Variables Summary

### Server (.env)
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/devcolab?retryWrites=true&w=majority
JWT_ACCESS_SECRET=<random-key-32-chars>
JWT_REFRESH_SECRET=<random-key-32-chars>
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d
CLIENT_ORIGIN=https://your-frontend-domain.vercel.app
NODE_ENV=production
```

### Client (.env.production)
```env
VITE_API_URL=https://api.your-domain.com/api/v1
VITE_SOCKET_URL=https://api.your-domain.com
```

## Verify Deployment

### Test Backend
```bash
curl https://devcolab-api.onrender.com/health
# Response: {"status":"ok","timestamp":"..."}
```

### Test Frontend
1. Visit https://your-frontend-domain.vercel.app
2. Register a new account
3. Create a team
4. Create a project and task
5. Test real-time chat in team page

## Troubleshooting

### Backend won't start
- Check MONGODB_URI is correct
- Verify IP is whitelisted in MongoDB Atlas
- Check all env vars are set
- View logs in Render dashboard

### Socket.io connection failed
- Verify `CLIENT_ORIGIN` matches frontend URL
- Check CORS is enabled in backend
- Verify backend is running

### Database connection timeout
- Check MongoDB whitelist includes Render IP range
- Try whitelisting `0.0.0.0/0` temporarily for testing
- Check network is not blocking port 27017

### CORS errors
- Ensure `CLIENT_ORIGIN` in backend matches exactly
- Include protocol (https, not http)
- Check backend CORS middleware

## Monitoring

### Render Logs
Go to Web Service → Logs → View all logs

### MongoDB Atlas
Go to Atlas → Metrics → View database metrics

### Vercel Analytics
Go to Project → Analytics → View performance metrics

## Scaling Up

### Database
- Upgrade to M2+ cluster for better performance
- Enable auto-scaling
- Add backups and restore points

### Backend
- Upgrade Render plan from Free to paid
- Enable "Keep Alive" to prevent cold starts
- Add horizontal scaling

### Frontend
- Use Vercel's edge functions for caching
- Enable Incremental Static Regeneration (ISR)
- Use Vercel Analytics Pro

## Security Checklist

- ✅ All env vars set to strong random values
- ✅ JWT secrets are 32+ chars
- ✅ MongoDB backups enabled
- ✅ HTTPS enforced on all endpoints
- ✅ CORS restricted to frontend origin
- ✅ Rate limiting enabled on auth endpoints
- ✅ Database user has limited permissions
- ✅ IP whitelist configured (or 0.0.0.0/0 with strong auth)

## Cost Summary (Approximate Monthly)

- **MongoDB Atlas**: Free (M0 tier) or $57+ (M2+)
- **Render Backend**: Free (with limited resources) or $7+ (Starter plan)
- **Vercel Frontend**: Free (with pro features) or $20+ (Pro plan)

**Total**: $0 for MVP, $15+ for production-grade setup

---

For detailed documentation, see [README.md](./README.md)
