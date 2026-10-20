import { STATUS } from "@/lib/constantes";

export default function SeloStatus({ status }) {
  return <span className={`badge rounded-pill text-bg-${STATUS[status] || "secondary"} selo-status`}>{status}</span>;
}
