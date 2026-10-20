"use client";

import { useRouter } from "next/navigation";
import { criarCampeonato } from "@/lib/api";
import { useMensagens } from "@/components/ProvedorMensagens";
import FormularioCampeonato from "@/components/FormularioCampeonato";

export default function NovoCampeonatoPage() {
  const router = useRouter();
  const mostrarMensagem = useMensagens();

  async function salvar(dados) {
    const criado = await criarCampeonato(dados);
    mostrarMensagem(`Campeonato "${criado.nome}" cadastrado com sucesso!`);
    router.push("/campeonatos");
  }

  return (
    <div className="mx-auto pagina-estreita">
      <h1 className="h3 fw-bold mb-1 titulo-pagina">Novo campeonato</h1>
      <p className="text-body-secondary mb-4 subtitulo-pagina">Campos marcados com * são obrigatórios.</p>
      <FormularioCampeonato textoBotao="Cadastrar" onSubmit={salvar} />
    </div>
  );
}
