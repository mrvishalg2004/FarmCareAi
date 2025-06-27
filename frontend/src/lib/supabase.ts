import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dhfmjhsuldxwcieshhmu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRoZm1qaHN1bGR4d2NpZXNoaG11Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5NTMyMjQsImV4cCI6MjA2NjUyOTIyNH0.UPLhhEsMhmNNkNZoDIsC_XK8wWUY70wIFApVQb1RIyE';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Helper function to check if Supabase is configured
export const isSupabaseConfigured = () => {
  return !!supabase;
};