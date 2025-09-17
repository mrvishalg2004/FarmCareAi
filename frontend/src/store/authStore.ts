import { create } from 'zustand';

import { supabase } from '../lib/supabase';
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
          // Get initial session
          const { data: { session }, error } = await supabase.auth.getSession();
          
          if (error) {
            console.error('Error getting session:', error);
            set({ error: error.message, loading: false, initialized: true });
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
              loading: false,
              error: null
            });
          });
        } catch (error) {
          console.error('Auth initialization error:', error);
          set({ 
            loading: false, 
            initialized: true, 
            error: error instanceof Error ? error.message : 'Initialization failed' 
          });
        }
      },

      signIn: async (email: string, password: string) => {
        set({ loading: true, error: null });
        
        try {
          const result = await AuthService.signIn({ email, password });

          if (result.error) {
            set({ error: result.error, loading: false });
            throw new Error(result.error);
          }

          if (result.user) {
            const userProfile = await AuthService.getUserProfile(result.user.id);
            set({ 
              user: result.user, 
              userProfile,
              loading: false, 
              error: null 
            });
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Sign in failed';
          set({ error: errorMessage, loading: false });
          throw error;
        }
      },

      signUp: async (email: string, password: string) => {
        set({ loading: true, error: null });
        
        try {
          const result = await AuthService.signUp({
            email,
            password,
            fullName: '', // This will be handled by the SignUp component
          });

          if (result.error) {
            set({ error: result.error, loading: false });
            throw new Error(result.error);
          }

          if (result.user) {
            // Create user profile
            await AuthService.createUserProfile(result.user);
            const userProfile = await AuthService.getUserProfile(result.user.id);
            
            set({ 
              user: result.user, 
              userProfile,
              loading: false, 
              error: null 
            });
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Sign up failed';
          set({ error: errorMessage, loading: false });
          throw error;
        }
      },

      signOut: async () => {
        set({ loading: true, error: null });
        
        try {
          const result = await AuthService.signOut();
          
          if (result.error) {
            set({ error: result.error, loading: false });
            throw new Error(result.error);
          }
          
          set({ 
            user: null, 
            userProfile: null, 
            loading: false, 
            error: null 
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Sign out failed';
          set({ error: errorMessage, loading: false });
          throw error;
        }
      },

      clearError: () => {
        set({ error: null });
      },

      updateProfile: async (updates) => {
        const { user } = get();
        if (!user) {
          throw new Error('No user authenticated');
        }

        set({ loading: true, error: null });

        try {
          const result = await AuthService.updateUserProfile(user.id, updates);
          
          if (result.error) {
            set({ error: result.error, loading: false });
            throw new Error(result.error);
          }

          // Refresh user profile
          const updatedProfile = await AuthService.getUserProfile(user.id);
          set({ 
            userProfile: updatedProfile, 
            loading: false, 
            error: null 
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Profile update failed';
          set({ error: errorMessage, loading: false });
          throw error;
        }
      },

      refreshUserProfile: async () => {
        const { user } = get();
        if (!user) return;

        try {
          const userProfile = await AuthService.getUserProfile(user.id);
          set({ userProfile });
        } catch (error) {
          console.error('Failed to refresh user profile:', error);
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

          set({ loading: false, error: null });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Password reset failed';
          set({ error: errorMessage, loading: false });
          throw error;
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

          set({ loading: false, error: null });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Password update failed';
          set({ error: errorMessage, loading: false });
          throw error;
        }
      },
    })
  );