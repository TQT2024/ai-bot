// chatStore.ts
import { create } from 'zustand';
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  where,
} from 'firebase/firestore';
import { auth, db } from '../../firebaseconfig';

export type ChatMessage = {
  id: string;
  sender: 'user' | 'chatbot';
  text: string;
  timestamp: number;
  userId: string;
};

type ChatStore = {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  fetchMessages: () => Promise<void>;
  sendUserMessage: (text: string) => Promise<void>;
  addMessage: (message: ChatMessage) => void;
  clearChat: () => void;
};

const CHATS_COLLECTION = 'chats';

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  isLoading: false,
  error: null,

  // Thêm một tin nhắn vào store (dùng nội bộ)
  addMessage: (message: ChatMessage) =>
    set((state) => ({ messages: [...state.messages, message] })),

  // Xoá toàn bộ cuộc chat
  clearChat: () => set({ messages: [] }),

  // Tải danh sách tin nhắn của người dùng hiện tại, sắp xếp theo timestamp tăng dần
  fetchMessages: async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    set({ isLoading: true, error: null });
    try {
      const q = query(
        collection(db, CHATS_COLLECTION),
        where('userId', '==', uid),
        orderBy('timestamp', 'asc')
      );
      const querySnapshot = await getDocs(q);
      const messages: ChatMessage[] = querySnapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      })) as ChatMessage[];
      set({ messages, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error:
          error instanceof Error
            ? error.message
            : 'Error fetching messages',
      });
    }
  },

  // Gửi tin nhắn của người dùng và nhận phản hồi từ chatbot
  sendUserMessage: async (text: string) => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    set({ isLoading: true, error: null });

    // Tạo tin nhắn của người dùng
    const userMsg: ChatMessage = {
      id: '', // Sẽ cập nhật sau khi thêm vào Firestore
      sender: 'user',
      text,
      timestamp: Date.now(),
      userId: uid,
    };

    try {
      // Thêm tin nhắn của người dùng vào Firestore
      const docRefUser = await addDoc(
        collection(db, CHATS_COLLECTION),
        userMsg
      );
      const userMsgWithId: ChatMessage = { ...userMsg, id: docRefUser.id };
      set((state) => ({
        messages: [...state.messages, userMsgWithId],
      }));

      // Gọi API để lấy phản hồi của chatbot (ví dụ: endpoint POST '/ngoc3')
      const response = await fetch('https://yourchatapi.com/ngoc3', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });
      if (!response.ok) {
        throw new Error('Failed to get chatbot response');
      }
      const data = await response.json();
      // Giả sử API trả về đối tượng { response: string }
      const chatbotText: string = data.response;

      // Tạo tin nhắn của chatbot
      const botMsg: ChatMessage = {
        id: '',
        sender: 'chatbot',
        text: chatbotText,
        timestamp: Date.now(),
        userId: uid,
      };
      const docRefBot = await addDoc(
        collection(db, CHATS_COLLECTION),
        botMsg
      );
      const botMsgWithId: ChatMessage = { ...botMsg, id: docRefBot.id };
      set((state) => ({
        messages: [...state.messages, botMsgWithId],
        isLoading: false,
      }));
    } catch (error) {
      set({
        isLoading: false,
        error:
          error instanceof Error
            ? error.message
            : 'Error sending message',
      });
    }
  },
}));
