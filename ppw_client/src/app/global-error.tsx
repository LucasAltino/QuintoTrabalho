'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.withScope((scope) => {
      scope.setLevel('fatal');
      scope.setTag('boundary', 'global-error');
      Sentry.captureException(error);
    });
  }, [error]);

  return (
    <html lang="pt-BR">
      <body style={{ fontFamily: 'system-ui, sans-serif', margin: 0, minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#f8fafc', color: '#0f172a' }}>
        <main role="alert" style={{ maxWidth: 560, padding: 32, textAlign: 'center' }}>
          <h1>O portal encontrou uma falha crítica</h1>
          <p>Não foi possível manter a estrutura principal do PPW Portal. Tente recarregar a aplicação.</p>
          {error.digest && <p style={{ color: '#475569', fontSize: 12 }}>Código de diagnóstico: {error.digest}</p>}
          <button onClick={reset} style={{ minHeight: 44, padding: '0 18px', cursor: 'pointer' }}>Tentar novamente</button>
        </main>
      </body>
    </html>
  );
}
