"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { buscarCampeonato, excluirCampeonato } from "@/lib/api";
import { JOGOS, formatarData, formatarMoeda } from "@/lib/constantes";
import { useMensagens } from "@/components/ProvedorMensagens";
import SeloJogo from "@/components/SeloJogo";
import SeloStatus from "@/components/SeloStatus";
import JanelaConfirmacao from "@/components/JanelaConfirmacao";
import IndicadorCarregamento from "@/components/IndicadorCarregamento";
import MensagemErro from "@/components/MensagemErro";

export default function DetalhesCampeonatoPage() {
  const { id } = useParams();
  const router = useRouter();
  const mostrarMensagem = useMensagens();
  const [campeonato, setCampeonato] = useState(null);
  const [erro, setErro] = useState("");
  const [confirmando, setConfirmando] = useState(false);
  const [excluindo, setExcluindo] = useState(false);

  useEffect(() => {
    buscarCampeonato(id).then(setCampeonato).catch((e) => setErro(e.message));
  }, [id]);

  async function excluir() {
    setExcluindo(true);
    try {
      await excluirCampeonato(id);
      mostrarMensagem(`Campeonato "${campeonato.nome}" excluído com sucesso.`);
      router.push("/campeonatos");
    } catch (e) {
      mostrarMensagem(e.message, "erro");
      setExcluindo(false);
      setConfirmando(false);
    }
  }

  if (erro) {
    return (
      <>
        <MensagemErro mensagem={erro} />
        <Link href="/campeonatos" className="btn btn-outline-light botao-voltar">Voltar para a lista</Link>
      </>
    );
  }
  if (!campeonato) return <IndicadorCarregamento />;

  const info = JOGOS[campeonato.jogo];
  const detalhes = [
    ["Jogo", campeonato.jogo],
    ["Modalidade", info?.modalidade],
    ["Abrangência", campeonato.abrangencia],
    ["Região", campeonato.regiao],
    ["Local", campeonato.local || "A definir"],
    ["Formato", campeonato.formato],
    ["Início", formatarData(campeonato.dataInicio)],
    ["Término", formatarData(campeonato.dataFim)],
    ["Máx. de equipes", campeonato.maxEquipes],
    ["Premiação", formatarMoeda(campeonato.premiacao, campeonato.moeda)],
    ["Organizador", campeonato.organizador],
    ["Status", campeonato.status],
  ];

  return (
    <div className="mx-auto pagina-estreita">
      <Link href="/campeonatos" className="small text-body-secondary text-decoration-none link-voltar">← Voltar para campeonatos</Link>

      <div className="card mt-3 card-detalhes-campeonato" style={{ "--cor-jogo": info?.cor }}>
        <div className="card-body p-3 p-md-4">
          <div className="d-flex flex-wrap gap-2 mb-2 selos-detalhes">
            <SeloJogo jogo={campeonato.jogo} />
            <SeloStatus status={campeonato.status} />
          </div>
          <h1 className="h3 fw-bold nome-detalhes">{campeonato.nome}</h1>

          <div className="row g-3 my-2 grade-detalhes">
            {detalhes.map(([rotulo, valor]) => (
              <div className="col-6 col-md-3 item-detalhe" key={rotulo}>
                <div className="small text-body-secondary rotulo-detalhe">{rotulo}</div>
                <div className="fw-semibold valor-detalhe">{valor}</div>
              </div>
            ))}
          </div>

          <h2 className="h6 mt-4 titulo-descricao">Descrição / regras</h2>
          <p className="text-body-secondary mb-4 texto-descricao">{campeonato.descricao || "Nenhuma descrição informada."}</p>

          <div className="d-flex flex-column flex-sm-row gap-2 acoes-detalhes">
            <Link href={`/campeonatos/${id}/editar`} className="btn botao-destaque botao-editar">Editar</Link>
            <button className="btn btn-outline-danger botao-excluir" onClick={() => setConfirmando(true)}>Excluir</button>
          </div>
        </div>
      </div>

      <JanelaConfirmacao
        aberto={confirmando}
        titulo="Excluir campeonato"
        mensagem={<>Tem certeza que deseja excluir <strong>{campeonato.nome}</strong>? Esta ação não pode ser desfeita.</>}
        carregando={excluindo}
        onConfirmar={excluir}
        onCancelar={() => !excluindo && setConfirmando(false)}
      />
    </div>
  );
}
