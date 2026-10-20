"use client";

import { createContext, useCallback, useContext, useState } from "react";

const MensagensContext = createContext(null);

export function ProvedorMensagens({ children }) {
  const [mensagens, setMensagens] = useState([]);

  const remover = useCallback((id) => {
    setMensagens((atuais) => atuais.filter((m) => m.id !== id));
  }, []);

  const mostrar = useCallback(
    (texto, tipo = "sucesso") => {
      const id = Date.now() + Math.random();
      setMensagens((atuais) => [...atuais, { id, texto, tipo }]);
      setTimeout(() => remover(id), 4000);
    },
    [remover]
  );

  return (
    <MensagensContext.Provider value={mostrar}>
      {children}
      <div className="toast-container position-fixed top-0 end-0 p-3 mt-5 area-mensagens" aria-live="polite">
        {mensagens.map((m) => (
          <div
            key={m.id}
            className={`alert alert-${m.tipo === "erro" ? "danger" : "success"} d-flex align-items-center shadow mb-2 aviso`}
            role="alert"
          >
            <span className="me-3">{m.texto}</span>
            <button type="button" className="btn-close ms-auto" aria-label="Fechar" onClick={() => remover(m.id)} />
          </div>
        ))}
      </div>
    </MensagensContext.Provider>
  );
}

export function useMensagens() {
  return useContext(MensagensContext);
}
