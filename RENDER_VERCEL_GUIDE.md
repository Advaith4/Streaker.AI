# Streaker.ai: Render + Vercel Deployment Guide

**Quick, focused guide for deploying backend on Render and frontend on Vercel.**

---

## 📋 Prerequisites Checklist

Before you start, have these ready:

- ✅ GitHub account (already have)
- ✅ Code pushed to GitHub (already done)
- ✅ Render account (create at render.com)
- ✅ Vercel account (create at vercel.com)
- ✅ MongoDB Atlas (free cluster)
- ✅ Google OAuth credentials

---

## 🔧 Step 1: Setup MongoDB Atlas (Database)

### 1.1 Create MongoDB Atlas Account
- Go to https://mongodb.com/cloud/atlas
- Sign up free
- Create an organization and project

### 1.2 Create Free Cluster
1. Click "Create a Cluster"
2. Choose **Free Tier**
3. Select cloud provider (AWS recommended)
4. Choose region closest to you
5. Click "Create Cluster" and wait 3-5 minutes

### 1.3 Get Connection String
1. After cluster is created, click "Connect"
2. Choose "Drivers" → Node.js
3. Copy the connection string (looks like):
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
4. Replace `<password>` and `<username>` with your credentials
5. Add database name at the end:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/devtrack?retryWrites=true&w=majority
   ```

### 1.4 Whitelist IPs
1. In MongoDB Atlas, go to "Security" → "Network Access"
2. Click "Add IP Address"
3. Choose "Allow access from anywhere" (for testing)
4. Confirm

**Save your connection string! You'll need it for Render.**

---

## 🚀 Step 2: Deploy Backend on Render

### 2.1 Create Render Account
- Go to https://render.com
- Click "Sign up"
- Choose "Sign up with GitHub"
- Authorize GitHub access
- Create account

### 2.2 Create Web Service
1. Click the "+" icon in top right
2. Click "New Web Service"
3. Select "Build and deploy from a Git repository"
4. Click "Connect Account" to link GitHub
5. Choose your repository: `Streaker.AI`
6. Click "Connect"

### 2.3 Configure Deployment
**Service settings:**
- **Name**: `streaker-ai-backend`
- **Root Directory**: `server` (important!)
- **Runtime**: Node
- **Build Command**: `npm install`
- **Start Command**: `node server.js`
- **Plan**: Free

### 2.4 Add Environment Variables
Click "Advanced" then "Add Environment Variable" for each:

```
MONGO_URI = mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/devtrack?retryWrites=true&w=majority

JWT_SECRET = (generate: openssl rand -base64 32)  OR use any random string like: supersecret123key456randomstring789

NODE_ENV = production

PORT = 3000

