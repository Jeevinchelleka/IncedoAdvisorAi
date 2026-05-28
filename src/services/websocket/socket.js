"use client";
import { io } from "socket.io-client";

let socket = null;

export function getSocket(userId, role) {
  if (socket?.connected) return socket;

  const url = process.env.NEXT_PUBLIC_API_URL || "https://advsiorai-backend-production.up.railway.app";

  socket = io(url, {
    auth: { userId, role },
    transports: ["websocket", "polling"],
    reconnectionAttempts: 5,
    reconnectionDelay: 2000,
  });

  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
