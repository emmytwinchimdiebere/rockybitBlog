"use client"
import { createClient } from "@/utils/supabase/client";
import { create } from "zustand";

interface CommentData {
  comments: Array<{
    id: number;
    content: string;
    createdAt: string;
    author: {
      id: string;
      first_name: string;
      email: string;
      profile: {
        avatar: string | null;
      } | null;
    };
    likes: number;
    dislikes: number;
    children: Array<any>; // You can replace 'any' with a more specific type if needed
  }>;
}

interface AuthState {
  user: any; // You can replace `any` with a proper user type
  setUser: (user: any) => void;
  isLoggedIn: boolean;
  checkAuth: () => Promise<void>;
  signOut: () => Promise<void>;
  fetchComments: (postId: number) => Promise<CommentData | null>;
  comment: CommentData['comments'];
}

export const useAuthstore = create<AuthState>((set) => ({
  comment: [],
  user: null,
  isLoggedIn: false,
  setUser: (user: any) => set({ user: user, isLoggedIn: true }),

  checkAuth: async () => {
    const supabase = await createClient();
    const { error, data: user } = await supabase.auth.getUser();

    if (!error && user) {
      set({ user: user, isLoggedIn: true });
    } else {
      set({ user: null, isLoggedIn: false });
    }
  },

  signOut: async () => {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();

    if (!error) {
      set({ user: null, isLoggedIn: false });
    }
  },

  fetchComments: async (postId: number): Promise<CommentData | null> => {
    try {
      const response = await fetch(`/api/comments?postId=${postId}`,{
        cache:"no-cache"
      });
      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }
      const serverResponse: CommentData = await response.json();
      set({ comment: serverResponse.comments || [] });
      return serverResponse;
    } catch (error) {
      console.error('Error fetching comments:', error);
      return null;
    }
  }
}));

