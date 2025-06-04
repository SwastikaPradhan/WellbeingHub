'use client';

import { useState } from 'react';
import { account } from '@/lib/appwrite';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    setError('');
    setSuccess('');
    try {
      await account.createEmailSession(email, password);
      setSuccess('🎯 Boom! You are in.');
      setTimeout(() => {
        router.push('/dashboard'); 
      }, 1500);
    } catch (err: any) {
      setError(err?.message || '🙃 Credentials are not impressed.');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-pink-100 font-mono">
      <div className="border-4 border-black p-10 w-full max-w-xl text-black bg-white shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
        <h1 className="text-4xl font-extrabold text-center uppercase mb-6">Login Like a Legend</h1>

        <p className="text-center mb-8 text-xs italic">
          Type your secrets. We *swear* we won't tell.
        </p>

        <input
          type="email"
          placeholder="📧 Email (real ones only)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 border-2 border-black bg-gray-100 placeholder-gray-600"
        />

        <input
          type="password"
          placeholder="🔐 Password (don’t be lazy)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-6 border-2 border-black bg-gray-100 placeholder-gray-600"
        />

        <button
          onClick={handleLogin}
          className="w-full bg-black text-white p-3 uppercase text-lg font-bold hover:bg-white hover:text-black hover:border-black border-2 transition duration-200"
        >
          ENTER THE CHAOS 🚪
        </button>

        {error && (
          <p className="text-red-700 text-center mt-4 font-bold">🚨 {error}</p>
        )}
        {success && (
          <p className="text-green-700 text-center mt-4 font-bold">✅ {success}</p>
        )}

        <p className="mt-6 text-center text-xs text-gray-600">
          New around here?{' '}
          <a href="/signup" className="underline text-blue-700">
            Go sign your fate →
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

