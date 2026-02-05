import React, { createContext, useState, useContext, useEffect } from "react";
import { storage } from "../utils/cookies";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Al cargar la app, revisamos si hay sesión activa
    const savedUser = storage.getToken("user");
    const token = storage.getToken("access_token");
    console.log('COntextoooooooooooo')
    console.log(savedUser)

    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData, tokens) => {
    storage.setToken("access_token", tokens.accessToken, 1);
    storage.setToken("refresh_token", tokens.refreshToken, 7);
    storage.setToken("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    storage.clearSession();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
