import { supabase } from '../lib/supabase';

export interface SignupData {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: 'customer' | 'owner' | 'broker';
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  role: 'admin' | 'customer' | 'owner' | 'broker';
  created_at: string;
}

export const authService = {
  // Sign up user using Supabase Auth
  async signup(userData: SignupData): Promise<{ success: boolean; error?: string; user?: AuthUser }> {
    try {
      // Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            name: userData.name,
            phone: userData.phone,
            role: userData.role
          }
        }
      });

      if (authError) {
        console.error('Supabase auth error:', authError);
        if (authError.message.includes('already registered')) {
          return { success: false, error: 'Email ID already exists, use different email' };
        }
        return { success: false, error: authError.message };
      }

      if (!authData.user) {
        return { success: false, error: 'Failed to create account' };
      }

      // The user profile will be created automatically by the database trigger
      // Wait a moment for the trigger to complete
      await new Promise(resolve => setTimeout(resolve, 500));

      // Fetch the created profile
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', authData.user.id)
        .maybeSingle();

      if (profileError) {
        console.error('Profile fetch error:', profileError);
      }

      return {
        success: true,
        user: {
          id: authData.user.id,
          email: authData.user.email!,
          name: userData.name,
          phone: userData.phone,
          role: userData.role,
          created_at: authData.user.created_at
        }
      };
    } catch (error: any) {
      console.error('Signup error:', error);
      return { success: false, error: error.message || 'Signup failed. Please try again.' };
    }
  },

  // Sign in user using Supabase Auth
  async signin(loginData: LoginData): Promise<{ success: boolean; error?: string; user?: AuthUser }> {
    try {
      // Sign in with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password
      });

      if (authError) {
        console.error('Supabase signin error:', authError);
        return { success: false, error: 'Username or Password incorrect, Try again' };
      }

      if (!authData.user) {
        return { success: false, error: 'Username or Password incorrect, Try again' };
      }

      // Fetch user profile from database
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', authData.user.id)
        .maybeSingle();

      if (profileError || !profile) {
        console.error('Profile fetch error:', profileError);
        // Still return success with basic user data
        return {
          success: true,
          user: {
            id: authData.user.id,
            email: authData.user.email!,
            name: authData.user.user_metadata?.name || 'User',
            phone: authData.user.user_metadata?.phone || null,
            role: (authData.user.user_metadata?.role as any) || 'customer',
            created_at: authData.user.created_at
          }
        };
      }

      return {
        success: true,
        user: {
          id: profile.id,
          email: authData.user.email!,
          name: profile.name,
          phone: profile.phone,
          role: profile.role,
          created_at: profile.created_at
        }
      };
    } catch (error: any) {
      console.error('Signin error:', error);
      return { success: false, error: 'Login failed. Please try again.' };
    }
  },

  // Get current session
  async getCurrentUser(): Promise<{ success: boolean; user?: AuthUser }> {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !session) {
        return { success: false };
      }

      // Fetch user profile
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle();

      if (profileError || !profile) {
        return {
          success: true,
          user: {
            id: session.user.id,
            email: session.user.email!,
            name: session.user.user_metadata?.name || 'User',
            phone: session.user.user_metadata?.phone || null,
            role: (session.user.user_metadata?.role as any) || 'customer',
            created_at: session.user.created_at
          }
        };
      }

      return {
        success: true,
        user: {
          id: profile.id,
          email: session.user.email!,
          name: profile.name,
          phone: profile.phone,
          role: profile.role,
          created_at: profile.created_at
        }
      };
    } catch (error) {
      console.error('Get current user error:', error);
      return { success: false };
    }
  },

  // Sign out
  async signout(): Promise<{ success: boolean }> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Signout error:', error);
        return { success: false };
      }
      return { success: true };
    } catch (error) {
      console.error('Signout error:', error);
      return { success: false };
    }
  },

  // Send password reset email
  async sendPasswordReset(email: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        console.error('Password reset error:', error);
        return { success: false, error: 'Failed to send password reset email' };
      }

      return { success: true };
    } catch (error: any) {
      console.error('Password reset error:', error);
      return { success: false, error: error.message || 'Failed to send password reset email' };
    }
  }
};
