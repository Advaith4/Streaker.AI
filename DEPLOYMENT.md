# 🚀 Streaker.ai Deployment Guide

Complete guide to deploy your MERN application to production.

---

## 📋 Pre-Deployment Checklist

Before deploying, ensure:

- ✅ All code is committed and pushed to GitHub
- ✅ `.env` files are NOT in git (add to `.gitignore`)
- ✅ Frontend build is tested locally: `npm run build`
- ✅ Backend runs without errors
- ✅ Database connection is stable
- ✅ All dependencies are listed in `package.json`
- ✅ Environment variables documented

---

## 🎯 Deployment Options

| Platform | Best For | Cost | Ease |
|----------|----------|------|------|
| **Render** | Full-stack apps | Free tier available | ⭐⭐⭐⭐⭐ |
| **Railway** | Full-stack apps | Free tier available | ⭐⭐⭐⭐⭐ |
| **Vercel** | Frontend only | Free tier available | ⭐⭐⭐⭐⭐ |
| **MongoDB Atlas** | Database only | Free tier available | ⭐⭐⭐⭐ |
| **DigitalOcean** | VPS hosting | $4+/month | ⭐⭐⭐ |
| **AWS** | Enterprise scale | Pay-as-you-go | ⭐⭐ |
| **Heroku** | Full-stack apps | Paid only | ⭐⭐⭐⭐ |

---

## ✨ Option 1: Render (Recommended - Easiest)

Render is the easiest option - it deploys full-stack apps with MongoDB support.

### Step 1: Prepare Your Repository

Ensure both `client` and `server` folders have `package.json` files.

```bash
# Verify package.json exists
ls server/package.json
ls client/package.json
```

### Step 2: Create `render.yaml` in Project Root

```yaml
services:
  - type: web
    name: streaker-ai-backend
    env: node
    plan: free
    buildCommand: cd server && npm install
    startCommand: cd server && npm start
    envVars:
      - key: MONGO_URI
        value: mongodb+srv://username:password@cluster.mongodb.net/devtrack
      - key: JWT_SECRET
        generateValue: true
      - key: NODE_ENV
        value: production
      - key: CORS_ORIGIN
        value: https://your-frontend-domain.netlify.app

  - type: static_site
    name: streaker-ai-frontend
    staticPublishPath: build
    buildCommand: npm install && npm run build
    envVars:
      - key: REACT_APP_API_URL
        value: https://streaker-ai-backend.onrender.com/api
      - key: REACT_APP_GOOGLE_CLIENT_ID
        value: your_google_client_id
```

### Step 3: Deploy on Render

1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Click "New +" → "Blueprint"
4. Connect your GitHub repository
5. Render will auto-detect `render.yaml` and deploy both frontend and backend
6. Wait ~5-10 minutes for deployment
7. Your app will be available at `https://streaker-ai-backend.onrender.com`

---

## ✨ Option 2: Railway (Very Easy)

Railway is super simple and free tier is generous.

### Step 1: Prepare Backend

Ensure `server/package.json` has a `start` script:

```json
"scripts": {
  "start": "node server.js"
}
```

### Step 2: Set Up MongoDB Atlas (if not already done)

1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create free tier cluster
3. Get connection string: `mongodb+srv://user:pass@cluster.mongodb.net/dbname`

### Step 3: Deploy Backend on Railway

1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub"
4. Choose your repository
5. Select `server` folder (if Railway asks)
6. Add environment variables:
   - `MONGO_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Generate a random string
   - `NODE_ENV`: `production`
   - `PORT`: `3000` (Railway auto-assigns)
   - `CORS_ORIGIN`: Your frontend URL
7. Deploy! Backend will be live in ~2 minutes

### Step 4: Deploy Frontend on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Select `client` as the root directory
5. Add environment variables:
   - `REACT_APP_API_URL`: Your Railway backend URL
   - `REACT_APP_GOOGLE_CLIENT_ID`: Your Google OAuth ID
6. Deploy!

---

## 🌍 Option 3: Separate Frontend (Vercel) + Backend (Railway)

This is the most popular approach for MERN apps.

### Frontend on Vercel

1. **Push code to GitHub** (already done ✅)

2. **Go to [vercel.com](https://vercel.com)**
   - Sign up with GitHub
   - Click "New Project"
   - Select your repository
   - Set root directory: `client`

3. **Configure build settings:**
   - Build command: `npm run build`
   - Output directory: `build`
   - Install command: `npm install`

4. **Add environment variables:**
   ```
   REACT_APP_API_URL = https://your-backend-url.railway.app/api
   REACT_APP_GOOGLE_CLIENT_ID = your_google_client_id
   ```

5. **Click Deploy!** ✅

### Backend on Railway

1. **Go to [railway.app](https://railway.app)**
   - New Project → Deploy from GitHub
   - Select your repository

2. **Add service:**
   - Root directory: `server`
   - Railway will auto-detect Node.js

3. **Add environment variables:**
   ```
   MONGO_URI = mongodb+srv://user:pass@cluster.mongodb.net/devtrack
   JWT_SECRET = generate-random-string-here
   NODE_ENV = production
   PORT = 3000
   CORS_ORIGIN = https://your-vercel-domain.vercel.app
   GOOGLE_CLIENT_ID = your_google_client_id
   ```

4. **Deploy!** ✅

---

## 🗄️ Database: MongoDB Atlas (Free Tier)

### Setup Steps

1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Click "Create an account" (free)
3. Create organization and project
4. Click "Create a cluster" (select Free tier)
5. Choose cloud provider and region
6. Wait for cluster to create (~3-5 minutes)
7. Click "Connect"
   - Choose "Drivers"
   - Select Node.js
   - Copy connection string

### Sample Connection String
```
mongodb+srv://username:password@cluster0.abcde.mongodb.net/devtrack?retryWrites=true&w=majority
```

### Add to `.env`
```env
MONGO_URI=mongodb+srv://username:password@cluster0.abcde.mongodb.net/devtrack
```

---

## 🔑 Google OAuth Setup

### Update Google Credentials for Production

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Select your project
3. Go to "Credentials"
4. Click on your OAuth 2.0 Client ID
5. Add authorized origins:
   ```
   https://your-frontend-domain.vercel.app
   https://your-frontend-domain.netlify.app
   ```
6. Add authorized redirect URIs:
   ```
   https://your-frontend-domain.vercel.app/
   ```
7. Save changes

---

## 🚀 Option 4: DigitalOcean (VPS - More Control)

For more control, use DigitalOcean's Droplet.

### Step 1: Create Droplet

1. Go to [digitalocean.com](https://digitalocean.com)
2. Click "Create" → "Droplet"
3. Choose Ubuntu 22.04 LTS
4. Select Basic plan ($4/month)
5. Choose data center nearest to you
6. SSH key setup (or password)
7. Create droplet

### Step 2: SSH into Droplet

```bash
ssh root@your_droplet_ip
```

### Step 3: Install Dependencies

```bash
# Update system
apt update && apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install -y nodejs

