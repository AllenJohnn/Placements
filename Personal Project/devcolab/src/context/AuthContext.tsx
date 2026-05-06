import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { authService } from "@/services/authService";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthCtx {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const Ctx = createContext<AuthCtx>({} as AuthCtx);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const userData = await authService.getMe();
        setUser(userData);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const signOut = async () => {
    await authService.logout();
    setUser(null);
  };

  const refreshAuth = async () => {
    try {
      await authService.refresh();
      const userData = await authService.getMe();
      setUser(userData);
    } catch {
      setUser(null);
    }
  };

  return (
    <Ctx.Provider value={{ user, loading, signOut, refreshAuth }}>
      {children}
    </Ctx.Provider>
  );
};

export const useAuth = () => useContext(Ctx);
