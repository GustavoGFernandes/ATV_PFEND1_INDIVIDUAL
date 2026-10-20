"use client";

import Link from "next/link";
import { useState } from "react";
import { ABRANGENCIAS, FORMATOS, JOGOS, MOEDAS, REGIOES, STATUS } from "@/lib/constantes";

const VAZIO = {
  nome: "",
  jogo: "",
  abrangencia: "",
  regiao: "",
  local: "",
  formato: "",
  status: "Inscrições abertas",
  dataInicio: "",
  dataFim: "",
  maxEquipes: "",
  premiacao: "",
  moeda: "BRL",
  organizador: "",
  descricao: "",
};

function validar(dados) {
  const erros = {};
  if (dados.nome.trim().length < 3) erros.nome = "Informe um nome com pelo menos 3 caracteres.";
  if (!dados.jogo) erros.jogo = "Selecione o jogo.";
  if (!dados.abrangencia) erros.abrangencia = "Selecione a abrangência.";
  if (!dados.regiao) erros.regiao = "Selecione a região.";
  if (!dados.formato) erros.formato = "Selecione o formato.";
  if (!dados.status) erros.status = "Selecione o status.";
  if (dados.organizador.trim().length < 2) erros.organizador = "Informe o organizador.";
  if (!dados.dataInicio) erros.dataInicio = "Informe a data de início.";
  if (!dados.dataFim) erros.dataFim = "Informe a data de término.";
  else if (dados.dataInicio && dados.dataFim < dados.dataInicio)
    erros.dataFim = "O término não pode ser antes do início.";

  const equipes = Number(dados.maxEquipes);
  if (!Number.isInteger(equipes) || equipes < 2 || equipes > 128) erros.maxEquipes = "Use um número entre 2 e 128.";

  if (dados.premiacao !== "" && Number(dados.premiacao) < 0) erros.premiacao = "O valor não pode ser negativo.";
  return erros;
}

