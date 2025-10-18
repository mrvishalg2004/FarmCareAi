import { create } from 'zustand';

import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { AuthService, type UserProfile } from '../lib/auth';
import type { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  initialized: boolean;
  error: string | null;
  
  // Auth actions
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
  clearError: () => void;
  
  // Profile actions
  updateProfile: (updates: Partial<Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>>) => Promise<void>;
  refreshUserProfile: () => Promise<void>;
  
  // Password actions
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  userProfile: null,
  loading: true,
  initialized: false,
  error: null,

  initialize: async () => {
    try {
      // Check if we have valid Supabase configuration
      const hasValidConfig = import.meta.env.VITE_SUPABASE_URL && 
                          import.meta.env.VITE_SUPABASE_ANON_KEY &&
                          import.meta.env.VITE_SUPABASE_URL !== 'your_supabase_project_url_here';
      
      if (!hasValidConfig) {
        console.warn('Supabase not configured, skipping auth initialization');
        set({ 
          user: null, 
          userProfile: null, 
          loading: false, 
          initialized: true,
          error: null 
        });
        return;
      }

      // Get initial session
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting session:', error);
        // Don't treat this as a fatal error, just continue without auth
        set({ 
          user: null, 
          userProfile: null, 
          loading: false, 
          initialized: true, 
          error: null 
        });
        return;
      }

      let userProfile = null;
      if (session?.user) {
        // Get user profile
        userProfile = await AuthService.getUserProfile(session.user.id);
      }

      set({ 
        user: session?.user ?? null,
        userProfile,
        loading: false, 
        initialized: true,
        error: null
      });

      // Set up auth state listener
      supabase.auth.onAuthStateChange(async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        let profile = null;
        if (session?.user) {
          profile = await AuthService.getUserProfile(session.user.id);
        }

        set({
          user: session?.user ?? null,
          userProfile: profile,
          loading: false
        });
      });
    } catch (error) {
      console.error('Error initializing auth:', error);
      set({ 
        user: null, 
        userProfile: null, 
        loading: false, 
        initialized: true, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  },

  signIn: async (email: string, password: string) => {
    set({ loading: true, error: null });
    
    try {
      // Check if we're running in demo mode
      const isDemoMode = !isSupabaseConfigured();
      console.log('Auth store signIn - Demo mode:', isDemoMode);
      
      const result = await AuthService.signIn({ email, password });

      if (result.error) {
        set({ error: result.error, loading: false });
        throw new Error(result.error);
      }

      if (result.user) {
        let userProfile = null;
        
        if (isDemoMode) {
          // Create a mock profile for demo mode
          userProfile = {
            id: result.user.id,
            email: result.user.email || email,
            full_name: 'Demo User',
            phone: '+1234567890',
            location: 'Demo City',
            farm_size: '10 acres',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
        } else {
          // Get real profile from database
          userProfile = await AuthService.getUserProfile(result.user.id);
        }

        set({
          user: result.user,
          userProfile,
          loading: false,
          error: null
        });
      }
    } catch (error) {
      // Let the Auth service handle formatting the error message
      console.error('Sign in error:', error);
      // Error is already set by the try block above
    }
  },

  signUp: async (email: string, password: string) => {
    set({ loading: true, error: null });
    
    try {
      const result = await AuthService.signUp({ email, password, fullName: 'User' });
      
      if (result.error) {
        set({ error: result.error, loading: false });
        throw new Error(result.error);
      }
      
      // Most Supabase configurations require email confirmation,
      // so don't set the user here
      set({ loading: false });
      
      return;
    } catch (error) {
      console.error('Sign up error:', error);
      // Error is already set by the try block above
    }
  },

  signOut: async () => {
    set({ loading: true, error: null });
    
    try {
      await AuthService.signOut();
      
      // Clear user data on sign out
      set({
        user: null,
        userProfile: null,
        loading: false,
        error: null
      });
    } catch (error) {
      console.error('Sign out error:', error);
      
      // Force sign out even if there's an error
      set({
        user: null,
        userProfile: null,
        loading: false,
        error: error instanceof Error ? error.message : 'Sign out failed'
      });
    }
  },

  clearError: () => {
    set({ error: null });
  },

  updateProfile: async (updates) => {
    const { user } = get();
    if (!user) throw new Error('Not authenticated');
    
    set({ loading: true, error: null });
    
    try {
      const result = await AuthService.updateUserProfile(user.id, updates);
      
      if (result.error) {
        set({ 
          loading: false, 
          error: result.error 
        });
        return;
      }
      
      // Refresh the user profile after successful update
      await get().refreshUserProfile();
    } catch (error) {
      console.error('Profile update error:', error);
      set({ 
        loading: false, 
        error: error instanceof Error ? error.message : 'Profile update failed' 
      });
    }
  },

  refreshUserProfile: async () => {
    const { user } = get();
    if (!user) return;
    
    set({ loading: true });
    
    try {
      const profile = await AuthService.getUserProfile(user.id);
      
      set({
        userProfile: profile,
        loading: false
      });
    } catch (error) {
      console.error('Profile refresh error:', error);
      set({ 
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to refresh profile'
      });
    }
  },

  resetPassword: async (email: string) => {
    set({ loading: true, error: null });
    
    try {
      const result = await AuthService.resetPassword(email);
      
      if (result.error) {
        set({ error: result.error, loading: false });
        throw new Error(result.error);
      }
      
      set({ loading: false });
    } catch (error) {
      console.error('Password reset error:', error);
      // Error already set in the try block
    }
  },

  updatePassword: async (newPassword: string) => {
    set({ loading: true, error: null });
    
    try {
      const result = await AuthService.updatePassword(newPassword);
      
      if (result.error) {
        set({ error: result.error, loading: false });
        throw new Error(result.error);
      }
      
      set({ loading: false });
    } catch (error) {
      console.error('Password update error:', error);
      set({ 
        loading: false, 
        error: error instanceof Error ? error.message : 'Password update failed' 
      });
    }
  }
}));