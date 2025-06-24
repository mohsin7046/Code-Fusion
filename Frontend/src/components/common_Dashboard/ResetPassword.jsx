import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');
  const uid = queryParams.get('uid');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    if (!password || !confirmPassword) {
      toast.error('Both fields are required')
      return setError('Both fields are required.');
    }

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters.')
      return setError('Password must be at least 8 characters.');
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.')
      return setError('Passwords do not match.');
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, uid, newpassword: password , confirmpassword:confirmPassword}),
      });

      if (!res.ok) {
        toast.error(res.message)
      }

      toast.success(res.message);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.message);
      toast.error('Something went wrong')
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Reset Your Password</h2>

      {error && <div className="mb-4 text-red-600">{error}</div>}
      {success ? (
        <div className="text-green-600">
          ✅ Password reset successful! Redirecting to login...
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="New Password"
            className="w-full px-4 py-2 border border-gray-300 rounded"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            className="w-full px-4 py-2 border border-gray-300 rounded"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
          />

          <button
            type="submit"
            className={`w-full py-2 text-white font-semibold rounded ${
              loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
            }`}
            disabled={loading}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      )}
    </div>
    </>
  );
};

export default ResetPassword;
