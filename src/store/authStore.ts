import { create } from 'zustand';
import { User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthState {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  signIn: async (email: string, password: string) => {
    if (!isSupabaseConfigured()) {
      throw new Error('Please connect to Supabase first using the "Connect to Supabase" button in the top right corner.');
    }
    const { error } = await supabase!.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  },
  signUp: async (email: string, password: string) => {
    if (!isSupabaseConfigured()) {
      throw new Error('Please connect to Supabase first using the "Connect to Supabase" button in the top right corner.');
    }
    const { error } = await supabase!.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
  },
  signOut: async () => {
    if (!isSupabaseConfigured()) {
      throw new Error('Please connect to Supabase first using the "Connect to Supabase" button in the top right corner.');
    }
    const { error } = await supabase!.auth.signOut();
    if (error) throw error;
    set({ user: null });
  },
}));