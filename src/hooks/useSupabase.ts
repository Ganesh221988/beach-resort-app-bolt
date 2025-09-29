import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';

type Tables = Database['public']['Tables'];

// Generic hook for fetching data from Supabase
export function useSupabaseQuery<T extends keyof Tables>(
  table: T,
  options?: {
    select?: string;
    filter?: Record<string, any>;
    orderBy?: { column: string; ascending?: boolean };
    limit?: number;
  }
) {
  const [data, setData] = useState<Tables[T]['Row'][] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        let query = supabase.from(table).select(options?.select || '*');

        // Apply filters
        if (options?.filter) {
          Object.entries(options.filter).forEach(([key, value]) => {
            query = query.eq(key, value);
          });
        }

        // Apply ordering
        if (options?.orderBy) {
          query = query.order(options.orderBy.column, { 
            ascending: options.orderBy.ascending ?? true 
          });
        }

        // Apply limit
        if (options?.limit) {
          query = query.limit(options.limit);
        }

        const { data: result, error } = await query;

        if (error) throw error;
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [table, JSON.stringify(options)]);

  return { data, loading, error, refetch: () => fetchData() };
}

// Hook for real-time subscriptions
export function useSupabaseSubscription<T extends keyof Tables>(
  table: T,
  callback: (payload: any) => void
) {
  useEffect(() => {
    const subscription = supabase
      .channel(`public:${table}`)
      .on('postgres_changes', { event: '*', schema: 'public', table }, callback)
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [table, callback]);
}

// Hook for properties
export function useProperties(ownerId?: string) {
  return useSupabaseQuery('properties', {
    select: `
      *,
      room_types (*)
    `,
    filter: ownerId ? { owner_id: ownerId } : undefined,
    orderBy: { column: 'created_at', ascending: false }
  });
}

// Hook for bookings
export function useBookings(userId?: string, userRole?: string) {
  const filter = userId && userRole ? {
    [userRole === 'owner' ? 'owner_id' : 
     userRole === 'broker' ? 'broker_id' : 'customer_id']: userId
  } : undefined;

  return useSupabaseQuery('bookings', {
    select: `
      *,
      properties (title, city),
      user_profiles!customer_id (name)
    `,
    filter,
    orderBy: { column: 'created_at', ascending: false }
  });
}

// Hook for subscription plans
export function useSubscriptionPlans(type?: 'owner' | 'broker') {
  return useSupabaseQuery('subscription_plans', {
    filter: type ? { type, is_active: true } : { is_active: true },
    orderBy: { column: 'created_at', ascending: true }
  });
}

// Hook for admin settings
export function useAdminSettings() {
  return useSupabaseQuery('admin_settings', {
    orderBy: { column: 'key', ascending: true }
  });
}