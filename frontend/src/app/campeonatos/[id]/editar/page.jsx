"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { atualizarCampeonato, buscarCampeonato } from "@/lib/api";
import { useMensagens } from "@/components/ProvedorMensagens";
import FormularioCampeonato from "@/components/FormularioCampeonato";
import IndicadorCarregamento from "@/components/IndicadorCarregamento";
import MensagemErro from "@/components/MensagemErro";

export default function EditarCampeonatoPage() {
  const { id } = useParams();
  const router = useRouter();
  const mostrarMensagem = useMensagens();
  const [campeonato, setCampeonato] = useState(null);
  const [erro, setErro] = useState("");

  useEffect(() => {
    buscarCampeonato(id).then(setCampeonato).catch((e) => setErro(e.message));
  }, [id]);

  async function salvar(dados) {
    const atualizado = await atualizarCampeonato(id, dados);
    mostrarMensagem(`Campeonato "${atualizado.nome}" atualizado com sucesso!`);
    router.push(`/campeonatos/${id}`);
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

  return (
    <div className="mx-auto pagina-estreita">
      <h1 className="h3 fw-bold mb-1 titulo-pagina">Editar campeonato</h1>
      <p className="text-body-secondary mb-4 subtitulo-pagina">{campeonato.nome}</p>
      <FormularioCampeonato inicial={campeonato} textoBotao="Salvar alterações" onSubmit={salvar} />
    </div>
  );
}
