/**
 * App.jsx
 * Componente raiz. Gerencia:
 *   - Sessão do usuário (localStorage)
 *   - Roteamento entre páginas (dashboard / vendas / gastos)
 *   - Sistema global de toasts
 *   - Layout com sidebar
 */

import React, { useState, useEffect } from 'react';
import Sidebar       from './components/layout/Sidebar';
import ToastContainer from './components/ui/Toast';
import Login         from './pages/Login';
import Dashboard     from './pages/Dashboard';
import Vendas        from './pages/Vendas';
import Gastos        from './pages/Gastos';
import { useToast }  from './hooks/useToast';
import styles        from './App.module.css';

export default function App() {
  const [usuario, setUsuario] = useState(null);
  const [page,    setPage]    = useState('dashboard');
  const { toasts, toast }     = useToast();

  // ── Restaura sessão do localStorage ao carregar ──────────────────────────
  useEffect(() => {
    const token = localStorage.getItem('token');
    const nome  = localStorage.getItem('nomeUsuario');
    if (token && nome) setUsuario({ nome });
  }, []);

  // ── Login bem-sucedido ───────────────────────────────────────────────────
  const handleLogin = ({ token, usuario }) => {
    localStorage.setItem('token',       token);
    localStorage.setItem('nomeUsuario', usuario.nome);
    setUsuario(usuario);
    toast.success(`Bem-vindo, ${usuario.nome}!`);
  };

  // ── Logout ───────────────────────────────────────────────────────────────
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('nomeUsuario');
    setUsuario(null);
    setPage('dashboard');
  };

  // ── Sem sessão → Login ───────────────────────────────────────────────────
  if (!usuario) {
    return (
      <>
        <Login onLogin={handleLogin} />
        <ToastContainer toasts={toasts} />
      </>
    );
  }

  // ── Com sessão → Layout principal ────────────────────────────────────────
  return (
    <div className={styles.layout}>
      <Sidebar
        page={page}
        setPage={setPage}
        usuario={usuario}
        onLogout={handleLogout}
      />

      <main className={styles.main}>
        {page === 'dashboard' && <Dashboard toast={toast} />}
        {page === 'vendas'    && <Vendas    toast={toast} />}
        {page === 'gastos'    && <Gastos    toast={toast} />}
      </main>

      <ToastContainer toasts={toasts} />
    </div>
  );
}
