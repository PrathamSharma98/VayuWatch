import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

/* =======================
   Types
======================= */

interface User {
  id: string;
  phone: string;
  name?: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (phone: string, password: string) => Promise<boolean>;
  loginWithOtp: (phone: string, otp: string) => Promise<boolean>;
  signup: (phone: string, password: string, name?: string) => Promise<boolean>;
  logout: () => void;
  sendOtp: (phone: string) => { otp: string; expiresAt: number };
  verifyOtp: (phone: string, otp: string) => boolean;
  resetPassword: (phone: string, newPassword: string) => boolean;
  currentOtp: { otp: string; phone: string; expiresAt: number } | null;
}

/* =======================
   Constants
======================= */

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "vayuwatch_users";
const SESSION_KEY = "vayuwatch_session";

/* =======================
   Safe localStorage helpers
======================= */

const safeGet = (key: string) => {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const safeSet = (key: string, value: string) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, value);
  } catch {}
};

const safeRemove = (key: string) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(key);
  } catch {}
};

/* =======================
   Provider
======================= */

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentOtp, setCurrentOtp] = useState<{
    otp: string;
    phone: string;
    expiresAt: number;
  } | null>(null);

  /* Load session safely */
  useEffect(() => {
    const session = safeGet(SESSION_KEY);
    if (session) {
      try {
        setUser(JSON.parse(session));
      } catch {
        safeRemove(SESSION_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  /* Get users */
  const getUsers = useCallback((): Record<string, { password: string; user: User }> => {
    const data = safeGet(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  }, []);

  /* Save users */
  const saveUsers = useCallback(
    (users: Record<string, { password: string; user: User }>) => {
      safeSet(STORAGE_KEY, JSON.stringify(users));
    },
    []
  );

  /* Send OTP (demo) */
  const sendOtp = useCallback((phone: string) => {
    const otp = "123456";
    const expiresAt = Date.now() + 60000;
    setCurrentOtp({ otp, phone, expiresAt });
    return { otp, expiresAt };
  }, []);

  /* Verify OTP */
  const verifyOtp = useCallback(
    (phone: string, otp: string): boolean => {
      if (otp === "123456") {
        setCurrentOtp(null);
        return true;
      }

      if (!currentOtp) return false;
      if (currentOtp.phone !== phone) return false;
      if (currentOtp.otp !== otp) return false;
      if (Date.now() > currentOtp.expiresAt) return false;

      setCurrentOtp(null);
      return true;
    },
    [currentOtp]
  );

  /* Signup */
  const signup = useCallback(
    async (phone: string, password: string, name?: string): Promise<boolean> => {
      await new Promise((r) => setTimeout(r, 800));

      const users = getUsers();
      if (users[phone]) return false;

      const newUser: User = {
        id: `user_${Date.now()}`,
        phone,
        name,
        createdAt: new Date().toISOString(),
      };

      users[phone] = {
        password: btoa(password),
        user: newUser,
      };

      saveUsers(users);
      setUser(newUser);
      safeSet(SESSION_KEY, JSON.stringify(newUser));

      return true;
    },
    [getUsers, saveUsers]
  );

  /* Login with password */
  const login = useCallback(
    async (phone: string, password: string): Promise<boolean> => {
      await new Promise((r) => setTimeout(r, 600));

      const users = getUsers();
      const userData = users[phone];

      if (!userData) return false;
      if (atob(userData.password) !== password) return false;

      setUser(userData.user);
      safeSet(SESSION_KEY, JSON.stringify(userData.user));

      return true;
    },
    [getUsers]
  );

  /* Login with OTP */
  const loginWithOtp = useCallback(
    async (phone: string, otp: string): Promise<boolean> => {
      await new Promise((r) => setTimeout(r, 600));

      if (!verifyOtp(phone, otp)) return false;

      const users = getUsers();
      let userData = users[phone];

      if (!userData) {
        const newUser: User = {
          id: `user_${Date.now()}`,
          phone,
          createdAt: new Date().toISOString(),
        };

        users[phone] = {
          password: btoa("temp_" + Date.now()),
          user: newUser,
        };

        saveUsers(users);
        userData = users[phone];
      }

      setUser(userData.user);
      safeSet(SESSION_KEY, JSON.stringify(userData.user));

      return true;
    },
    [verifyOtp, getUsers, saveUsers]
  );

  /* Reset password */
  const resetPassword = useCallback(
    (phone: string, newPassword: string): boolean => {
      const users = getUsers();
      if (!users[phone]) return false;

      users[phone].password = btoa(newPassword);
      saveUsers(users);
      return true;
    },
    [getUsers, saveUsers]
  );

  /* Logout */
  const logout = useCallback(() => {
    setUser(null);
    setCurrentOtp(null);
    safeRemove(SESSION_KEY);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        loginWithOtp,
        signup,
        logout,
        sendOtp,
        verifyOtp,
        resetPassword,
        currentOtp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* =======================
   Hook
======================= */

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
