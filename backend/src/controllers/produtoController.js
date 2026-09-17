const Produto = require('../models/produtoModel');

module.exports = {
  async listar(req, res) {
    try { res.json(await Produto.listar()); } catch { res.status(500).json({ erro: 'Erro ao listar.' }); }
  },
  async buscarPorId(req, res) {
    try {
      const p = await Produto.buscarPorId(req.params.id);
      if (!p) return res.status(404).json({ erro: 'Produto nao encontrado.' });
      res.json(p);
    } catch { res.status(500).json({ erro: 'Erro ao buscar.' }); }
  },
  async criar(req, res) {
    const { nome, preco } = req.body;
    if (!nome || !preco) return res.status(400).json({ erro: 'Nome e preco sao obrigatorios.' });
    try { res.status(201).json(await Produto.criar(req.body)); } catch { res.status(500).json({ erro: 'Erro ao criar.' }); }
  },
  async atualizar(req, res) {
    try {
      const p = await Produto.atualizar(req.params.id, req.body);
      if (!p) return res.status(404).json({ erro: 'Nao encontrado.' });
      res.json(p);
    } catch { res.status(500).json({ erro: 'Erro ao atualizar.' }); }
  },
  async deletar(req, res) {
    try { await Produto.deletar(req.params.id); res.json({ mensagem: 'Removido.' }); }
    catch { res.status(500).json({ erro: 'Erro ao deletar.' }); }
  },
};
