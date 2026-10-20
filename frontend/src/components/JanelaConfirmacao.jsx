"use client";

export default function JanelaConfirmacao({ aberto, titulo, mensagem, carregando, onConfirmar, onCancelar }) {
  if (!aberto) return null;

  return (
    <>
      <div className="modal d-block janela-confirmacao" tabIndex="-1" role="dialog" onClick={onCancelar}>
        <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{titulo}</h5>
              <button type="button" className="btn-close" aria-label="Fechar" onClick={onCancelar} />
            </div>
            <div className="modal-body">{mensagem}</div>
            <div className="modal-footer">
              <button className="btn btn-outline-secondary" onClick={onCancelar} disabled={carregando}>
                Cancelar
              </button>
              <button className="btn btn-danger botao-excluir" onClick={onConfirmar} disabled={carregando}>
                {carregando ? "Excluindo..." : "Excluir"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop show" />
    </>
  );
}