export default function FormularioCampeonato({ inicial, textoBotao = "Salvar", onSubmit }) {
  const [dados, setDados] = useState({ ...VAZIO, ...inicial, premiacao: inicial?.premiacao ?? "" });
  const [erros, setErros] = useState({});
  const [errosApi, setErrosApi] = useState([]);
  const [enviando, setEnviando] = useState(false);

  function alterar(e) {
    const { name, value } = e.target;
    setDados((atual) => {
      const novo = { ...atual, [name]: value };
      if (name === "abrangencia") {
        if (value === "Mundial") novo.regiao = "Internacional";
        else if (atual.regiao === "Internacional") novo.regiao = "";
      }
      return novo;
    });
    if (erros[name]) setErros((atual) => ({ ...atual, [name]: undefined }));
  }

  async function enviar(e) {
    e.preventDefault();
    setErrosApi([]);
    const novosErros = validar(dados);
    setErros(novosErros);
    if (Object.keys(novosErros).length) return;

    setEnviando(true);
    try {
      await onSubmit({
        ...dados,
        maxEquipes: Number(dados.maxEquipes),
        premiacao: dados.premiacao === "" ? null : Number(dados.premiacao),
      });
    } catch (erro) {
      setErrosApi(erro.erros?.length ? erro.erros : [erro.message]);
    } finally {
      setEnviando(false);
    }
  }

  function campo(nome, classeBootstrap = "form-control") {
    return {
      id: nome,
      name: nome,
      value: dados[nome],
      onChange: alterar,
      className: `${classeBootstrap} campo ${erros[nome] ? "is-invalid" : ""}`,
      "aria-invalid": Boolean(erros[nome]),
    };
  }

  const Erro = ({ nome }) => (erros[nome] ? <div className="invalid-feedback erro-campo">{erros[nome]}</div> : null);

  return (
    <form onSubmit={enviar} noValidate className="card card-formulario">
      <div className="card-body p-3 p-md-4">
        {errosApi.length > 0 && (
          <div className="alert alert-danger erros-formulario" role="alert">
            <strong>Não foi possível salvar:</strong>
            <ul className="mb-0 mt-1">
              {errosApi.map((msg) => (
                <li key={msg}>{msg}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="row g-3 grade-formulario">
          <div className="col-12 col-md-8 grupo-campo">
            <label htmlFor="nome" className="form-label rotulo-campo">Nome do campeonato *</label>
            <input type="text" placeholder="Ex.: Copa Spike Masters" {...campo("nome")} />
            <Erro nome="nome" />
          </div>
          <div className="col-12 col-md-4 grupo-campo">
            <label htmlFor="jogo" className="form-label rotulo-campo">Jogo *</label>
            <select {...campo("jogo", "form-select")}>
              <option value="">Selecione...</option>
              {Object.keys(JOGOS).map((jogo) => (
                <option key={jogo} value={jogo}>{jogo}</option>
              ))}
            </select>
            <Erro nome="jogo" />
            {dados.jogo && <div className="form-text dica-campo">{JOGOS[dados.jogo].modalidade}</div>}
          </div>

          <div className="col-12 col-md-4 grupo-campo">
            <label htmlFor="abrangencia" className="form-label rotulo-campo">Abrangência *</label>
            <select {...campo("abrangencia", "form-select")}>
              <option value="">Selecione...</option>
              {ABRANGENCIAS.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
            <Erro nome="abrangencia" />
          </div>
          <div className="col-12 col-md-4 grupo-campo">
            <label htmlFor="regiao" className="form-label rotulo-campo">Região *</label>
            <select disabled={dados.abrangencia === "Mundial"} {...campo("regiao", "form-select")}>
              <option value="">Selecione...</option>
              {REGIOES.filter((r) => dados.abrangencia !== "Regional" || r !== "Internacional").map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            <Erro nome="regiao" />
          </div>
          <div className="col-12 col-md-4 grupo-campo">
            <label htmlFor="local" className="form-label rotulo-campo">Local</label>
            <input type="text" maxLength={100} placeholder="Ex.: São Paulo, Brasil ou Online" {...campo("local")} />
          </div>

          <div className="col-12 col-md-6 grupo-campo">
            <label htmlFor="formato" className="form-label rotulo-campo">Formato *</label>
            <select {...campo("formato", "form-select")}>
              <option value="">Selecione...</option>
              {FORMATOS.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
            <Erro nome="formato" />
          </div>
          <div className="col-12 col-md-6 grupo-campo">
            <label htmlFor="status" className="form-label rotulo-campo">Status *</label>
            <select {...campo("status", "form-select")}>
              {Object.keys(STATUS).map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <Erro nome="status" />
          </div>

          <div className="col-6 col-md-3 grupo-campo">
            <label htmlFor="dataInicio" className="form-label rotulo-campo">Início *</label>
            <input type="date" {...campo("dataInicio")} />
            <Erro nome="dataInicio" />
          </div>
          <div className="col-6 col-md-3 grupo-campo">
            <label htmlFor="dataFim" className="form-label rotulo-campo">Término *</label>
            <input type="date" min={dados.dataInicio || undefined} {...campo("dataFim")} />
            <Erro nome="dataFim" />
          </div>
          <div className="col-6 col-md-3 grupo-campo">
            <label htmlFor="maxEquipes" className="form-label rotulo-campo">Máx. de equipes *</label>
            <input type="number" min="2" max="128" step="1" {...campo("maxEquipes")} />
            <Erro nome="maxEquipes" />
          </div>
          <div className="col-6 col-md-3 grupo-campo">
            <label htmlFor="premiacao" className="form-label rotulo-campo">Premiação</label>
            <div className="input-group has-validation campo-premiacao">
              <select className="form-select flex-grow-0 w-auto seletor-moeda" aria-label="Moeda" name="moeda" value={dados.moeda} onChange={alterar}>
                {MOEDAS.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              <input type="number" min="0" step="0.01" placeholder="Não divulgada" {...campo("premiacao")} />
              <Erro nome="premiacao" />
            </div>
          </div>

          <div className="col-12 grupo-campo">
            <label htmlFor="organizador" className="form-label rotulo-campo">Organizador *</label>
            <input type="text" placeholder="Ex.: Liga Arena BR" {...campo("organizador")} />
            <Erro nome="organizador" />
          </div>
          <div className="col-12 grupo-campo">
            <label htmlFor="descricao" className="form-label rotulo-campo">Descrição / regras</label>
            <textarea rows="3" placeholder="Informações adicionais (opcional)" {...campo("descricao")} />
          </div>
        </div>

        <div className="d-flex flex-column flex-sm-row justify-content-end gap-2 mt-4 acoes-formulario">
          <Link href="/campeonatos" className="btn btn-outline-secondary botao-cancelar">Cancelar</Link>
          <button type="submit" className="btn botao-destaque px-4" disabled={enviando}>
            {enviando ? "Salvando..." : textoBotao}
          </button>
        </div>
      </div>
    </form>
  );
}
