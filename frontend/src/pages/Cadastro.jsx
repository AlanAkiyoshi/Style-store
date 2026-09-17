import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Cadastro() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ nome: '', email: '', senha: '' });
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault(); setErro(''); setLoading(true);
    try {
      const d = await api.post('/auth/cadastro', form);
      login(d.usuario, d.token);
      navigate('/');
    } catch (err) { setErro(err.message); }
    finally { setLoading(false); }
  }

  return (
    <div style={s.page}>
      <div style={s.card}>
        <h1 style={{ fontSize: 32, marginBottom: 6 }}>Criar conta</h1>
        <p style={{ color: '#888', fontSize: 14, marginBottom: 32 }}>Faca parte da StyleStore</p>
        <form onSubmit={handleSubmit}>
          <div className="campo"><label>Nome completo</label><input type="text" value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} required placeholder="Seu nome" /></div>
          <div className="campo"><label>E-mail</label><input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required placeholder="seu@email.com" /></div>
          <div className="campo"><label>Senha</label><input type="password" value={form.senha} onChange={e => setForm(f => ({ ...f, senha: e.target.value }))} required placeholder="Minimo 6 caracteres" minLength={6} /></div>
          {erro && <p className="msg-erro">{erro}</p>}
          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }} disabled={loading}>
            {loading ? 'Criando...' : 'Criar conta'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: '#666' }}>
          Ja tem conta? <Link to="/login" style={{ color: 'var(--marrom)', fontWeight: 500 }}>Entrar</Link>
        </p>
      </div>
    </div>
  );
}

const s = {
  page: { minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' },
  card: { background: 'var(--branco)', padding: '48px 40px', borderRadius: 4, width: '100%', maxWidth: 420, boxShadow: '0 2px 20px rgba(0,0,0,0.08)' },
};
