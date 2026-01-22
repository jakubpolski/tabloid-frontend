'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { Post } from '@/types';
import { useRouter, useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import LoginPage from '@/components/LoginPage';
import Link from 'next/link';

export default function PostDetailPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await api.getPost(postId);
        setPost(data.post);
      } catch (error) {
        console.error('Failed to fetch post:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchPost();
    }
  }, [postId, user]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.deletePost(postId);
      router.push('/');
    } catch (error) {
      console.error('Failed to delete post:', error);
      setDeleting(false);
    }
  };

  const getAuthorId = (author: Post['author']) => {
    if (typeof author === 'string') return author;
    return author.googleId;
  };

  const getAuthorName = (author: Post['author']) => {
    if (typeof author === 'object' && author !== null) return author.name;
    return 'Unknown';
  };

  const getAuthorPicture = (author: Post['author']) => {
    if (typeof author === 'object' && author !== null) return author.picture;
    return '';
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

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500 text-lg">Nie znaleziono ogłoszenia</p>
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

  const isAuthor = getAuthorId(post.author) === user.googleId;
  const canEdit = isAuthor || user.role === 'admin';

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={() => router.push('/')}
          className="mb-6 text-blue-600 hover:text-blue-800 flex items-center gap-2"
        >
          ← Wróć do listy
        </button>

        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>
            
            <div className="flex items-center justify-between mb-4">
              <Link
                href={`/user/${getAuthorId(post.author)}`}
                className="flex items-center gap-3 hover:opacity-80 transition"
              >
                {getAuthorPicture(post.author) && (
                  <img
                    src={getAuthorPicture(post.author)}
                    alt={getAuthorName(post.author)}
                    className="w-10 h-10 rounded-full"
                  />
                )}
                <div>
                  <p className="font-medium text-gray-900">{getAuthorName(post.author)}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString('pl-PL', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </Link>

              {canEdit && (
                <div className="flex gap-2">
                  <button
                    onClick={() => router.push(`/post/${postId}/edit`)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200"
                  >
                    Edytuj
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition duration-200"
                  >
                    Usuń
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="prose max-w-none">
            <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
          </div>
        </div>

        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Potwierdź usunięcie
              </h3>
              <p className="text-gray-600 mb-6">
                Czy na pewno chcesz usunąć to ogłoszenie? Ta operacja jest nieodwracalna.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg transition duration-200 disabled:opacity-50"
                >
                  {deleting ? 'Usuwanie...' : 'Usuń'}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={deleting}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-4 py-2 rounded-lg transition duration-200 disabled:opacity-50"
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