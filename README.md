# VibeLog - Mood Tracking Application

VibeLog is a full-stack web application that allows users to track their moods and add journal entries. This application helps users monitor their emotional patterns over time.

## Technology Stack

### Frontend
- React.js with Vite
- Tailwind CSS for styling
- shadcn/ui for UI components
- React Router for navigation
- React Hook Form for form handling
- Axios for API requests

### Backend
- Node.js with Express.js
- PostgreSQL database
- JWT for authentication
- bcrypt for password hashing

## Features

- **User Authentication**: Sign up and login functionality with JWT authentication
- **Mood Logging**: Record your current mood with an optional journal entry
- **Mood History**: View your past mood logs chronologically
- **Responsive Design**: Works on desktop and mobile devices

## Project Structure

```
vibelog/
├── backend/                  # Express.js backend
│   ├── controllers/          # Request handlers
│   ├── middleware/           # Custom middleware
│   ├── models/               # Database models
│   ├── routes/               # API routes
│   ├── .env                  # Environment variables
│   ├── index.js              # Server entry point
│   └── package.json          # Backend dependencies
│
├── frontend/                 # React frontend
│   ├── public/               # Static files
│   ├── src/                  # Source files
│   │   ├── components/       # React components
│   │   │   └── ui/           # shadcn/ui components
│   │   ├── contexts/         # Context providers
│   │   ├── lib/              # Utility functions
│   │   ├── pages/            # Page components
│   │   ├── App.jsx           # Main App component
│   │   └── main.jsx          # Entry point
│   ├── index.html            # HTML template
│   └── package.json          # Frontend dependencies
│
└── README.md                 # Project documentation
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL database

### Installation

1. Clone the repository
2. Set up the backend:
   ```bash
   cd backend
   npm install
   ```
3. Configure your PostgreSQL connection string in `backend/.env`
4. Set up the frontend:
   ```bash
   cd frontend
   npm install
   ```
5. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```
6. Start the frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```
7. Access the application at `http://localhost:5173`

## Database Setup

The application will automatically create the necessary tables when it starts. Make sure your PostgreSQL server is running and the connection string in `backend/.env` is correct.

## Environment Variables

### Backend (.env file)
```
PORT=5000
DB_CONNECTION_STRING=postgres://username:password@localhost:5432/vibelog
JWT_SECRET=your_jwt_secret_key_here
```

Replace the placeholder values with your actual PostgreSQL credentials and a secure JWT secret.
