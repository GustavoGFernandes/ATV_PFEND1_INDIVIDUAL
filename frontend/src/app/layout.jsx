import { Geist, Geist_Mono } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import BarraNavegacao from "@/components/BarraNavegacao";
import { ProvedorMensagens } from "@/components/ProvedorMensagens";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "ArenaHub · Campeonatos de eSports",
  description: "Gerenciador de campeonatos de Valorant, CS:GO, League of Legends, Rainbow Six Siege e Free Fire.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" data-bs-theme="dark" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <ProvedorMensagens>
          <BarraNavegacao />
          <main className="container py-4 flex-grow-1 conteudo-principal">{children}</main>
          <footer className="text-center small py-3 rodape">ArenaHub · Gerenciador de campeonatos de jogos online</footer>
        </ProvedorMensagens>
      </body>
    </html>
  );
}
