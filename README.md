# Library Management System 📚

A full-stack, role-based Library Management System built with the MERN stack (MongoDB, Express, React, Node.js). 

## 🚀 Evaluator / Reviewer Guide

Since the database is running locally and contains a lot of interconnected data, I have provided a **Seed Script** so you do not have to manually enter books, members, or users from scratch. 

Follow these steps to test the project locally on your machine.

### 1. Prerequisites
- [Node.js](https://nodejs.org/) installed
- [MongoDB](https://www.mongodb.com/try/download/community) installed and running locally on port `27017`
- Git

### 2. Installation
Clone the repository and install the dependencies for both the frontend and backend:

```bash
# Clone the repository
git clone https://github.com/Nittin2004/Library-Management-System.git
cd Library-Management-System

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the `backend/` directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/library
JWT_SECRET=your_super_secret_jwt_key_here
```

### 4. Seed The Database (Important)
To avoid having to manually register users and add books, run the seed script. This will populate your local MongoDB with default data.

```bash
# Inside the backend folder
node seed.js
```

**Seed Script Credentials generated:**
- **Admin Login:** Username: `admin` | Password: `admin123`
- **User Login:** Username: `user` | Password: `user123`

### 5. Start the Application
You need to run both the frontend and backend servers.

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

The app will be available at `http://localhost:5173`. You can log in using the Admin or User credentials generated above.

## ✨ Features

- **Role-Based Access Control:** Separate dashboards and permissions for Admins and Regular Users.
- **Library Maintenance (Admin):** Add/Update Books and Movies.
- **Membership Management (Admin):** Register users for 6-month, 1-year, or 2-year memberships.
- **Transactions:** Issue books to members, accept returns, and automatically calculate overdue fines.
- **Comprehensive Reports:** View currently issued books, overdue books, and all active members.
- **Responsive Design:** Fully optimized for mobile, tablet, and desktop viewing.

## 🛠️ Technology Stack
- **Frontend:** React, Vite, React Router DOM, Vanilla CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Authentication:** JSON Web Tokens (JWT), Bcrypt.js
