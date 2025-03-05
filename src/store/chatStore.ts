import { create } from 'zustand';
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  where,
  doc,
  setDoc,
  getDoc,
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
  clearChat: () => Promise<void>;
};

const API_URL = 'https://ef0c-34-83-37-205.ngrok-free.app';
const CHATS_COLLECTION = 'chats';
const CHAT_STATUS_COLLECTION = 'chatStatus';

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  isLoading: false,
  error: null,

  // Thêm tin nhắn vào store (nội bộ)
  addMessage: (message: ChatMessage) =>
    set((state) => ({ messages: [...state.messages, message] })),

  // Xóa chat: cập nhật Firestore với thời điểm xóa và reset store
  clearChat: async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;
    const uid = currentUser.uid;
    const currentTime = Date.now();
    try {
      // Lưu thời điểm xóa chat
      await setDoc(doc(db, CHAT_STATUS_COLLECTION, uid), { lastCleared: currentTime });
      // Reset tin nhắn trong store
      set({ messages: [] });
    } catch (error) {
      console.error("Error clearing chat:", error);
      set({
        error: error instanceof Error ? error.message : "Error clearing chat",
      });
    }
  },

  // Lấy tin nhắn: chỉ lấy tin nhắn có timestamp > lastCleared (nếu có)
  fetchMessages: async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;
    const uid = currentUser.uid;

    // Lấy thông tin chatStatus để xác định thời điểm xóa chat
    let lastCleared = 0;
    try {
      const chatStatusDoc = await getDoc(doc(db, CHAT_STATUS_COLLECTION, uid));
      if (chatStatusDoc.exists() && chatStatusDoc.data().lastCleared) {
        lastCleared = chatStatusDoc.data().lastCleared;
      }
    } catch (error) {
      console.error("Error fetching chat status:", error);
    }

    // Reset dữ liệu tin nhắn trước khi fetch
    set({ messages: [], isLoading: true, error: null });

    try {
      // Xây dựng truy vấn: lấy tin nhắn của người dùng, nếu có lastCleared thì chỉ lấy các tin sau thời điểm đó
      let messagesQuery;
      if (lastCleared) {
        messagesQuery = query(
          collection(db, CHATS_COLLECTION),
          where('userId', '==', uid),
          where('timestamp', '>', lastCleared),
          orderBy('timestamp', 'asc')
        );
      } else {
        messagesQuery = query(
          collection(db, CHATS_COLLECTION),
          where('userId', '==', uid),
          orderBy('timestamp', 'asc')
        );
      }

      const querySnapshot = await getDocs(messagesQuery);
      const messages: ChatMessage[] = querySnapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      })) as ChatMessage[];
      set({ messages, isLoading: false });
    } catch (error) {
      console.error("Error fetching messages:", error);
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Error fetching messages',
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
      const docRefUser = await addDoc(collection(db, CHATS_COLLECTION), userMsg);
      const userMsgWithId: ChatMessage = { ...userMsg, id: docRefUser.id };
      set((state) => ({
        messages: [...state.messages, userMsgWithId],
      }));

      // Gọi API để lấy phản hồi từ chatbot
      const response = await fetch(API_URL + '/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: text }),
      });

      if (!response.ok) {
        throw new Error('Failed to get chatbot response');
      }
      const data = await response.json();
      const chatbotText: string = data.answer;

      // Tạo tin nhắn của chatbot
      const botMsg: ChatMessage = {
        id: '',
        sender: 'chatbot',
        text: chatbotText,
        timestamp: Date.now(),
        userId: uid,
      };
      const docRefBot = await addDoc(collection(db, CHATS_COLLECTION), botMsg);
      const botMsgWithId: ChatMessage = { ...botMsg, id: docRefBot.id };
      set((state) => ({
        messages: [...state.messages, botMsgWithId],
        isLoading: false,
      }));
    } catch (error) {
      console.error("Error sending message:", error);
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Error sending message',
      });
    }
  },
}));
