import React, { useState } from "react";

export default function SignInForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
  
    async function handleSubmit(e: React.FormEvent) {
      e.preventDefault();
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await res.json();
      if (res.ok) {
        alert('Sign in successful!');
        localStorage.setItem('token', data.token);
      } else {
        alert(data.error);
      }
    }
  
    return (
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
            required
          />
          <button type="submit" className="btn">
            Sign In
          </button>
        </div>
      </form>
    );
  }
  