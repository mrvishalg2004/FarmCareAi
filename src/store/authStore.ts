import { create } from 'zustand';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { auth } from '../lib/firebase';

interface AuthState {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => {
  // Set up auth state listener
  onAuthStateChanged(auth, (user) => {
    set({ user, loading: false });
  });

  return {
    user: null,
    loading: true,
    signIn: async (email: string, password: string) => {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        set({ user: userCredential.user });
      } catch (error) {
        console.error('Sign in error:', error);
        throw error;
      }
    },
    signUp: async (email: string, password: string) => {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        set({ user: userCredential.user });
      } catch (error) {
        console.error('Sign up error:', error);
        throw error;
      }
    },
    signOut: async () => {
      try {
        await firebaseSignOut(auth);
        set({ user: null });
      } catch (error) {
        console.error('Sign out error:', error);
        throw error;
      }
    },
  };
});