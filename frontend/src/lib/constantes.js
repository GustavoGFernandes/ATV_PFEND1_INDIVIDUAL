export const JOGOS = {
  Valorant: { sigla: "VAL", cor: "#ff4655", modalidade: "5v5 · PC" },
  "CS:GO": { sigla: "CS", cor: "#f39c12", modalidade: "5v5 · PC" },
  "League of Legends": { sigla: "LoL", cor: "#0ac8b9", modalidade: "5v5 · PC" },
  "Rainbow Six Siege": { sigla: "R6", cor: "#7c8cff", modalidade: "5v5 · PC/Console" },
  "Free Fire": { sigla: "FF", cor: "#ffd23f", modalidade: "Squad 4 · Mobile" },
};

export const FORMATOS = [
  "Eliminação simples",
  "Dupla eliminação",
  "Pontos corridos",
  "Fase de grupos + mata-mata",
  "Sistema suíço + playoffs",
  "Liga + playoffs",
];

export const ABRANGENCIAS = ["Mundial", "Regional"];

export const REGIOES = [
  "Internacional",
  "Américas",
  "América do Norte",
  "Brasil",
  "Europa / EMEA",
  "Coreia do Sul",
  "China",
  "Ásia-Pacífico",
];

export const MOEDAS = ["BRL", "USD", "EUR"];

export const STATUS = {
  "Inscrições abertas": "success",
  "Em andamento": "primary",
  Finalizado: "secondary",
  Cancelado: "danger",
};

export function formatarData(data) {
  if (!data) return "-";
  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano}`;
}

export function formatarMoeda(valor, moeda = "BRL") {
  if (valor === null || valor === undefined) return "Não divulgada";
  return Number(valor).toLocaleString("pt-BR", { style: "currency", currency: moeda, maximumFractionDigits: 0 });
}
