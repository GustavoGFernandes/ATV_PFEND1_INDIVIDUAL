export default function IndicadorCarregamento({ texto = "Carregando..." }) {
  return (
    <div className="text-center py-5 text-body-secondary indicador-carregamento">
      <div className="spinner-border texto-destaque mb-2" role="status" />
      <p className="mb-0">{texto}</p>
    </div>
  );
}
