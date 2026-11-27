'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';

export function SentryInit() {
  useEffect(() => {
    Sentry.setTag('application', 'ppw-portal');
    Sentry.setContext('portal', {
      modulos: ['devolucoes-trocas', 'chamados'],
      origem: 'app-router',
    });
  }, []);

  return null;
}
