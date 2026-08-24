# 📚 BookNest — Full-Stack Bookstore E-commerce Platform

A complete MERN (MongoDB, Express, React, Node.js) e-commerce application for browsing, purchasing and managing books online — built with real authentication, real payments, and a full admin dashboard.

**🔗 Live site:** https://bookstore-app-drab-eight.vercel.app
**🔗 Backend API:** https://bookstore-app-f9y2.onrender.com
**🔗 GitHub:** https://github.com/Sana190304/bookstore-app

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 (Vite), React Router, Tailwind CSS, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose ODM) — hosted on MongoDB Atlas |
| Authentication | JWT (email/password) + Google OAuth 2.0 (Google Identity Services) |
| Payments | Razorpay (Cards, UPI/Google Pay, Netbanking, Wallets) |
| Deployment | Frontend → Vercel · Backend → Render · DB → MongoDB Atlas |

---

## ✨ Features

**Customer side**
- Browse books with search (by title) and category filter (Fiction / Non-fiction / Academic)
- Book detail page with star ratings, description, stock status
- Add to cart, update quantity, remove items (cart persists in `localStorage`)
- Wishlist (heart icon toggles on/off, synced with backend)
- Checkout with shipping address form
- Real payment via Razorpay checkout popup (test mode)
- Order history with live order status (pending / shipped / delivered / cancelled)
- Sign up / Login with email+password **or** "Continue with Google"

**Admin side** (role-based, `role: "admin"` on the user)
- Add / edit / delete books (title, author, price, stock, category, cover image URL)
- View all customer orders
- Update order status

