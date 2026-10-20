"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { excluirCampeonato, listarCampeonatos } from "@/lib/api";
import { ABRANGENCIAS, JOGOS, REGIOES, STATUS } from "@/lib/constantes";
import { useMensagens } from "@/components/ProvedorMensagens";
import CardCampeonato from "@/components/CardCampeonato";
import JanelaConfirmacao from "@/components/JanelaConfirmacao";
import IndicadorCarregamento from "@/components/IndicadorCarregamento";
import MensagemErro from "@/components/MensagemErro";

const FILTROS_VAZIOS = { busca: "", jogo: "", status: "", abrangencia: "", regiao: "" };

function ListaCampeonatos() {
  const searchParams = useSearchParams();
  const mostrarMensagem = useMensagens();

  const [filtros, setFiltros] = useState({
    ...FILTROS_VAZIOS,
    jogo: searchParams.get("jogo") || "",
    abrangencia: searchParams.get("abrangencia") || "",
  });
  const [campeonatos, setCampeonatos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [paraExcluir, setParaExcluir] = useState(null);
  const [excluindo, setExcluindo] = useState(false);

  async function carregar(f = filtros) {
    setCarregando(true);
    setErro("");
    try {
      setCampeonatos(await listarCampeonatos(f));
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => carregar(filtros), 250);
    return () => clearTimeout(timer);
  }, [filtros]);

  function alterarFiltro(e) {
    setFiltros((atual) => ({ ...atual, [e.target.name]: e.target.value }));
  }

  async function confirmarExclusao() {
    setExcluindo(true);
    try {
      await excluirCampeonato(paraExcluir.id);
      mostrarMensagem(`Campeonato "${paraExcluir.nome}" excluído com sucesso.`);
      setParaExcluir(null);
      carregar();
    } catch (e) {
      mostrarMensagem(e.message, "erro");
    } finally {
      setExcluindo(false);
    }
  }

  const temFiltro = Object.values(filtros).some(Boolean);

  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3 cabecalho-pagina">
        <h1 className="h3 fw-bold mb-0 titulo-pagina">Campeonatos</h1>
        <Link href="/campeonatos/novo" className="btn botao-destaque">+ Novo campeonato</Link>
      </div>

      <div className="card mb-4 card-filtros">
        <div className="card-body row g-2">
          <div className="col-12 col-lg-3">
            <input
              type="search"
              name="busca"
              className="form-control campo-busca"
              placeholder="Buscar por nome, organizador ou local..."
              aria-label="Buscar"
              value={filtros.busca}
              onChange={alterarFiltro}
            />
          </div>
          <div className="col-6 col-md-3 col-lg-2">
            <select name="jogo" className="form-select campo-filtro" aria-label="Filtrar por jogo" value={filtros.jogo} onChange={alterarFiltro}>
              <option value="">Todos os jogos</option>
              {Object.keys(JOGOS).map((j) => (
                <option key={j} value={j}>{j}</option>
              ))}
            </select>
          </div>
          <div className="col-6 col-md-3 col-lg-2">
            <select name="abrangencia" className="form-select campo-filtro" aria-label="Filtrar por abrangência" value={filtros.abrangencia} onChange={alterarFiltro}>
              <option value="">Mundial e regional</option>
              {ABRANGENCIAS.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>
          <div className="col-6 col-md-3 col-lg-2">
            <select name="regiao" className="form-select campo-filtro" aria-label="Filtrar por região" value={filtros.regiao} onChange={alterarFiltro}>
              <option value="">Todas as regiões</option>
              {REGIOES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
          <div className="col-6 col-md-3 col-lg-2">
            <select name="status" className="form-select campo-filtro" aria-label="Filtrar por status" value={filtros.status} onChange={alterarFiltro}>
              <option value="">Todos os status</option>
              {Object.keys(STATUS).map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="col-12 col-lg-1 d-grid">
            <button className="btn btn-outline-secondary botao-limpar" disabled={!temFiltro} onClick={() => setFiltros(FILTROS_VAZIOS)}>
              Limpar
            </button>
          </div>
        </div>
      </div>

      {erro && <MensagemErro mensagem={erro} onTentarNovamente={() => carregar()} />}
      {carregando && !erro && <IndicadorCarregamento />}

      {!carregando && !erro && campeonatos.length === 0 && (
        <div className="text-center py-5 text-body-secondary lista-vazia">
          <p className="mb-3">{temFiltro ? "Nenhum campeonato encontrado com esses filtros." : "Nenhum campeonato cadastrado ainda."}</p>
          {!temFiltro && <Link href="/campeonatos/novo" className="btn botao-destaque">Cadastrar o primeiro</Link>}
        </div>
      )}

      {!carregando && !erro && campeonatos.length > 0 && (
        <>
          <p className="small text-body-secondary contador-resultados">{campeonatos.length} campeonato(s) encontrado(s)</p>
          <div className="row g-3 grade-campeonatos">
            {campeonatos.map((c) => (
              <div className="col-12 col-md-6 col-xl-4" key={c.id}>
                <CardCampeonato campeonato={c} onExcluir={setParaExcluir} />
              </div>
            ))}
          </div>
        </>
      )}

      <JanelaConfirmacao
        aberto={Boolean(paraExcluir)}
        titulo="Excluir campeonato"
        mensagem={paraExcluir && <>Tem certeza que deseja excluir <strong>{paraExcluir.nome}</strong>? Esta ação não pode ser desfeita.</>}
        carregando={excluindo}
        onConfirmar={confirmarExclusao}
        onCancelar={() => !excluindo && setParaExcluir(null)}
      />
    </>
  );
}

export default function CampeonatosPage() {
  return (
    <Suspense fallback={<IndicadorCarregamento />}>
      <ListaCampeonatos />
    </Suspense>
  );
}
