const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Get token from sessionStorage
const getToken = () => typeof window !== 'undefined' ? sessionStorage.getItem('token') : null;

// Add Authorization header if token exists
const headers = (): Record<string, string> => {
  const token = getToken();
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const api = {
  async getLoginUrl() {
    const res = await fetch(`${API_URL}/login`, { headers: headers() });
    return res.json();
  },

  async getCurrentUser() {
    const res = await fetch(`${API_URL}/user/me`, { headers: headers() });
    if (!res.ok) return null;
    return res.json();
  },

  async getPosts(page: number = 1) {
    const res = await fetch(`${API_URL}/posts?page=${page}`, { headers: headers() });
    if (!res.ok) throw new Error('Failed to fetch posts');
    return res.json();
  },

  async getPost(id: string) {
    const res = await fetch(`${API_URL}/post?id=${id}`, { headers: headers() });
    if (!res.ok) throw new Error('Failed to fetch post');
    return res.json();
  },

  async createPost(title: string, content: string) {
    const res = await fetch(`${API_URL}/post`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers() },
      body: JSON.stringify({ title, content }),
    });
    if (!res.ok) throw new Error('Failed to create post');
    return res.json();
  },

  async updatePost(id: string, title: string, content: string) {
    const res = await fetch(`${API_URL}/post?id=${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...headers() },
      body: JSON.stringify({ title, content }),
    });
    if (!res.ok) throw new Error('Failed to update post');
    return res.json();
  },

  async deletePost(id: string) {
    const res = await fetch(`${API_URL}/post?id=${id}`, {
      method: 'DELETE',
      headers: headers(),
    });
    if (!res.ok) throw new Error('Failed to delete post');
    return res.json();
  },

  async getUser(id: string) {
    const res = await fetch(`${API_URL}/user?id=${id}`, { headers: headers() });
    if (!res.ok) throw new Error('Failed to fetch user');
    return res.json();
  },

  async deleteUser(id: string) {
    const res = await fetch(`${API_URL}/user?id=${id}`, {
      method: 'DELETE',
      headers: headers(),
    });
    if (!res.ok) throw new Error('Failed to delete user');
    return res.json();
  },
};