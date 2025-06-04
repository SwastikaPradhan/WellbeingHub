'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { account } from '@/lib/appwrite';

const SignUpPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleSignUp = async () => {
    setError('');
    setSuccess('');
    try {
      await account.create('unique()', email, password, username);
await account.createEmailSession(email, password); 
setSuccess('🎉 Welcome to WellBeing Hub.');
setTimeout(() => {
  router.push('/');
}, 1500);

    } catch (err: any) {
      setError(err?.message || 'Oops. That was not supposed to happen.');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-yellow-100 font-mono">
      <div className="border-4 border-black p-10 w-full max-w-xl text-black bg-white shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
        <h1 className="text-4xl font-extrabold text-center uppercase mb-6">Sign Up or Cry Later</h1>

        <p className="text-center mb-8 text-xs italic">We promise this won't steal your soul. Probably.</p>

        <input
          type="text"
          placeholder="👤 Username (make it cool)"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-3 mb-4 border-2 border-black bg-gray-100 placeholder-gray-600"
        />

        <input
          type="email"
          placeholder="📧 Email (don’t use your school one)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 border-2 border-black bg-gray-100 placeholder-gray-600"
        />

        <input
          type="password"
          placeholder="🔐 Password (1234 not allowed)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-6 border-2 border-black bg-gray-100 placeholder-gray-600"
        />

        <button
          onClick={handleSignUp}
          className="w-full bg-black text-white p-3 uppercase text-lg font-bold hover:bg-white hover:text-black hover:border-black border-2 transition duration-200"
        >
          LET'S DO THIS 💪
        </button>

        {error && (
          <p className="text-red-700 text-center mt-4 font-bold">😢 {error}</p>
        )}
        {success && (
          <p className="text-green-700 text-center mt-4 font-bold">✅ {success}</p>
        )}

        <p className="mt-6 text-center text-xs text-gray-600">
          Already sold your soul to us?{' '}
          <a href="/login" className="underline text-blue-700">
            Log in instead.
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;

