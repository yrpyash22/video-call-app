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

flowchart TD

subgraph group_client["Web Client"]
  node_app["React App<br/>[App.jsx]"]
  node_authpage["Sign In / Up<br/>[authentication.jsx]"]
  node_authcontext["Auth Context<br/>[AuthContext.jsx]"]
  node_home["Home Page<br/>[home.jsx]"]
  node_historypage["History Page<br/>[history.jsx]"]
  node_meeting["Meeting UI<br/>[VideoMeet.jsx]"]
end

subgraph group_api["Account API"]
  node_apiapp["Express Server<br/>[app.js]"]
  node_routes["User Routes<br/>[user.routes.js]"]
  node_usercontroller["User Controller<br/>[user.controller.js]"]
  node_usermodel["User Model<br/>[userModel.js]"]
  node_meetingmodel["Meeting Model<br/>[meetingModel.js]"]
end

subgraph group_realtime["Call Realtime"]
  node_socketserver["Socket Signaling<br/>[socketManage.js]"]
end

node_user(("Caller"))
node_browsermedia["Browser Media"]
node_mongodb[("MongoDB")]
node_peers(("Other Call Peers"))

node_user -->|"uses"| node_app
node_app -->|"routes to"| node_authpage
node_app -->|"routes to"| node_home
node_app -->|"routes to"| node_historypage
node_app -->|"routes to"| node_meeting
node_authpage -->|"invokes auth"| node_authcontext
node_home -->|"uses auth"| node_authcontext
node_historypage -->|"uses history"| node_authcontext
node_authcontext -->|"HTTP requests"| node_apiapp
node_apiapp -->|"mounts routes"| node_routes
node_routes -->|"dispatches"| node_usercontroller
node_usercontroller -->|"reads/writes users"| node_usermodel
node_usercontroller -->|"reads/writes history"| node_meetingmodel
node_usermodel -->|"persists users"| node_mongodb
node_meetingmodel -->|"persists meetings"| node_mongodb
node_apiapp -->|"starts socket server"| node_socketserver
node_meeting -->|"joins / signals / chats"| node_socketserver
node_socketserver -->|"dispatches events"| node_peers
node_peers -->|"sends events"| node_socketserver
node_meeting -->|"requests media"| node_browsermedia
node_meeting -->|"WebRTC media"| node_peers

click node_app "https://github.com/yrpyash22/video-call-app/blob/main/frontend/src/App.jsx"
click node_authpage "https://github.com/yrpyash22/video-call-app/blob/main/frontend/src/pages/authentication.jsx"
click node_authcontext "https://github.com/yrpyash22/video-call-app/blob/main/frontend/src/contexts/AuthContext.jsx"
click node_home "https://github.com/yrpyash22/video-call-app/blob/main/frontend/src/pages/home.jsx"
click node_historypage "https://github.com/yrpyash22/video-call-app/blob/main/frontend/src/pages/history.jsx"
click node_meeting "https://github.com/yrpyash22/video-call-app/blob/main/frontend/src/pages/VideoMeet.jsx"
click node_apiapp "https://github.com/yrpyash22/video-call-app/blob/main/backend/src/app.js"
click node_routes "https://github.com/yrpyash22/video-call-app/blob/main/backend/src/routes/user.routes.js"
click node_usercontroller "https://github.com/yrpyash22/video-call-app/blob/main/backend/src/controllers/user.controller.js"
click node_usermodel "https://github.com/yrpyash22/video-call-app/blob/main/backend/src/models/userModel.js"
click node_meetingmodel "https://github.com/yrpyash22/video-call-app/blob/main/backend/src/models/meetingModel.js"
click node_socketserver "https://github.com/yrpyash22/video-call-app/blob/main/backend/src/controllers/socketManage.js"

classDef toneNeutral fill:#f8fafc,stroke:#334155,stroke-width:1.5px,color:#0f172a
classDef toneBlue fill:#dbeafe,stroke:#2563eb,stroke-width:1.5px,color:#172554
classDef toneAmber fill:#fef3c7,stroke:#d97706,stroke-width:1.5px,color:#78350f
classDef toneMint fill:#dcfce7,stroke:#16a34a,stroke-width:1.5px,color:#14532d
classDef toneRose fill:#ffe4e6,stroke:#e11d48,stroke-width:1.5px,color:#881337
classDef toneIndigo fill:#e0e7ff,stroke:#4f46e5,stroke-width:1.5px,color:#312e81
classDef toneTeal fill:#ccfbf1,stroke:#0f766e,stroke-width:1.5px,color:#134e4a
class node_app,node_authpage,node_authcontext,node_home,node_historypage,node_meeting,node_browsermedia toneBlue
class node_apiapp,node_routes,node_usercontroller,node_usermodel,node_meetingmodel,node_mongodb toneAmber
class node_socketserver toneMint
class node_user,node_peers toneIndigo

---

## 👤 Author

**yrpyash22**
[GitHub Profile](https://github.com/yrpyash22)
