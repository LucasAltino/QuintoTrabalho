'use client';

import { useState } from 'react';
import * as Sentry from '@sentry/nextjs';
import { Button } from '@/components/ui/button';

export function DiagnosticsPanel() {
  const [shouldThrow, setShouldThrow] = useState(false);
  const [message, setMessage] = useState('');

  if (shouldThrow) {
    throw new Error('Falha ao processar formulário no client');
  }

  async function simulateAsyncFailure() {
    try {
      await Promise.reject(new Error('Falha assíncrona ao validar solicitação de troca'));
    } catch (error) {
      Sentry.withScope((scope) => {
        scope.setTag('feature', 'returns');
        scope.setContext('teste', { tipo: 'async-client', recurso: 'solicitacao-de-troca' });
        Sentry.captureException(error);
      });
      setMessage('Falha assíncrona enviada ao GlitchTip. Confira o evento no painel.');
    }
  }

  return (
    <section className="grid gap-4 md:grid-cols-2">
      <article className="space-y-3 rounded-xl border border-border p-5">
        <h2 className="font-semibold">1. Erro de renderização Client-side</h2>
        <p className="text-sm text-muted-foreground">Força uma exceção durante a renderização e abre este error boundary. Use “Tentar novamente” para exercitar reset().</p>
        <Button className="min-h-11" onClick={() => setShouldThrow(true)}>Forçar erro de formulário</Button>
      </article>
      <article className="space-y-3 rounded-xl border border-border p-5">
        <h2 className="font-semibold">3. Erro assíncrono controlado</h2>
        <p className="text-sm text-muted-foreground">Simula falha na validação de uma solicitação e captura a exceção com contexto de negócio.</p>
        <Button variant="outline" className="min-h-11" onClick={simulateAsyncFailure}>Simular validação indisponível</Button>
        {message && <p role="status" className="text-sm text-emerald-700">{message}</p>}
      </article>
    </section>
  );
}
