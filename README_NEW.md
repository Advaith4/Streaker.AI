# 🔥 Streaker.ai

**A premium, AI-powered Data Structures and Algorithms (DSA) tracking platform.** Built with the MERN stack (MongoDB, Express, React, Node.js), it helps developers maintain consistency, visualize their coding journey, and achieve algorithmic mastery through streak tracking, activity heatmaps, and personalized progress monitoring.

---

## ✨ Key Features

### 🔐 Authentication & Security
- **Google OAuth Integration**: Seamless one-tap login and registration with Google
- **JWT-Based Sessions**: Secure token-based authentication
- **Password Security**: Bcrypt password hashing for local accounts
- **Protected Routes**: Role-based access control (User/Admin)

### 📊 Progress Tracking
- **Dynamic Activity Heatmap**: GitHub-style visual heatmap showing daily problem-solving streaks
- **Streak System**: Track consecutive days of solving problems
- **Daily Problem Assignments**: Get daily DSA problem recommendations
- **Problem Status Tracking**: Mark problems as solved, track solve timestamps

### 🎯 DSA Management
- **Problem Database**: Organized DSA problems by topic and difficulty level
- **Difficulty Levels**: Easy, Medium, Hard categorization
- **Personal Notes**: Add custom notes and code solutions for each problem
- **Topic Organization**: Filter and organize problems by DSA topics
- **Resource Links**: Save LeetCode and GeeksforGeeks problem links

### 👤 User Dashboard
- **Profile Management**: View and update user information
- **Statistics Dashboard**: Overall progress metrics and achievements
- **Activity History**: Track all solved problems and dates
- **Performance Analytics**: Visual representation of progress over time

### 🎨 User Interface
- **Glassmorphic Design**: Modern, polished UI with custom CSS styling
- **Responsive Layout**: Works seamlessly on desktop and mobile
- **Dark Theme**: Eye-friendly dark mode design
- **Interactive Components**: Smooth animations and transitions
- **Premium SVG Icons**: Lucide React icons for beautiful iconography

---

## 📋 Tech Stack

### Frontend
- **React.js** (v19) – UI framework
- **React Router** (v7) – Client-side routing and navigation
- **Axios** (v1.15) – HTTP client for API calls
- **React Google OAuth** – Google authentication integration
- **React Calendar Heatmap** – Activity heatmap visualization
- **Lucide React** – Premium SVG icon library
- **React Toastify** – Toast notifications
- **Vanilla CSS** – Custom glassmorphism design system
- **JWT Decode** – Token decoding and validation

### Backend
- **Node.js & Express.js** (v5) – Server and routing
- **MongoDB & Mongoose** (v9) – NoSQL database and ODM
- **Google Auth Library** – OAuth token verification
- **JWT (JSON Web Tokens)** – Secure authentication
- **Bcrypt.js** (v3) – Password encryption
- **CORS** – Cross-origin resource sharing
- **Multer** – File upload handling
- **XLSX** – Excel file support
- **Dotenv** – Environment variable management

---

## 📁 Project Structure

