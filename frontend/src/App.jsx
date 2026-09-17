import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CarrinhoProvider } from './context/CarrinhoContext';
import Navbar      from './components/Navbar';
import Home        from './pages/Home';
import Catalogo    from './pages/Catalogo';
import Produto     from './pages/Produto';
import Login       from './pages/Login';
import Cadastro    from './pages/Cadastro';
import Carrinho    from './pages/Carrinho';
import MeusPedidos from './pages/MeusPedidos';
import Admin       from './pages/Admin';

function Privada({ children }) {
  const { usuario, carregando } = useAuth();
  if (carregando) return null;
  return usuario ? children : <Navigate to="/login" replace />;
}

function SoAdmin({ children }) {
  const { usuario, carregando } = useAuth();
  if (carregando) return null;
  if (!usuario) return <Navigate to="/login" replace />;
  if (usuario.perfil !== 'admin') return <Navigate to="/" replace />;
  return children;
}

function Layout() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/"            element={<Home />} />
        <Route path="/catalogo"    element={<Catalogo />} />
        <Route path="/produto/:id" element={<Produto />} />
        <Route path="/login"       element={<Login />} />
        <Route path="/cadastro"    element={<Cadastro />} />
        <Route path="/carrinho"    element={<Privada><Carrinho /></Privada>} />
        <Route path="/meus-pedidos" element={<Privada><MeusPedidos /></Privada>} />
        <Route path="/admin"       element={<SoAdmin><Admin /></SoAdmin>} />
        <Route path="*"            element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CarrinhoProvider>
          <Layout />
        </CarrinhoProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
