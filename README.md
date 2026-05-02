# 🔥 Streaker.ai

**A premium, AI-powered Data Structures and Algorithms (DSA) tracking platform.** Built with the MERN stack (MongoDB, Express, React, Node.js), it helps developers maintain consistency, visualize their coding journey, and achieve algorithmic mastery.

---

## 🚀 Features

- **Google OAuth Authentication**: Seamless, one-tap login and registration with Google.
- **Dynamic Activity Heatmap**: GitHub-style visual heatmap to track your daily problem-solving streaks and identify your most productive days.
- **DSA Progress Tracker**: Organize solved problems by topic, difficulty, and personal notes.
- **Glassmorphic UI**: A highly polished, modern, and interactive user interface built with custom CSS.
- **Secure RESTful API**: Clean, robust backend architecture with JWT-based session management.

## 📋 Tech Stack

### Frontend
- **React.js** (v19)
- **React Router** (Routing & Navigation)
- **Axios** (HTTP Client)
- **Lucide-React** (Premium SVG Icons)
- **Vanilla CSS** (Custom Glassmorphism Design System)
- **React Google OAuth** (Authentication)

### Backend
- **Node.js & Express.js**
- **MongoDB & Mongoose** (ODM)
- **Google Auth Library** (OAuth Token Verification)
- **JWT (JSON Web Tokens)** & **Bcrypt.js** (Security)

## 📁 Project Structure

```
streaker-ai/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/    # Navbar, Heatmaps, Problem Cards
│   │   ├── pages/         # Dashboard, Profile, DSA Tracker
│   │   ├── services/      # API/Axios configuration
│   │   └── App.js
│   └── package.json
│
└── server/                # Node/Express backend
    ├── config/            # Database configuration
    ├── controllers/       # Business logic (Auth, Problems)
    ├── models/            # Mongoose schemas
    ├── routes/            # API endpoints
    ├── server.js
    └── package.json
```

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas URI)
- Google Cloud Console Account (for OAuth Client ID)

### Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GOOGLE_CLIENT_ID=your_google_oauth_client_id.apps.googleusercontent.com
PORT=5000
```

### Frontend Setup

```bash
cd client
npm install
```

Create a `.env` file in the `client` directory:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_GOOGLE_CLIENT_ID=your_google_oauth_client_id.apps.googleusercontent.com
```

## 🏃 Running the Application locally

**Start Backend Server**
```bash
cd server
node server.js
```
*(Server runs on `http://localhost:5000`)*

**Start Frontend Development Server**
```bash
cd client
npm start
```
*(Frontend runs on `http://localhost:3000`)*

## 🚀 Deployment

The recommended deployment architecture is:
- **Frontend**: [Vercel](https://vercel.com)
- **Backend**: [Render](https://render.com)

1. Deploy the backend to Render, ensuring environment variables (`MONGO_URI`, `JWT_SECRET`, `GOOGLE_CLIENT_ID`) are set.
2. Deploy the frontend to Vercel, pointing `REACT_APP_API_URL` to your live Render backend URL.
3. **Important**: Add your new Vercel URL to your Google Cloud Console's *Authorized JavaScript origins* to allow Google Login on production.

## 📄 License
This project is open source and available under the MIT License.

## 👤 Author
Advaith G
