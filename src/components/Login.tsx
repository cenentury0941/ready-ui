import React, { useState } from 'react';
import { Input, Button, Card, Image } from "@nextui-org/react";

interface LoginProps {
  onLogin: (username: string, password: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin') {
      onLogin(username, password);
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <Card className="p-8 w-full max-w-md">
        <div className="flex justify-center mb-6">
          <Image
            src="https://source.unsplash.com/random/200x200?book"
            alt="ReadY Logo"
            width={100}
            height={100}
            className="rounded-full"
          />
        </div>
        <h2 className="text-2xl font-bold text-center mb-6">Welcome to ReadY</h2>
        <form onSubmit={handleSubmit}>
          <Input
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
            isClearable
            className="mb-4"
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            className="mb-6"
          />
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <Button type="submit" color="primary" fullWidth>
            Log In
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Login;
