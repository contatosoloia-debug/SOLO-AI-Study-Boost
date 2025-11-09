
import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { MindmapIcon } from './icons';

const Login: React.FC = () => {
  const { login } = useAuth();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#111827]">
      <div className="max-w-md w-full space-y-8 p-10 bg-[#1f2937] rounded-xl shadow-lg border border-[#374151]">
        <div>
          <div className="flex items-center justify-center mb-6">
              <div className="p-3 bg-gradient-to-r from-[#3b82f6] to-[#60a5fa] rounded-lg">
                  <MindmapIcon />
              </div>
              <h1 className="text-4xl font-bold ml-4 text-[#f9fafb]">Solo AI</h1>
          </div>
          <h2 className="mt-6 text-center text-2xl font-extrabold text-[#f9fafb]">
            Potencialize seus estudos
          </h2>
          <p className="mt-2 text-center text-sm text-[#9ca3af]">
            Faça login para acessar sua plataforma de estudos inteligente.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">Email</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-[#4b5563] bg-[#374151] placeholder-gray-500 text-[#f9fafb] rounded-t-md focus:outline-none focus:ring-[#3b82f6] focus:border-[#3b82f6] focus:z-10 sm:text-sm"
                placeholder="email@exemplo.com (demo)"
                defaultValue="estudante@demo.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Senha</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-[#4b5563] bg-[#374151] placeholder-gray-500 text-[#f9fafb] rounded-b-md focus:outline-none focus:ring-[#3b82f6] focus:border-[#3b82f6] focus:z-10 sm:text-sm"
                placeholder="Senha (demo)"
                defaultValue="********"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#3b82f6] hover:bg-[#2563eb] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1f2937] focus:ring-white"
            >
              Entrar na Plataforma
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
