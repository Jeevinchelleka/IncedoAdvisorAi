"use client";
import { useEffect, useState, useCallback } from "react";
import { getSocket } from "@/services/websocket/socket";
import useAuthStore from "@/store/authStore";

export function useRealtime() {
  const { user, role } = useAuthStore();
  const [notifications, setNotifications] = useState([]);
  const [marketTick,    setMarketTick]    = useState([]);
  const [connected,     setConnected]     = useState(false);

  const dismiss    = useCallback((id) => setNotifications(n => n.filter(x => x.id !== id)), []);
  const dismissAll = useCallback(() => setNotifications([]), []);

  useEffect(() => {
    if (typeof window === "undefined" || !user?.id) return;

    const socket = getSocket(user.id, role);

    socket.on("connect",    () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));

    socket.on("notification", (payload) => {
      setNotifications(n => [{ id: Date.now(), ...payload }, ...n.slice(0, 19)]);
    });

    socket.on("market:tick", setMarketTick);

    socket.on("compliance:alert", ({ latest }) => {
      if (!latest) return;
      setNotifications(n => [{
        id: Date.now(), type: "warning",
        title: `Alert [${latest.severity}]`,
        body: latest.alertMessage?.slice(0, 80),
        timestamp: new Date().toISOString(),
      }, ...n.slice(0, 19)]);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("notification");
      socket.off("market:tick");
      socket.off("compliance:alert");
    };
  }, [user?.id, role]);

  return { notifications, marketTick, connected, dismiss, dismissAll };
}
