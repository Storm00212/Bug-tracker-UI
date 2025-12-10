import React, { useState } from 'react';
import toast from 'react-hot-toast';

interface AuthPageProps {
  onLogin: (email: string, password: string) => void;
  onSignup: (username: string, email: string, password: string, role: string) => void;
  isLoading?: boolean;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin, onSignup, isLoading = false }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('User');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Email is required', { duration: 4000 });
      console.error('Login validation error: Email is required');
      return;
    }
    if (!validateEmail(email)) {
      toast.error('Invalid email format', { duration: 4000 });
      console.error('Login validation error: Invalid email format');
      return;
    }
    if (!password.trim()) {
      toast.error('Password is required', { duration: 4000 });
      console.error('Login validation error: Password is required');
      return;
    }
    try {
      await onLogin(email, password);
      toast.success('Login successful!', { duration: 2000 });
    } catch (error) {
      toast.error('Invalid credentials', { duration: 4000 });
      console.error('Login failed:', error);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Full name is required', { duration: 4000 });
      console.error('Signup validation error: Full name is required');
      return;
    }
    if (!email.trim()) {
      toast.error('Email is required', { duration: 4000 });
      console.error('Signup validation error: Email is required');
      return;
    }
    if (!validateEmail(email)) {
      toast.error('Invalid email format', { duration: 4000 });
      console.error('Signup validation error: Invalid email format');
      return;
    }
    if (!password.trim()) {
      toast.error('Password is required', { duration: 4000 });
      console.error('Signup validation error: Password is required');
      return;
    }
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters', { duration: 4000 });
      console.error('Signup validation error: Password too short');
      return;
    }
    try {
      await onSignup(name, email, password, role);
      toast.success('Account created successfully!', { duration: 2000 });
    } catch (error) {
      toast.error('Failed to create account. Email may already exist.', { duration: 4000 });
      console.error('Signup failed:', error);
    }
  };

  const toggleView = () => {
    setIsLoginView(!isLoginView);
    setEmail('');
    setPassword('');
    setName('');
    setRole('User');
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

        <div className="flex justify-center mb-6">
          <button
            data-cy="login-button"
            onClick={() => {
              if (!isLoginView) toggleView();
            }}
            className={`px-4 py-2 font-mono text-sm rounded-l border border-border transition-all ${
              isLoginView ? 'bg-primary text-background shadow-glow' : 'bg-surface text-text-muted hover:bg-surface-highlight'
            }`}
          >
            LOGIN
          </button>
          <button
            data-cy="signup-button"
            onClick={() => {
              if (isLoginView) toggleView();
            }}
            className={`px-4 py-2 font-mono text-sm rounded-r border border-border transition-all ${
              !isLoginView ? 'bg-primary text-background shadow-glow' : 'bg-surface text-text-muted hover:bg-surface-highlight'
            }`}
          >
            SIGN_UP
          </button>
        </div>

        <form className="space-y-6" onSubmit={isLoginView ? handleLogin : handleSignup}>
          <div className="space-y-4">
            {!isLoginView && (
              <div>
                <label htmlFor="name" className="block text-xs font-mono font-bold text-primary mb-1 uppercase">Full Name</label>
                <input
                  data-cy="username-input"
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
                data-cy="email-input"
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
                data-cy="password-input"
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
            {!isLoginView && (
              <div>
                <label htmlFor="role" className="block text-xs font-mono font-bold text-primary mb-1 uppercase">Role</label>
                <select
                  data-cy="role-select"
                  id="role"
                  name="role"
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  className="block w-full px-4 py-3 bg-background border border-border text-text-main rounded focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary appearance-none cursor-pointer"
                >
                  <option value="User">User</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
            )}
          </div>

          <div>
            <button
              data-cy={isLoginView ? "login-submit-button" : "register-submit-button"}
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