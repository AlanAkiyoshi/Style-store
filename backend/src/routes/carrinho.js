const router = require('express').Router();
const { carrinhoController: ctrl } = require('../controllers/pedidoController');
const { autenticar } = require('../middlewares/auth');

/**
 * @swagger
 * tags:
 *   name: Carrinho
 *   description: Carrinho de compras
 */

/**
 * @swagger
 * /carrinho:
 *   get:
 *     summary: Ver carrinho
 *     tags: [Carrinho]
 *     responses:
 *       200: { description: Itens do carrinho }
 */
router.get('/', autenticar, ctrl.listar);

/**
 * @swagger
 * /carrinho:
 *   post:
 *     summary: Adicionar ao carrinho
 *     tags: [Carrinho]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               produto_id: { type: integer, example: 1 }
 *               quantidade: { type: integer, example: 1 }
 *     responses:
 *       201: { description: Adicionado }
 */
router.post('/', autenticar, ctrl.adicionar);

/**
 * @swagger
 * /carrinho/{produto_id}:
 *   delete:
 *     summary: Remover item do carrinho
 *     tags: [Carrinho]
 *     parameters:
 *       - in: path
 *         name: produto_id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Removido }
 */
router.delete('/:produto_id', autenticar, ctrl.remover);

module.exports = router;
