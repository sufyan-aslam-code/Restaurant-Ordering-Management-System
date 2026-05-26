import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getMyProfile,
  logoutUser,
  updateMyProfile,
  updateMyPassword, 
  deleteMyAccount, // <-- 1. Imported the new API function
} from "../api/auth";
import {
  clearAuthSession,
  getStoredAccessToken,
  getStoredUser,
  saveAuthSession,
} from "../utils/authStorage";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser());
  const [loadingProfile, setLoadingProfile] = useState(Boolean(getStoredAccessToken()));

  const isAuthenticated = Boolean(user && getStoredAccessToken());

  const syncProfile = useCallback(async () => {
    if (!getStoredAccessToken()) {
      setLoadingProfile(false);
      return;
    }

    try {
      const response = await getMyProfile();
      setUser(response.data.user);
      saveAuthSession({ user: response.data.user });
    } catch (error) {
      clearAuthSession();
      setUser(null);
    } finally {
      setLoadingProfile(false);
    }
  }, []);

  useEffect(() => {
    syncProfile();
  }, [syncProfile]);

  const login = useCallback((session) => {
    saveAuthSession(session);
    setUser(session.user || null);
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } catch (error) {
      // Ignore API failures and clear local session anyway.
    }

    clearAuthSession();
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (payload) => {
    const response = await updateMyProfile(payload);
    const updatedUser = response.data.user;

    setUser(updatedUser);
    saveAuthSession({ user: updatedUser });

    return response.data;
  }, []);

  const updatePassword = useCallback(async (payload) => {
    const response = await updateMyPassword(payload);
    return response.data;
  }, []);

  // <-- 2. Created the context function to handle account deletion
  const deleteAccount = useCallback(async (password) => {
    const response = await deleteMyAccount({ password });
    return response.data;
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      loadingProfile,
      login,
      logout,
      updateProfile,
      updatePassword, 
      deleteAccount, // <-- 3. Added to the provided value
      refreshProfile: syncProfile,
    }),
    [
      user,
      isAuthenticated,
      loadingProfile,
      login,
      logout,
      updateProfile,
      updatePassword, 
      deleteAccount, // <-- 4. Added to dependencies
      syncProfile,
    ]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};

export default AuthContext;