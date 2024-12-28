// hooks\useWebSocket.js

"use client";
import { useEffect, useState } from "react";

export function useWebSocket(url) {
    const [messages, setMessages] = useState([]); // For storing incoming messages
    const [responses, setResponses] = useState([]); // For storing incoming responses

    useEffect(() => {
        const socket = new WebSocket(url);

        socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);

                // Check if the data is a response or a message
                if (data.type === "response") {
                    setResponses((prev) => [data.payload, ...prev]);
                } else if (data.type === "message") {
                    setMessages((prev) => [data.payload, ...prev]);
                }
            } catch (error) {
                console.error("Error parsing WebSocket data:", error);
            }
        };

        return () => {
            socket.close();
        };
    }, [url]);

    const sendMessage = (message) => {
        const socket = new WebSocket(url);
        socket.onopen = () => {
            socket.send(JSON.stringify({ type: "message", payload: message }));
            socket.close();
        };
        socket.onerror = (error) => {
            console.error("WebSocket error:", error);
        };
    };

    const sendResponse = (response) => {
        const socket = new WebSocket(url);
        socket.onopen = () => {
            socket.send(JSON.stringify({ type: "response", payload: response }));
            socket.close();
        };
        socket.onerror = (error) => {
            console.error("WebSocket error:", error);
        };
    };

    return { messages, responses, sendMessage, sendResponse };
}
