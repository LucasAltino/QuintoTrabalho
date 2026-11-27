'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ReturnsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.withScope((scope) => {
      scope.setTag('feature', 'returns');
      scope.setContext('devolucao', { tela: 'devolucoes-e-trocas' });
      Sentry.captureException(error);
    });
  }, [error]);

  return (
    <section role="alert" className="container mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="rounded-full bg-amber-500/10 p-4 text-amber-700" aria-hidden="true">⚠</div>
      <h1 className="text-2xl font-bold">Não foi possível carregar esta devolução</h1>
      <p className="text-muted-foreground">Os dados da solicitação ou o comprovante podem estar temporariamente indisponíveis. Tente carregar o módulo novamente.</p>
      {error.digest && <p className="text-xs text-muted-foreground">Código de diagnóstico: {error.digest}</p>}
      <Button onClick={reset} className="min-h-11 gap-2"><RotateCcw className="h-4 w-4" /> Tentar novamente</Button>
    </section>
  );
}
