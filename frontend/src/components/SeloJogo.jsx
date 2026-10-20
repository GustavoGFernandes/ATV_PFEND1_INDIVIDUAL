import { JOGOS } from "@/lib/constantes";

export default function SeloJogo({ jogo }) {
  const info = JOGOS[jogo] || { sigla: "?", cor: "#888" };
  return (
    <span className="d-inline-flex align-items-center gap-1 rounded-pill small selo-jogo" style={{ color: info.cor }}>
      <strong className="font-monospace sigla-selo-jogo">{info.sigla}</strong> {jogo}
    </span>
  );
}
