const pool = require('../config/database');

const Carrinho = {
  listar: async (usuario_id) => {
    const r = await pool.query(
      `SELECT c.id, c.quantidade, p.id AS produto_id, p.nome, p.preco, p.imagem_url,
              (p.preco * c.quantidade) AS subtotal
       FROM carrinho c JOIN produtos p ON c.produto_id=p.id WHERE c.usuario_id=$1`,
      [usuario_id]
    );
    return r.rows;
  },
  adicionar: async (usuario_id, produto_id, quantidade) => {
    const r = await pool.query(
      `INSERT INTO carrinho (usuario_id,produto_id,quantidade) VALUES ($1,$2,$3)
       ON CONFLICT (usuario_id,produto_id) DO UPDATE SET quantidade=carrinho.quantidade+EXCLUDED.quantidade
       RETURNING *`,
      [usuario_id, produto_id, quantidade]
    );
    return r.rows[0];
  },
  remover: async (usuario_id, produto_id) =>
    pool.query('DELETE FROM carrinho WHERE usuario_id=$1 AND produto_id=$2', [usuario_id, produto_id]),
};

const Pedido = {
  finalizar: async (usuario_id) => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const { rows: itens } = await client.query(
        `SELECT c.quantidade, p.id AS produto_id, p.preco, p.estoque
         FROM carrinho c JOIN produtos p ON c.produto_id=p.id WHERE c.usuario_id=$1`,
        [usuario_id]
      );
      if (itens.length === 0) throw new Error('Carrinho vazio.');
      for (const i of itens)
        if (i.estoque < i.quantidade) throw new Error(`Estoque insuficiente: ${i.produto_id}`);

      const total = itens.reduce((acc, i) => acc + i.preco * i.quantidade, 0);
      const { rows: [pedido] } = await client.query(
        'INSERT INTO pedidos (usuario_id,total) VALUES ($1,$2) RETURNING *', [usuario_id, total]
      );
      for (const i of itens) {
        await client.query(
          'INSERT INTO itens_pedido (pedido_id,produto_id,quantidade,preco_unit) VALUES ($1,$2,$3,$4)',
          [pedido.id, i.produto_id, i.quantidade, i.preco]
        );
        await client.query('UPDATE produtos SET estoque=estoque-$1 WHERE id=$2', [i.quantidade, i.produto_id]);
      }
      await client.query('DELETE FROM carrinho WHERE usuario_id=$1', [usuario_id]);
      await client.query('COMMIT');
      return pedido;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  },
  listarDoUsuario: async (usuario_id) => {
    const { rows: pedidos } = await pool.query(
      'SELECT * FROM pedidos WHERE usuario_id=$1 ORDER BY criado_em DESC', [usuario_id]
    );
    for (const p of pedidos) {
      const { rows } = await pool.query(
        'SELECT ip.*, pr.nome, pr.imagem_url FROM itens_pedido ip JOIN produtos pr ON ip.produto_id=pr.id WHERE ip.pedido_id=$1',
        [p.id]
      );
      p.itens = rows;
    }
    return pedidos;
  },
  listarTodos: async () => {
    const { rows } = await pool.query(
      'SELECT pd.*, u.nome AS cliente, u.email FROM pedidos pd JOIN usuarios u ON pd.usuario_id=u.id ORDER BY pd.criado_em DESC'
    );
    return rows;
  },
  atualizarStatus: async (id, status) => {
    const { rows } = await pool.query('UPDATE pedidos SET status=$1 WHERE id=$2 RETURNING *', [status, id]);
    return rows[0];
  },
  resumoVendas: async () => {
    const { rows } = await pool.query(
      `SELECT COUNT(*) AS total_pedidos, COALESCE(SUM(total),0) AS receita_total,
       COUNT(*) FILTER (WHERE status='pendente') AS pendentes,
       COUNT(*) FILTER (WHERE status='entregue') AS entregues FROM pedidos`
    );
    return rows[0];
  },
};

module.exports = { Carrinho, Pedido };
