const router = require('express').Router();
const ctrl = require('../controllers/authController');
const { autenticar } = require('../middlewares/auth');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Autenticacao
 */

/**
 * @swagger
 * /auth/cadastro:
 *   post:
 *     summary: Cadastrar novo cliente
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome: { type: string, example: Maria Silva }
 *               email: { type: string, example: maria@email.com }
 *               senha: { type: string, example: "123456" }
 *     responses:
 *       201: { description: Cadastro realizado }
 *       409: { description: E-mail ja cadastrado }
 */
router.post('/cadastro', ctrl.cadastro);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Fazer login
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string, example: admin@stylestore.com }
 *               senha: { type: string, example: admin123 }
 *     responses:
 *       200: { description: Token JWT retornado }
 *       401: { description: Credenciais invalidas }
 */
router.post('/login', ctrl.login);

/**
 * @swagger
 * /auth/perfil:
 *   get:
 *     summary: Dados do usuario logado
 *     tags: [Auth]
 *     responses:
 *       200: { description: Dados do usuario }
 */
router.get('/perfil', autenticar, ctrl.perfil);

module.exports = router;
