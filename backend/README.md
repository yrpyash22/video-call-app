# Video Call App - Backend

This is the backend server for the **Video Call App**. It is built using **Node.js, Express.js, MongoDB (Mongoose)**, and **Socket.io** to provide a robust REST API and real-time signaling server for seamless video communication.

## 🚀 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (with Mongoose)
- **Real-time Communication:** Socket.io
- **Authentication & Security:** bcrypt, cors
- **Environment Management:** dotenv

## 📁 Folder Structure & File Overview

backend/
├── node_modules/           # Contains all npm dependencies
├── .env                    # Environment variables (DB_URL)
├── package.json            # Project metadata, scripts, and dependencies
├── package-lock.json       # Exact versions of installed dependencies
├── README.md               # Project documentation
└── src/                    # Main source code directory
    ├── app.js              # Application entry point. Sets up Express, middlewares, DB connection, and initializes Socket.io server.
    ├── controllers/        # Contains the business logic
    │   ├── socketManage.js # Handles Socket.io events, updates connection lists, notifies other clients, and deletes empty rooms. Exports the `io` instance.
    │   └── user.controller.js # Handles user authentication, registration, and operations.
    ├── models/             # Mongoose Database Schemas
    │   ├── meetingModel.js # Schema for storing meeting details and participant logs.
    │   └── userModel.js    # Schema for storing user details securely.
    └── routes/             # API Route definitions
        └── user.routes.js  # Defines endpoints for user operations and maps them to user.controller.js.

## ⚙️ Prerequisites

Before you begin, ensure you have met the following requirements:
- **Node.js** (v18 or higher recommended)
- **MongoDB** (Local instance or MongoDB Atlas cluster)

## 🛠️ Installation & Setup

1. **Clone the repository**:
   git clone <your-repository-url>
   cd backend

2. **Install dependencies**:
   npm install

3. **Set up Environment Variables**:
   Create a `.env` file in the root of your `backend` directory and add the following variable:
   DB_URL=your_mongodb_connection_string_here

## 📜 Available Scripts

In the project directory, you can run the following commands based on your `package.json`:

- `npm run dev` : Starts the server in development mode using `nodemon`. The server will automatically restart if you make any changes.
- `npm start` : Starts the server in production mode using Node.js directly.
- `npm run prod` : Starts the server using `pm2` for advanced production process management.

## 🔌 API & Socket Details

- **REST API:** Handled by Express routing (`src/routes`).
- **Socket Signaling:** Handled by `socketManage.js`. It manages WebRTC signaling by listening to custom events, handling client disconnections, and clearing empty rooms.

---
*Developed by Yashraj Prajapati*