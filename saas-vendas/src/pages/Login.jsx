import React, { useState } from 'react';
import { authService } from '../services/api';
import Button from '../components/ui/Button';
import Input  from '../components/ui/Input';
import styles from './Login.module.css';

export default function Login({ onLogin }) {
  const [email,      setEmail]      = useState('');
  const [senha,      setSenha]      = useState('');
  const [erro,       setErro]       = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    if (!email.trim() || !senha) return setErro('Preencha e-mail e senha.');

    setCarregando(true);
    try {
      const dados = await authService.login(email.trim(), senha);
      onLogin(dados);
    } catch (err) {
      setErro(err.message || 'Credenciais inválidas. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className={styles.page}>
      {/* Decoração */}
      <div className={styles.deco} aria-hidden>
        <div className={styles.decoOrb1} />
        <div className={styles.decoOrb2} />
        <div className={styles.decoGrid} />
      </div>

      <div className={styles.card + ' anim-scale-in'}>
        {/* Topo */}
        <div className={styles.header}>
          <div className={styles.logoWrap}>
            <span className={styles.logoMark}>✦</span>
          </div>
          <h1 className={styles.title}>Bem-vindo de volta</h1>
          <p className={styles.subtitle}>Acesse sua conta para continuar</p>
        </div>

        {/* Erro */}
        {erro && (
          <div className={styles.errorBox + ' anim-fade-in'} role="alert">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
            </svg>
            {erro}
          </div>
        )}

        {/* Form */}
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <Input
            label="E-mail"
            id="email"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="email"
            autoFocus
            disabled={carregando}
          />
          <Input
            label="Senha"
            id="senha"
            type="password"
            placeholder="••••••••"
            value={senha}
            onChange={e => setSenha(e.target.value)}
            autoComplete="current-password"
            disabled={carregando}
          />
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={carregando}
          >
            Entrar
          </Button>
        </form>

        <p className={styles.hint}>Sistema de gestão para pequenos comércios</p>
      </div>
    </div>
  );
}
