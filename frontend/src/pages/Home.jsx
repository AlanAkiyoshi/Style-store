import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import CardProduto from '../components/CardProduto';

export default function Home() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/produtos').then(d => setProdutos(d.slice(0, 4))).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section style={s.hero}>
        <div className="container" style={s.heroInner}>
          <p style={s.heroSub}>Nova colecao 2026</p>
          <h1 style={s.heroTitulo}>Moda que<br /><em style={{ color: 'var(--acento)' }}>fala por voce</em></h1>
          <p style={s.heroDesc}>Pecas selecionadas com cuidado.<br />Qualidade e elegancia em cada detalhe.</p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link to="/catalogo" className="btn btn-primary" style={{ padding: '12px 32px' }}>Ver catalogo</Link>
            <Link to="/cadastro" className="btn btn-outline" style={{ padding: '12px 32px', borderColor: 'rgba(255,255,255,0.4)', color: '#fff' }}>Criar conta</Link>
          </div>
        </div>
        <div style={s.circulo} />
      </section>

      {/* Destaques */}
      <section className="container" style={{ padding: '72px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 36 }}>
          <h2 style={{ fontSize: 32 }}>Destaques</h2>
          <Link to="/catalogo" style={{ fontSize: 14, color: 'var(--marrom)' }}>Ver todos →</Link>
        </div>
        {loading ? <div className="loading">Carregando...</div> : (
          <div style={s.grid}>{produtos.map(p => <CardProduto key={p.id} produto={p} />)}</div>
        )}
      </section>

      {/* Banner */}
      <section style={s.banner}>
        {[
          { icone: '✦', titulo: 'Frete gratis', sub: 'Acima de R$ 200' },
          { icone: '◈', titulo: 'Troca facil', sub: 'Ate 30 dias' },
          { icone: '◉', titulo: 'Pagamento seguro', sub: 'Dados protegidos' },
        ].map((item, i) => (
          <div key={i} style={s.bannerItem}>
            <span style={{ fontSize: 24, color: 'var(--acento)' }}>{item.icone}</span>
            <div>
              <strong style={{ display: 'block', fontFamily: "'Playfair Display', serif", marginBottom: 2 }}>{item.titulo}</strong>
              <span style={{ fontSize: 13, color: '#888' }}>{item.sub}</span>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

const s = {
  hero: { position: 'relative', background: 'var(--preto)', color: '#fff', padding: '100px 0 80px', overflow: 'hidden', minHeight: 520, display: 'flex', alignItems: 'center' },
  heroInner: { position: 'relative', zIndex: 2, maxWidth: 560 },
  heroSub: { fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--acento)', marginBottom: 16 },
  heroTitulo: { fontSize: 'clamp(40px, 6vw, 70px)', fontFamily: "'Playfair Display', serif", fontWeight: 700, lineHeight: 1.05, marginBottom: 20 },
  heroDesc: { fontSize: 16, color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, marginBottom: 36 },
  circulo: { position: 'absolute', right: -100, top: '50%', transform: 'translateY(-50%)', width: 500, height: 500, borderRadius: '50%', border: '1px solid rgba(200,149,108,0.2)' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 24 },
  banner: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: 'var(--areia)', borderTop: '1px solid var(--areia)', borderBottom: '1px solid var(--areia)', marginBottom: 80 },
  bannerItem: { display: 'flex', alignItems: 'center', gap: 16, padding: '32px 28px', background: 'var(--branco)' },
};
