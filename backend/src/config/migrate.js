const pool = require('./database');

async function migrate() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    await client.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id        SERIAL PRIMARY KEY,
        nome      VARCHAR(100) NOT NULL,
        email     VARCHAR(150) UNIQUE NOT NULL,
        senha     VARCHAR(255) NOT NULL,
        perfil    VARCHAR(20) NOT NULL DEFAULT 'cliente',
        criado_em TIMESTAMP DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS categorias (
        id   SERIAL PRIMARY KEY,
        nome VARCHAR(80) UNIQUE NOT NULL
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS produtos (
        id           SERIAL PRIMARY KEY,
        nome         VARCHAR(150) NOT NULL,
        descricao    TEXT,
        preco        NUMERIC(10,2) NOT NULL,
        estoque      INTEGER NOT NULL DEFAULT 0,
        categoria_id INTEGER REFERENCES categorias(id) ON DELETE SET NULL,
        imagem_url   VARCHAR(255),
        criado_em    TIMESTAMP DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS pedidos (
        id         SERIAL PRIMARY KEY,
        usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
        total      NUMERIC(10,2) NOT NULL,
        status     VARCHAR(30) NOT NULL DEFAULT 'pendente',
        criado_em  TIMESTAMP DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS itens_pedido (
        id         SERIAL PRIMARY KEY,
        pedido_id  INTEGER NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
        produto_id INTEGER NOT NULL REFERENCES produtos(id) ON DELETE CASCADE,
        quantidade INTEGER NOT NULL,
        preco_unit NUMERIC(10,2) NOT NULL
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS carrinho (
        id         SERIAL PRIMARY KEY,
        usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
        produto_id INTEGER NOT NULL REFERENCES produtos(id) ON DELETE CASCADE,
        quantidade INTEGER NOT NULL DEFAULT 1,
        UNIQUE(usuario_id, produto_id)
      );
    `);

    await client.query('COMMIT');
    console.log('Tabelas criadas com sucesso!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Erro na migração:', err.message);
  } finally {
    client.release();
    pool.end();
  }
}

migrate();
