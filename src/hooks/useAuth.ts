import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function initSession() {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Session error:', error);
        return;
      }
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      setIsLoading(false);
    }

    initSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
      if (event === 'SIGNED_IN') {
        navigate('/dashboard', { replace: true });
      } else if (event === 'SIGNED_OUT') {
        navigate('/', { replace: true });
        // Clear any cached data
        localStorage.removeItem('supabase.auth.token');
      } else if (event === 'USER_UPDATED') {
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const signOut = async () => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
      setUser(null);
      // Clear any cached data
      localStorage.removeItem('supabase.auth.token');
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    isLoading,
    signOut,
  };
}