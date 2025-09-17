import { supabase, handleAuthError } from './supabase';
import type { User } from '@supabase/supabase-js';

// Types for authentication
export interface SignUpData {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  location?: string;
  farmSize?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  location?: string;
  farm_size?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResult {
  user: User | null;
  error: string | null;
  requiresEmailConfirmation?: boolean;
}

/**
 * Authentication Service Class
 * Handles all Supabase authentication operations with proper error handling
 */
export class AuthService {
  /**
   * Sign in a user with email and password
   * @param data - Sign in credentials
   * @returns Promise with user data or error
   */
  static async signIn(data: SignInData): Promise<AuthResult> {
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email.trim().toLowerCase(),
        password: data.password,
      });

      if (error) {
        return {
          user: null,
          error: handleAuthError(error),
        };
      }

      return {
        user: authData.user,
        error: null,
      };
    } catch (error) {
      console.error('Sign in error:', error);
      return {
        user: null,
        error: 'An unexpected error occurred during sign in.',
      };
    }
  }

  /**
   * Sign up a new user with email and password
   * @param data - Sign up data including profile information
   * @returns Promise with user data or error
   */
  static async signUp(data: SignUpData): Promise<AuthResult> {
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email.trim().toLowerCase(),
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            phone: data.phone || null,
            location: data.location || null,
            farm_size: data.farmSize || null,
          },
        },
      });

      if (error) {
        return {
          user: null,
          error: handleAuthError(error),
        };
      }

      // Check if email confirmation is required
      const requiresEmailConfirmation = !authData.user?.email_confirmed_at;

      return {
        user: authData.user,
        error: null,
        requiresEmailConfirmation,
      };
    } catch (error) {
      console.error('Sign up error:', error);
      return {
        user: null,
        error: 'An unexpected error occurred during sign up.',
      };
    }
  }

  /**
   * Sign out the current user
   * @returns Promise with error if any
   */
  static async signOut(): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        return { error: handleAuthError(error) };
      }

      return { error: null };
    } catch (error) {
      console.error('Sign out error:', error);
      return { error: 'An unexpected error occurred during sign out.' };
    }
  }

  /**
   * Get the current user session
   * @returns Promise with user or null
   */
  static async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        console.error('Get current user error:', error);
        return null;
      }

      return user;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  /**
   * Reset password for a user
   * @param email - User's email address
   * @returns Promise with error if any
   */
  static async resetPassword(email: string): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        return { error: handleAuthError(error) };
      }

      return { error: null };
    } catch (error) {
      console.error('Reset password error:', error);
      return { error: 'An unexpected error occurred during password reset.' };
    }
  }

  /**
   * Update user password
   * @param newPassword - New password
   * @returns Promise with error if any
   */
  static async updatePassword(newPassword: string): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        return { error: handleAuthError(error) };
      }

      return { error: null };
    } catch (error) {
      console.error('Update password error:', error);
      return { error: 'An unexpected error occurred during password update.' };
    }
  }

  /**
   * Get user profile from the profiles table
   * @param userId - User's ID
   * @returns Promise with user profile or null
   */
  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Get user profile error:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Get user profile error:', error);
      return null;
    }
  }

  /**
   * Update user profile in the profiles table
   * @param userId - User's ID
   * @param updates - Profile updates
   * @returns Promise with error if any
   */
  static async updateUserProfile(
    userId: string,
    updates: Partial<Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>>
  ): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (error) {
        console.error('Update user profile error:', error);
        return { error: 'Failed to update profile. Please try again.' };
      }

      return { error: null };
    } catch (error) {
      console.error('Update user profile error:', error);
      return { error: 'An unexpected error occurred during profile update.' };
    }
  }

  /**
   * Create user profile in the profiles table
   * @param user - User object from Supabase Auth
   * @returns Promise with error if any
   */
  static async createUserProfile(user: User): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email!,
          full_name: user.user_metadata?.full_name || '',
          phone: user.user_metadata?.phone || null,
          location: user.user_metadata?.location || null,
          farm_size: user.user_metadata?.farm_size || null,
          avatar_url: user.user_metadata?.avatar_url || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

      if (error) {
        console.error('Create user profile error:', error);
        return { error: 'Failed to create user profile.' };
      }

      return { error: null };
    } catch (error) {
      console.error('Create user profile error:', error);
      return { error: 'An unexpected error occurred during profile creation.' };
    }
  }
}

/**
 * Input validation utilities
 */
export class ValidationUtils {
  /**
   * Validate email format
   * @param email - Email to validate
   * @returns boolean
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  }

  /**
   * Validate password strength
   * @param password - Password to validate
   * @returns validation result with errors
   */
  static validatePassword(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }

    if (password.length > 72) {
      errors.push('Password must be less than 72 characters long');
    }

    if (!/[A-Za-z]/.test(password)) {
      errors.push('Password must contain at least one letter');
    }

    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate phone number format
   * @param phone - Phone number to validate
   * @returns boolean
   */
  static isValidPhone(phone: string): boolean {
    const phoneRegex = /^\+?[\d\s\-()]{10,}$/;
    return phoneRegex.test(phone.trim());
  }

  /**
   * Validate form data for sign up
   * @param data - Sign up data to validate
   * @returns validation result with errors
   */
  static validateSignUpData(data: SignUpData): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.email) {
      errors.push('Email is required');
    } else if (!this.isValidEmail(data.email)) {
      errors.push('Please enter a valid email address');
    }

    if (!data.password) {
      errors.push('Password is required');
    } else {
      const passwordValidation = this.validatePassword(data.password);
      if (!passwordValidation.isValid) {
        errors.push(...passwordValidation.errors);
      }
    }

    if (!data.fullName || data.fullName.trim().length < 2) {
      errors.push('Full name must be at least 2 characters long');
    }

    if (data.phone && !this.isValidPhone(data.phone)) {
      errors.push('Please enter a valid phone number');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate form data for sign in
   * @param data - Sign in data to validate
   * @returns validation result with errors
   */
  static validateSignInData(data: SignInData): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.email) {
      errors.push('Email is required');
    } else if (!this.isValidEmail(data.email)) {
      errors.push('Please enter a valid email address');
    }

    if (!data.password) {
      errors.push('Password is required');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
