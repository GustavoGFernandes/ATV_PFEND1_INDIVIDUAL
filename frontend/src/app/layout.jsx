import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import BarraNavegacao from "@/components/BarraNavegacao";
import { ProvedorMensagens } from "@/components/ProvedorMensagens";

export const metadata = {
  title: "ArenaHub · Campeonatos de eSports",
  description: "Gerenciador de campeonatos de Valorant, CS:GO, League of Legends, Rainbow Six Siege e Free Fire.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" data-bs-theme="dark">
      <body className="d-flex flex-column min-vh-100">
        <ProvedorMensagens>
          <BarraNavegacao />
          <main className="container py-4 flex-grow-1 conteudo-principal">{children}</main>
          <footer className="text-center small text-body-secondary py-3 rodape">ArenaHub · Gerenciador de campeonatos de jogos online</footer>
        </ProvedorMensagens>
      </body>
    </html>
  );
}
