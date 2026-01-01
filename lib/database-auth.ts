import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabase } from '@/lib/supabase';
import { Database } from '@/lib/database.types';

type User = Database['public']['Tables']['users']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];

const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-key';
const JWT_EXPIRES_IN = '7d';

export interface AuthUser {
  id: string;
  email: string;
  role: string;
  profile?: Profile;
}

export class DatabaseAuth {
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  static generateToken(user: AuthUser): string {
    return jwt.sign(
      {
        id: (user as any).id,
        email: (user as any).email,
        role: (user as any).role,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
  }

  static verifyToken(token: string): AuthUser | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      return {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
      };
    } catch (error) {
      return null;
    }
  }

  static async signUp(email: string, password: string, userData?: any): Promise<{ user: AuthUser | null; error: string | null }> {
    try {
      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (existingUser) {
        return { user: null, error: 'User already exists' };
      }

      // Hash password
      const hashedPassword = await this.hashPassword(password);

      // Create user record
      const { data: newUser, error: userError } = await supabase
        .from('users')
        .insert({
          email,
          password_hash: hashedPassword,
          email_confirmed_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (userError) {
        return { user: null, error: (userError as any)?.message || 'Unknown error' };
      }

      // Create profile
      const { data: newProfile, error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: newUser.id,
          email,
          full_name: userData?.fullName || '',
          role: userData?.role || 'customer',
          email_verified: true,
        })
        .select()
        .single();

      if (profileError) {
        // Clean up user record if profile creation fails
        await supabase.from('users').delete().eq('id', newUser.id);
        return { user: null, error: (profileError as any)?.message || 'Unknown error' };
      }

      const authUser: AuthUser = {
        id: newUser.id,
        email: newUser.email,
        role: newProfile.role || 'customer',
        profile: newProfile,
      };

      return { user: authUser, error: null };
    } catch (error) {
      return { user: null, error: 'Signup failed' };
    }
  }

  static async signIn(email: string, password: string): Promise<{ user: AuthUser | null; error: string | null }> {
    try {
      // Get user from database
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (userError || !user) {
        return { user: null, error: 'Invalid credentials' };
      }

      // Verify password
      const isValidPassword = await this.verifyPassword(password, (user as any).encrypted_password || '');
      if (!isValidPassword) {
        return { user: null, error: 'Invalid credentials' };
      }

      // Get profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', (user as any).id)
        .single();

      if (profileError) {
        return { user: null, error: 'Profile not found' };
      }

      if (!profile) {
        return { user: null, error: 'Profile not found' };
      }

      const authUser: AuthUser = {
        id: (user as any).id,
        email: (user as any).email,
        role: (profile as any)?.role || 'customer',
        profile,
      };

      return { user: authUser, error: null };
    } catch (error) {
      return { user: null, error: 'Signin failed' };
    }
  }

  static async signInAsAdmin(email: string, password: string): Promise<{ user: AuthUser | null; error: string | null }> {
    try {
      // First check admin credentials table
      const { data: adminCred, error: adminError } = await supabase
        .from('admin_credentials')
        .select('*')
        .eq('email', email)
        .eq('is_active', true)
        .single();

      if (!adminCred || adminError) {
        return { user: null, error: 'Invalid admin credentials' };
      }

      // Verify password (simple check for demo)
      if (password !== 'Admin123!') {
        return { user: null, error: 'Invalid admin credentials' };
      }

      // Check if admin user exists in users table
      let { data: user, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (userError && (userError as any).code === 'PGRST116') {
        // Create admin user if doesn't exist
        const hashedPassword = await this.hashPassword(password);

        const { data: newUser, error: createError } = await supabase
          .from('users')
          .insert({
            email,
            password_hash: hashedPassword,
            email_confirmed_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (createError) {
          return { user: null, error: (createError as any)?.message || 'Unknown error' };
        }

        user = newUser;
      } else if (userError) {
        return { user: null, error: (userError as any)?.message || 'Unknown error' };
      }

      if (!user) {
        return { user: null, error: 'Failed to create or retrieve admin user' };
      }

      // Check if admin profile exists
      let { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', (user as any).id)
        .single();

      if (profileError && (profileError as any).code === 'PGRST116') {
        // Create admin profile if doesn't exist
        const { data: newProfile, error: createProfileError } = await supabase
          .from('profiles')
          .insert({
            id: (user as any).id,
            email,
            full_name: 'Admin User',
            role: 'admin',
            email_verified: true,
          })
          .select()
          .single();

        if (createProfileError) {
          return { user: null, error: (createProfileError as any)?.message || 'Unknown error' };
        }

        profile = newProfile;
      } else if (profileError) {
        return { user: null, error: (profileError as any)?.message || 'Unknown error' };
      }

      if (!profile) {
        return { user: null, error: 'Failed to create or retrieve admin profile' };
      }

      const authUser: AuthUser = {
        id: (user as any).id,
        email: (user as any).email,
        role: (profile as any)?.role || 'customer',
        profile,
      };

      return { user: authUser, error: null };
    } catch (error) {
      return { user: null, error: 'Admin signin failed' };
    }
  }

  static async getUserById(id: string): Promise<{ user: AuthUser | null; error: string | null }> {
    try {
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();

      if (userError || !user) {
        return { user: null, error: 'User not found' };
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (profileError) {
        return { user: null, error: 'Profile not found' };
      }

      if (!profile) {
        return { user: null, error: 'Profile not found' };
      }

      const authUser: AuthUser = {
        id: (user as any).id,
        email: (user as any).email,
        role: (profile as any)?.role || 'customer',
        profile,
      };

      return { user: authUser, error: null };
    } catch (error) {
      return { user: null, error: 'Failed to get user' };
    }
  }

  static async getUserProfile(userId: string): Promise<{ profile: Profile | null; error: string | null }> {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        return { profile: null, error: (error as any)?.message || 'Unknown error' };
      }

      return { profile, error: null };
    } catch (error) {
      return { profile: null, error: 'Failed to get profile' };
    }
  }
}