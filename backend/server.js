const express = require("express");
const cors = require("cors");
const campeonatosIniciais = require("./data/campeonatos");
const { JOGOS, FORMATOS, STATUS, ABRANGENCIAS, REGIOES, MOEDAS } = require("./data/opcoes");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

let campeonatos = campeonatosIniciais.map((c) => ({ ...c }));
let proximoId = Math.max(0, ...campeonatos.map((c) => c.id)) + 1;

function texto(valor) {
  return typeof valor === "string" ? valor.trim() : "";
}

function validarCampeonato(dados) {
  const erros = [];
  const nome = texto(dados.nome);
  const organizador = texto(dados.organizador);
  const local = texto(dados.local);

  if (nome.length < 3) erros.push("O nome deve ter pelo menos 3 caracteres.");
  if (!JOGOS.includes(dados.jogo)) erros.push("Selecione um jogo válido.");
  if (!FORMATOS.includes(dados.formato)) erros.push("Selecione um formato válido.");
  if (!STATUS.includes(dados.status)) erros.push("Selecione um status válido.");
  if (organizador.length < 2) erros.push("Informe o organizador.");
  if (local.length > 100) erros.push("O local deve ter no máximo 100 caracteres.");

  if (!ABRANGENCIAS.includes(dados.abrangencia)) erros.push("Selecione a abrangência (Mundial ou Regional).");
  if (!REGIOES.includes(dados.regiao)) erros.push("Selecione uma região válida.");
  if (dados.abrangencia === "Mundial" && dados.regiao !== "Internacional") {
    erros.push("Campeonatos mundiais devem ter a região Internacional.");
  }
  if (dados.abrangencia === "Regional" && dados.regiao === "Internacional") {
    erros.push("Campeonatos regionais precisam de uma região específica.");
  }

  const dataRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dataRegex.test(dados.dataInicio || "")) erros.push("Informe a data de início.");
  if (!dataRegex.test(dados.dataFim || "")) erros.push("Informe a data de término.");
  if (dataRegex.test(dados.dataInicio || "") && dataRegex.test(dados.dataFim || "") && dados.dataFim < dados.dataInicio) {
    erros.push("A data de término não pode ser anterior à data de início.");
  }

  const maxEquipes = Number(dados.maxEquipes);
  if (!Number.isInteger(maxEquipes) || maxEquipes < 2 || maxEquipes > 128) {
    erros.push("O número de equipes deve ser um inteiro entre 2 e 128.");
  }

  const semPremiacao = dados.premiacao === "" || dados.premiacao === null || dados.premiacao === undefined;
  const premiacao = semPremiacao ? null : Number(dados.premiacao);
  if (!semPremiacao && (Number.isNaN(premiacao) || premiacao < 0)) {
    erros.push("A premiação deve ser um valor maior ou igual a zero.");
  }
  const moeda = dados.moeda || "BRL";
  if (!MOEDAS.includes(moeda)) erros.push("Selecione uma moeda válida.");

  return {
    erros,
    campeonato: {
      nome,
      jogo: dados.jogo,
      abrangencia: dados.abrangencia,
      regiao: dados.regiao,
      local,
      formato: dados.formato,
      status: dados.status,
      dataInicio: dados.dataInicio,
      dataFim: dados.dataFim,
      maxEquipes,
      premiacao,
      moeda,
      organizador,
      descricao: texto(dados.descricao),
    },
  };
}

function buscarPorId(req, res) {
  const campeonato = campeonatos.find((c) => c.id === Number(req.params.id));
  if (!campeonato) {
    res.status(404).json({ mensagem: "Campeonato não encontrado." });
    return null;
  }
  return campeonato;
}

app.get("/", (req, res) => {
  res.json({ mensagem: "API de campeonatos funcionando.", total: campeonatos.length });
});

app.get("/opcoes", (req, res) => {
  res.json({ jogos: JOGOS, formatos: FORMATOS, status: STATUS, abrangencias: ABRANGENCIAS, regioes: REGIOES, moedas: MOEDAS });
});

app.get("/campeonatos", (req, res) => {
  const { jogo, status, abrangencia, regiao, busca } = req.query;
  let resultado = campeonatos;

  if (jogo) resultado = resultado.filter((c) => c.jogo === jogo);
  if (status) resultado = resultado.filter((c) => c.status === status);
  if (abrangencia) resultado = resultado.filter((c) => c.abrangencia === abrangencia);
  if (regiao) resultado = resultado.filter((c) => c.regiao === regiao);
  if (busca) {
    const termo = busca.toLowerCase();
    resultado = resultado.filter((c) =>
      [c.nome, c.organizador, c.local].some((campo) => campo.toLowerCase().includes(termo))
    );
  }

  res.json([...resultado].sort((a, b) => b.dataInicio.localeCompare(a.dataInicio)));
});

app.get("/campeonatos/:id", (req, res) => {
  const campeonato = buscarPorId(req, res);
  if (campeonato) res.json(campeonato);
});

app.post("/campeonatos", (req, res) => {
  const { erros, campeonato } = validarCampeonato(req.body || {});
  if (erros.length) return res.status(400).json({ mensagem: "Dados inválidos.", erros });

  const novo = { id: proximoId++, ...campeonato };
  campeonatos.push(novo);
  res.status(201).json(novo);
});

app.put("/campeonatos/:id", (req, res) => {
  const existente = buscarPorId(req, res);
  if (!existente) return;

  const { erros, campeonato } = validarCampeonato(req.body || {});
  if (erros.length) return res.status(400).json({ mensagem: "Dados inválidos.", erros });

  Object.assign(existente, campeonato);
  res.json(existente);
});

app.delete("/campeonatos/:id", (req, res) => {
  const existente = buscarPorId(req, res);
  if (!existente) return;

  campeonatos = campeonatos.filter((c) => c.id !== existente.id);
  res.json({ mensagem: "Campeonato excluído com sucesso." });
});

app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT} com ${campeonatos.length} campeonatos carregados`);
});
