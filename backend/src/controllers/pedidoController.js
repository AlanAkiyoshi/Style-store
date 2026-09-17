const { Carrinho, Pedido } = require('../models/pedidoModel');

const carrinhoController = {
  async listar(req, res) {
    try {
      const itens = await Carrinho.listar(req.usuario.id);
      const total = itens.reduce((acc, i) => acc + parseFloat(i.subtotal), 0).toFixed(2);
      res.json({ itens, total });
    } catch { res.status(500).json({ erro: 'Erro ao listar carrinho.' }); }
  },
  async adicionar(req, res) {
    const { produto_id, quantidade = 1 } = req.body;
    if (!produto_id) return res.status(400).json({ erro: 'produto_id obrigatorio.' });
    try { res.status(201).json(await Carrinho.adicionar(req.usuario.id, produto_id, quantidade)); }
    catch { res.status(500).json({ erro: 'Erro ao adicionar.' }); }
  },
  async remover(req, res) {
    try { await Carrinho.remover(req.usuario.id, req.params.produto_id); res.json({ mensagem: 'Removido.' }); }
    catch { res.status(500).json({ erro: 'Erro ao remover.' }); }
  },
};

const pedidoController = {
  async finalizar(req, res) {
    try { res.status(201).json({ mensagem: 'Pedido realizado!', pedido: await Pedido.finalizar(req.usuario.id) }); }
    catch (err) { res.status(400).json({ erro: err.message }); }
  },
  async meusPedidos(req, res) {
    try { res.json(await Pedido.listarDoUsuario(req.usuario.id)); }
    catch { res.status(500).json({ erro: 'Erro ao listar.' }); }
  },
  async listarTodos(req, res) {
    try { res.json(await Pedido.listarTodos()); }
    catch { res.status(500).json({ erro: 'Erro ao listar.' }); }
  },
  async atualizarStatus(req, res) {
    const validos = ['pendente','confirmado','enviado','entregue','cancelado'];
    if (!validos.includes(req.body.status)) return res.status(400).json({ erro: 'Status invalido.' });
    try { res.json(await Pedido.atualizarStatus(req.params.id, req.body.status)); }
    catch { res.status(500).json({ erro: 'Erro ao atualizar.' }); }
  },
  async resumoVendas(req, res) {
    try { res.json(await Pedido.resumoVendas()); }
    catch { res.status(500).json({ erro: 'Erro ao gerar relatorio.' }); }
  },
};

module.exports = { carrinhoController, pedidoController };
