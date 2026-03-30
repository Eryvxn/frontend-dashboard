# ✦ Gestão Pro — Frontend SaaS React

Dashboard de gestão para pequenos comércios. Visual profissional estilo SaaS, pronto para ser entregue a clientes reais.

---

## 📁 Estrutura completa

```
saas-vendas/
├── public/
│   └── index.html                    ← HTML base com fontes Sora + Lora
├── src/
│   ├── index.js                      ← Entry point
│   ├── App.jsx                       ← Raiz: sessão, roteamento, toasts
│   ├── App.module.css
│   │
│   ├── styles/
│   │   └── globals.css               ← Design system (variáveis, animações, skeleton)
│   │
│   ├── services/
│   │   └── api.js                    ← Todas as chamadas HTTP ao backend
│   │
│   ├── hooks/
│   │   ├── useToast.js               ← Sistema de notificações global
│   │   └── useFilters.js             ← Filtros de mês/ano compartilhados
│   │
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.jsx            ← Botão reutilizável (4 variantes)
│   │   │   ├── Button.module.css
│   │   │   ├── Input.jsx             ← Input/Select reutilizável
│   │   │   ├── Input.module.css
│   │   │   ├── Card.jsx              ← Card base reutilizável
│   │   │   ├── Card.module.css
│   │   │   ├── Loading.jsx           ← Skeleton + Spinner
│   │   │   ├── Loading.module.css
│   │   │   ├── Toast.jsx             ← Notificações (sucesso/erro/aviso)
│   │   │   ├── Toast.module.css
│   │   │   ├── FilterBar.jsx         ← Barra de filtros mês/ano
│   │   │   └── FilterBar.module.css
│   │   └── layout/
│   │       ├── Sidebar.jsx           ← Sidebar desktop + topbar mobile
│   │       └── Sidebar.module.css
│   │
│   └── pages/
│       ├── Login.jsx                 ← Tela de login
│       ├── Login.module.css
│       ├── Dashboard.jsx             ← Métricas + gráfico + tabela mensal
│       ├── Dashboard.module.css
│       ├── Vendas.jsx                ← Formulário + listagem de vendas
│       ├── Gastos.jsx                ← Formulário + listagem de gastos
│       └── Transacao.module.css      ← CSS compartilhado (Vendas + Gastos)
└── package.json
```

---

## 🚀 Como rodar

### Pré-requisitos
- Node.js v18+
- Backend rodando em `http://localhost:3000`

### Instalação e start

```bash
npm install
npm start
```

Abre em `http://localhost:3001` automaticamente.

---

## 🔗 Integração com o backend

Todas as chamadas estão em `src/services/api.js`. Se seu backend usar outra porta:

```js
// src/services/api.js — linha 1
const BASE = 'http://localhost:3000/api'; // ← altere aqui
```

O token JWT é salvo em `localStorage` e injetado automaticamente em todas as requisições protegidas via header `Authorization: Bearer <token>`.

---

## 🎨 Design System

| Token | Valor |
|-------|-------|
| Fonte UI | Sora |
| Fonte display | Lora (itálica nos títulos) |
| Fundo | `#f7f6f2` (creme) |
| Sidebar | `#141412` (quase-preto) |
| Acento | `#10b981` (esmeralda) |
| Danger | `#f43f5e` (rosa) |
| Border radius | 12–24px |

---

## ✅ Funcionalidades entregues

### 🔐 Autenticação
- [x] Login com e-mail e senha
- [x] Token JWT em localStorage
- [x] Persistência de sessão (recarregar página mantém login)
- [x] Logout com limpeza de token

### 📊 Dashboard
- [x] Card: Total de vendas do mês
- [x] Card: Total de gastos do mês
- [x] Card: Lucro do mês (cor muda conforme positivo/negativo)
- [x] Gráfico de linha (Chart.js) — últimos 6 meses
- [x] Tabela detalhada por mês (vendas, gastos, lucro)
- [x] Skeleton loading nos cards
- [x] Tratamento de erro amigável

### 💰 Vendas
- [x] Formulário com validação (valor, descrição, data)
- [x] Listagem com tabela estilizada
- [x] Filtro por mês e ano
- [x] Total calculado na base da lista
- [x] Botão de exclusão com confirmação
- [x] Feedback de sucesso/erro via toast

### 💸 Gastos (nova tela)
- [x] Mesma estrutura das vendas
- [x] Formulário com validação
- [x] Listagem, filtros, total, exclusão

### 🧩 Componentes reutilizáveis
- [x] `Button` (primary / secondary / ghost / danger, sizes, loading state)
- [x] `Input` (com label, erro, hint, prefix)
- [x] `Card` (com subcomponentes Header, Title, Body)
- [x] `Loading` (SkeletonMetricCard, SkeletonTableRow, PageSpinner)
- [x] `Toast` (sucesso, erro, aviso — auto-dismiss em 4s)
- [x] `FilterBar` (mês/ano com botão de limpar)

### 📱 Responsividade
- [x] Sidebar fixa no desktop
- [x] Sidebar vira menu deslizante no mobile (topbar com hamburger)
- [x] Grids colapsam para 1 coluna no celular

---

## 📦 Dependências

| Pacote | Versão | Uso |
|--------|--------|-----|
| react | ^18.3 | Framework |
| react-dom | ^18.3 | Renderização |
| react-scripts | 5.0.1 | Build / dev server |
| chart.js | ^4.4 | Motor de gráficos |
| react-chartjs-2 | ^5.2 | Wrapper React para Chart.js |
