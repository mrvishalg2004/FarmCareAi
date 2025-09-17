import { createClient, AuthError } from '@supabase/supabase-js';
import type { Database } from '../types/database';

// Get environment variables with validation
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env file and ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.'
  );
}

// Create Supabase client with TypeScript support
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  realtime: {
    params: {
      eventsPerSecond: 2
    }
  }
});

// Helper function to check if Supabase is configured
export const isSupabaseConfigured = (): boolean => {
  return !!(supabaseUrl && supabaseAnonKey);
};

// Helper function to handle Supabase Auth errors
export const handleAuthError = (error: AuthError | Error | null): string => {
  if (!error) return '';
  
  const errorMessage = error.message.toLowerCase();
  
  // Handle various authentication error cases
  if (errorMessage.includes('invalid login credentials')) {
    return 'Invalid email or password. Please check your credentials and try again.';
  }
  
  if (errorMessage.includes('email not confirmed')) {
    return 'Please check your email and click the confirmation link before signing in.';
  }
  
  if (errorMessage.includes('user already registered') || errorMessage.includes('already exists')) {
    return 'This email is already registered. Try signing in instead, or use a different email address.';
  }
  
  if (errorMessage.includes('password should be at least 6 characters') || errorMessage.includes('weak password')) {
    return 'Password must be at least 6 characters long and contain letters and numbers.';
  }
  
  if (errorMessage.includes('unable to validate email address') || errorMessage.includes('invalid format')) {
    return 'Please enter a valid email address.';
  }
  
  if (errorMessage.includes('signup is disabled')) {
    return 'Account registration is currently disabled. Please contact support.';
  }
  
  if (errorMessage.includes('too many requests')) {
    return 'Too many attempts. Please wait a few minutes before trying again.';
  }
  
  // Return the original error message if no specific case matches
  return error.message || 'An unexpected error occurred. Please try again.';
};