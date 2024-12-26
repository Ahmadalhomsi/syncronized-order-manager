"use client";
import { useWebSocket } from "../../hooks/useWebSocket";

export default function AdminPage() {
    const { messages } = useWebSocket("ws://localhost:8080");

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <ul className="mt-4 space-y-2">
                {messages.map((message, index) => (
                    <li key={index} className="p-2 border rounded bg-gray-100">
                        {message}
                    </li>
                ))}
            </ul>
        </div>
    );
}
