import React, { useEffect, useState } from 'react';
import api from '../services/api';

const ABAS = ['Produtos', 'Pedidos', 'Clientes', 'Relatorios'];

export default function Admin() {
  const [aba, setAba] = useState('Produtos');
  return (
    <div className="container" style={{ padding: '48px 24px 80px' }}>
      <h1 style={{ fontSize: 36, marginBottom: 28 }}>Painel Administrativo</h1>
      <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid var(--areia)', marginBottom: 36 }}>
        {ABAS.map(a => (
          <button key={a} onClick={() => setAba(a)} style={{ padding: '10px 24px', fontSize: 14, background: 'none', cursor: 'pointer', borderBottom: `2px solid ${aba === a ? 'var(--acento)' : 'transparent'}`, color: aba === a ? 'var(--preto)' : '#888', fontWeight: aba === a ? 500 : 400, transition: 'all 0.2s' }}>
            {a}
          </button>
        ))}
      </div>
      {aba === 'Produtos'    && <Produtos />}
      {aba === 'Pedidos'     && <Pedidos />}
      {aba === 'Clientes'    && <Clientes />}
      {aba === 'Relatorios'  && <Relatorios />}
    </div>
  );
}

function Tabela({ colunas, dados, renderLinha }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
        <thead>
          <tr>{colunas.map(c => <th key={c} style={{ textAlign: 'left', padding: '12px 16px', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#888', borderBottom: '1px solid var(--areia)', background: 'var(--creme)' }}>{c}</th>)}</tr>
        </thead>
        <tbody>{dados.map((d, i) => <tr key={i} style={{ borderBottom: '1px solid var(--areia)' }}>{renderLinha(d)}</tr>)}</tbody>
      </table>
    </div>
  );
}

function Td({ children }) { return <td style={{ padding: '14px 16px', verticalAlign: 'middle' }}>{children}</td>; }

function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [form, setForm] = useState({ nome: '', descricao: '', preco: '', estoque: '', categoria_id: '', imagem_url: '' });
  const [editando, setEditando] = useState(null);
  const [msg, setMsg] = useState('');
  const [cats, setCats] = useState([]);

  useEffect(() => { carregar(); }, []);

  function carregar() {
    api.get('/produtos').then(ps => {
      setProdutos(ps);
      const unicos = [...new Map(ps.filter(p => p.categoria_id).map(p => [p.categoria_id, { id: p.categoria_id, nome: p.categoria }])).values()];
      setCats(unicos);
    });
  }

  async function handleSalvar(e) {
    e.preventDefault(); setMsg('');
    try {
      const payload = { ...form, preco: parseFloat(form.preco), estoque: parseInt(form.estoque) || 0, categoria_id: form.categoria_id || null };
      if (editando) await api.put(`/produtos/${editando}`, payload);
      else await api.post('/produtos', payload);
      setMsg(editando ? 'Atualizado!' : 'Criado!');
      setForm({ nome: '', descricao: '', preco: '', estoque: '', categoria_id: '', imagem_url: '' });
      setEditando(null);
      carregar();
    } catch (err) { setMsg(err.message); }
  }

  function handleEditar(p) {
    setEditando(p.id);
    setForm({ nome: p.nome, descricao: p.descricao || '', preco: p.preco, estoque: p.estoque, categoria_id: p.categoria_id || '', imagem_url: p.imagem_url || '' });
    window.scrollTo(0, 0);
  }

  async function handleDeletar(id) {
    if (!window.confirm('Remover este produto?')) return;
    await api.del(`/produtos/${id}`); carregar();
  }

  return (
    <div>
      <div style={{ background: 'var(--branco)', border: '1px solid var(--areia)', borderRadius: 4, padding: 28, marginBottom: 32 }}>
        <h2 style={{ fontSize: 20, marginBottom: 20 }}>{editando ? 'Editar produto' : 'Novo produto'}</h2>
        <form onSubmit={handleSalvar}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0 16px' }}>
            <div className="campo"><label>Nome *</label><input value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} required /></div>
            <div className="campo"><label>Preco *</label><input type="number" step="0.01" value={form.preco} onChange={e => setForm(f => ({ ...f, preco: e.target.value }))} required /></div>
            <div className="campo"><label>Estoque</label><input type="number" value={form.estoque} onChange={e => setForm(f => ({ ...f, estoque: e.target.value }))} /></div>
            <div className="campo"><label>Categoria</label>
              <select value={form.categoria_id} onChange={e => setForm(f => ({ ...f, categoria_id: e.target.value }))}>
                <option value="">Sem categoria</option>
                {cats.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
              </select>
            </div>
            <div className="campo" style={{ gridColumn: '1 / -1' }}><label>Descricao</label><input value={form.descricao} onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))} /></div>
            <div className="campo" style={{ gridColumn: '1 / -1' }}><label>URL da imagem</label><input value={form.imagem_url} onChange={e => setForm(f => ({ ...f, imagem_url: e.target.value }))} /></div>
          </div>
          {msg && <p className="msg-ok">{msg}</p>}
          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <button type="submit" className="btn btn-primary">{editando ? 'Salvar' : 'Criar produto'}</button>
            {editando && <button type="button" className="btn btn-outline" onClick={() => { setEditando(null); setForm({ nome: '', descricao: '', preco: '', estoque: '', categoria_id: '', imagem_url: '' }); }}>Cancelar</button>}
          </div>
        </form>
      </div>
      <Tabela
        colunas={['Nome', 'Categoria', 'Preco', 'Estoque', 'Acoes']}
        dados={produtos}
        renderLinha={p => (<>
          <Td>{p.nome}</Td>
          <Td>{p.categoria || '—'}</Td>
          <Td>R$ {parseFloat(p.preco).toFixed(2).replace('.', ',')}</Td>
          <Td><span style={{ color: p.estoque === 0 ? 'var(--erro)' : 'inherit', fontWeight: p.estoque === 0 ? 600 : 400 }}>{p.estoque}</span></Td>
          <Td>
            <div style={{ display: 'flex', gap: 8 }}>
              <button style={{ padding: '5px 12px', fontSize: 12, borderRadius: 4, background: 'var(--creme)', border: '1px solid var(--areia)', cursor: 'pointer' }} onClick={() => handleEditar(p)}>Editar</button>
              <button style={{ padding: '5px 12px', fontSize: 12, borderRadius: 4, background: '#fdecea', border: '1px solid #fac5c1', color: 'var(--erro)', cursor: 'pointer' }} onClick={() => handleDeletar(p.id)}>Remover</button>
            </div>
          </Td>
        </>)}
      />
    </div>
  );
}

