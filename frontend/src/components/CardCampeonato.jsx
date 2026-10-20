import Link from "next/link";
import SeloJogo from "./SeloJogo";
import SeloStatus from "./SeloStatus";
import { JOGOS, formatarData, formatarMoeda } from "@/lib/constantes";

export default function CardCampeonato({ campeonato, onExcluir }) {
  const cor = JOGOS[campeonato.jogo]?.cor || "#888";

  return (
    <div className="card h-100 card-campeonato" style={{ borderLeftColor: cor }}>
      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start gap-2 mb-2 topo-card-campeonato">
          <SeloJogo jogo={campeonato.jogo} />
          <SeloStatus status={campeonato.status} />
        </div>
        <h5 className="card-title mb-1 nome-campeonato">{campeonato.nome}</h5>
        <p className="small text-body-secondary mb-3 local-campeonato">
          <span className={`badge me-1 ${campeonato.abrangencia === "Mundial" ? "text-bg-warning" : "text-bg-info"} selo-abrangencia`}>
            {campeonato.abrangencia}
          </span>
          {campeonato.regiao} · {campeonato.local || "Local a definir"}
        </p>

        <dl className="row small mb-3 g-0 informacoes-campeonato">
          <dt className="col-5 text-body-secondary fw-normal">Período</dt>
          <dd className="col-7 mb-1">
            {formatarData(campeonato.dataInicio)} – {formatarData(campeonato.dataFim)}
          </dd>
          <dt className="col-5 text-body-secondary fw-normal">Organizador</dt>
          <dd className="col-7 mb-1">{campeonato.organizador}</dd>
          <dt className="col-5 text-body-secondary fw-normal">Formato</dt>
          <dd className="col-7 mb-1">{campeonato.formato}</dd>
          <dt className="col-5 text-body-secondary fw-normal">Equipes</dt>
          <dd className="col-7 mb-1">até {campeonato.maxEquipes}</dd>
          <dt className="col-5 text-body-secondary fw-normal">Premiação</dt>
          <dd className="col-7 mb-1 fw-semibold texto-destaque valor-premiacao">
            {formatarMoeda(campeonato.premiacao, campeonato.moeda)}
          </dd>
        </dl>

        <div className="d-flex gap-2 mt-auto acoes-card-campeonato">
          <Link href={`/campeonatos/${campeonato.id}`} className="btn btn-sm btn-outline-light flex-fill botao-detalhes">
            Detalhes
          </Link>
          <Link href={`/campeonatos/${campeonato.id}/editar`} className="btn btn-sm btn-outline-primary flex-fill botao-editar">
            Editar
          </Link>
          <button className="btn btn-sm btn-outline-danger flex-fill botao-excluir" onClick={() => onExcluir(campeonato)}>
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}
