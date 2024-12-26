"use client"
import React, { useState, useEffect } from 'react';

export default function CustomerAdmin() {
    const [view, setView] = useState('customer'); // Toggle between 'customer' and 'admin'
    const [message, setMessage] = useState('');
    const [requests, setRequests] = useState([]);

    // WebSocket connection for Admin Dashboard
    useEffect(() => {
        if (view === 'admin') {
            const socket = new WebSocket('ws://localhost:8080');

            socket.onmessage = (event) => {
                setRequests((prev) => [event.data, ...prev]);
            };

            return () => {
                socket.close();
            };
        }
    }, [view]);

    const sendRequest = () => {
        const socket = new WebSocket('ws://localhost:8080');
        socket.onopen = () => {
            socket.send(message);
            alert('Request sent!');
            setMessage('');
            socket.close();
        };
        socket.onerror = (error) => {
            console.error('WebSocket error:', error);
            alert('Failed to send request.');
        };
    };

    return (
        <div className="p-4">
            {/* View Toggle */}
            <div className="mb-4">
                <button
                    className={`px-4 py-2 rounded ${view === 'customer' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
                    onClick={() => setView('customer')}
                >
                    Customer View
                </button>
                <button
                    className={`ml-2 px-4 py-2 rounded ${view === 'admin' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
                    onClick={() => setView('admin')}
                >
                    Admin View
                </button>
            </div>

            {/* Customer Form */}
            {view === 'customer' && (
                <div className="p-4 border rounded-lg shadow">
                    <h2 className="text-xl font-bold">Send Request</h2>
                    <textarea
                        className="w-full p-2 border rounded"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Enter your request..."
                    />
                    <button
                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        onClick={sendRequest}
                    >
                        Send
                    </button>
                </div>
            )}

            {/* Admin Dashboard */}
            {view === 'admin' && (
                <div className="p-4 border rounded-lg shadow">
                    <h2 className="text-xl font-bold">Admin Dashboard</h2>
                    <ul className="mt-4 space-y-2">
                        {requests.map((request, index) => (
                            <li key={index} className="p-2 border rounded bg-gray-100">
                                {request}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

