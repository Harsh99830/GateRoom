# GateRoom

GateRoom is a dedicated peer-to-peer matchmaking and real-time collaboration network built exclusively for GATE aspirants in India. It solves the isolation problem of standardized testing by connecting serious engineers for instant silent study sessions and doubt resolution across all engineering disciplines.

## Features

- **Instant Peer Matchmaking**: Join the queue and immediately connect with another GATE aspirant studying at the exact same moment.
- **Silent Focus Sessions**: Built for deep work. Connect via WebRTC video, mute your mic, and use mutual accountability for long, uninterrupted Pomodoro sessions.
- **P2P Doubt Resolution**: Face-to-face video calling and real-time chat for discussing complex technical problems.
- **Zero Friction**: No complicated setups. Select your branch and start studying immediately.
- **Premium UI/UX**: Designed with a high-end, minimal aesthetic supporting seamless Dark/Light modes.

## Tech Stack

### Frontend (Client)
- **Framework**: React.js (Vite)
- **Styling**: Tailwind CSS (with highly customized utility classes for gradients, glassmorphism, and responsive grids)
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Authentication**: Google OAuth (`@react-oauth/google`)
- **Real-time**: `socket.io-client` for WebRTC signaling and chat
- **WebRTC**: Native browser `RTCPeerConnection` for direct P2P video/audio streaming

### Backend (Server)
- **Framework**: Node.js & Express
- **Real-time Engine**: Socket.io for managing the matchmaking queue, broadcasting WebRTC SDP packets, and routing text messages.
- **Authentication**: Google OAuth verification (via `google-auth-library`) & JWT issuing
- **Database**: PostgreSQL (Prisma ORM) for persisting user profiles (currently setup for local development).

## Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd gateroom
   ```

2. **Backend Setup:**
   ```bash
   cd server
   npm install
   ```
   - Create a `.env` file in the `server` directory and configure the following:
     ```env
     PORT=5000
     CLIENT_URL=http://localhost:3000
     JWT_SECRET=your_jwt_secret
     GOOGLE_CLIENT_ID=your_google_client_id
     DATABASE_URL=your_postgresql_url
     ```
   - Start the backend server:
     ```bash
     npm run dev
     ```

3. **Frontend Setup:**
   ```bash
   cd client
   npm install
   ```
   - Create a `.env` file in the `client` directory:
     ```env
     VITE_API_URL=http://localhost:5000
     VITE_GOOGLE_CLIENT_ID=your_google_client_id
     ```
   - Start the frontend development server:
     ```bash
     npm run dev
     ```

## Deployment Notes

- **Frontend**: Best deployed on platforms like **Vercel** or **Netlify**. Ensure that you set the environment variables (`VITE_API_URL` and `VITE_GOOGLE_CLIENT_ID`) in your project settings.
- **Backend**: Because GateRoom heavily relies on long-lived WebSocket connections (`Socket.io`) for matchmaking and WebRTC brokering, the backend is **not suitable for Serverless environments like Vercel**. Deploy the backend to a long-running instance provider such as **Render**, **Railway**, or **Heroku**.
  - Ensure you update the `CLIENT_URL` on the backend to match your Vercel frontend URL.

## Architecture Highlights
- **Matchmaking Engine**: The backend maintains a live queue array. Users are instantly shifted out of the array and assigned a unique `roomId` the millisecond another user connects.
- **WebRTC Signaling**: The server acts purely as a signaling broker. Video and audio streams are direct Peer-to-Peer, ensuring zero server bottlenecks and minimal latency.

---
*Built for engineers, by engineers.*
