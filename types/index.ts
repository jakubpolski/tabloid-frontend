export interface User {
  googleId: string;
  name: string;
  picture: string;
  role: 'user' | 'admin';
}

export interface Post {
  _id: string;
  title: string;
  content: string;
  author: User;
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
  posts?: Post[];
}