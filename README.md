# 📚 StudySync - Online Group Study Assignment Platform

Welcome to **StudySync**, an interactive online group study platform built for assignment sharing, submission, and peer evaluation. This project is part of a MERN Stack job assessment by **BJET Inc.**, designed to showcase your capabilities as a Junior MERN Developer.

---

## 🌐 Live Website

🔗 [Live Link](https://studysync-d270a.web.app/)

---

## 🎯 Purpose

The aim of this project is to simulate a real-world collaborative assignment system where users (students) can:

- Create and publish assignments
- Submit assignments to friends
- Evaluate submitted assignments
- Gain feedback and marks
- Learn from each other in a seamless, responsive environment

---

## 🚀 Tech Stack

- **Frontend**: React.js, Tailwind CSS, DaisyUI, React Router, Axios, Framer Motion, SweetAlert2, React DatePicker, Lottie, JWT
- **Backend**: Node.js, Express.js, MongoDB, CORS, dotenv, JWT
- **Authentication**: Firebase Authentication (Email/Password + Google Login)
- **Deployment**: 
  - Client: Firebase
  - Server: Vercel

---

## 💡 Key Features

### ✅ Authentication
- Email & Password login/register
- Google OAuth login
- Password validation with custom rules
- JWT-based private route protection
- Environment variable protection for Firebase & MongoDB credentials

### 🏠 Public Pages
- **Home**: Banner, Features, FAQ (with Framer Motion animations)
- **Assignments**: View all assignments with filter & search (MongoDB based)

### 🔐 Private Pages (JWT Protected)
- **Create Assignment**: With validations, date picker, thumbnail & difficulty level
- **My Submitted Assignments**: Shows the user’s own submissions and feedback
- **Pending Assignments**: Only shows unmarked submissions; assign marks & feedback
- **View Assignment**: Detailed view with "Take Assignment" submission modal
- **Update/Delete Assignment**: Only creators can modify/delete their assignments

### 🎨 UI & UX
- Fully Responsive (Mobile, Tablet, Desktop)
- Light/Dark Theme Toggle
- Clean layout with modern animations using Framer Motion
- Success/Error toasts for all critical actions

### 🔍 Extra Features (Optional)
- Loading Spinner on Data Fetching
- Search & Filter Assignments by Difficulty (from MongoDB)
- Extra Feature: **Leaderboard** to show top contributors by number of assignments submitted & reviewed

---

## 📦 NPM Packages Used

### Frontend:
- `react-router-dom`
- `firebase`
- `react-hook-form`
- `sweetalert2`
- `axios`
- `framer-motion`
- `react-datepicker`
- `react-icons`
- `lottie-react`
- `jwt-decode`

### Backend:
- `express`
- `cors`
- `dotenv`
- `mongoose`
- `jsonwebtoken`
- `cookie-parser`

---

## 🛡️ Security
- Firebase keys stored in `.env.local`
- MongoDB URI stored in `.env`
- JWT tokens stored in cookies
- Auth headers validated on the backend

---

## 📋 Assignment Submission Requirements Covered

- ✅ Minimum 15+ meaningful commits on client
- ✅ Minimum 8+ meaningful commits on server
- ✅ Fully responsive across devices
- ✅ Color contrast & spacing optimized for recruiters
- ✅ Firebase and MongoDB secured via environment variables
- ✅ No CORS / 404 / 504 deployment issues
- ✅ Route reload stability ensured (SPA optimized)
- ✅ Firebase Auth Domain configured properly
- ✅ No forced redirect to login on reload (JWT retained)
- ✅ Custom theme toggle (Light/Dark)
- ✅ Extra Feature & Spinner added

---

## 🔐 JWT Implementation

- Token generated on login (email/password or Google)
- Stored securely on client (cookie/localStorage)
- All private route API calls validated on backend
- Invalid tokens return proper 401/403 responses (optional)

---

## 🧠 Pages Summary

| Page                    | Access      | Description |
|-------------------------|-------------|-------------|
| Home                    | Public      | Landing banner, features, FAQ |
| Login/Register          | Public      | Auth forms with validations |
| Assignments             | Public      | Browse all assignments with filter & search |
| View Assignment         | Private     | Detailed assignment view with submit option |
| Create Assignment       | Private     | Assignment form with validations |
| My Submitted Assignments| Private     | View own submissions, feedback, marks |
| Pending Assignments     | Private     | Evaluate others' submissions, give marks |
| Update Assignment       | Creator Only| Editable form with pre-filled data |
| Delete Assignment       | Creator Only| Confirmation modal + secure delete |

---

## 📝 Validation Rules

- **Auth**: 
  - Password must include uppercase, lowercase, number, special character, min 6 chars
- **Assignment**:
  - Description: min 20 characters
  - Marks: number only
  - Difficulty: must be selected
  - Thumbnail URL: valid link
- **Submission**:
  - Google Docs URL: required
  - Notes: minimum 15 characters

---

## 📌 Deployment Notes

- Client hosted on **Firebase**
- Server hosted on **Vercel**
- Firebase auth domains set up
- MongoDB URI & Firebase keys hidden using `.env`
- No route errors on reload
- Works perfectly on mobile, tab, and desktop

---

## 🤝 Credits

This project was developed as a part of the **BJET Inc. Junior MERN Developer Assessment**. All logic, design, and features were custom-built by **[Aanan Munna]**.

---

## 🧑‍💻 Contact

📧 Email: aananmunna420@gmail.com  
📍 Location: Bangladesh

---

## 🔚 Final Note

If you're a recruiter or hiring manager, I hope this project demonstrates my ability to work with full-stack technologies, build scalable REST APIs, manage authentication, apply validation and security, and design polished user experiences with responsiveness and animations.

**Thank you for reviewing!** 🌱
