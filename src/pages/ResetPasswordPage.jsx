import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setMessage('');
    if (!token) {
      setError('Invalid reset link. Request a new one.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    setSubmitting(true);
    try {
      const data = await resetPassword(token, password);
      setMessage(data.message || 'Password updated.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.message || 'Reset failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-surface-soft)] font-sans">
      <div className="w-full max-w-md p-8 glass rounded-2xl shadow-2xl border border-white/20">
        <h1 className="text-2xl font-black text-[var(--color-primary-navy)] mb-6">Set new password</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-2 uppercase">New password</label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/50 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2 uppercase">Confirm password</label>
            <input
              type="password"
              required
              minLength={8}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full px-4 py-3 bg-white/50 border rounded-lg"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {message && <p className="text-green-600 text-sm">{message}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-[var(--color-primary-navy)] text-white font-bold uppercase rounded-lg disabled:opacity-60"
          >
            {submitting ? 'Saving...' : 'Update password'}
          </button>
        </form>
        <Link to="/login" className="block mt-6 text-center text-sm text-[var(--color-secondary-blue)]">
          Back to sign in
        </Link>
      </div>
    </div>
  );
}

