import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(email.trim(), password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-surface-soft)] font-sans">
      <div className="w-full max-w-md p-8 glass rounded-2xl shadow-2xl border border-white/20">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-[var(--color-primary-navy)] mb-2">GQS ADMIN</h1>
          <p className="text-gray-500 text-sm">Secure Portal Access</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-[var(--color-primary-navy)] mb-2 uppercase">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 bg-white/50 border rounded-lg" placeholder="admin@gqs.com" />
          </div>
          <div>
            <label className="block text-sm font-bold text-[var(--color-primary-navy)] mb-2 uppercase">Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 bg-white/50 border rounded-lg" />
          </div>
          <div className="text-right">
            <Link to="/forgot-password" className="text-sm font-semibold text-[var(--color-secondary-blue)]">Forgot password?</Link>
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button type="submit" disabled={submitting} className="w-full py-4 bg-[var(--color-primary-navy)] text-white font-black uppercase rounded-lg disabled:opacity-60">
            {submitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}


