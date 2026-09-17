import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCarrinho } from '../context/CarrinhoContext';
import { useAuth } from '../context/AuthContext';

export default function CardProduto({ produto }) {
  const { adicionar } = useCarrinho();
  const { usuario } = useAuth();
  const navigate = useNavigate();

  async function handleAdd(e) {
    e.preventDefault();
    if (!usuario) { navigate('/login'); return; }
    try { await adicionar(produto.id, 1); } catch (err) { alert(err.message); }
  }

  const esgotado = produto.estoque === 0;

  return (
    <Link to={`/produto/${produto.id}`} style={s.card}>
      <div style={s.imgBox}>
        {produto.imagem_url
          ? <img src={produto.imagem_url} alt={produto.nome} style={s.img} />
          : <div style={s.semImg}><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg></div>
        }
        {esgotado && <span style={s.esgotado}>Esgotado</span>}
        {produto.categoria && <span style={s.catTag}>{produto.categoria}</span>}
      </div>
      <div style={s.info}>
        <h3 style={s.nome}>{produto.nome}</h3>
        <div style={s.rodape}>
          <span style={s.preco}>R$ {parseFloat(produto.preco).toFixed(2).replace('.', ',')}</span>
          {!esgotado && (
            <button className="btn btn-primary" style={{ padding: '6px 14px', fontSize: 12 }} onClick={handleAdd}>
              + Carrinho
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}

const s = {
  card: { display: 'flex', flexDirection: 'column', background: 'var(--branco)', borderRadius: 4, overflow: 'hidden', border: '1px solid transparent', transition: 'all 0.2s' },
  imgBox: { position: 'relative', aspectRatio: '3/4', background: 'var(--creme)', overflow: 'hidden' },
  img: { width: '100%', height: '100%', objectFit: 'cover' },
  semImg: { width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0ece6' },
  esgotado: { position: 'absolute', top: 12, left: 12, background: 'var(--preto)', color: '#fff', fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '3px 10px', borderRadius: 20 },
  catTag: { position: 'absolute', top: 12, right: 12, background: 'rgba(255,255,255,0.9)', color: 'var(--marrom)', fontSize: 10, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '3px 10px', borderRadius: 20 },
  info: { padding: '14px 16px 16px', display: 'flex', flexDirection: 'column', gap: 12, flex: 1 },
  nome: { fontFamily: "'Playfair Display', serif", fontSize: 15, fontWeight: 600, lineHeight: 1.3 },
  rodape: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' },
  preco: { fontSize: 16, fontWeight: 500, color: 'var(--marrom)' },
};
