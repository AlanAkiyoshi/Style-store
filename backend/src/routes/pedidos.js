const router = require('express').Router();
const { pedidoController: ctrl } = require('../controllers/pedidoController');
const { autenticar, apenasAdmin } = require('../middlewares/auth');

/**
 * @swagger
 * tags:
 *   name: Pedidos
 *   description: Pedidos
 */

/**
 * @swagger
 * /pedidos:
 *   post:
 *     summary: Finalizar compra
 *     tags: [Pedidos]
 *     responses:
 *       201: { description: Pedido criado }
 *       400: { description: Carrinho vazio ou estoque insuficiente }
 */
router.post('/', autenticar, ctrl.finalizar);

/**
 * @swagger
 * /pedidos/meus:
 *   get:
 *     summary: Meus pedidos
 *     tags: [Pedidos]
 *     responses:
 *       200: { description: Historico de pedidos }
 */
router.get('/meus', autenticar, ctrl.meusPedidos);

/**
 * @swagger
 * /pedidos:
 *   get:
 *     summary: Todos os pedidos (admin)
 *     tags: [Pedidos]
 *     responses:
 *       200: { description: Lista de pedidos }
 */
router.get('/', autenticar, apenasAdmin, ctrl.listarTodos);

/**
 * @swagger
 * /pedidos/{id}/status:
 *   patch:
 *     summary: Atualizar status (admin)
 *     tags: [Pedidos]
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
 *               status: { type: string, enum: [pendente, confirmado, enviado, entregue, cancelado] }
 *     responses:
 *       200: { description: Status atualizado }
 */
router.patch('/:id/status', autenticar, apenasAdmin, ctrl.atualizarStatus);

/**
 * @swagger
 * /pedidos/relatorio/vendas:
 *   get:
 *     summary: Relatorio de vendas (admin)
 *     tags: [Pedidos]
 *     responses:
 *       200: { description: Totais de vendas }
 */
router.get('/relatorio/vendas', autenticar, apenasAdmin, ctrl.resumoVendas);

module.exports = router;
