"use client";
import { useState } from "react";
import { useWebSocket } from "../../hooks/useWebSocket";

export default function CustomerPage() {
    const { sendMessage } = useWebSocket("ws://localhost:8080");
    const [message, setMessage] = useState("");

    const handleSend = () => {
        sendMessage(message);
        alert("Request sent!");
        setMessage("");
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold">Customer Request Page</h1>
            <textarea
                className="w-full p-2 border rounded"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter your request..."
            />
            <button
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={handleSend}
            >
                Send Request
            </button>
        </div>
    );
}
