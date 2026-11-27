'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';
import { Button } from '@/components/ui/button';

export default function TicketsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.withScope((scope) => {
      scope.setTag('feature', 'tickets');
      scope.setContext('chamado', { tela: 'gestao-de-chamados' });
      Sentry.captureException(error);
    });
  }, [error]);

  return (
    <section role="alert" className="container mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-2xl font-bold">Não foi possível carregar os chamados</h1>
      <p className="text-muted-foreground">O painel de suporte está temporariamente indisponível. Tente novamente para atualizar a fila.</p>
      {error.digest && <p className="text-xs text-muted-foreground">Código de diagnóstico: {error.digest}</p>}
      <Button onClick={reset} className="min-h-11">Tentar novamente</Button>
    </section>
  );
}
