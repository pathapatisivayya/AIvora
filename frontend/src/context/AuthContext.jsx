import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import api, { setAuthToken } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const refreshMe = useCallback(async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setUser(null);
      return;
    }
    setAuthToken(token);
    try {
      const { data } = await api.get("/auth/me/");
      setUser(data);
    } catch {
      setAuthToken(null);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    refreshMe();
  }, [refreshMe]);

  const login = async (username, password) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login/", { username, password });
      setAuthToken(data.access);
      localStorage.setItem("refresh_token", data.refresh);
      await refreshMe();
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e?.response?.data?.detail || "Login failed" };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("refresh_token");
    setAuthToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      isStaff: !!user?.is_staff,
      login,
      logout,
      refreshMe,
    }),
    [user, loading, refreshMe],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
