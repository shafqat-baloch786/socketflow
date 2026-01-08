# SocketFlow - Real-Time Chat Application

[![Node.js](https://img.shields.io/badge/Node.js-v18-green)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-blue)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-v6.0-green)](https://www.mongodb.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-v4.0-yellow)](https://socket.io/)

---

## Table of Contents

* [Overview](#overview)
* [Live Demo](#live-demo)
* [Features](#features)
* [How It Works](#how-it-works)
* [System Architecture](#system-architecture)
* [Tech Stack & Technical Challenges](#tech-stack--technical-challenges)
* [Future Improvements / Roadmap](#future-improvements--roadmap)
* [Installation](#installation)
* [Running the Project](#running-the-project)
* [Configuration](#configuration)
* [API Endpoints](#api-endpoints)
* [Socket.IO Events](#socketio-events)
* [Project Structure](#project-structure)
* [Contributing](#contributing)
* [License](#license)

---

## Overview

SocketFlow is a **real-time chat application** enabling users to securely register, login, maintain profiles, search for other users, and send/receive messages instantly. It uses **JWT-based authentication** and **Socket.IO** for real-time communication.

### Live Demo

> [Live Demo Link will be added here]
> (Replace with your hosted app link)

### Screenshot / GIF

![Chat Screenshot/GIF will be added here]

> (Add your screenshot or GIF link)

---

## Features

* User registration and login with JWT
* View and edit user profile
* Search users by name/email
* One-to-one real-time messaging
* Online/offline status tracking
* Unread message notifications
* Security-first approach using Helmet and Bcrypt
* Global error handling for all API routes

---

## How It Works

**User Login & JWT Flow**

1. User sends email/password → server validates → generates JWT → client stores token.
2. Token is sent in `Authorization` header for protected routes.

**Real-Time Messaging Flow**

1. Client emits `sendMessage` → server receives → stores in MongoDB.
2. Server emits `newMessage` to the recipient’s socket room.
3. UI updates immediately without refresh.

**Online Status Tracking**

* Socket connects → updates `isOnline` in DB.
* Socket disconnect → sets `isOnline = false` and updates `lastSeen`.
* Broadcasts status changes to all clients in real-time.

**Search Users / All Users**

* Search uses MongoDB regex queries → filters out current user → returns minimal fields.
* Optimized for performance using indexes on `_id` and `name/email`.

---

## System Architecture

**Architecture Pattern:** MVC (Model-View-Controller) + Middleware

**Message Flow:**

```
Frontend (React/Vue/HTML)
     │
     ├─> HTTP Requests (REST API) -> Express Routes -> Controllers -> MongoDB
     │
     └─> Socket.IO Events -> Socket Handlers -> MongoDB -> Emit to recipient
```

---

## Tech Stack & Technical Challenges

* **Backend**: Node.js, Express (lightweight, scalable)
* **Database**: MongoDB, Mongoose (NoSQL flexibility for chat data)
* **Realtime**: Socket.IO (automatic reconnection, room management)
* **Authentication**: JWT (stateless, secure)
* **Security**: Helmet (headers), Bcrypt (password hashing)

**Technical Challenges:**

* Efficiently storing and retrieving chat history using Mongoose aggregation.
* Linking socket IDs to users for real-time delivery.
* Global error handling using middleware to catch async errors.
* Maintaining online/offline status for users in real-time.

---

## Future Improvements / Roadmap

* Implement **group chats / channels**
* Add **message read receipts**
* Support **media/file uploads**
* Implement **end-to-end encryption**
* Add **push notifications / mobile integration**
* Enhance **search and filter functionalities**
* Optimize **scalability** for larger user bases

---

## Installation

1. Clone the repository:

```bash
git clone https://github.com/shafqat-baloch786/socketflow.git
cd socketflow/api
```

2. Install dependencies:

```bash
npm install
```

3. Ensure MongoDB is running locally or set up an Atlas cluster.

4. Run the server:

```bash
npm run dev   # runs server in development mode with hot reload
npm start     # runs server in production mode
```

---

## Running the Project

SocketFlow can be run in **three ways** depending on your setup.

### Option 1: Run Backend & Frontend Separately (Recommended for Development)

#### Backend (API)

```bash
cd api
npm install
npm start
```

* Backend runs on: `http://localhost:4000`
* Uses MongoDB (local or Atlas)

#### Frontend (Web)

```bash
cd web
npm install
npm run dev
```

* Frontend runs on: `http://localhost:5173` (or Vite default)
* Communicates with backend via REST + Socket.IO

---

### Option 2: Run Entire Project from Root (Docker Compose)

```bash
docker compose up
```

* Starts **backend**, **frontend**, and **MongoDB**
* No manual dependency setup required
* Uses environment variables from `.env`

To stop containers:

```bash
docker compose down
```

---

### Option 3: Manual Full Setup (Advanced)

```bash
npm install
npm run dev
```

> Requires correct environment variables and service configuration

---

## Configuration

Create a `.env` file in the root of `api`:

```
PORT=4000
MONGO_URI=<your-mongodb-uri>
JWT_SECRET=<your-jwt-secret>
JWT_EXPIRES_IN=7d
```

---

## API Endpoints

### Auth

| Method | Endpoint           | Request Body                | Response Example                 | Description       |
| ------ | ------------------ | --------------------------- | -------------------------------- | ----------------- |
| POST   | /api/auth/register | `{ name, email, password }` | `{ success: true, token, user }` | Register new user |
| POST   | /api/auth/login    | `{ email, password }`       | `{ success: true, token, user }` | Login user        |

### Profile

| Method | Endpoint          | Request Body                 | Response Example          | Description                  |
| ------ | ----------------- | ---------------------------- | ------------------------- | ---------------------------- |
| GET    | /api/profile      | -                            | `{ success: true, user }` | Get logged-in user's profile |
| PATCH  | /api/edit-profile | `{ name?, email?, avatar? }` | `{ success: true, user }` | Update profile               |

### Users

| Method | Endpoint   | Query/Body      | Response Example           | Description                  |
| ------ | ---------- | --------------- | -------------------------- | ---------------------------- |
| GET    | /api/users | -               | `{ success: true, users }` | Get all users excluding self |
| GET    | /api/user  | `?query=string` | `{ success: true, users }` | Search users by name/email   |

### Chat

| Method | Endpoint             | Request Body  | Response Example              | Description                  |
| ------ | -------------------- | ------------- | ----------------------------- | ---------------------------- |
| GET    | /api/chat/all-chats  | -             | `{ success: true, chats }`    | Get all recent conversations |
| GET    | /api/chat/:partnerId | -             | `{ success: true, messages }` | Get chat history with a user |
| POST   | /api/chat/:partnerId | `{ content }` | `{ success: true, message }`  | Send a message               |

---

## Socket.IO Events

| Event               | Type   | Data Payload                    | Description                                   |
| :------------------ | :----- | :------------------------------ | :-------------------------------------------- |
| `login`             | Emit   | `userId`                        | Login and attach Socket ID, join private room |
| `disconnect`        | Emit   | -                               | Triggered automatically when user disconnects |
| `sendMessage`       | Emit   | `{ recipientId, text }`         | Sends a message to a specific user            |
| `newMessage`        | Listen | `{ senderId, text, timestamp }` | Receives incoming messages in real-time       |
| `userStatusChanged` | Listen | `{ userId, isOnline }`          | Update online/offline status in UI            |

---

## Project Structure

```
socketflow/api
├── app.js
├── server.js
├── controllers
│   ├── auth_controller.js
│   ├── chat_controller.js
│   ├── profile_controller.js
│   └── user_controller.js
├── models
│   ├── Message.js
│   └── User.js
├── routes
│   ├── auth_router.js
│   ├── chat_routes.js
│   ├── profile_routes.js
│   └── user_routes.js
├── socket
│   └── index.js
├── utils
│   ├── catch_async.js
│   ├── Error_handler.js
│   └── generate_token.js
└── middlewares
    ├── authorization.js
    └── error_middleware.js
```

*Note: Excludes `web` folder and test scripts for a production-ready structure.*

---

## Contributing

1. Fork the repo
2. Create a branch: `git checkout -b feature/YourFeature`
3. Commit changes: `git commit -m "feat: Add your feature"`
4. Push branch: `git push origin feature/YourFeature`
5. Open a Pull Request

---

## License

MIT License
