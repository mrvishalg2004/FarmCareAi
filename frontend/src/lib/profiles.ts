import { supabase } from './supabase';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  farm_size?: string;
  last_login?: string;
  created_at?: string;
  updated_at?: string;
}

// Create user profile
export const createUserProfile = async (profileData: Omit<UserProfile, 'created_at' | 'updated_at'>) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .insert([{
        ...profileData,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error('Profile creation error:', error);
      throw new Error(`Failed to create profile: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Create profile error:', error);
    throw error;
  }
};

// Get user profile
export const getUserProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Get profile error:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Get profile error:', error);
    return null;
  }
};

// Update user profile
export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Update profile error:', error);
      throw new Error(`Failed to update profile: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Update profile error:', error);
    throw error;
  }
};

// Check if profiles table exists
export const checkProfilesTableExists = async () => {
  try {
    const { error } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);

    return !error;
  } catch (error) {
    console.error('Table check error:', error);
    return false;
  }
};