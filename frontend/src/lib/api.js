const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

async function request(caminho, opcoes = {}) {
  let resposta;
  try {
    resposta = await fetch(`${API_URL}${caminho}`, {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      ...opcoes,
    });
  } catch {
    throw new Error("Não foi possível conectar à API. Verifique se o back-end está rodando na porta 3001.");
  }

  const dados = await resposta.json().catch(() => ({}));
  if (!resposta.ok) {
    const erro = new Error(dados.mensagem || "Ocorreu um erro inesperado.");
    erro.erros = dados.erros || [];
    erro.status = resposta.status;
    throw erro;
  }
  return dados;
}

export function listarCampeonatos(filtros = {}) {
  const params = new URLSearchParams();
  Object.entries(filtros).forEach(([chave, valor]) => {
    if (valor) params.append(chave, valor);
  });
  const query = params.toString();
  return request(`/campeonatos${query ? `?${query}` : ""}`);
}

export function buscarCampeonato(id) {
  return request(`/campeonatos/${id}`);
}

export function criarCampeonato(dados) {
  return request("/campeonatos", { method: "POST", body: JSON.stringify(dados) });
}

export function atualizarCampeonato(id, dados) {
  return request(`/campeonatos/${id}`, { method: "PUT", body: JSON.stringify(dados) });
}

export function excluirCampeonato(id) {
  return request(`/campeonatos/${id}`, { method: "DELETE" });
}
