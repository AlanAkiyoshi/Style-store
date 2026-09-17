import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function MeusPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/pedidos/meus').then(setPedidos).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Carregando pedidos...</div>;

  return (
    <div className="container" style={{ padding: '48px 24px 80px' }}>
      <h1 style={{ fontSize: 36, marginBottom: 32 }}>Meus pedidos</h1>
      {pedidos.length === 0
        ? <p style={{ color: '#888' }}>Voce ainda nao realizou nenhum pedido.</p>
        : <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {pedidos.map(p => (
              <div key={p.id} style={{ background: 'var(--branco)', border: '1px solid var(--areia)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    <span style={{ fontWeight: 600, display: 'block', marginBottom: 2 }}>Pedido #{p.id}</span>
                    <span style={{ fontSize: 13, color: '#999' }}>{new Date(p.criado_em).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <span className={`badge badge-${p.status}`}>{p.status}</span>
                    <strong style={{ fontSize: 17 }}>R$ {parseFloat(p.total).toFixed(2).replace('.', ',')}</strong>
                  </div>
                </div>
                {p.itens && p.itens.length > 0 && (
                  <div style={{ borderTop: '1px solid var(--areia)', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {p.itens.map((item, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#555' }}>
                        <span>{item.nome}</span>
                        <span style={{ color: '#999' }}>x{item.quantidade}</span>
                        <span>R$ {(item.preco_unit * item.quantidade).toFixed(2).replace('.', ',')}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
      }
    </div>
  );
}
