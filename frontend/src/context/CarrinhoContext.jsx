import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import api from '../services/api';

const Ctx = createContext();

export function CarrinhoProvider({ children }) {
  const { usuario } = useAuth();
  const [itens, setItens] = useState([]);
  const [total, setTotal] = useState('0.00');

  useEffect(() => {
    if (usuario) carregar();
    else { setItens([]); setTotal('0.00'); }
  }, [usuario]);

  async function carregar() {
    try { const d = await api.get('/carrinho'); setItens(d.itens); setTotal(d.total); } catch {}
  }

  async function adicionar(produto_id, quantidade = 1) {
    await api.post('/carrinho', { produto_id, quantidade });
    carregar();
  }

  async function remover(produto_id) {
    await api.del(`/carrinho/${produto_id}`);
    carregar();
  }

  async function finalizar() {
    await api.post('/pedidos');
    carregar();
  }

  const qtd = itens.reduce((a, i) => a + i.quantidade, 0);

  return <Ctx.Provider value={{ itens, total, qtd, adicionar, remover, finalizar }}>{children}</Ctx.Provider>;
}

export function useCarrinho() { return useContext(Ctx); }
