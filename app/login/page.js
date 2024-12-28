"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; // Import the Link component
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const LoginPage = () => {
    const router = useRouter();
    const [customerName, setCustomerName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ customerName, password }),
            });

            const data = await res.json();

            if (res.ok) {
                router.push('/');
                router.refresh();
            } else {
                setError(data.error || 'Login failed');
            }
        } catch (error) {
            setError('An error occurred');
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <Card className="w-full max-w-md shadow-2xl">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl text-center">
                        Welcome Back
                    </CardTitle>
                    <CardDescription className="text-center">
                        Sign in to continue to your dashboard
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {error && (
                        <div className="mb-4 p-2 text-sm text-red-600 bg-red-50 rounded">
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="customerName">User Name</Label>
                            <Input
                                id="customerName"
                                type="text"
                                placeholder="username"
                                value={customerName}
                                onChange={(e) => setCustomerName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full">
                            Sign In
                        </Button>
                    </form>
                    <div className="mt-4 text-sm text-center">
                        Don’t have an account?{' '}
                        <Link href="/signup" className="text-blue-600 hover:underline">
                            Sign up here
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default LoginPage;
