import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { forgotPassword } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setMessage('');
    setSubmitting(true);
    try {
      const data = await forgotPassword(email.trim());
      setMessage(data.message || 'Check your email for a reset link.');
    } catch (err) {
      setError(err.message || 'Request failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-surface-soft)] font-sans">
      <div className="w-full max-w-md p-8 glass rounded-2xl shadow-2xl border border-white/20">
        <h1 className="text-2xl font-black text-[var(--color-primary-navy)] mb-2">Forgot password</h1>
        <p className="text-gray-500 text-sm mb-6">We will email you a link to reset your password.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-[var(--color-primary-navy)] mb-2 uppercase">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            {submitting ? 'Sending...' : 'Send reset link'}
          </button>
        </form>
        <Link to="/login" className="block mt-6 text-center text-sm text-[var(--color-secondary-blue)]">
          Back to sign in
        </Link>
      </div>
    </div>
  );
}


