import React, { createContext, useContext, useState, useEffect } from 'react';

const Ctx = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const u = localStorage.getItem('ss_usuario');
    if (u) setUsuario(JSON.parse(u));
    setCarregando(false);
  }, []);

  function login(u, token) {
    localStorage.setItem('ss_token', token);
    localStorage.setItem('ss_usuario', JSON.stringify(u));
    setUsuario(u);
  }

  function logout() {
    localStorage.removeItem('ss_token');
    localStorage.removeItem('ss_usuario');
    setUsuario(null);
  }

  return <Ctx.Provider value={{ usuario, login, logout, carregando }}>{children}</Ctx.Provider>;
}

export function useAuth() { return useContext(Ctx); }
