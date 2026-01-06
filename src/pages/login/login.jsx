import generateTokenAuth from '@/api/generateTokenAuth';
import React, { useState } from 'react';

export default function SimpleLogin() {
  const [clientId, setClientId] = useState('');
  const [clientKey, setClientKey] = useState('');

  const handleSubmit = async () => {
    const tokenAuth = await generateTokenAuth(clientId, clientKey)
    localStorage.setItem('tokenAuth', tokenAuth);
    window.location.href = '/paket-tersedia';
    console.log(tokenAuth);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow p-8">
        <h2 className="text-2xl font-bold text-center text-black mb-6">Login</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-black mb-1">Client ID</label>
            <input
              type="text"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">Client Key</label>
            <input
              type="password"
              value={clientKey}
              onChange={(e) => setClientKey(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition-colors"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
