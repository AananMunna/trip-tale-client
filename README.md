# 🌍 Tourist Guide - Tourism Management System

## 🚀 Project Overview

The **Tourist Guide** is a dynamic tourism management platform focused on showcasing the beauty of **Bangladesh**. It assists travelers with curated packages, authentic stories, tour guides, and a community-driven platform. Designed for users, tour guides, and administrators — this MERN stack application offers seamless booking, real-time interactions, and a visually immersive experience.

---

## 🌐 Live Site

* **Live URL**: [https://trip-tale-3fd61.web.app/](https://trip-tale-3fd61.web.app/)

---

## ✨ Key Features (Top 10+ Highlights)

1. 🔐 **Role-Based Authentication** with Firebase & JWT (Tourist, Tour Guide, Admin)
2. 🌈 **Responsive UI** for Mobile, Tablet, and Desktop using Tailwind CSS + Framer Motion
3. 🏞️ **Dynamic Tourism Packages** with image gallery, tour plans, and booking form
4. 📖 **User-Generated Stories** with sharing capability via `react-share`
5. 📅 **Date Selection** using `react-datepicker`
6. 💳 **Secure Payments** via Stripe integration with status updates
7. 💬 **Toast & Sweet Alerts** for all CRUD operations, signups, logins, etc.
8. 🔍 **MongoDB \$sample Operator** used for dynamic content loading
9. ⚙️ **TanStack Query** for all data fetching (GET operations)
10. 👥 **User Dashboard** to manage profile, bookings, stories, and guide applications
11. 📊 **Admin Dashboard** with total stats, user management, role updates, and applications
12. 📂 **Tour Guide Dashboard** with assigned tours, accept/reject actions, and story management
13. 🔐 **Private Routes** persist after refresh (no login redirect)
14. 🌿 **Environment Variables** used for Firebase & MongoDB security
15. 🎉 **react-confetti** congratulations animation for power users (>3 bookings)

---

## 🧩 Tech Stack

* **Frontend**: React.js, Tailwind CSS, Framer Motion, React Share, React Tabs, React Datepicker, React Router
* **Backend**: Express.js, MongoDB, JWT, Stripe
* **Authentication**: Firebase Auth + JWT
* **State Management**: React Context + Tanstack Query

---

## 📄 Layout Breakdown

### 🔹 Basic Layout:

* Navbar: Logo, Home, Community, About Us, Trips, Login/Register
* Footer: Logo, Developer Social Links

### 🔸 Dashboard Layout:

* Sidebar: Role-based navigation
* Main Section: Dynamic content rendering

---

## 🧑‍💻 Authentication Features

* Email/Password Signup + Google Login
* Strong password validation
* Token-based secured routes (JWT)
* Forgot Password Option
* Logout functionality with token clearing

---

## 🗺️ Pages Overview

* **Home**: Banner, Overview Video, Tour Packages, Guides, Stories, Extra Sections
* **Community**: All shared stories with Facebook sharing
* **Trips**: All packages listed with details
* **About Us**: Developer info, projects, and contact
* **Dashboard**: Role-based custom routes

---

## 📦 Database Collections (MongoDB)

* `users`
* `bookings`
* `packages`
* `stories`
* `applications`
* `payments`

---

## 🛠️ Dev Tools & Packages

* `react-datepicker`
* `react-toastify`
* `sweetalert2`
* `react-tabs`
* `react-confetti`
* `framer-motion`
* `react-share`
* `react-select`
* `tanstack/react-query`
* `axios`

---

## 🧠 Special Logic Implemented

* Tour guide application system
* Story image management using `$push`/`$pull`
* Dynamic filtering using MongoDB queries (search, filter)
* Stripe payments triggering status updates
* Conditional dashboard routes based on roles

---

## 🧪 Optional Features (Implemented)

* 📸 Swiper / Slider for galleries
* 🔒 Axios Interceptors for auth error handling

---


---

> 👨‍💻 **Developed by Munna** — MERN Stack Developer and Tourism Enthusiast.

For any queries, feel free to connect! 🌐
