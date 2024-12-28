// app/signup/page.js
"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
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

const SignupPage = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        customerName: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSignup = async (e) => {
        e.preventDefault();

        // Basic validation
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customerName: formData.customerName,
                    password: formData.password
                }),
            });

            const data = await res.json();

            if (res.ok) {
                router.push('/login');
            } else {
                setError(data.error || 'Signup failed');
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
                        Create an Account
                    </CardTitle>
                    <CardDescription className="text-center">
                        Enter your details to sign up
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {error && (
                        <div className="mb-4 p-2 text-sm text-red-600 bg-red-50 rounded">
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleSignup} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="customerName">Username</Label>
                            <Input
                                id="customerName"
                                name="customerName"
                                type="text"
                                placeholder="Choose a username"
                                value={formData.customerName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Create a password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                placeholder="Confirm your password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full">
                            Sign Up
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default SignupPage;