CORS_ORIGIN = https://your-vercel-frontend-url.vercel.app
(You'll update this after Vercel deployment)

GOOGLE_CLIENT_ID = your_google_client_id_here
```

### 2.5 Deploy
1. Click "Create Web Service"
2. Render will auto-build and deploy
3. Wait 2-3 minutes for build to complete
4. You'll see a URL like: `https://streaker-ai-backend.onrender.com`
5. **Save this URL! You need it for Vercel.**

### 2.6 Verify Backend is Running
Open in browser:
```
https://streaker-ai-backend.onrender.com/
```

You should see:
```json
{"status":"ok","app":"Streaker.ai API"}
```

✅ **Backend deployed!**

---

## 🎨 Step 3: Deploy Frontend on Vercel

### 3.1 Create Vercel Account
- Go to https://vercel.com
- Click "Sign Up"
- Choose "Sign up with GitHub"
- Authorize and create account

### 3.2 Import Project
1. Click "Add New..." → "Project"
2. Click "Import Git Repository"
3. Paste your repo URL: `https://github.com/Advaith4/Streaker.AI`
4. Click "Continue"

### 3.3 Configure Project
**Framework Preset**: React (auto-selected)

**Configure project settings:**
- **Project Name**: `streaker-ai-frontend`
- **Framework**: React
- **Root Directory**: `client` (important!)
- **Build Command**: `npm run build`
- **Output Directory**: `build`
- **Install Command**: `npm install`

### 3.4 Add Environment Variables
Click "Environment Variables" and add:

```
REACT_APP_API_URL = https://streaker-ai-backend.onrender.com/api

REACT_APP_GOOGLE_CLIENT_ID = your_google_client_id_here
```

### 3.5 Deploy
1. Click "Deploy"
2. Vercel will build and deploy
3. Wait 2-3 minutes
4. You'll get a URL like: `https://streaker-ai-frontend.vercel.app`

✅ **Frontend deployed!**

---

## 🔗 Step 4: Update Backend CORS

Now that you have your Vercel frontend URL, update backend CORS:

### 4.1 Update on Render
1. Go to https://dashboard.render.com
2. Select `streaker-ai-backend` service
3. Go to "Environment" tab
4. Click "Edit" on `CORS_ORIGIN` variable
5. Change to your Vercel URL:
   ```
   https://streaker-ai-frontend.vercel.app
   ```
6. Click "Save"
7. Your service will auto-redeploy in 1-2 minutes

---

## 🔑 Step 5: Setup Google OAuth for Production

### 5.1 Update Google Credentials
1. Go to https://console.cloud.google.com
2. Select your project
3. Go to "Credentials" → Click your OAuth 2.0 Client ID
4. Add **Authorized JavaScript origins**:
   ```
   https://streaker-ai-frontend.vercel.app
   https://www.streaker-ai-frontend.vercel.app
   ```
5. Add **Authorized redirect URIs**:
   ```
   https://streaker-ai-frontend.vercel.app/
   https://www.streaker-ai-frontend.vercel.app/
   ```
6. Click "Save"

---

## ✅ Step 6: Test Your Deployment

### 6.1 Test Frontend
1. Open https://streaker-ai-frontend.vercel.app
2. You should see the login page
3. Try signing up with Google
4. Should redirect to dashboard

### 6.2 Test Backend API
```
https://streaker-ai-backend.onrender.com/
```
Should return:
```json
{"status":"ok","app":"Streaker.ai API"}
```

### 6.3 Full Test Checklist
- ✅ Frontend loads
- ✅ Google login works
- ✅ Can sign up
- ✅ Dashboard loads
- ✅ Can add problems
- ✅ Can mark problems solved
- ✅ Heatmap displays
- ✅ Profile page loads

---

## 📊 Your Deployment Summary

| Component | Platform | URL |
|-----------|----------|-----|
| **Backend API** | Render | https://streaker-ai-backend.onrender.com |
| **Frontend** | Vercel | https://streaker-ai-frontend.vercel.app |
| **Database** | MongoDB Atlas | (connection string) |

---

## 🔐 Security Notes

- Never commit `.env` files to GitHub
- Store sensitive values only in platform dashboards (Render/Vercel)
- Use strong `JWT_SECRET` (random 32+ characters)
- Keep `NODE_ENV=production` in backend
- MongoDB IP whitelist should allow your Render server

---

## 🚨 Troubleshooting

### Frontend shows "Cannot connect to API"
- ✅ Check `REACT_APP_API_URL` is set in Vercel
- ✅ Verify Render backend is running
- ✅ Check CORS_ORIGIN matches your Vercel URL

### Google OAuth doesn't work
- ✅ Verify authorized origins in Google Console
- ✅ Check `REACT_APP_GOOGLE_CLIENT_ID` in Vercel
- ✅ Check `GOOGLE_CLIENT_ID` in Render

### Database connection fails
- ✅ Verify `MONGO_URI` in Render
- ✅ Check MongoDB IP whitelist (allow all IPs for now)
- ✅ Test connection string locally first

### Render won't build
- ✅ Check `Root Directory` is set to `server`
- ✅ Verify `npm install` runs without errors
- ✅ Check build logs in Render dashboard

---

## 📱 Custom Domain (Optional)

### Add Domain to Vercel
1. Go to Vercel project settings
2. Click "Domains"
3. Enter your domain
4. Follow DNS setup instructions

### Add Domain to Render
1. Go to Render service settings
2. Click "Custom Domains"
3. Add your domain
4. Update DNS records

---

## 🎉 You're Done!

Your Streaker.ai app is now live on:
- **Frontend**: https://streaker-ai-frontend.vercel.app
- **Backend**: https://streaker-ai-backend.onrender.com

Both are auto-connected to GitHub, so any push to main branch will auto-redeploy!

---

**Questions? Check:**
- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs
- MongoDB Docs: https://docs.mongodb.com/atlas

Happy deploying! 🚀
