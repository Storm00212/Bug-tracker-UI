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
      setError('Invalid email or password.');
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name || !email || !password) {
      setError('All fields are required.');
      return;
    }
    if (users.some(u => u.email === email)) {
      setError('A user with this email already exists.');
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
    <div className="flex items-center justify-center min-h-screen bg-neutral-light">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-neutral-darkest">
            {isLoginView ? 'Sign in to your account' : 'Create a new account'}
          </h2>
          <p className="mt-2 text-center text-sm text-neutral-dark">
            Or{' '}
            <button onClick={toggleView} className="font-medium text-brand-primary hover:text-indigo-500">
              {isLoginView ? 'start your 14-day free trial' : 'sign in to your existing account'}
            </button>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={isLoginView ? handleLogin : handleSignup}>
          <div className="rounded-md shadow-sm -space-y-px">
            {!isLoginView && (
              <div>
                <label htmlFor="name" className="sr-only">Full name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-neutral-medium placeholder-neutral-dark text-neutral-darkest rounded-t-md focus:outline-none focus:ring-brand-primary focus:border-brand-primary focus:z-10 sm:text-sm"
                  placeholder="Full name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>
            )}
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border border-neutral-medium placeholder-neutral-dark text-neutral-darkest ${isLoginView ? 'rounded-t-md' : ''} focus:outline-none focus:ring-brand-primary focus:border-brand-primary focus:z-10 sm:text-sm`}
                placeholder="Email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-neutral-medium placeholder-neutral-dark text-neutral-darkest rounded-b-md focus:outline-none focus:ring-brand-primary focus:border-brand-primary focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
          </div>
          
          {error && <p className="text-sm text-red-600">{error}</p>}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-brand-primary hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isLoginView ? 'Sign in' : 'Create account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;