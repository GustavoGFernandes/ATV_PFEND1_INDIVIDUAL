import Link from "next/link";

export default function NotFound() {
  return (
    <div className="text-center py-5 pagina-nao-encontrada">
      <h1 className="display-5 fw-bold codigo-erro">404</h1>
      <p className="text-body-secondary">Página não encontrada.</p>
      <Link href="/" className="btn botao-destaque">Voltar ao painel</Link>
    </div>
  );
}
