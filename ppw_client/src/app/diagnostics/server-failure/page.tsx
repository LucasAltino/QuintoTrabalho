export const dynamic = 'force-dynamic';

export default async function ServerFailurePage() {
  await Promise.resolve();
  throw new Error('Falha simulada: banco de dados de devoluções indisponível');
}
