import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Post = {
  id: string;
  title: string;
  url: string;
  imageUri: string;
  icon: string;
};

type PostState = {
  posts: Post[];
  addPost: (post: Omit<Post, 'id'>) => void;
  updatePost: (id: string, post: Partial<Omit<Post, 'id'>>) => void;
  deletePost: (id: string) => void;
};

export const usePostStore = create<PostState, [['zustand/persist', PostState]]>(
  persist(
    (set) => ({
      // data for testing
      posts: [
        {
          id: '1',
          title: 'Thông báo điều chỉnh thời gian đào tạo của sinh viên các khóa 2022 trở về trước',
          icon: 'book',
          imageUri: 'https://thanhnien.mediacdn.vn/Uploaded/linhnt-qc/2022_02_28/tn2-8506.jpg',
          url: 'https://tdmu.edu.vn/tin-tuc/thong-tin-nghien-cuu/khai-mac-chuoi-su-kien-khoa-hoc-cong-nghe-va-doi-moi-sang-tao-tdmu-nam-2024',
        },
        {
          id: '2',
          title: 'Quyết định sửa đổi, bổ sung quyết định 1774/QĐ-ĐHTDM ngày 17/11/2021',
          icon: 'laptop',
          imageUri: 'https://tdmu.edu.vn/img/img-kham-pha-tdmu.jpg',
          url: 'https://example.com/post/2',
        },
        {
          id: '3',
          title: 'Hướng dẫn vị trí trong trường TDMU',
          icon: 'graduation-cap',
          imageUri: 'https://kiemdinhvatuvanxaydung.tdmu.edu.vn/img/bt3/images/V%E1%BB%8A%20TR%C3%8D%20PTN1855%20T%E1%BA%A0I%20TDMU.jpg',
          url: 'https://example.com/post/3',
        },
      ],
      addPost: (post) => {
        const newPost: Post = {
          id: Date.now().toString(),
          ...post,
        };
        set((state) => ({ posts: [...state.posts, newPost] }));
      },
      updatePost: (id, post) => {
        set((state) => ({
          posts: state.posts.map((c) =>
            c.id === id ? { ...c, ...post } : c
          ),
        }));
      },
      deletePost: (id) => {
        set((state) => ({
          posts: state.posts.filter((c) => c.id !== id),
        }));
      },
    }),
    {
      name: 'post-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
