const router = require('express').Router();
const ctrl = require('../controllers/produtoController');
const { autenticar, apenasAdmin } = require('../middlewares/auth');

/**
 * @swagger
 * tags:
 *   name: Produtos
 *   description: Catalogo de produtos
 */

/**
 * @swagger
 * /produtos:
 *   get:
 *     summary: Listar todos os produtos
 *     tags: [Produtos]
 *     security: []
 *     responses:
 *       200: { description: Lista de produtos }
 */
router.get('/', ctrl.listar);

/**
 * @swagger
 * /produtos/{id}:
 *   get:
 *     summary: Buscar produto por ID
 *     tags: [Produtos]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Produto encontrado }
 *       404: { description: Nao encontrado }
 */
router.get('/:id', ctrl.buscarPorId);

/**
 * @swagger
 * /produtos:
 *   post:
 *     summary: Criar produto (admin)
 *     tags: [Produtos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome: { type: string }
 *               preco: { type: number }
 *               estoque: { type: integer }
 *               descricao: { type: string }
 *               categoria_id: { type: integer }
 *     responses:
 *       201: { description: Produto criado }
 */
router.post('/', autenticar, apenasAdmin, ctrl.criar);

/**
 * @swagger
 * /produtos/{id}:
 *   put:
 *     summary: Atualizar produto (admin)
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome: { type: string }
 *               preco: { type: number }
 *               estoque: { type: integer }
 *     responses:
 *       200: { description: Produto atualizado }
 */
router.put('/:id', autenticar, apenasAdmin, ctrl.atualizar);

/**
 * @swagger
 * /produtos/{id}:
 *   delete:
 *     summary: Remover produto (admin)
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Removido }
 */
router.delete('/:id', autenticar, apenasAdmin, ctrl.deletar);

module.exports = router;