# Install MongoDB
apt install -y mongodb

# Install PM2 (process manager)
npm install -g pm2

# Install Nginx (reverse proxy)
apt install -y nginx
```

### Step 4: Clone Repository

```bash
cd /home
git clone https://github.com/Advaith4/Streaker.AI.git
cd Streaker.AI/server
```

### Step 5: Setup Backend

```bash
npm install

# Create .env file
nano .env
# Add your environment variables
```

### Step 6: Start Backend with PM2

```bash
pm2 start server.js --name "streaker-backend"
pm2 startup
pm2 save
```

### Step 7: Setup Frontend

```bash
cd ../client
npm install
npm run build
```

### Step 8: Configure Nginx

Create `/etc/nginx/sites-available/streaker`:

```nginx
server {
    listen 80;
    server_name your_domain.com www.your_domain.com;

    # Frontend
    location / {
        root /home/Streaker.AI/client/build;
        try_files $uri $uri/ /index.html;
    }

    # Backend API proxy
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site and test:

```bash
ln -s /etc/nginx/sites-available/streaker /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### Step 9: SSL Certificate (HTTPS)

```bash
apt install certbot python3-certbot-nginx -y
certbot --nginx -d your_domain.com -d www.your_domain.com
```

---

## ✅ Post-Deployment Checklist

After deployment, verify:

- ✅ Frontend loads without errors
- ✅ Login/Signup works
- ✅ Google OAuth works
- ✅ Dashboard displays
- ✅ Can add problems and mark as solved
- ✅ Heatmap renders correctly
- ✅ Activity tracking works
- ✅ Profile page loads
- ✅ API calls are successful

### Test Backend Health

```bash
curl https://your-backend-url.com/
```

Expected response:
```json
{"status":"ok","app":"Streaker.ai API"}
```

---

## 🔧 Common Issues & Solutions

### Issue: CORS Errors

**Solution:** Update `CORS_ORIGIN` in backend `.env`:
```env
CORS_ORIGIN=https://your-frontend-domain.com
```

### Issue: MongoDB Connection Fails

**Solution:** 
- Check MongoDB Atlas IP whitelist (allow all IPs or add your server IP)
- Verify connection string format
- Check username/password in connection string

### Issue: Google OAuth Not Working

**Solution:**
- Add frontend domain to Google OAuth authorized origins
- Check `REACT_APP_GOOGLE_CLIENT_ID` matches in frontend

### Issue: Environment Variables Not Loaded

**Solution:**
- Verify `.env` file exists in correct directory
- On Render/Railway: Add via dashboard UI, don't use `.env` files
- Restart application after adding variables

---

## 📊 Monitoring & Logging

### View Logs

**Railway:**
```
Dashboard → Logs tab
```

**Render:**
```
Dashboard → Logs
```

**DigitalOcean (PM2):**
```bash
pm2 logs streaker-backend
pm2 monit
```

### Database Monitoring

**MongoDB Atlas:**
```
Cluster → Metrics → View monitoring data
```

---

## 🔐 Security Best Practices

- ✅ Never commit `.env` files to git
- ✅ Use strong `JWT_SECRET` (generate random: `openssl rand -base64 32`)
- ✅ Enable HTTPS/SSL (Let's Encrypt free)
- ✅ Keep dependencies updated: `npm audit fix`
- ✅ Use environment variables for all secrets
- ✅ Enable MongoDB IP whitelist
- ✅ Set `NODE_ENV=production`

---

## 💡 Quick Deployment Summary

### Fastest (5 minutes):
1. Deploy backend on **Railway** 
2. Deploy frontend on **Vercel**
3. Update environment variables

### Recommended (10 minutes):
1. Create MongoDB Atlas cluster
2. Deploy backend on Railway
3. Deploy frontend on Vercel
4. Configure Google OAuth

### Full Control (DigitalOcean):
1. Create VPS droplet ($4/month)
2. Install Node.js and MongoDB
3. Deploy both frontend and backend
4. Configure Nginx and SSL

---

## 📞 Support Resources

- **Render Docs:** https://render.com/docs
- **Railway Docs:** https://docs.railway.app
- **Vercel Docs:** https://vercel.com/docs
- **MongoDB Atlas:** https://docs.mongodb.com/atlas
- **DigitalOcean:** https://docs.digitalocean.com

---

**Choose your deployment platform and follow the steps above. Happy deploying! 🚀**
