import React, { useState } from 'react';
import styles from './Sidebar.module.css';

const NavItem = ({ icon, label, active, onClick, collapsed }) => (
  <button
    className={[styles.navItem, active ? styles['navItem--active'] : ''].join(' ')}
    onClick={onClick}
    title={collapsed ? label : undefined}
  >
    <span className={styles.navIcon}>{icon}</span>
    {!collapsed && <span className={styles.navLabel}>{label}</span>}
    {active && !collapsed && <span className={styles.activeDot} />}
  </button>
);

const IconDashboard = () => (
  <svg viewBox="0 0 20 20" fill="currentColor">
    <path d="M2 4a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1H3a1 1 0 01-1-1V4zM2 10a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1H3a1 1 0 01-1-1v-2zM8 4a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1H9a1 1 0 01-1-1V4zM14 4a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1V4zM8 10a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1H9a1 1 0 01-1-1v-6zM2 16a1 1 0 011-1h2a1 1 0 011 1v0a1 1 0 01-1 1H3a1 1 0 01-1-1z"/>
  </svg>
);

const IconVendas = () => (
  <svg viewBox="0 0 20 20" fill="currentColor">
    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3z"/>
    <path d="M16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
  </svg>
);

const IconGastos = () => (
  <svg viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
  </svg>
);

const IconLogout = () => (
  <svg viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V5h10v10a1 1 0 102 0V4a1 1 0 00-1-1H3zm9.293 5.293a1 1 0 011.414 1.414L12.414 11H8a1 1 0 110-2h4.414l-1.707-1.707z" clipRule="evenodd"/>
  </svg>
);

const IconChevron = ({ collapsed }) => (
  <svg viewBox="0 0 20 20" fill="currentColor" style={{ transform: collapsed ? 'rotate(180deg)' : 'none', transition: 'transform .3s' }}>
    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd"/>
  </svg>
);

const IconMenu = () => (
  <svg viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
  </svg>
);

export default function Sidebar({ page, setPage, usuario, onLogout }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const nav = (p) => { setPage(p); setMobileOpen(false); };

  return (
    <>
      {/* ── Mobile topbar ── */}
      <header className={styles.topbar}>
        <div className={styles.topbarBrand}>
          <span className={styles.logoMark}>✦</span>
          <span className={styles.logoText}>Comércio Pro</span>
        </div>
        <button className={styles.menuBtn} onClick={() => setMobileOpen(v => !v)}>
          <IconMenu />
        </button>
      </header>

      {/* ── Mobile overlay ── */}
      {mobileOpen && (
        <div className={styles.overlay} onClick={() => setMobileOpen(false)} />
      )}

      {/* ── Sidebar ── */}
      <aside className={[styles.sidebar, collapsed ? styles['sidebar--collapsed'] : '', mobileOpen ? styles['sidebar--open'] : ''].join(' ')}>
        {/* Brand */}
        <div className={styles.brand}>
          <span className={styles.logoMark}>✦</span>
          {!collapsed && <span className={styles.logoText}>Comércio Pro</span>}
          <button className={styles.collapseBtn} onClick={() => setCollapsed(v => !v)} title="Recolher menu">
            <IconChevron collapsed={collapsed} />
          </button>
        </div>

        {/* Nav */}
        <nav className={styles.nav}>
          {!collapsed && <span className={styles.navSection}>MENU</span>}
          <NavItem icon={<IconDashboard />} label="Dashboard"  active={page === 'dashboard'} onClick={() => nav('dashboard')} collapsed={collapsed} />
          <NavItem icon={<IconVendas />}   label="Vendas"      active={page === 'vendas'}    onClick={() => nav('vendas')}    collapsed={collapsed} />
          <NavItem icon={<IconGastos />}   label="Gastos"      active={page === 'gastos'}    onClick={() => nav('gastos')}    collapsed={collapsed} />
        </nav>

        {/* Footer */}
        <div className={styles.footer}>
          <div className={styles.userRow}>
            <div className={styles.avatar}>{usuario?.nome?.charAt(0).toUpperCase()}</div>
            {!collapsed && (
              <div className={styles.userInfo}>
                <span className={styles.userName}>{usuario?.nome}</span>
                <span className={styles.userRole}>Operador</span>
              </div>
            )}
          </div>
          <button className={styles.logoutBtn} onClick={onLogout} title="Sair">
            <IconLogout />
          </button>
        </div>
      </aside>
    </>
  );
}
