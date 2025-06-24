import { useState } from "react";
import { toast } from 'react-toastify';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  

  const submit = async e => {
    e.preventDefault();
    setLoading(true);
   const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({ email })
    });
    if(!res.ok){
      toast.error(res.message);
    }
    toast.success(res.message);
    setSent(true);
    setLoading(false);
  };

  return (
    <>
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        {sent ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-green-600 mb-4">✅ Email Sent!</h2>
            <p className="text-gray-700">
              Please check your inbox for the reset instructions.
            </p>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Forgot Password?</h1>
              <p className="text-sm text-gray-500">
                Enter your email and we’ll send you a reset link.
              </p>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                required
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 text-white rounded-lg font-semibold transition ${
                loading
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        )}
      </div>
    </div>
    </>
  );
}