**Engineering**
- JWT-protected routes on both frontend (`ProtectedRoute` component) and backend (`authMiddleware`)
- Password hashing with bcrypt
- Server-side payment signature verification (Razorpay HMAC SHA256) — the frontend can never fake a "successful" order
- Responsive design (mobile / tablet / desktop)
- SPA routing fix for Vercel (`vercel.json` rewrite rule so deep links like `/login` don't 404)

---

## 🏗️ Architecture

```
┌─────────────────┐         HTTPS/JSON          ┌──────────────────┐
│   React (Vite)   │  ────────────────────────▶  │  Express.js API  │
│   Vercel (CDN)    │  ◀────────────────────────  │  Render (Node)   │
└─────────────────┘                              └──────────────────┘
                                                          │
                                    ┌─────────────────────┼─────────────────────┐
                                    ▼                     ▼                     ▼
                              MongoDB Atlas          Razorpay API        Google OAuth
                              (books, users,         (payment order       (Identity
                               orders)                 creation +          Services /
                                                        verification)      token verify)
```

- Frontend calls the backend only through `/api/*` — the base URL is set via `VITE_API_URL` (empty in dev, using Vite's proxy; the Render URL in production).
- Every request that needs auth carries `Authorization: Bearer <JWT>` (attached automatically by an Axios interceptor).
- The backend never trusts the frontend for payment status — it re-verifies the Razorpay signature itself before marking an order "paid".

---

## 📁 Folder Structure

```
bookstore-app/
├── backend/
│   ├── config/db.js              # MongoDB connection
│   ├── models/                   # User, Book, Order (Mongoose schemas)
│   ├── controllers/               # business logic per resource
│   ├── routes/                   # Express routers
│   ├── middleware/authMiddleware.js  # JWT verification + admin check
│   ├── seed.js                   # populates sample books + admin user
│   └── index.js                  # app entry point
│
└── frontend/
    ├── src/
    │   ├── api/axios.js          # shared Axios instance + token interceptor
    │   ├── context/              # AuthContext, CartContext (React Context API)
    │   ├── components/           # Navbar, BookCard, AuthLayout, ProtectedRoute, Admin* 
    │   └── pages/                # Home, Login, Register, Cart, Checkout, BookDetails, etc.
    └── vercel.json                # SPA rewrite rule
```

---

## 🔌 API Reference

Base URL (production): `https://bookstore-app-f9y2.onrender.com/api`

### Auth — `/api/auth`

| Method | Endpoint | Auth? | Body | Description |
|---|---|---|---|---|
| POST | `/auth/register` | No | `{ name, email, password }` | Create a customer account, returns JWT |
| POST | `/auth/login` | No | `{ email, password }` | Login, returns JWT |
| POST | `/auth/google` | No | `{ credential }` (Google ID token) | Verifies token with Google, logs in / auto-creates account |
| GET | `/auth/me` | Yes | — | Returns the logged-in user's profile |

### Books — `/api/books`

| Method | Endpoint | Auth? | Description |
|---|---|---|---|
| GET | `/books?search=&category=&minPrice=&maxPrice=` | No | List/filter/search books |
| GET | `/books/:id` | No | Single book details |
| POST | `/books` | Admin | Create a book |
| PUT | `/books/:id` | Admin | Update a book |
| DELETE | `/books/:id` | Admin | Delete a book |

### Orders — `/api/orders`

| Method | Endpoint | Auth? | Description |
|---|---|---|---|
| POST | `/orders` | Yes | Create an order **after** payment — verifies Razorpay signature server-side, reduces stock |
| GET | `/orders/my` | Yes | Logged-in user's own orders |
| GET | `/orders` | Admin | All orders (with customer info) |
| PUT | `/orders/:id/status` | Admin | Update order status |

### Payment — `/api/payment`

| Method | Endpoint | Auth? | Description |
|---|---|---|---|
| POST | `/payment/create-order` | Yes | Creates a Razorpay order for the cart total; frontend opens the Razorpay checkout with the returned `order_id` |

### Users / Wishlist — `/api/users`

| Method | Endpoint | Auth? | Description |
|---|---|---|---|
| GET | `/users/wishlist` | Yes | Get the logged-in user's wishlisted books |
| POST | `/users/wishlist/:bookId` | Yes | Toggle a book in/out of the wishlist |

---

## 🔐 Authentication Flow

1. **Email/password:** user submits form → backend checks bcrypt hash → signs a JWT (`jsonwebtoken`, 7-day expiry) → frontend stores `{ user, token }` in `localStorage`.
2. **Google Sign-In:** Google's Identity Services button returns a signed **ID token** to the frontend → frontend sends it to `/api/auth/google` → backend verifies it with `google-auth-library` against Google's servers → creates the user on first login (no password needed) or logs in an existing one → issues our own JWT exactly like the email flow, so the rest of the app doesn't care which method was used.
3. Every protected request attaches `Authorization: Bearer <JWT>` via an Axios request interceptor.
4. Backend `authMiddleware.protect` decodes the JWT and attaches `req.user`; `adminOnly` middleware additionally checks `req.user.role === "admin"`.

## 💳 Payment Flow (Razorpay)

1. User clicks **"Pay & Place Order"** on Checkout.
2. Frontend calls `POST /api/payment/create-order` with the cart total → backend creates a Razorpay order (server-side, using the secret key) → returns `{ id, amount, currency }`.
3. Frontend opens Razorpay's checkout popup using that `order_id` (public key only, safe to expose).
4. On success, Razorpay's popup returns `razorpay_order_id`, `razorpay_payment_id`, `razorpay_signature` to the frontend.
5. Frontend sends those + the cart items to `POST /api/orders`.
6. **Backend re-computes the HMAC-SHA256 signature itself** using the Razorpay secret and compares it — only if it matches does it create the Order document and decrement book stock. This means a malicious client can never fabricate a "successful" order without an actual valid payment.

---

## ⚙️ Environment Variables

**Backend** (`backend/.env`)
```
PORT=5000
MONGO_URI=<MongoDB Atlas connection string>
JWT_SECRET=<random secret for signing JWTs>
CLIENT_URL=<deployed frontend URL, for CORS>
RAZORPAY_KEY_ID=<Razorpay public key>
RAZORPAY_KEY_SECRET=<Razorpay secret key>
GOOGLE_CLIENT_ID=<Google OAuth client ID>
```

**Frontend** (`frontend/.env`)
```
VITE_RAZORPAY_KEY_ID=<same Razorpay public key>
VITE_GOOGLE_CLIENT_ID=<same Google OAuth client ID>
VITE_API_URL=<deployed backend URL, e.g. https://bookstore-app-f9y2.onrender.com>
```

---

## 🚀 Running Locally

```bash
# Backend
cd backend
npm install
npm run dev        # nodemon, http://localhost:5000

# Frontend (separate terminal)
cd frontend
npm install
npm run dev         # Vite, http://localhost:5173
```

Seed sample data (4 categories × 3 books + one admin account):
```bash
cd backend
npm run seed
# creates admin@bookstore.com / admin123
```
