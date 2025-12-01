import React, { useState } from 'react';
import { User } from '../types';

interface AuthPageProps {
  users: User[];
  onLogin: (user: User) => void;
  onSignup: (newUser: User) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ users, onLogin, onSignup }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      onLogin(user);
    } else {
      setError('ACCESS_DENIED: Invalid credentials.');
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name || !email || !password) {
      setError('ERROR: All fields are required.');
      return;
    }
    if (users.some(u => u.email === email)) {
      setError('ERROR: Email already exists.');
      return;
    }
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      password,
      avatar: `https://i.pravatar.cc/150?u=${Date.now()}`,
    };
    onSignup(newUser);
  };

  const toggleView = () => {
    setIsLoginView(!isLoginView);
    setError('');
    setEmail('');
    setPassword('');
    setName('');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary rounded-full filter blur-[128px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary rounded-full filter blur-[128px]"></div>
      </div>

      <div className="w-full max-w-md p-8 bg-surface/80 backdrop-blur-xl rounded-2xl border border-border shadow-2xl z-10">
        <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg mb-4 text-white font-mono font-bold text-xl shadow-glow">
                BT
            </div>
            <h2 className="text-3xl font-mono font-bold text-text-main tracking-tight">
                {isLoginView ? 'Welcome_Back' : 'Init_User'}
            </h2>
            <p className="mt-2 text-sm text-text-muted font-mono">
                {isLoginView ? 'Authenticate to access system' : 'Create new user profile'}
            </p>
        </div>

        <form className="space-y-6" onSubmit={isLoginView ? handleLogin : handleSignup}>
          <div className="space-y-4">
            {!isLoginView && (
              <div>
                <label htmlFor="name" className="block text-xs font-mono font-bold text-primary mb-1 uppercase">Full Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="block w-full px-4 py-3 bg-background border border-border text-text-main rounded focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder-gray-600 transition-all"
                  placeholder="John Doe"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>
            )}
            <div>
              <label htmlFor="email-address" className="block text-xs font-mono font-bold text-primary mb-1 uppercase">Email Address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="block w-full px-4 py-3 bg-background border border-border text-text-main rounded focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder-gray-600 transition-all"
                placeholder="user@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-xs font-mono font-bold text-primary mb-1 uppercase">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="block w-full px-4 py-3 bg-background border border-border text-text-main rounded focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder-gray-600 transition-all"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
          </div>
          
          {error && (
            <div className="bg-red-900/20 border border-red-500/50 text-red-200 text-xs font-mono p-3 rounded">
                {'>'} {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              className="group w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded text-background bg-primary hover:bg-primary-dark focus:outline-none shadow-glow transition-all font-mono"
            >
              {isLoginView ? 'AUTHENTICATE' : 'CREATE_ACCOUNT'}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
            <button onClick={toggleView} className="text-xs font-mono text-text-muted hover:text-accent transition-colors underline decoration-dotted">
              {isLoginView ? '{'>'} No account? Create one' : '{'>'} Already registered? Login'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;