```
devtrack/
├── client/                           # React Frontend
│   ├── public/
│   │   ├── index.html               # HTML entry point
│   │   ├── manifest.json            # PWA manifest
│   │   └── robots.txt               # SEO robots file
│   ├── src/
│   │   ├── components/              # Reusable React components
│   │   │   ├── Navbar.jsx           # Main navigation
│   │   │   ├── DSANavbar.jsx        # DSA section navigation
│   │   │   ├── ProblemCard.jsx      # Problem display card
│   │   │   ├── ProtectedRoute.js    # Authentication wrapper
│   │   │   └── heatmap/
│   │   │       ├── ActivityHeatmap.jsx      # Main heatmap component
│   │   │       ├── HeatmapComponents.jsx    # Heatmap utilities
│   │   │       └── DayDetailModal.jsx       # Day detail popup
│   │   ├── pages/                   # Page components
│   │   │   ├── Login.js             # Login page
│   │   │   ├── Signup.js            # Registration page
│   │   │   ├── Dashboard.js         # Main dashboard
│   │   │   ├── DSADashboard.jsx     # DSA tracker dashboard
│   │   │   ├── DailyProblems.jsx    # Daily problem view
│   │   │   └── Profile.js           # User profile
│   │   ├── services/
│   │   │   └── api.js               # Axios API configuration
│   │   ├── App.js                   # Main app component with routes
│   │   ├── App.css                  # App styles
│   │   ├── index.js                 # React entry point
│   │   ├── index.css                # Global styles
│   │   ├── dsa.css                  # DSA-specific styles
│   │   └── setupTests.js            # Test configuration
│   ├── build/                       # Production build output
│   ├── package.json                 # Frontend dependencies
│   └── README.md
│
└── server/                          # Node/Express Backend
    ├── config/
    │   └── db.js                   # MongoDB connection configuration
    ├── controllers/                # Business logic
    │   ├── authController.js       # Authentication logic
    │   ├── userController.js       # User management
    │   ├── problemController.js    # Problem CRUD operations
    │   ├── solveController.js      # Problem solving logic
    │   ├── dailyController.js      # Daily problem assignments
    │   ├── historyController.js    # User history tracking
    │   └── notesController.js      # Notes management
    ├── models/                     # Mongoose schemas
    │   ├── user.js                 # User schema
    │   ├── Problem.js              # Problem schema
    │   ├── DailyLog.js             # Daily activity logging
    │   └── UserProblem.js          # Per-user problem tracking
    ├── routes/                     # API endpoints
    │   ├── authRoutes.js           # /api/auth
    │   ├── userRoutes.js           # /api/users
    │   ├── problemRoutes.js        # /api/problems
    │   ├── solveRoutes.js          # /api/solve
    │   ├── dailyRoutes.js          # /api/daily
    │   ├── historyRoutes.js        # /api/history
    │   └── notesRoutes.js          # /api/notes
    ├── middleware/                 # Custom middleware
    │   ├── authMiddleware.js       # JWT verification
    │   └── roleMiddleware.js       # Role-based access control
    ├── data/                       # Seed/sample data
    ├── server.js                   # Express app setup & server
    ├── package.json                # Backend dependencies
    ├── seed.js                     # Database seeding script
    ├── debug.js                    # Debugging utilities
    └── README.md

```

---

## 🚀 Installation & Setup

### Prerequisites
- **Node.js** (v16 or higher) and npm/yarn
- **MongoDB** (local or MongoDB Atlas cloud)
- **Google OAuth credentials** (for authentication)
- **Git**

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/devtrack.git
cd devtrack
```

### Step 2: Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:

```env
# Database
MONGO_URI=mongodb://localhost:27017/devtrack
# or use MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/devtrack

# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your_super_secret_jwt_key_here

# CORS
CORS_ORIGIN=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id_here
```

### Step 3: Frontend Setup

```bash
cd ../client
npm install
```

Create a `.env` file in the `client` directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id_here
```

### Step 4: (Optional) Seed the Database

```bash
cd server
npm run seed
```

---

## 📦 Running the Application

### Development Mode

**Terminal 1 - Start Backend Server:**
```bash
cd server
npm start
```

The backend will run on `http://localhost:5000`

**Terminal 2 - Start Frontend Dev Server:**
```bash
cd client
npm start
```

The frontend will open at `http://localhost:3000`

### Production Build

**Build Frontend:**
```bash
cd client
npm run build
```

The optimized build will be in `client/build/`

**Run Backend in Production:**
```bash
cd server
NODE_ENV=production npm start
```

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login with credentials |
| POST | `/api/auth/google` | Google OAuth login |
| POST | `/api/auth/logout` | Logout user |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/profile` | Get user profile |
| PUT | `/api/users/profile` | Update user profile |
| GET | `/api/users/stats` | Get user statistics |

### Problems
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/problems` | Get all problems |
| GET | `/api/problems/:id` | Get problem by ID |
| POST | `/api/problems` | Create new problem (Admin) |
| PUT | `/api/problems/:id` | Update problem (Admin) |
| DELETE | `/api/problems/:id` | Delete problem (Admin) |
| GET | `/api/problems/topic/:topic` | Get problems by topic |

### Problem Solving
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/solve/mark` | Mark problem as solved |
| GET | `/api/solve/user-problems` | Get user's solved problems |
| POST | `/api/solve/notes` | Add notes to problem |

### Daily Tracking
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/daily/heatmap` | Get activity heatmap data |
| GET | `/api/daily/assigned` | Get daily assigned problems |
| POST | `/api/daily/assign` | Assign daily problems |

