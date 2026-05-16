# Premium EdTech & Library Management Platform

A modern, high-end, full-stack library management and educational technology platform built for seamless browsing, borrowing, and course study.

## ✨ Features

- **Robust Authentication**: Secure user registration and login using JWT and bcrypt password hashing.
- **Role-Based Access**: Specialized dashboard and capabilities based on user roles (Admin vs. Standard User).
- **Comprehensive Library Catalog**: Browse, search, and filter a wide variety of books including general literature and technical/EdTech resources.
- **Borrowing & Return System**: Users can borrow books with real-time inventory tracking and automatic due date calculation.
- **Personalized User Dashboard**: Track active borrowed books, read history, accumulated fines, and view recent notifications.
- **Admin Dashboard**: Full CRUD (Create, Read, Update, Delete) management capabilities for the library's catalog.
- **Real-Time Notifications**: Get notified instantly when you borrow or return books.
- **Premium UI/UX**: A highly responsive, cinematic, and interactive user interface built with Tailwind CSS and Framer Motion.

## 🛠️ Tech Stack

**Frontend**:
- **React**: Modern UI component library.
- **Vite**: Ultra-fast build tool and development server.
- **Tailwind CSS**: Utility-first styling for a beautiful, responsive, and custom design.
- **Framer Motion**: For smooth, dynamic micro-animations and transitions.
- **React Router DOM**: Client-side routing for seamless navigation.
- **Lucide React**: Beautiful and consistent iconography.

**Backend**:
- **Node.js & Express**: Fast, unopinionated, minimalist web framework for building the REST API.
- **SQLite (better-sqlite3)**: Lightweight, fast, and robust local database for storing users, books, and records.
- **JSON Web Tokens (JWT)**: Secure state-less user authentication.
- **Bcrypt.js**: Secure password hashing.

## ⚙️ How It Works

1. **Client-Server Architecture**: The React frontend provides a smooth single-page application experience, communicating with the Node.js/Express backend via a RESTful API.
2. **Data Management**: The backend connects to an SQLite database (`library.db`). SQLite acts as an efficient, file-based relational database that stores all persistent data without the need for a complex external database server.
3. **Authentication Flow**: When a user registers or logs in, the backend encrypts their credentials and returns a secure JWT token. The frontend stores this token and includes it in the HTTP headers (`Authorization: Bearer <token>`) for all subsequent protected API requests (like borrowing a book or accessing the dashboard).
4. **Borrowing Logic**: When a user borrows a book, the backend verifies inventory using SQLite transactions, deducts the available copies, calculates a return due date, logs the record, and triggers an automated user notification.

## 🚀 Running Locally

1. **Install Dependencies**:
   - In the `backend` folder: `npm install`
   - In the `frontend` folder: `npm install`

2. **Start the Backend**:
   - Navigate to the `backend` folder and run: `npm run dev` (Runs on port 5000)

3. **Start the Frontend**:
   - Navigate to the `frontend` folder and run: `npm run dev`
