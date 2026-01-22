export interface User {
  googleId: string;
  name: string;
  email: string;
  picture: string;
  role: 'user' | 'admin';
}

export interface Post {
  _id: string;
  title: string;
  content: string;
  author: string | {
    googleId: string;
    name: string;
    picture: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface PostsResponse {
  posts: Post[];
  currentPage: number;
  totalPages: number;
  totalPosts: number;
}

export interface UserDetailResponse {
  user?: User;
  name?: string;
  picture?: string;
  role?: string;
  posts?: Array<{ title: string; createdAt: string }>;
  postsCount?: number;
}