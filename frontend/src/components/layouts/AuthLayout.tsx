import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

function AuthLayout() {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => (user: any) => state.user = user);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      return;
    }

    supabase!.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase!.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return <Outlet />;
}

export default AuthLayout;