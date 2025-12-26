# SocketFlow - Real-Time Chat Application

[![Node.js](https://img.shields.io/badge/Node.js-v18-green)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-blue)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-v6.0-green)](https://www.mongodb.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-v4.0-yellow)](https://socket.io/)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Configuration](#configuration)
- [API Endpoints](#api-endpoints)
- [Socket.IO Events](#socketio-events)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

SocketFlow is a **real-time chat application** that allows users to:

- Register and log in securely
- Maintain user profiles
- Search for other users
- Send and receive messages instantly
- View online/offline status of users

This app leverages **JWT-based authentication** for secure routes and **Socket.IO** for real-time communication.

---

## Features

- **Authentication**: Registration & Login with JWT
- **User Profiles**: View & edit profile data
- **User Management**: Fetch all users, search by name/email
- **Real-Time Messaging**: One-to-one messaging with unread status
- **Online Status**: Track online/offline users with last seen
- **Minimal & Clean API**: RESTful endpoints and Socket.IO events

---

## Tech Stack

- **Backend**: Node.js, Express
- **Database**: MongoDB, Mongoose
- **Realtime**: Socket.IO
- **Authentication**: JWT
- **Security**: Helmet, CORS
- **Password Hashing**: Bcrypt

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

3. Run the server:
```bash
npm run dev
```

Server will start on `http://localhost:4000`

---

## Configuration

Create a `.env` file in the root directory:

```
PORT=4000
MONGO_URI=<your-mongodb-uri>
JWT_SECRET=<your-jwt-secret>
JWT_EXPIRES_IN=7d
```

---

## API Endpoints

### Auth

| Method | Endpoint        | Description               |
|--------|----------------|---------------------------|
| POST   | /api/auth/register | Register new user       |
| POST   | /api/auth/login    | Login user             |

### Profile

| Method | Endpoint           | Description               |
|--------|------------------|---------------------------|
| GET    | /api/profile       | Get logged-in user's profile |
| PATCH  | /api/edit-profile  | Update logged-in user's profile |

### Users

| Method | Endpoint       | Description                         |
|--------|----------------|-------------------------------------|
| GET    | /api/users     | Get all users (excluding self)      |
| GET    | /api/user?query= | Search users by name/email         |

### Chat

| Method | Endpoint                | Description                       |
|--------|-------------------------|-----------------------------------|
| GET    | /api/chat/all-chats      | Get all recent conversations       |
| GET    | /api/chat/:partnerId     | Get chat history with a specific user |
| POST   | /api/chat/:partnerId     | Send a message to a specific user |

---

## Socket.IO Events

### Client emits:

- `login` – Log in a user and attach Socket ID
- `disconnect` – Triggered automatically when user disconnects

### Server emits:

- `newMessage` – Real-time new message
- `userStatusChanged` – Update online/offline status

---

## Project Structure

```
socketflow/api
├── app.js                 # Express application setup
├── server.js              # HTTP server + Socket.IO initialization
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
│   └── index.js            # Socket.IO handlers (test file removed)
├── utils
│   ├── catch_async.js
│   ├── Error_handler.js
│   └── generate_token.js
└── middlewares
    ├── authorization.js
    └── error_middleware.js
```

*Note: Test and client scripts are excluded for a cleaner, production-ready structure.*

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/YourFeature`
3. Commit your changes: `git commit -m "feat: Add your feature"`
4. Push to the branch: `git push origin feature/YourFeature`
5. Open a pull request

---

## License

This project is licensed under the MIT License.

