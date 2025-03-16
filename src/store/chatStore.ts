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
import faqsData from '../data/qna_data.json';

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

const API_URL = 'https://4724-34-83-211-175.ngrok-free.app';
const CHATS_COLLECTION = 'chats';
const CHAT_STATUS_COLLECTION = 'chatStatus';

function getFAQAnswer(userQuestion: string): { answer: string; url?: string } | null {
  const faqs = faqsData.faqs;
  const lowerUserQuestion = userQuestion.trim().toLowerCase();
  const faq = faqs.find(item => item.Question.trim().toLowerCase() === lowerUserQuestion);
  if (faq) {
    const answer = faq.Answer;
    const rawUrl = faq["url (link pdf, nội dung liên quan đến)"];
    const trimmedUrl: string | undefined = typeof rawUrl === "string" ? rawUrl.trim() : undefined;
    return { answer, url: trimmedUrl };
  }
  return null;
}


export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  isLoading: false,
  error: null,

  addMessage: (message: ChatMessage) =>
    set((state) => ({ messages: [...state.messages, message] })),

  clearChat: async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;
    const uid = currentUser.uid;
    const currentTime = Date.now();
    try {
      await setDoc(doc(db, CHAT_STATUS_COLLECTION, uid), { lastCleared: currentTime });
      set({ messages: [] });
    } catch (error) {
      console.error("Error clearing chat:", error);
      set({ error: error instanceof Error ? error.message : "Error clearing chat" });
    }
  },

  fetchMessages: async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;
    const uid = currentUser.uid;
    let lastCleared = 0;
    try {
      const chatStatusDoc = await getDoc(doc(db, CHAT_STATUS_COLLECTION, uid));
      if (chatStatusDoc.exists() && chatStatusDoc.data().lastCleared) {
        lastCleared = chatStatusDoc.data().lastCleared;
      }
    } catch (error) {
      console.error("Error fetching chat status:", error);
    }
    set({ messages: [], isLoading: true, error: null });
    try {
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

  sendUserMessage: async (text: string) => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    set({ isLoading: true, error: null });
    const userMsg: ChatMessage = {
      id: '',
      sender: 'user',
      text,
      timestamp: Date.now(),
      userId: uid,
    };

    try {
      const docRefUser = await addDoc(collection(db, CHATS_COLLECTION), userMsg);
      const userMsgWithId: ChatMessage = { ...userMsg, id: docRefUser.id };
      set((state) => ({ messages: [...state.messages, userMsgWithId] }));

      // Check question trong file JSON FAQs
      const faqResult = getFAQAnswer(text);
      let chatbotText: string;
      if (faqResult) {
        chatbotText = faqResult.answer;
        if (faqResult.url) {
          chatbotText += "\n\nTài liệu liên quan: " + faqResult.url;
        }
      } else {
        const response = await fetch(API_URL + '/query', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: text }),
        });
        if (!response.ok) {
          throw new Error('Failed to get chatbot response');
        }
        const data = await response.json();
        chatbotText = data.answer;
      }

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

