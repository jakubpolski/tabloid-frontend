'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Post, PostsResponse } from '@/types';
import Link from 'next/link';

export default function PostList() {
  const [data, setData] = useState<PostsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const fetchPosts = async (pageNum: number) => {
    setLoading(true);
    try {
      const response = await api.getPosts(pageNum);
      setData(response);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(page);
  }, [page]);

  const getAuthorName = (author: Post['author']) => {
    console.log(author)
    if (typeof author === 'object' && author !== null) return author.name;
    return 'Unknown';
  };

  const getAuthorPicture = (author: Post['author']) => {
    if (typeof author === 'object' && author !== null) return author.picture;
    return '';
  };

  if (loading && !data) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Wszystkie ogłoszenia</h1>

      {data && data.posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Brak ogłoszeń</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {data?.posts.map((post) => (
              <Link
                key={post._id}
                href={`/post/${post._id}`}
                className="block bg-white rounded-lg shadow-md hover:shadow-lg transition duration-200 p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      {post.title}
                    </h2>
                    <p className="text-gray-600 line-clamp-2 mb-4">
                      {post.content}
                    </p>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      {typeof post.author !== 'string' && post.author.picture && (
                        <img
                          src={getAuthorPicture(post.author)}
                          alt={getAuthorName(post.author)}
                          className="w-6 h-6 rounded-full"
                        />
                      )}
                      <span>{getAuthorName(post.author)}</span>
                      <span>•</span>
                      <span>{new Date(post.createdAt).toLocaleDateString('pl-PL')}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {data && data.totalPages > 1 && (
            <div className="mt-8 flex justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Poprzednia
              </button>

              <span className="px-4 py-2 bg-white border border-gray-300 rounded-lg">
                Strona {data.currentPage} z {data.totalPages}
              </span>

              <button
                onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                disabled={page === data.totalPages}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Następna
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}