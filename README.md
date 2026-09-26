# 🎥 Video Call App

A real-time video calling application built with the **MERN stack**, featuring secure user authentication and peer-to-peer video calls.

![MERN Stack](https://img.shields.io/badge/Stack-MERN-61DAFB?style=flat-square&logo=react)

---

## ✨ Features

- 🔐 **User Authentication** – Secure sign up / login with hashed passwords and token-based sessions
- 📹 **Peer-to-Peer Video Calls** – Real-time audio/video communication using WebRTC
- 💬 **Real-Time Signaling** – Socket.io-powered signaling for instant call setup
- 🖥️ **Responsive UI** – Clean, modern interface that works across devices
- 🔗 **Room-Based Calls** – Create or join a call using a unique room ID / link

> Note: adjust the feature list above to exactly match what's implemented if any of these differ from your app.

---

## 🛠️ Tech Stack

**Frontend**
- React.js
- WebRTC (peer-to-peer media streaming)
- Socket.io-client

**Backend**
- Node.js
- Express.js
- Socket.io (signaling server)
- MongoDB with Mongoose (user data / auth)

**Auth**
- JSON Web Tokens (JWT)
- bcrypt for password hashing

---

## 📁 Project Structure

```
video-call-app/
├── backend/          # Express server, API routes, auth, and Socket.io signaling
├── frontend/         # React client application
└── .gitignore
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (local instance or a MongoDB Atlas connection string)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yrpyash22/video-call-app.git
   cd video-call-app
   ```

2. **Install backend dependencies**

   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**

   ```bash
   cd ../frontend
   npm install
   ```

### Environment Variables

Create a `.env` file inside the `backend/` directory with the following variables:

```env
DB_URL=mongodb://127.0.0.1:27017/videocall
```

If the frontend needs to know the backend URL, create a `.env` file inside `frontend/` as well:

```env
VITE_SERVER_URL=http://localhost:8000
```

> Update these variable names to match whatever your code actually reads via `process.env`.

### Running the App

**Start the backend server**

```bash
cd backend
npm start
```

**Start the frontend (in a new terminal)**

```bash
cd frontend
npm start
```

The app should now be running at `http://localhost:3000`, connected to the backend at `http://localhost:5000`.

---

## 📖 Usage

1. Sign up for a new account or log in with existing credentials.
2. Create a new call room, or join an existing one using a room ID / invite link.
3. Grant camera and microphone permissions when prompted.
4. Start your video call! 🎉

---

## 🗺️ Roadmap

- [ ] Screen sharing
- [ ] Group video calls (multi-peer)
- [ ] In-call chat
- [ ] Call recording

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 👤 Author

**yrpyash22**
[GitHub Profile](https://github.com/yrpyash22)

---

## Live Demo of Website
🎥[VIDEO CALL APP](https://video-call-app-one-omega.vercel.app/)
