import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../config/supabase";

interface AuthContextType {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  setAccessToken: () => {},
  loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [accessToken, setAccessTokenState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  function setAccessToken(token: string | null) {
    if (token) {
      localStorage.setItem("access_token", token);
    } else {
      localStorage.removeItem("access_token");
    }
    setAccessTokenState(token);
  }

  useEffect(() => {
    let mounted = true;

    const stored = localStorage.getItem("access_token");
    if (stored) {
      setAccessTokenState(stored);
    }

    async function loadSession() {
      const { data } = await supabase.auth.getSession();
      if (mounted) {
        const token = data.session?.access_token ?? stored ?? null;
        setAccessTokenState(token);
        setLoading(false);
      }
    }

    loadSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const token = session?.access_token ?? null;
        setAccessToken(token);
      }
    );

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
