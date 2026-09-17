const pool = require('../config/database');

const Usuario = {
  buscarPorEmail: async (email) => {
    const r = await pool.query('SELECT * FROM usuarios WHERE email=$1', [email]);
    return r.rows[0];
  },
  buscarPorId: async (id) => {
    const r = await pool.query('SELECT id,nome,email,perfil,criado_em FROM usuarios WHERE id=$1', [id]);
    return r.rows[0];
  },
  criar: async ({ nome, email, senha }) => {
    const r = await pool.query(
      'INSERT INTO usuarios (nome,email,senha) VALUES ($1,$2,$3) RETURNING id,nome,email,perfil,criado_em',
      [nome, email, senha]
    );
    return r.rows[0];
  },
  listarClientes: async () => {
    const r = await pool.query(
      "SELECT id,nome,email,criado_em FROM usuarios WHERE perfil='cliente' ORDER BY criado_em DESC"
    );
    return r.rows;
  },
};

module.exports = Usuario;
