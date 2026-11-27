import Link from 'next/link';
import { DiagnosticsPanel } from '@/components/monitoring/DiagnosticsPanel';

export const metadata = {
  title: 'Diagnóstico de erros | PPW Portal',
  description: 'Cenários locais para validar error boundaries e eventos do GlitchTip.',
};

export default function DiagnosticsPage() {
  return (
    <main className="container mx-auto max-w-4xl space-y-8 px-4 py-10 sm:px-6">
      <header className="space-y-3">
        <p className="text-xs font-bold uppercase tracking-widest text-primary">Observabilidade • ambiente local</p>
        <h1 className="text-3xl font-black tracking-tight">Painel de diagnóstico</h1>
        <p className="max-w-2xl text-muted-foreground">Dispare falhas controladas para verificar os limites visuais e a chegada dos eventos ao GlitchTip.</p>
      </header>
      <DiagnosticsPanel />
      <section className="rounded-xl border border-border p-5">
        <h2 className="font-semibold">2. Falha de Server Component</h2>
        <p className="mt-1 text-sm text-muted-foreground">A rota seguinte lança uma exceção no servidor, simulando indisponibilidade ao consultar solicitações de devolução.</p>
        <Link className="mt-4 inline-flex min-h-11 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground" href="/diagnostics/server-failure">Simular falha de banco</Link>
      </section>
      <p className="text-xs text-muted-foreground">Use somente em desenvolvimento. O painel não altera dados de chamados ou devoluções. <Link className="underline" href="/">Voltar ao portal</Link></p>
    </main>
  );
}
