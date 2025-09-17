# Supabase Authentication Implementation Guide

## Overview

This document provides a comprehensive guide to the Supabase authentication implementation in the FarmCare AI project. The implementation follows security best practices and provides a complete authentication system with user management, error handling, and type safety.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Environment Configuration](#environment-configuration)
3. [Core Components](#core-components)
4. [API Reference](#api-reference)
5. [Usage Examples](#usage-examples)
6. [Security Considerations](#security-considerations)
7. [Troubleshooting](#troubleshooting)
8. [Best Practices](#best-practices)

## Architecture Overview

The authentication system is built using a layered architecture:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Components    │◄──►│   Auth Store    │◄──►│  Auth Service   │
│   (UI Layer)    │    │  (State Mgmt)   │    │  (Business)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                       │
                                              ┌─────────────────┐
                                              │ Supabase Client │
                                              │   (Data Layer)  │
                                              └─────────────────┘
```

### Key Components:

- **Supabase Client**: Handles low-level authentication operations
- **Auth Service**: Provides high-level authentication methods with error handling
- **Auth Store**: Manages authentication state using Zustand
- **Components**: UI components for sign-in, sign-up, and user management

## Environment Configuration

### Required Environment Variables

Create a `.env` file in your `frontend` directory with the following variables:

```env
# Supabase Configuration (Required)
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# App Configuration (Optional)
VITE_APP_NAME=FarmCare AI
VITE_APP_VERSION=1.0.0
VITE_NODE_ENV=development
```

### Environment Variable Details:

1. **VITE_SUPABASE_URL**: Your Supabase project URL
   - Format: `https://your-project-id.supabase.co`
   - Found in: Supabase Dashboard → Settings → API

2. **VITE_SUPABASE_ANON_KEY**: Your Supabase anonymous/public key
   - Format: JWT token starting with `eyJ...`
   - Found in: Supabase Dashboard → Settings → API
   - **Note**: This is safe to expose in client-side code

### Security Notes:
- Never expose your Supabase service role key in client-side code
- The anon key is designed to be public and has limited permissions
- Always use environment variables, never hardcode credentials

## Core Components

### 1. Supabase Client (`src/lib/supabase.ts`)

```typescript
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
});
```

**Features:**
- Environment variable validation
- TypeScript support with Database types
- Auto token refresh
- Session persistence
- PKCE flow for enhanced security

### 2. Authentication Service (`src/lib/auth.ts`)

The AuthService class provides high-level authentication methods:

```typescript
// Sign in a user
const result = await AuthService.signIn({ email, password });

// Sign up a new user
const result = await AuthService.signUp({
  email,
  password,
  fullName,
  phone,
  location,
  farmSize
});

// Sign out current user
await AuthService.signOut();
```

**Key Features:**
- Comprehensive error handling
- Input validation
- User profile management
- Password operations
- Type-safe operations

### 3. Authentication Store (`src/store/authStore.ts`)

Global state management using Zustand:

```typescript
const { 
  user, 
  userProfile, 
  loading, 
  error,
  signIn, 
  signUp, 
  signOut,
  updateProfile,
  clearError
} = useAuthStore();
```

**State Properties:**
- `user`: Current authenticated user
- `userProfile`: Extended user profile data
- `loading`: Authentication operation status
- `error`: Current error message
- `initialized`: Whether auth has been initialized

### 4. UI Components

#### SignIn Component (`src/pages/SignIn.tsx`)
- Email/password authentication
- Input validation
- Error handling
- Responsive design
- Loading states

#### SignUp Component (`src/pages/SignUp.tsx`)
- User registration
- Profile information collection
- Password confirmation
- Location services integration
- Success/error feedback

## API Reference

### AuthService Methods

#### `signIn(data: SignInData): Promise<AuthResult>`
Signs in a user with email and password.

**Parameters:**
```typescript
interface SignInData {
  email: string;
  password: string;
}
```

**Returns:**
```typescript
interface AuthResult {
  user: User | null;
  error: string | null;
}
```

#### `signUp(data: SignUpData): Promise<AuthResult>`
Registers a new user.

**Parameters:**
```typescript
interface SignUpData {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  location?: string;
  farmSize?: string;
}
```

#### `signOut(): Promise<{ error: string | null }>`
Signs out the current user.

#### `resetPassword(email: string): Promise<{ error: string | null }>`
Sends password reset email.

#### `updatePassword(newPassword: string): Promise<{ error: string | null }>`
Updates user password.

#### `getUserProfile(userId: string): Promise<UserProfile | null>`
Retrieves user profile from database.

#### `updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<{ error: string | null }>`
Updates user profile in database.

### ValidationUtils Methods

#### `isValidEmail(email: string): boolean`
Validates email format.

#### `validatePassword(password: string): { isValid: boolean; errors: string[] }`
Validates password strength.

#### `validateSignUpData(data: SignUpData): { isValid: boolean; errors: string[] }`
Validates complete sign-up form data.

#### `validateSignInData(data: SignInData): { isValid: boolean; errors: string[] }`
Validates sign-in form data.

## Usage Examples

### Basic Authentication Flow

```typescript
import { useAuthStore } from '../store/authStore';
import { AuthService } from '../lib/auth';

function LoginComponent() {
  const { signIn, loading, error } = useAuthStore();
  
  const handleSubmit = async (email: string, password: string) => {
    try {
      await signIn(email, password);
      // Redirect to dashboard
    } catch (error) {
      // Error is handled by the store
      console.error('Login failed:', error);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      {/* Form inputs */}
      <button disabled={loading}>
        {loading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  );
}
```

### Protected Routes

```typescript
import { useAuthStore } from '../store/authStore';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, initialized } = useAuthStore();
  
  if (!initialized || loading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/signin" replace />;
  }
  
  return <>{children}</>;
}
```

### Profile Management

```typescript
import { useAuthStore } from '../store/authStore';

function ProfileComponent() {
  const { userProfile, updateProfile, loading } = useAuthStore();
  
  const handleUpdateProfile = async (updates: Partial<UserProfile>) => {
    try {
      await updateProfile(updates);
      // Profile updated successfully
    } catch (error) {
      console.error('Profile update failed:', error);
    }
  };
  
  return (
    <div>
      <h2>{userProfile?.full_name}</h2>
      <p>{userProfile?.email}</p>
      {/* Profile update form */}
    </div>
  );
}
```

## Security Considerations

### 1. Environment Variables
- Store sensitive data in environment variables
- Never commit `.env` files to version control
- Use different keys for development and production

### 2. Input Validation
- Always validate user input on both client and server
- Use the provided ValidationUtils for consistent validation
- Sanitize user input before database operations

### 3. Error Handling
- Don't expose sensitive error details to users
- Log detailed errors for debugging
- Provide user-friendly error messages

### 4. Session Management
- Sessions are automatically managed by Supabase
- Tokens are automatically refreshed
- Sessions persist across browser sessions

### 5. Password Security
- Enforce strong password requirements
- Use Supabase's built-in password hashing
- Provide password reset functionality

## Troubleshooting

### Common Issues

#### 1. Environment Variables Not Loading
**Problem**: `Missing Supabase environment variables` error

**Solution:**
- Ensure `.env` file is in the correct location (`frontend/.env`)
- Check variable names match exactly (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)
- Restart development server after adding environment variables

#### 2. Authentication State Not Persisting
**Problem**: User gets logged out on page refresh

**Solution:**
- Ensure `initialize()` is called in your app startup
- Check that `persistSession: true` is set in Supabase client config
- Verify browser allows localStorage

#### 3. Sign-up Email Confirmation
**Problem**: Users not receiving confirmation emails

**Solution:**
- Check Supabase email settings in dashboard
- Verify SMTP configuration
- Check spam folder
- Enable email confirmation in Supabase Auth settings

#### 4. CORS Issues
**Problem**: Network requests blocked by CORS

**Solution:**
- Add your domain to Supabase allowed origins
- Check Supabase dashboard → Authentication → Settings → Site URL

### Debug Mode

Enable detailed logging by adding to your environment:

```env
VITE_DEBUG_AUTH=true
```

This will log authentication events to the console.

## Best Practices

### 1. State Management
- Use the auth store for all authentication state
- Clear errors when appropriate
- Handle loading states in UI

### 2. Error Handling
- Always handle authentication errors gracefully
- Provide clear error messages to users
- Log errors for debugging

### 3. User Experience
- Show loading states during authentication
- Provide feedback for successful operations
- Handle offline scenarios

### 4. Testing
- Test authentication flows thoroughly
- Test error scenarios
- Test with different user roles

### 5. Performance
- Initialize authentication early in app lifecycle
- Cache user profile data appropriately
- Minimize unnecessary re-renders

## Migration from Firebase

If migrating from Firebase Authentication:

1. Update import statements
2. Replace Firebase methods with AuthService methods
3. Update error handling logic
4. Test authentication flows thoroughly

### Key Differences:
- Supabase uses email confirmation by default
- Different error message formats
- Built-in user profile management
- PostgreSQL instead of Firestore

## Support and Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [TypeScript Support](https://supabase.com/docs/reference/javascript/installing)
- [Security Best Practices](https://supabase.com/docs/guides/auth/server-side-rendering)

For project-specific issues, check the authentication store and service implementations in your codebase.
