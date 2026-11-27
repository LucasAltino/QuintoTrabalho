'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import * as Sentry from '@sentry/nextjs';
import { Button } from '@/components/ui/button';

export default function DiagnosticsError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    Sentry.withScope((scope) => {
      scope.setTag('feature', 'diagnostics');
      scope.setContext('diagnostico', { boundary: 'diagnostics-segment', digest: error.digest });
      Sentry.captureException(error);
    });
  }, [error]);

  return (
    <main role="alert" className="container mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-2xl font-bold">Falha ao consultar o serviço de devoluções</h1>
      <p className="text-muted-foreground">O componente de servidor simulou uma indisponibilidade do banco. O evento foi encaminhado ao GlitchTip.</p>
      {error.digest && <p className="text-xs text-muted-foreground">Digest: {error.digest}</p>}
      <div className="flex flex-wrap justify-center gap-3"><Button onClick={reset}>Tentar novamente</Button><Button variant="outline" asChild><Link href="/diagnostics">Voltar aos testes</Link></Button></div>
    </main>
  );
}
