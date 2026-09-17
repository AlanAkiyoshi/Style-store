import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCarrinho } from '../context/CarrinhoContext';

export default function Carrinho() {
  const { itens, total, remover, finalizar } = useCarrinho();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  async function handleFinalizar() {
    setLoading(true);
    try {
      await finalizar();
      setMsg('Pedido realizado com sucesso!');
      setTimeout(() => navigate('/meus-pedidos'), 2000);
    } catch (err) { setMsg(err.message); setLoading(false); }
  }

  if (msg) return (
    <div style={{ textAlign: 'center', padding: '120px 24px', color: 'var(--sucesso)' }}>
      <p style={{ fontSize: 22, marginBottom: 8 }}>✓ {msg}</p>
      <p style={{ color: '#888' }}>Redirecionando para seus pedidos...</p>
    </div>
  );

  if (itens.length === 0) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 64px)', padding: 24 }}>
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--areia)" strokeWidth="1"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
        <h2 style={{ fontSize: 26 }}>Carrinho vazio</h2>
        <p style={{ color: '#888' }}>Explore o catalogo e adicione pecas.</p>
        <Link to="/catalogo" className="btn btn-primary">Ver catalogo</Link>
      </div>
    </div>
  );

  return (
    <div className="container" style={{ padding: '48px 24px 80px' }}>
      <h1 style={{ fontSize: 36, marginBottom: 36 }}>Carrinho</h1>
      <div style={s.layout}>
        <div style={s.lista}>
          {itens.map(item => (
            <div key={item.produto_id} style={s.item}>
              <div style={s.itemImg}>
                {item.imagem_url ? <img src={item.imagem_url} alt={item.nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', background: '#f0ece6' }} />}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, marginBottom: 6 }}>{item.nome}</h3>
                <p style={{ fontSize: 14, color: 'var(--marrom)' }}>R$ {parseFloat(item.preco).toFixed(2).replace('.', ',')}</p>
                <p style={{ fontSize: 13, color: '#999', marginTop: 4 }}>Qtd: {item.quantidade}</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                <p style={{ fontSize: 16, fontWeight: 500 }}>R$ {parseFloat(item.subtotal).toFixed(2).replace('.', ',')}</p>
                <button style={{ background: 'none', fontSize: 12, color: 'var(--erro)', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => remover(item.produto_id)}>Remover</button>
              </div>
            </div>
          ))}
        </div>

        <div style={s.resumo}>
          <h2 style={{ fontSize: 22, marginBottom: 24 }}>Resumo</h2>
          <div style={s.rl}><span>Subtotal</span><span>R$ {parseFloat(total).toFixed(2).replace('.', ',')}</span></div>
          <div style={s.rl}><span>Frete</span><span style={{ color: 'var(--sucesso)', fontWeight: 500 }}>Gratis</span></div>
          <div style={{ ...s.rl, borderTop: '1px solid var(--areia)', paddingTop: 16, marginTop: 8, fontSize: 17 }}>
            <span>Total</span><strong>R$ {parseFloat(total).toFixed(2).replace('.', ',')}</strong>
          </div>
          {msg && <p className="msg-erro" style={{ marginBottom: 12 }}>{msg}</p>}
          <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: 14, marginTop: 16 }} onClick={handleFinalizar} disabled={loading}>
            {loading ? 'Processando...' : 'Finalizar compra'}
          </button>
          <Link to="/catalogo" style={{ display: 'block', textAlign: 'center', marginTop: 14, fontSize: 13, color: '#888' }}>← Continuar comprando</Link>
        </div>
      </div>
    </div>
  );
}

const s = {
  layout: { display: 'grid', gridTemplateColumns: '1fr 320px', gap: 48, alignItems: 'start' },
  lista: { display: 'flex', flexDirection: 'column', gap: 1, background: 'var(--areia)', border: '1px solid var(--areia)', borderRadius: 4, overflow: 'hidden' },
  item: { display: 'flex', gap: 16, padding: 20, background: 'var(--branco)', alignItems: 'center' },
  itemImg: { width: 80, height: 100, background: 'var(--creme)', borderRadius: 4, overflow: 'hidden', flexShrink: 0 },
  resumo: { background: 'var(--branco)', border: '1px solid var(--areia)', borderRadius: 4, padding: 28, position: 'sticky', top: 84 },
  rl: { display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 12, color: '#666' },
};
