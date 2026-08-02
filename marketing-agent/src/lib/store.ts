"use client";

import { create } from "zustand";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  toolCalls?: string[];
  isStreaming?: boolean;
  timestamp: Date;
}

interface ChatStore {
  messages: Message[];
  sessionId: string | null;
  isLoading: boolean;
  streamingContent: string;
  activeToolCalls: string[];
  addMessage: (msg: Omit<Message, "id" | "timestamp">) => string;
  updateMessage: (id: string, update: Partial<Message>) => void;
  setSessionId: (id: string) => void;
  setLoading: (v: boolean) => void;
  setStreamingContent: (v: string) => void;
  setActiveToolCalls: (tools: string[]) => void;
  clearChat: () => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  sessionId: null,
  isLoading: false,
  streamingContent: "",
  activeToolCalls: [],

  addMessage: (msg) => {
    const id = crypto.randomUUID();
    set((state) => ({
      messages: [...state.messages, { ...msg, id, timestamp: new Date() }],
    }));
    return id;
  },

  updateMessage: (id, update) => {
    set((state) => ({
      messages: state.messages.map((m) =>
        m.id === id ? { ...m, ...update } : m
      ),
    }));
  },

  setSessionId: (id) => set({ sessionId: id }),
  setLoading: (v) => set({ isLoading: v }),
  setStreamingContent: (v) => set({ streamingContent: v }),
  setActiveToolCalls: (tools) => set({ activeToolCalls: tools }),

  clearChat: () =>
    set({ messages: [], sessionId: null, streamingContent: "", activeToolCalls: [] }),
}));
