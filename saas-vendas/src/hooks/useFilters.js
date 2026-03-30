/**
 * hooks/useFilters.js
 * Filtros de mês e ano compartilhados entre as páginas.
 */

import { useState } from 'react';

export function useFilters() {
  const now = new Date();
  const [mes, setMes] = useState(now.getMonth() + 1); // 1–12
  const [ano, setAno] = useState(now.getFullYear());

  const limpar = () => {
    setMes('');
    setAno(now.getFullYear());
  };

  return { mes, ano, setMes, setAno, limpar };
}
