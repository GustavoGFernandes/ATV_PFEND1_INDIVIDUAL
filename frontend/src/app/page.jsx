"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { listarCampeonatos } from "@/lib/api";
import { JOGOS, formatarData } from "@/lib/constantes";
import IndicadorCarregamento from "@/components/IndicadorCarregamento";
import MensagemErro from "@/components/MensagemErro";
import SeloStatus from "@/components/SeloStatus";
import SeloJogo from "@/components/SeloJogo";

export default function Painel() {
  const [campeonatos, setCampeonatos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  async function carregar() {
    setCarregando(true);
    setErro("");
    try {
      setCampeonatos(await listarCampeonatos());
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  const mundiais = campeonatos.filter((c) => c.abrangencia === "Mundial").length;
  const regionais = campeonatos.filter((c) => c.abrangencia === "Regional").length;
  const ativos = campeonatos.filter((c) => c.status === "Inscrições abertas" || c.status === "Em andamento");

  const destaque = ativos.length
    ? [...ativos].sort((a, b) => a.dataInicio.localeCompare(b.dataInicio)).slice(0, 6)
    : campeonatos.slice(0, 6);

  return (
    <>
      <section className="mb-4 banner-painel">
        <h1 className="fw-bold mb-2 titulo-banner">Painel de campeonatos</h1>
        <p className="text-body-secondary mb-3 texto-banner">
          Organize os torneios de Valorant, CS:GO, League of Legends, Rainbow Six Siege e Free Fire em um só lugar.
        </p>
        <Link href="/campeonatos/novo" className="btn botao-destaque">+ Novo campeonato</Link>
      </section>

      {carregando && <IndicadorCarregamento />}
      {erro && <MensagemErro mensagem={erro} onTentarNovamente={carregar} />}

      {!carregando && !erro && (
        <>
          <div className="row g-3 mb-4 grade-estatisticas">
            {[
              { rotulo: "Campeonatos", valor: campeonatos.length, href: "/campeonatos" },
              { rotulo: "Mundiais", valor: mundiais, href: "/campeonatos?abrangencia=Mundial" },
              { rotulo: "Regionais", valor: regionais, href: "/campeonatos?abrangencia=Regional" },
              { rotulo: "Ativos", valor: ativos.length, href: "/campeonatos" },
            ].map((item) => (
              <div className="col-6 col-lg-3" key={item.rotulo}>
                <Link href={item.href} className="card h-100 text-decoration-none card-estatistica">
                  <div className="card-body">
                    <div className="small text-body-secondary rotulo-estatistica">{item.rotulo}</div>
                    <div className="fs-4 fw-bold valor-estatistica">{item.valor}</div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          <h2 className="h5 mb-3 titulo-secao">Por jogo</h2>
          <div className="row g-3 mb-4 grade-jogos">
            {Object.entries(JOGOS).map(([jogo, info]) => (
              <div className="col-6 col-md-4 col-xl" key={jogo}>
                <Link
                  href={`/campeonatos?jogo=${encodeURIComponent(jogo)}`}
                  className="card h-100 text-decoration-none card-jogo"
                  style={{ borderTopColor: info.cor }}
                >
                  <div className="card-body">
                    <div className="font-monospace fw-bold fs-4 sigla-jogo" style={{ color: info.cor }}>{info.sigla}</div>
                    <div className="fw-semibold nome-jogo">{jogo}</div>
                    <div className="small text-body-secondary quantidade-jogo">
                      {campeonatos.filter((c) => c.jogo === jogo).length} campeonato(s)
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          <h2 className="h5 mb-3 titulo-secao">{ativos.length ? "Próximos e em andamento" : "Mais recentes"}</h2>
          {destaque.length === 0 ? (
            <p className="text-body-secondary">Nenhum campeonato cadastrado.</p>
          ) : (
            <div className="list-group lista-destaques">
              {destaque.map((c) => (
                <Link key={c.id} href={`/campeonatos/${c.id}`} className="list-group-item list-group-item-action d-flex flex-wrap align-items-center gap-2 item-destaque">
                  <SeloJogo jogo={c.jogo} />
                  <span className="fw-semibold nome-item-destaque">{c.nome}</span>
                  <span className="small text-body-secondary regiao-item-destaque">{c.abrangencia} · {c.regiao}</span>
                  <span className="small text-body-secondary ms-md-auto datas-item-destaque">
                    {formatarData(c.dataInicio)} – {formatarData(c.dataFim)}
                  </span>
                  <SeloStatus status={c.status} />
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
}
