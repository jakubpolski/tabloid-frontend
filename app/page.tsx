'use client'

import { useAuth } from '@/context/AuthContext';
import LoginPage from '@/components/LoginPage';
import Navbar from '@/components/Navbar';
import PostList from '@/components/PostList';

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <PostList />
    </div>
  );
}