"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const LINKS = [
  { href: "/", rotulo: "Painel" },
  { href: "/campeonatos", rotulo: "Campeonatos" },
  { href: "/campeonatos/novo", rotulo: "Novo campeonato" },
];

export default function BarraNavegacao() {
  const pathname = usePathname();
  const [aberto, setAberto] = useState(false);

  return (
    <nav className="navbar navbar-expand-md sticky-top barra-navegacao">
      <div className="container">
        <Link href="/" className="navbar-brand fw-bold logo" onClick={() => setAberto(false)}>
          <span className="icone-logo">⚔</span> Arena<span className="texto-destaque">Hub</span>
        </Link>
        <button
          className="navbar-toggler botao-menu"
          type="button"
          aria-label="Abrir menu"
          aria-expanded={aberto}
          onClick={() => setAberto(!aberto)}
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className={`collapse navbar-collapse ${aberto ? "show" : ""}`}>
          <ul className="navbar-nav ms-auto links-navegacao">
            {LINKS.map((link) => (
              <li className="nav-item" key={link.href}>
                <Link
                  href={link.href}
                  className={`nav-link link-navegacao ${pathname === link.href ? "active link-navegacao-ativo" : ""}`}
                  onClick={() => setAberto(false)}
                >
                  {link.rotulo}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
