"use client"

import React, { useState } from 'react';
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
import { Separator } from "@/components/ui/separator";

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        // Implement login logic here
        console.log('Login attempted', { email, password });
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
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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
                            <a
                                href="/forgot-password"
                                className="text-sm text-blue-600 hover:underline float-right"
                            >
                                Forgot password?
                            </a>
                        </div>
                        <Button type="submit" className="w-full">
                            Sign In
                        </Button>

                        {/* <div className="flex items-center my-4">
                        <Separator className="flex-grow" />
                        <span className="px-3 text-muted-foreground text-sm">
                            OR
                        </span>
                        <Separator className="flex-grow" />
                    </div> */}

                        {/* <div className="grid grid-cols-2 gap-4">
                        <Button 
                            variant="outline" 
                            className="w-full"
                        >
                            <GitHubLogoIcon className="mr-2" />
                            GitHub
                        </Button>
                        <Button 
                            variant="outline" 
                            className="w-full"
                        >
                            <GoogleLogoIcon className="mr-2" />
                            Google
                        </Button>
                    </div> */}

                        <div className="text-center mt-4">
                            <span className="text-sm text-muted-foreground">
                                Don&apos;t have an account?{' '}
                                <a
                                    href="/signup"
                                    className="text-blue-600 hover:underline"
                                >
                                    Sign Up
                                </a>
                            </span>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default LoginPage;