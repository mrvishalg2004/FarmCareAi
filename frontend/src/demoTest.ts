/**
 * Demo Mode Testing Utility
 * 
 * This file provides utilities to test the application in demo mode
 * without requiring backend services to be running.
 */

import { AuthService } from './lib/auth';
import { isSupabaseConfigured } from './lib/supabase';

/**
 * Verifies that we are running in demo mode
 */
export const checkDemoMode = () => {
  const isDemoMode = !isSupabaseConfigured();
  console.log('Demo mode check:', isDemoMode ? 'ENABLED' : 'DISABLED');
  
  if (!isDemoMode) {
    console.warn('App is running with real Supabase configuration. Demo mode tests will not be valid.');
  }
  
  return isDemoMode;
};

/**
 * Tests the demo mode authentication flow
 */
export const testAuthFlow = async () => {
  console.group('🧪 Demo Mode Authentication Test');
  console.time('Auth flow test');
  
  try {
    console.log('Step 1: Checking demo mode status...');
    const isDemoMode = checkDemoMode();
    if (!isDemoMode) {
      console.warn('⚠️ Not running in demo mode, test results may not be valid');
    }
    
    console.log('Step 2: Testing sign in...');
    const signInResult = await AuthService.signIn({
      email: 'test@example.com',
      password: 'password123'
    });
    
    console.log('Sign in result:', {
      success: !!signInResult.user && !signInResult.error,
      user: signInResult.user ? {
        id: signInResult.user.id,
        email: signInResult.user.email
      } : null,
      error: signInResult.error
    });
    
    if (!signInResult.user || signInResult.error) {
      console.error('❌ Sign in failed');
      return false;
    }
    
    console.log('Step 3: Testing get user profile...');
    const userProfile = await AuthService.getUserProfile(signInResult.user.id);
    console.log('User profile:', userProfile);
    
    if (!userProfile) {
      console.error('❌ Failed to get user profile');
      return false;
    }
    
    console.log('Step 4: Testing sign out...');
    const signOutResult = await AuthService.signOut();
    console.log('Sign out result:', signOutResult);
    
    if (signOutResult.error) {
      console.error('❌ Sign out failed');
      return false;
    }
    
    console.log('Step 5: Testing sign up...');
    const signUpResult = await AuthService.signUp({
      email: 'newuser@example.com',
      password: 'password123',
      fullName: 'New Test User'
    });
    
    console.log('Sign up result:', {
      success: !!signUpResult.user && !signUpResult.error,
      user: signUpResult.user ? {
        id: signUpResult.user.id,
        email: signUpResult.user.email
      } : null,
      error: signUpResult.error
    });
    
    if (!signUpResult.user || signUpResult.error) {
      console.error('❌ Sign up failed');
      return false;
    }
    
    console.log('✅ All authentication tests passed!');
    return true;
  } catch (error) {
    console.error('❌ Test failed with error:', error);
    return false;
  } finally {
    console.timeEnd('Auth flow test');
    console.groupEnd();
  }
};

/**
 * Instructions for testing demo mode
 */
export const getDemoModeInstructions = () => {
  return `
    Demo Mode Testing Instructions
    -----------------------------
    
    1. Open your browser console (F12 or Ctrl+Shift+I)
    2. Run the following command to test authentication:
       
       import { testAuthFlow } from './demoTest';
       testAuthFlow().then(success => console.log('Test completed with status:', success ? 'SUCCESS' : 'FAILED'));
       
    3. To check if demo mode is active:
       
       import { checkDemoMode } from './demoTest';
       checkDemoMode();
       
    4. Try logging in with any email and password
       (Demo mode will accept any valid email format and password >= 6 characters)
       
    5. After login, you should be able to access protected routes like the Dashboard
  `;
};

// Export default for direct imports
export default {
  checkDemoMode,
  testAuthFlow,
  getDemoModeInstructions
};