
import { create } from 'zustand';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
} from 'firebase/firestore';
import { auth, db } from '../../firebaseconfig';

export type Post = {
  id: string;
  title: string;
  url: string;
  imageUri: string;
  icon: string;
  userId: string; // Người tạo bài post
  timestamp?: number; // Có thể thêm trường timestamp để sắp xếp theo thời gian
};

type PostState = {
  posts: Post[];
  loadPosts: () => Promise<void>;
  addPost: (post: Omit<Post, 'id' | 'userId' | 'timestamp'>) => Promise<void>;
  updatePost: (id: string, post: Partial<Omit<Post, 'id'>>) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
};

const POSTS_COLLECTION = 'posts';

export const usePostStore = create<PostState>((set, get) => ({
  posts: [],
  loadPosts: async () => {
    try {
      // Truy vấn tất cả các bài post, có thể sắp xếp theo timestamp nếu có
      const postsRef = collection(db, POSTS_COLLECTION);
      const q = query(postsRef, orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);
      const posts: Post[] = querySnapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      })) as Post[];
      set({ posts });
    } catch (error) {
      console.error('Error loading posts:', error);
    }
  },
  addPost: async (postData) => {
    // Lấy userId của người dùng hiện tại; nếu không có thì sử dụng 'anonymous'
    const userId = auth.currentUser?.uid || 'anonymous';
    try {
      const newPost: Post = {
        ...postData,
        userId,
        timestamp: Date.now(),
        id: '', // Sẽ cập nhật sau khi thêm vào Firestore
      };
      const docRef = await addDoc(collection(db, POSTS_COLLECTION), newPost);
      // Cập nhật state với bài post mới, gán id từ Firestore
      set((state) => ({
        posts: [...state.posts, { ...newPost, id: docRef.id }],
      }));
    } catch (error) {
      console.error('Error adding post:', error);
    }
  },
  updatePost: async (id, postData) => {
    try {
      await updateDoc(doc(db, POSTS_COLLECTION, id), postData);
      set((state) => ({
        posts: state.posts.map((p) => (p.id === id ? { ...p, ...postData } : p)),
      }));
    } catch (error) {
      console.error('Error updating post:', error);
    }
  },
  deletePost: async (id) => {
    if (!id) {
      console.error('Invalid id for deletion:', id);
      return;
    }
    try {
      await deleteDoc(doc(db, POSTS_COLLECTION, id));
      set((state) => ({
        posts: state.posts.filter((p) => p.id !== id),
      }));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  },
  
}));





