export default function MensagemErro({ mensagem, onTentarNovamente }) {
  return (
    <div className="alert alert-danger d-flex flex-wrap align-items-center gap-2 mensagem-erro" role="alert">
      <span>{mensagem}</span>
      {onTentarNovamente && (
        <button className="btn btn-sm btn-outline-light ms-auto botao-tentar-novamente" onClick={onTentarNovamente}>
          Tentar novamente
        </button>
      )}
    </div>
  );
}
