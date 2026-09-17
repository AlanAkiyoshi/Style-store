import React, { useEffect, useState } from 'react';
import api from '../services/api';
import CardProduto from '../components/CardProduto';

export default function Catalogo() {
  const [todos, setTodos] = useState([]);
  const [filtrados, setFiltrados] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cat, setCat] = useState('Todas');
  const [busca, setBusca] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/produtos').then(d => {
      setTodos(d); setFiltrados(d);
      setCategorias(['Todas', ...new Set(d.map(p => p.categoria).filter(Boolean))]);
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let r = todos;
    if (cat !== 'Todas') r = r.filter(p => p.categoria === cat);
    if (busca.trim()) r = r.filter(p => p.nome.toLowerCase().includes(busca.toLowerCase()));
    setFiltrados(r);
  }, [cat, busca, todos]);

  return (
    <div className="container" style={{ padding: '48px 24px 80px' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 40, marginBottom: 4 }}>Catalogo</h1>
        <p style={{ color: '#888', fontSize: 14 }}>{filtrados.length} {filtrados.length === 1 ? 'peca' : 'pecas'} encontradas</p>
      </div>

      <div style={{ marginBottom: 36, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <input
          placeholder="Buscar produto..."
          value={busca}
          onChange={e => setBusca(e.target.value)}
          style={{ maxWidth: 400, padding: '10px 16px', border: '1.5px solid var(--areia)', borderRadius: 30, background: 'var(--branco)', outline: 'none', fontSize: 14 }}
        />
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {categorias.map(c => (
            <button key={c} onClick={() => setCat(c)} style={{ padding: '6px 18px', borderRadius: 30, fontSize: 13, cursor: 'pointer', background: cat === c ? 'var(--preto)' : 'var(--branco)', color: cat === c ? '#fff' : '#666', border: `1.5px solid ${cat === c ? 'var(--preto)' : 'var(--areia)'}`, transition: 'all 0.2s' }}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {loading ? <div className="loading">Carregando...</div>
        : filtrados.length === 0
          ? <div style={{ textAlign: 'center', padding: '80px 0', color: '#888' }}>
              <p style={{ marginBottom: 16 }}>Nenhum produto encontrado.</p>
              <button className="btn btn-outline" onClick={() => { setBusca(''); setCat('Todas'); }}>Limpar filtros</button>
            </div>
          : <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 24 }}>
              {filtrados.map(p => <CardProduto key={p.id} produto={p} />)}
            </div>
      }
    </div>
  );
}
