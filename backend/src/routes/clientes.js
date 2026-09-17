const router = require('express').Router();
const Usuario = require('../models/usuarioModel');
const { autenticar, apenasAdmin } = require('../middlewares/auth');

/**
 * @swagger
 * tags:
 *   name: Clientes
 *   description: Clientes cadastrados
 */

/**
 * @swagger
 * /clientes:
 *   get:
 *     summary: Listar clientes (admin)
 *     tags: [Clientes]
 *     responses:
 *       200: { description: Lista de clientes }
 */
router.get('/', autenticar, apenasAdmin, async (req, res) => {
  try { res.json(await Usuario.listarClientes()); }
  catch { res.status(500).json({ erro: 'Erro ao listar clientes.' }); }
});

module.exports = router;
