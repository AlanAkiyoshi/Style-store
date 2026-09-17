const pool = require('./database');
const bcrypt = require('bcryptjs');

async function seed() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    await client.query(`
      INSERT INTO categorias (nome) VALUES
        ('Camisetas'), ('Calcas'), ('Vestidos'), ('Acessorios')
      ON CONFLICT (nome) DO NOTHING;
    `);

    const senhaAdmin = await bcrypt.hash('admin123', 10);
    await client.query(`
      INSERT INTO usuarios (nome, email, senha, perfil) VALUES
        ('Administrador', 'admin@stylestore.com', $1, 'admin')
      ON CONFLICT (email) DO NOTHING;
    `, [senhaAdmin]);

    const { rows: cats } = await client.query('SELECT id, nome FROM categorias');
    const cat = {};
    cats.forEach(c => cat[c.nome] = c.id);

    await client.query(`
      INSERT INTO produtos (nome, descricao, preco, estoque, categoria_id, imagem_url) VALUES
        ('Camiseta Basica Branca', 'Camiseta de algodao, corte regular', 49.90, 50, $1, 'https://m.media-amazon.com/images/I/41z6diDxZvL._AC_SX569_.jpg'),
        ('Camiseta Oversized Preta', 'Modelo amplo, tecido premium', 69.90, 30, $1, 'https://http2.mlstatic.com/D_NQ_NP_2X_922984-CBT110128105085_042026-F-camiseta-oversized-de-suede-com-bordado-vero.webp'),
        ('Calca Jeans Slim', 'Jeans de alta qualidade', 149.90, 20, $2, 'https://dkloed91apca8.cloudfront.net/Custom/Content/Products/73/13/7313_calca-jeans-slim-fit-preta-51422_l1_638566578334981971.webp'),
        ('Vestido Floral', 'Vestido leve para o verao', 129.90, 15, $3, 'https://m.media-amazon.com/images/I/91FQI1Eh2mL._AC_UF894,1000_QL80_.jpg'),
        ('Bone Bordado', 'Bone com bordado exclusivo', 59.90, 5, $4, 'https://static.dafiti.com.br/p/Opice-Bone-Bordado-com-Aba-Curva-Ajustavel-RLXD-5698-73900251-1-product.jpg'),
        ('Camiseta Polo Azul', 'Polo de algodao premium', 89.90, 25, $1, 'https://m.media-amazon.com/images/I/61YP+YcOqgL._AC_SX569_.jpg'),
        ('Calca Cargo Verde', 'Calca cargo estilosa', 179.90, 12, $2, 'https://http2.mlstatic.com/D_NQ_NP_2X_863715-MLB79233385670_092024-F-calca-cargo-de-sarja-100-algodo-diversas-cores.webp')
      ON CONFLICT DO NOTHING;
    `, [cat['Camisetas'], cat['Calcas'], cat['Vestidos'], cat['Acessorios']]);

    await client.query('COMMIT');
    console.log('Dados inseridos! Admin: admin@stylestore.com / admin123');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Erro no seed:', err.message);
  } finally {
    client.release();
    pool.end();
  }
}

seed();