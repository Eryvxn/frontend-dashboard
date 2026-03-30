/**
 * hooks/useToast.js
 * Hook simples para exibir notificações de sucesso/erro.
 * Retorna { toasts, toast } onde toast.success() e toast.error() adicionam notificações.
 */

import { useState, useCallback } from 'react';

let _id = 0;

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const add = useCallback((message, type = 'success') => {
    const id = ++_id;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  return {
    toasts,
    toast: {
      success: (msg) => add(msg, 'success'),
      error:   (msg) => add(msg, 'error'),
      warning: (msg) => add(msg, 'warning'),
    },
  };
}
