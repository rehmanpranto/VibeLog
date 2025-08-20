# VibeLog Deployment Guide

## Frontend Only Deployment (Recommended for testing)

### Vercel Deployment

1. **Connect Repository:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Select the `frontend` folder as the root directory

2. **Project Settings:**
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

3. **Environment Variables:**
   **No environment variables needed!** 
   
   The app now works in demo mode by default on Vercel.
   
   *(Optional: If you deploy a backend later, add `VITE_API_URL=https://your-backend-url.com/api`)*

### Netlify Deployment

1. **Project Settings:**
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `frontend/dist`

2. **Environment Variables:**
   ```
   VITE_API_URL=https://your-backend-url.com/api
   ```

## Backend Deployment

### Railway Deployment (Recommended - Free tier available)

1. **Create Railway Account:**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Deploy Backend:**
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your VibeLog repository
   - Choose "backend" folder as root directory

3. **Add Database:**
   - In Railway dashboard, click "New" → "Database" → "PostgreSQL"
   - Railway will automatically provide DATABASE_URL

4. **Environment Variables:**
   Add these in Railway dashboard:
   ```
   NODE_ENV=production
   JWT_SECRET=your_super_secret_jwt_key_here
   OPENAI_API_KEY=your_openai_api_key_here
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_app_password
   FRONTEND_URL=https://your-vercel-app.vercel.app
   ```

5. **Connect Frontend to Backend:**
   - Copy your Railway backend URL (e.g., `https://your-app.up.railway.app`)
   - In Vercel, add environment variable:
     ```
     VITE_API_URL=https://your-railway-app.up.railway.app/api
     ```
   - Redeploy frontend in Vercel

### Render Deployment (Alternative)

### Render Deployment (Alternative)

1. **Create Render Account:**
   - Go to [render.com](https://render.com)
   - Connect your GitHub account

2. **Deploy Backend:**
   - New → Web Service
   - Connect repository, select `backend` folder
   - Settings:
     - **Build Command:** `npm install`
     - **Start Command:** `node index.js`
     - **Environment:** Node

3. **Add Database:**
   - New → PostgreSQL
   - Copy the Internal Database URL

4. **Environment Variables:**
   ```
   DATABASE_URL=your_postgresql_connection_string
   JWT_SECRET=your_jwt_secret_key
   OPENAI_API_KEY=your_openai_api_key
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_app_password
   PORT=5000
   NODE_ENV=production
   ```

## Git Workflow for Deployment

### Initial Setup and Push to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit your changes
git commit -m "Initial commit: VibeLog mood tracking app with React frontend and Node.js backend"

# Add remote repository (replace with your GitHub repo URL)
git remote add origin https://github.com/rehmanpranto/VibeLog.git

# Push to main branch
git push -u origin main
```

### Regular Updates and Deployment

```bash
# Check status of your changes
git status

# Add specific files or all changes
git add .
# or add specific files: git add frontend/src/EnhancedApp.jsx

# Commit with descriptive message
git commit -m "Update: Minimized dashboard design and fixed deployment configuration"

# Push to trigger automatic deployment
git push origin main
```

### Common Git Commands for Development

```bash
# Check current branch
git branch

# Create and switch to new feature branch
git checkout -b feature/new-dashboard-design

# Switch back to main branch
git checkout main

# Merge feature branch
git merge feature/new-dashboard-design

# View commit history
git log --oneline

# Check differences before committing
git diff

# Reset changes (be careful!)
git reset --hard HEAD~1  # Goes back one commit
```

### Deployment Trigger Commands

```bash
# For automatic deployment on Vercel/Netlify
git add .
git commit -m "Deploy: Updated UI and fixed build configuration"
git push origin main

# For manual deployment testing
git add .
git commit -m "Test: Frontend build verification"
git push origin main
```

## Local Testing

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
npm install
npm run dev
```

## Quick Commands for Deployment

### Frontend Build Test
```bash
cd frontend
npm install
npm run build
# Check if dist folder is created
ls dist/
```

### Backend Test
```bash
cd backend
npm install
npm start
```

## Troubleshooting

1. **No dist folder after build:**
   - Make sure you're in the frontend directory
   - Run `npm run build` manually
   - Check for build errors

2. **API connection issues:**
   - Verify VITE_API_URL environment variable
   - Check CORS settings in backend
   - Ensure backend is deployed and accessible

3. **Database connection issues:**
   - Verify DATABASE_URL is correct
   - Check database is accessible from deployment platform
   - Ensure all required environment variables are set
