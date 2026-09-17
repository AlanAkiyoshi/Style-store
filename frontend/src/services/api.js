const BASE = 'https://style-store-production.up.railway.app';

function headers(body = false) {
  const h = {};
  const token = localStorage.getItem('ss_token');
  if (token) h['Authorization'] = `Bearer ${token}`;
  if (body) h['Content-Type'] = 'application/json';
  return h;
}

async function handle(res) {
  const data = await res.json();
  if (!res.ok) throw new Error(data.erro || 'Erro na requisicao');
  return data;
}

const api = {
  get:   (p)    => fetch(`${BASE}${p}`, { headers: headers() }).then(handle),
  post:  (p, b) => fetch(`${BASE}${p}`, { method: 'POST',   headers: headers(true), body: JSON.stringify(b) }).then(handle),
  put:   (p, b) => fetch(`${BASE}${p}`, { method: 'PUT',    headers: headers(true), body: JSON.stringify(b) }).then(handle),
  patch: (p, b) => fetch(`${BASE}${p}`, { method: 'PATCH',  headers: headers(true), body: JSON.stringify(b) }).then(handle),
  del:   (p)    => fetch(`${BASE}${p}`, { method: 'DELETE', headers: headers() }).then(handle),
};

export default api;
