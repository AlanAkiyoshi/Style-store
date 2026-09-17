const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuarioModel');

const gerarToken = (usuario) =>
  jwt.sign({ id: usuario.id, perfil: usuario.perfil }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

module.exports = {
  async cadastro(req, res) {
    const { nome, email, senha } = req.body;
    if (!nome || !email || !senha) return res.status(400).json({ erro: 'Preencha todos os campos.' });
    if (senha.length < 6) return res.status(400).json({ erro: 'Senha deve ter pelo menos 6 caracteres.' });
    try {
      if (await Usuario.buscarPorEmail(email)) return res.status(409).json({ erro: 'E-mail ja cadastrado.' });
      const senhaHash = await bcrypt.hash(senha, 10);
      const usuario = await Usuario.criar({ nome, email, senha: senhaHash });
      res.status(201).json({ mensagem: 'Cadastro realizado!', usuario, token: gerarToken(usuario) });
    } catch (err) { res.status(500).json({ erro: 'Erro interno.' }); }
  },

  async login(req, res) {
    const { email, senha } = req.body;
    if (!email || !senha) return res.status(400).json({ erro: 'Informe e-mail e senha.' });
    try {
      const usuario = await Usuario.buscarPorEmail(email);
      if (!usuario || !(await bcrypt.compare(senha, usuario.senha)))
        return res.status(401).json({ erro: 'E-mail ou senha incorretos.' });
      res.json({ mensagem: 'Login realizado!', usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, perfil: usuario.perfil }, token: gerarToken(usuario) });
    } catch (err) { res.status(500).json({ erro: 'Erro interno.' }); }
  },

  async perfil(req, res) {
    try {
      const usuario = await Usuario.buscarPorId(req.usuario.id);
      res.json(usuario);
    } catch (err) { res.status(500).json({ erro: 'Erro interno.' }); }
  },
};
