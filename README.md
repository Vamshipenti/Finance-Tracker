# 💰 Personal Finance Tracker - Backend (Node.js + Express)

This is the **backend server** of the Personal Finance Tracker App. It handles user authentication, transactions, and budget management. Built using **Node.js**, **Express**, and **MongoDB**, it exposes a secure REST API for the mobile frontend (React Native).

---

## ✅ Features

- 🔐 User Registration & Login (JWT-based)
- 🔑 Secure password handling with bcrypt
- 📄 CRUD operations for Transactions (income/expense)
- 🧮 Budget management & monitoring
- 📅 Date-based filters & summaries
- 🔁 Optional support for recurring transactions
- 📦 RESTful APIs

---

## ⚙️ Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB (Mongoose)**
- **JWT (jsonwebtoken)**
- **bcrypt**
- **dotenv**
- **Render** (for deployment)

---

## 📦 API Endpoints

### 🔐 Authentication
- `POST /api/auth/register` – Register a new user  
- `POST /api/auth/login` – Login and receive a JWT

### 💸 Transactions
- `GET /api/transactions` – Get all transactions (user-specific)  
- `POST /api/transactions` – Create a new transaction  
- `PUT /api/transactions/:id` – Update a transaction  
- `DELETE /api/transactions/:id` – Delete a transaction  

### 📊 Budgets
- `GET /api/budgets` – Get current budgets  
- `POST /api/budgets` – Create or update a budget  
- `GET /api/budgets/status` – Check current spending vs budget  

---

## 🛠️ Getting Started

### 1️⃣ Clone the repository
```bash
git clone https://github.com/Vamshipenti/Finance-Tracker.git
cd Finance-Tracker
