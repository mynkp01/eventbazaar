// hooks/useSocket.ts
import Cookies from "js-cookie";
import { useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";
import { decrypt, isAdminRoute } from "src/utils/helper";

const reconnectSocket = (socket: Socket) => {
  if (!socket) return;

  let retryCount = 0;
  const maxRetries = 5;

  const tryReconnect = () => {
    if (retryCount >= maxRetries) {
      console.error("Max reconnection attempts reached");
      return;
    }

    retryCount++;
    socket.connect();
  };

  socket.on("disconnect", (reason) => {
    if (reason === "io server disconnect") {
      // Server initiated disconnect, try reconnecting
      tryReconnect();
    }
  });

  socket.on("reconnect_failed", () => {
    console.error("Failed to reconnect");
  });

  socket.on("reconnect_attempt", (attempt) => {
    console.log(`Reconnection attempt ${attempt}`);
  });
};

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let token = decrypt(
      (isAdminRoute() ? Cookies.get("admin_token") : Cookies.get("token")) ||
        "",
    );
    // Only create the socket if it doesn't exist
    if (!socketRef.current) {
      socketRef.current = io(
        process.env.NEXT_PUBLIC_BACKEND_API || "http://localhost:8080",
        {
          // Connection options
          transports: ["websocket", "polling"], // Try WebSocket first, fallback to polling
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
          timeout: 10000, // Connection timeout
          auth: {
            token: token ? `Bearer ${token}` : null,
          },
          withCredentials: true,
        },
      );

      // Connection event handlers
      socketRef.current.on("connect", () => {
        setIsConnected(true);
        setError(null);
        console.log("Socket connected:", socketRef.current?.id);
      });

      socketRef.current.on("disconnect", (reason) => {
        setIsConnected(false);
        console.log("Socket disconnected:", reason);
      });

      socketRef.current.on("connect_error", (err) => {
        setError(err);
        setIsConnected(false);
        console.error("Connection error:", err);
      });
    }

    // Cleanup function
    return () => {
      if (socketRef.current) {
        socketRef.current.removeAllListeners();
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, []);

  return { socket: socketRef.current, isConnected, error };
};
