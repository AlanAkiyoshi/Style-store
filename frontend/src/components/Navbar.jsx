import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCarrinho } from '../context/CarrinhoContext';

export default function Navbar() {
  const { usuario, logout } = useAuth();
  const { qtd } = useCarrinho();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  function handleLogout() { logout(); navigate('/'); setOpen(false); }

  return (
    <nav style={s.nav}>
      <div style={s.inner}>
        <Link to="/" style={s.logo}>Style<span style={{ color: 'var(--acento)' }}>Store</span></Link>

        <div style={s.links}>
          <Link to="/" style={s.link}>Inicio</Link>
          <Link to="/catalogo" style={s.link}>Catalogo</Link>
        </div>

        <div style={s.acoes}>
          {usuario && (
            <Link to="/carrinho" style={s.cartBtn}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              {qtd > 0 && <span style={s.badge}>{qtd}</span>}
            </Link>
          )}

          {usuario ? (
            <div style={{ position: 'relative' }}>
              <button style={s.userBtn} onClick={() => setOpen(!open)}>
                <div style={s.avatar}>{usuario.nome.charAt(0).toUpperCase()}</div>
                <span style={{ fontSize: 14 }}>{usuario.nome.split(' ')[0]}</span>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor"><path d="M5 7L1 3h8z"/></svg>
              </button>
              {open && (
                <div style={s.dropdown}>
                  <Link to="/meus-pedidos" style={s.ddItem} onClick={() => setOpen(false)}>Meus pedidos</Link>
                  {usuario.perfil === 'admin' && (
                    <Link to="/admin" style={s.ddItem} onClick={() => setOpen(false)}>Painel Admin</Link>
                  )}
                  <button style={{ ...s.ddItem, width: '100%', textAlign: 'left', color: 'var(--erro)' }} onClick={handleLogout}>Sair</button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 8 }}>
              <Link to="/login"   className="btn btn-outline" style={{ padding: '7px 16px', fontSize: 13 }}>Entrar</Link>
              <Link to="/cadastro" className="btn btn-primary" style={{ padding: '7px 16px', fontSize: 13 }}>Cadastrar</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

const s = {
  nav: { position: 'sticky', top: 0, zIndex: 100, background: 'var(--branco)', borderBottom: '1px solid var(--areia)' },
  inner: { maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 },
  logo: { fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: 'var(--preto)' },
  links: { display: 'flex', gap: 32 },
  link: { fontSize: 14, color: '#555', transition: 'color 0.2s' },
  acoes: { display: 'flex', alignItems: 'center', gap: 16 },
  cartBtn: { position: 'relative', display: 'flex', alignItems: 'center', color: 'var(--preto)' },
  badge: { position: 'absolute', top: -6, right: -8, background: 'var(--acento)', color: '#fff', fontSize: 10, fontWeight: 700, width: 17, height: 17, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  userBtn: { display: 'flex', alignItems: 'center', gap: 8, background: 'none', padding: '6px 10px', borderRadius: 4, cursor: 'pointer' },
  avatar: { width: 30, height: 30, background: 'var(--marrom)', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600 },
  dropdown: { position: 'absolute', top: 'calc(100% + 8px)', right: 0, background: 'var(--branco)', border: '1px solid var(--areia)', borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.1)', minWidth: 180, overflow: 'hidden', zIndex: 200 },
  ddItem: { display: 'block', padding: '11px 16px', fontSize: 14, color: 'var(--preto)', background: 'none', transition: 'background 0.2s', cursor: 'pointer' },
};
