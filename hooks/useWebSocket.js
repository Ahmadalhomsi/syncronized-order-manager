"use client";
import { useEffect, useState } from "react";

export function useWebSocket(url) {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const socket = new WebSocket(url);

        socket.onmessage = (event) => {
            setMessages((prev) => [event.data, ...prev]);
        };

        return () => {
            socket.close();
        };
    }, [url]);

    const sendMessage = (message) => {
        const socket = new WebSocket(url);
        socket.onopen = () => {
            socket.send(message);
            socket.close();
        };
        socket.onerror = (error) => {
            console.error("WebSocket error:", error);
        };
    };

    return { messages, sendMessage };
}
