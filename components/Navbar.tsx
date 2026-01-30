'use client';

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold text-blue-600">
            Tablica Ogłoszeń
          </Link>

          {user && (
            <div className="flex items-center gap-4">
              <Link
                href="/post/new"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200"
              >
                Nowe ogłoszenie
              </Link>

              <div className="flex items-center gap-3">
                <img
                  src={user.picture}
                  alt={user.name}
                  referrerPolicy='no-referrer'
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-gray-700">{user.name}</span>
                {user.role === 'admin' && (
                  <span className="bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded">
                    Admin
                  </span>
                )}
              </div>

              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-900 transition duration-200"
              >
                Wyloguj
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}