function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  useEffect(() => { api.get('/pedidos').then(setPedidos); }, []);

  async function handleStatus(id, status) {
    await api.patch(`/pedidos/${id}/status`, { status });
    api.get('/pedidos').then(setPedidos);
  }

  return (
    <Tabela
      colunas={['#', 'Cliente', 'Total', 'Data', 'Status']}
      dados={pedidos}
      renderLinha={p => (<>
        <Td>{p.id}</Td>
        <Td>{p.cliente}<br /><small style={{ color: '#999', fontSize: 12 }}>{p.email}</small></Td>
        <Td>R$ {parseFloat(p.total).toFixed(2).replace('.', ',')}</Td>
        <Td>{new Date(p.criado_em).toLocaleDateString('pt-BR')}</Td>
        <Td>
          <select value={p.status} onChange={e => handleStatus(p.id, e.target.value)} style={{ padding: '5px 8px', border: '1px solid var(--areia)', borderRadius: 4, fontSize: 13 }}>
            {['pendente','confirmado','enviado','entregue','cancelado'].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </Td>
      </>)}
    />
  );
}

function Clientes() {
  const [clientes, setClientes] = useState([]);
  useEffect(() => { api.get('/clientes').then(setClientes); }, []);
  return (
    <Tabela
      colunas={['#', 'Nome', 'E-mail', 'Cadastro']}
      dados={clientes}
      renderLinha={c => (<>
        <Td>{c.id}</Td><Td>{c.nome}</Td><Td>{c.email}</Td>
        <Td>{new Date(c.criado_em).toLocaleDateString('pt-BR')}</Td>
      </>)}
    />
  );
}

function Relatorios() {
  const [resumo, setResumo] = useState(null);
  const [baixoEstoque, setBaixoEstoque] = useState([]);

  useEffect(() => {
    api.get('/pedidos/relatorio/vendas').then(setResumo);
    api.get('/produtos').then(ps => setBaixoEstoque(ps.filter(p => p.estoque < 10).sort((a, b) => a.estoque - b.estoque)));
  }, []);

  return (
    <div>
      {resumo && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16, marginBottom: 40 }}>
          {[
            { label: 'Total de pedidos', valor: resumo.total_pedidos },
            { label: 'Receita total', valor: `R$ ${parseFloat(resumo.receita_total || 0).toFixed(2).replace('.', ',')}` },
            { label: 'Pendentes', valor: resumo.pendentes },
            { label: 'Entregues', valor: resumo.entregues },
          ].map(card => (
            <div key={card.label} style={{ background: 'var(--branco)', border: '1px solid var(--areia)', borderRadius: 4, padding: 24 }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: 'var(--marrom)', marginBottom: 6 }}>{card.valor}</div>
              <div style={{ fontSize: 13, color: '#888' }}>{card.label}</div>
            </div>
          ))}
        </div>
      )}
      <h3 style={{ fontSize: 18, marginBottom: 16 }}>Produtos com estoque baixo (menos de 10)</h3>
      {baixoEstoque.length === 0
        ? <p style={{ color: '#888' }}>Nenhum produto com estoque baixo.</p>
        : <Tabela colunas={['Produto', 'Categoria', 'Estoque']} dados={baixoEstoque}
            renderLinha={p => (<>
              <Td>{p.nome}</Td><Td>{p.categoria || '—'}</Td>
              <Td><span style={{ color: p.estoque === 0 ? 'var(--erro)' : '#e67e22', fontWeight: 600 }}>{p.estoque}</span></Td>
            </>)}
          />
      }
    </div>
  );
}