### History & Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/history/user` | Get user problem history |
| GET | `/api/history/stats` | Get user statistics |

### Notes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notes` | Get all notes |
| POST | `/api/notes` | Create note |
| PUT | `/api/notes/:id` | Update note |
| DELETE | `/api/notes/:id` | Delete note |

---

## 💡 Usage Guide

### 1. **Getting Started**
   - Visit `http://localhost:3000`
   - Click "Sign up" or login with Google
   - Complete registration with your details

### 2. **Dashboard**
   - View your overall statistics
   - See your current streak
   - Access quick links to all features

### 3. **DSA Tracker**
   - Browse problems by topic and difficulty
   - Mark problems as solved
   - Add personal notes and code solutions
   - Track your progress with the activity heatmap

### 4. **Daily Problems**
   - View problems assigned for today
   - Solve and track your daily progress
   - Build consistent coding habits

### 5. **Profile**
   - View your user information
   - Update profile details
   - See all-time statistics and achievements

### 6. **Activity Heatmap**
   - Visual representation of your solving streak
   - Click on a day to see detailed stats
   - Track your most productive periods

---

## 🔐 Security Features

- **Password Hashing**: All passwords are hashed using Bcrypt (10 salt rounds)
- **JWT Authentication**: Secure token-based session management
- **CORS Protection**: Configurable cross-origin request handling
- **Role-Based Access**: Admin and user roles for permission control
- **OAuth 2.0**: Google authentication for enhanced security
- **Protected Routes**: Frontend route guards for authenticated users

---

## 📊 Database Models

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (user/admin),
  createdAt: Date,
  updatedAt: Date
}
```

### Problem Model
```javascript
{
  title: String,
  topic: String,
  difficulty: String (Easy/Medium/Hard),
  solved: Boolean,
  notes: String,
  code: String,
  solvedAt: Date,
  gfgUrl: String,
  leetcodeUrl: String,
  createdAt: Date,
  updatedAt: Date
}
```

### UserProblem Model
```javascript
{
  userId: ObjectId (ref: User),
  problemId: ObjectId (ref: Problem),
  solved: Boolean,
  notes: String,
  code: String,
  solvedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### DailyLog Model
```javascript
{
  userId: ObjectId (ref: User),
  date: Date,
  problemsAssigned: [ObjectId],
  problemsSolved: [ObjectId],
  count: Number,
  createdAt: Date
}
```

---

## 🛠️ Development Tools

### Available Scripts

**Frontend:**
```bash
npm start     # Start dev server on port 3000
npm build     # Build for production
npm test      # Run tests
npm eject     # Eject from create-react-app (irreversible)
```

**Backend:**
```bash
npm start     # Start server on port 5000
npm run seed  # Seed database with sample data
```

---

## 📝 Environment Variables

### Backend (`.env`)
```env
MONGO_URI=               # MongoDB connection string
PORT=5000               # Server port
NODE_ENV=development    # Environment (development/production)
JWT_SECRET=             # JWT signing secret
CORS_ORIGIN=            # Allowed origins
GOOGLE_CLIENT_ID=       # Google OAuth client ID
```

### Frontend (`.env`)
```env
REACT_APP_API_URL=      # Backend API base URL
REACT_APP_GOOGLE_CLIENT_ID=  # Google OAuth client ID
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/YourFeature`
3. Commit changes: `git commit -m 'Add YourFeature'`
4. Push to branch: `git push origin feature/YourFeature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the ISC License – see the LICENSE file for details.

---

## 🙋 Support

For issues, questions, or suggestions, please open an issue on GitHub or contact the development team.

---

## 🎯 Future Roadmap

- [ ] Integration with LeetCode and GeeksforGeeks APIs
- [ ] AI-powered problem recommendations
- [ ] Community leaderboard
- [ ] Advanced analytics and performance insights
- [ ] Mobile app (React Native)
- [ ] Problem difficulty prediction
- [ ] Collaboration features
- [ ] Export progress reports

---

**Happy Coding! 🚀**

Made with ❤️ using MERN Stack
