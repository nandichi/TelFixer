"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { User } from "@/types";

interface AuthContextType {
  user: SupabaseUser | null;
  profile: User | null;
  loading: boolean;
  isConfigured: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [configured, setConfigured] = useState(false);

  useEffect(() => {
    const isConfiguredNow = isSupabaseConfigured();
    setConfigured(isConfiguredNow);

    if (!isConfiguredNow) {
      console.warn(
        "Supabase is niet geconfigureerd. Auth functionaliteit is uitgeschakeld."
      );
      setLoading(false);
      return;
    }

    const supabase = createClient();
    let resolved = false;

    // Vangnet: als onAuthStateChange niet binnen 6s vuurt, beschouwen we de
    // gebruiker als niet ingelogd. We gebruiken bewust GEEN supabase.auth.getSession()
    // omdat die in @supabase/ssr regelmatig oneindig hangt door web-lock issues.
    const fallbackTimeout = setTimeout(() => {
      if (!resolved) {
        console.warn("Auth init timeout - geen sessie binnen 6s, wordt als uitgelogd behandeld");
        resolved = true;
        setLoading(false);
      }
    }, 6000);

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      const sessionUser = session?.user ?? null;
      setUser(sessionUser);

      if (sessionUser) {
        void fetchProfile(sessionUser.id);
      } else {
        setProfile(null);
      }

      if (!resolved) {
        resolved = true;
        clearTimeout(fallbackTimeout);
      }
      setLoading(false);
    });

    return () => {
      clearTimeout(fallbackTimeout);
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    if (!isSupabaseConfigured()) return;

    try {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (error) {
        console.warn("fetchProfile fout:", error.message);
        return;
      }

      if (data) {
        setProfile(data as User);
      }
    } catch (err) {
      console.warn("fetchProfile onverwachte fout:", err);
    }
  };

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured()) {
      return { error: new Error("Supabase is niet geconfigureerd") };
    }

    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return { error: error as Error | null };
  };

  const signUp = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => {
    if (!isSupabaseConfigured()) {
      return { error: new Error("Supabase is niet geconfigureerd") };
    }

    const supabase = createClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    });

    if (!error && data.user) {
      // Create user profile
      await supabase.from("users").insert({
        id: data.user.id,
        email,
        first_name: firstName,
        last_name: lastName,
      });
    }

    return { error: error as Error | null };
  };

  const signOut = async () => {
    if (!isSupabaseConfigured()) {
      setUser(null);
      setProfile(null);
      return;
    }

    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!isSupabaseConfigured()) {
      return { error: new Error("Supabase is niet geconfigureerd") };
    }

    const supabase = createClient();

    if (!user) {
      return { error: new Error("Niet ingelogd") };
    }

    const { error } = await supabase
      .from("users")
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq("id", user.id);

    if (!error) {
      setProfile((prev) => (prev ? { ...prev, ...data } : null));
    }

    return { error: error as Error | null };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isConfigured: configured,
        signIn,
        signUp,
        signOut,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
