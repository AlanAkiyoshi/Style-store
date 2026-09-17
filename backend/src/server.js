require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// Documentacao: http://localhost:3001/api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: 'StyleStore API',
  customCss: '.swagger-ui .topbar { background: #0f0f0f; }',
}));

app.use('/auth',     require('./routes/auth'));
app.use('/produtos', require('./routes/produtos'));
app.use('/carrinho', require('./routes/carrinho'));
app.use('/pedidos',  require('./routes/pedidos'));
app.use('/clientes', require('./routes/clientes'));

app.get('/', (req, res) => res.json({ mensagem: 'StyleStore API no ar!', docs: `http://localhost:${PORT}/api-docs` }));

app.listen(PORT, () => {
  console.log(`\nServidor: http://localhost:${PORT}`);
  console.log(`Swagger:  http://localhost:${PORT}/api-docs\n`);
});
