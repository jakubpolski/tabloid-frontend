'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { UserDetailResponse } from '@/types';
import { useRouter, useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import LoginPage from '@/components/LoginPage';

export default function UserDetailPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

  const [userData, setUserData] = useState<UserDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await api.getUser(userId);
        setUserData(data);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUser();
    }
  }, [userId, user]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.deleteUser(userId);
      router.push('/');
    } catch (error) {
      console.error('Failed to delete user:', error);
      setDeleting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <p className="text-gray-500 text-lg">Nie znaleziono użytkownika</p>
            <button
              onClick={() => router.push('/')}
              className="mt-4 text-blue-600 hover:text-blue-800"
            >
              Wróć do listy
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isAdmin = user.role === 'admin';
  const targetRole = userData.user?.role || userData.role;
  const canDelete = isAdmin && targetRole !== 'admin';
  const userName = userData.user?.name || userData.name || 'Unknown';
  const userPicture = userData.user?.picture || userData.picture || '';

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <button
          onClick={() => router.back()}
          className="mb-6 text-blue-600 hover:text-blue-800 flex items-center gap-1"
        >
          ← Wróć
        </button>

        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              {userPicture && (
                <img
                  src={userPicture}
                  alt={userName}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-full"
                />
              )}
              <div>
                <h1 className="text-3xl font-bold">{userName}</h1>
                {userData.user?.email && (
                  <p className="text-gray-600 mt-1">{userData.user.email}</p>
                )}
                <div className="mt-2">
                  {targetRole === 'admin' && (
                    <span className="bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded">
                      Administrator
                    </span>
                  )}
                  {targetRole === 'user' && (
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
                      Użytkownik
                    </span>
                  )}
                </div>
              </div>
            </div>

            {canDelete && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
              >
                Usuń użytkownika
              </button>
            )}
          </div>

          {userData.posts && userData.posts.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">
                Ogłoszenia ({userData.posts.length})
              </h2>
              <div className="space-y-2">
                {userData.posts.map((post, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                    <p className="font-medium">{post.title}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString('pl-PL')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-bold mb-4">
                Potwierdź usunięcie użytkownika
              </h3>
              <p className="text-gray-600 mb-6">
                Czy na pewno chcesz usunąć użytkownika <strong>{userName}</strong>? 
                Wszystkie jego ogłoszenia również zostaną usunięte. Ta operacja jest nieodwracalna.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg transition disabled:opacity-50"
                >
                  {deleting ? 'Usuwanie...' : 'Usuń'}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={deleting}
                  className="flex-1 border border-gray-200 hover:bg-gray-50 font-semibold px-4 py-2 rounded-lg transition disabled:opacity-50"
                >
                  Anuluj
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}