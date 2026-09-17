import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useCarrinho } from '../context/CarrinhoContext';
import { useAuth } from '../context/AuthContext';

export default function Produto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { adicionar } = useCarrinho();
  const { usuario } = useAuth();
  const [produto, setProduto] = useState(null);
  const [qtd, setQtd] = useState(1);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/produtos/${id}`).then(setProduto).catch(() => navigate('/catalogo')).finally(() => setLoading(false));
  }, [id]);

  async function handleAdd() {
    if (!usuario) { navigate('/login'); return; }
    try { await adicionar(produto.id, qtd); setMsg('Adicionado ao carrinho!'); setTimeout(() => setMsg(''), 3000); }
    catch (err) { setMsg(err.message); }
  }

  if (loading) return <div className="loading">Carregando...</div>;
  if (!produto) return null;
  const esgotado = produto.estoque === 0;

  return (
    <div className="container" style={{ padding: '32px 24px 80px' }}>
      <button onClick={() => navigate(-1)} style={{ background: 'none', fontSize: 14, color: '#888', marginBottom: 32, cursor: 'pointer' }}>← Voltar</button>

      <div style={s.layout}>
        <div style={s.imgBox}>
          {produto.imagem_url
            ? <img src={produto.imagem_url} alt={produto.nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0ece6' }}>
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
              </div>
          }
        </div>

        <div style={s.info}>
          {produto.categoria && <span style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--marrom)' }}>{produto.categoria}</span>}
          <h1 style={{ fontSize: 36, marginTop: 8 }}>{produto.nome}</h1>
          <p style={{ fontSize: 28, fontWeight: 500, color: 'var(--marrom)' }}>R$ {parseFloat(produto.preco).toFixed(2).replace('.', ',')}</p>
          {produto.descricao && <p style={{ fontSize: 15, color: '#666', lineHeight: 1.7 }}>{produto.descricao}</p>}
          <p style={{ fontSize: 14, color: esgotado ? 'var(--erro)' : 'var(--sucesso)', fontWeight: 500 }}>
            {esgotado ? 'Produto esgotado' : `✓ ${produto.estoque} em estoque`}
          </p>
          {!esgotado && (
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid var(--areia)', borderRadius: 4, overflow: 'hidden' }}>
                <button style={{ width: 36, height: 44, background: 'none', fontSize: 18, cursor: 'pointer' }} onClick={() => setQtd(q => Math.max(1, q - 1))}>−</button>
                <span style={{ width: 40, textAlign: 'center', fontWeight: 500 }}>{qtd}</span>
                <button style={{ width: 36, height: 44, background: 'none', fontSize: 18, cursor: 'pointer' }} onClick={() => setQtd(q => Math.min(produto.estoque, q + 1))}>+</button>
              </div>
              <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={handleAdd}>Adicionar ao carrinho</button>
            </div>
          )}
          {msg && <p className="msg-ok">{msg}</p>}
        </div>
      </div>
    </div>
  );
}

const s = {
  layout: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start' },
  imgBox: { aspectRatio: '3/4', background: 'var(--creme)', borderRadius: 4, overflow: 'hidden' },
  info: { display: 'flex', flexDirection: 'column', gap: 20, paddingTop: 16 },
};
