const pool = require('../config/database');

const Produto = {
  listar: async () => {
    const r = await pool.query(
      'SELECT p.*, c.nome AS categoria FROM produtos p LEFT JOIN categorias c ON p.categoria_id=c.id ORDER BY p.criado_em DESC'
    );
    return r.rows;
  },
  buscarPorId: async (id) => {
    const r = await pool.query(
      'SELECT p.*, c.nome AS categoria FROM produtos p LEFT JOIN categorias c ON p.categoria_id=c.id WHERE p.id=$1',
      [id]
    );
    return r.rows[0];
  },
  criar: async (d) => {
    const r = await pool.query(
      'INSERT INTO produtos (nome,descricao,preco,estoque,categoria_id,imagem_url) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
      [d.nome, d.descricao, d.preco, d.estoque || 0, d.categoria_id || null, d.imagem_url || null]
    );
    return r.rows[0];
  },
  atualizar: async (id, d) => {
    const r = await pool.query(
      'UPDATE produtos SET nome=$1,descricao=$2,preco=$3,estoque=$4,categoria_id=$5,imagem_url=$6 WHERE id=$7 RETURNING *',
      [d.nome, d.descricao, d.preco, d.estoque, d.categoria_id || null, d.imagem_url || null, id]
    );
    return r.rows[0];
  },
  deletar: async (id) => pool.query('DELETE FROM produtos WHERE id=$1', [id]),
};

module.exports = Produto;
