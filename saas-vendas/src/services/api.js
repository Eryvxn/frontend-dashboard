/**
 * services/api.js
 * Camada de serviço centralizada para todas as chamadas ao backend.
 * Injeta automaticamente o Bearer token em rotas protegidas.
 */

const BASE = 'https://backend-dashboard-91rp.onrender.com/api';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const getToken = () => localStorage.getItem('token');

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getToken()}`,
});

const jsonHeaders = () => ({ 'Content-Type': 'application/json' });

/** Lança erro com a mensagem do backend, ou mensagem genérica. */
const handle = async (res) => {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.mensagem || `Erro ${res.status}`);
  return data;
};

// ─── Autenticação ─────────────────────────────────────────────────────────────

export const authService = {
  /** POST /auth/login → { token, usuario } */
  login: async (email, senha) => {
    const res = await fetch(`${BASE}/auth/login`, {
      method: 'POST',
      headers: jsonHeaders(),
      body: JSON.stringify({ email, senha }),
    });
    const data = await handle(res);
    return data.dados; // { token, usuario }
  },
};

// ─── Vendas ───────────────────────────────────────────────────────────────────

export const vendasService = {
  /** GET /vendas?mes=&ano= → { vendas[], paginacao } */
  listar: async ({ mes, ano } = {}) => {
    const p = new URLSearchParams();
    if (mes) p.set('mes', mes);
    if (ano) p.set('ano', ano);
    const res = await fetch(`${BASE}/vendas?${p}`, { headers: authHeaders() });
    const data = await handle(res);
    return data.dados;
  },

  /** POST /vendas → venda criada */
  criar: async (venda) => {
    const res = await fetch(`${BASE}/vendas`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(venda),
    });
    return handle(res);
  },

  /** DELETE /vendas/:id */
  deletar: async (id) => {
    const res = await fetch(`${BASE}/vendas/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    return handle(res);
  },
};

// ─── Gastos ───────────────────────────────────────────────────────────────────

export const gastosService = {
  /** GET /gastos?mes=&ano= → { gastos[], paginacao } */
  listar: async ({ mes, ano } = {}) => {
    const p = new URLSearchParams();
    if (mes) p.set('mes', mes);
    if (ano) p.set('ano', ano);
    const res = await fetch(`${BASE}/gastos?${p}`, { headers: authHeaders() });
    const data = await handle(res);
    return data.dados;
  },

  /** POST /gastos → gasto criado */
  criar: async (gasto) => {
    const res = await fetch(`${BASE}/gastos`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(gasto),
    });
    return handle(res);
  },

  /** DELETE /gastos/:id */
  deletar: async (id) => {
    const res = await fetch(`${BASE}/gastos/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    return handle(res);
  },
};

// ─── Dashboard ────────────────────────────────────────────────────────────────

export const dashboardService = {
  /** GET /dashboard → { totalVendasMes, totalGastosMes, lucroMes, evolucaoMensal[] } */
  get: async () => {
    const res = await fetch(`${BASE}/dashboard`, { headers: authHeaders() });
    const data = await handle(res);
    return data.dados;
  },
};
