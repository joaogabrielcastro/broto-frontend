import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs"; // Import dayjs for date formatting
import "dayjs/locale/pt-br"; // Import locale for pt-br format

dayjs.locale("pt-br"); // Set locale

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

const SituacaoAtual = () => {
  const [viagens, setViagens] = useState([]);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  // const [modalConfirmacao, setModalConfirmacao] = useState({ aberto: false, placa: null }); // REMOVIDO
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarViagens();
  }, []);

  const carregarViagens = () => {
    setLoading(true);
    setMensagem("");
    setErro("");
    axios.get(`${API_BASE_URL}/situacao-atual-caminhoes`)
      .then(res => {
        const rawData = Array.isArray(res.data) ? res.data : []; 
        const validViagens = rawData.filter(v => v && v.placa && v.inicio && v.status);
        setViagens(validViagens);

        if (validViagens.length === 0) {
          setMensagem("Nenhum caminhão está em viagem no momento.");
        }
      })
      .catch(err => {
        console.error("Erro ao carregar situação atual:", err);
        setErro("Erro ao carregar a situação atual. Tente novamente mais tarde.");
        setViagens([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // handleFinalizarViagem e confirmarFinalizarViagem REMOVIDOS
  // const handleFinalizarViagem = (placa) => { ... };
  // const confirmarFinalizarViagem = async () => { ... };

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-900 font-inter py-8">
      <div className="max-w-4xl w-full p-8 bg-neutral-800 rounded-lg shadow-2xl border border-red-700">
        <h2 className="text-3xl font-bold mb-8 text-red-500 text-center">Situação Atual dos Caminhões</h2>

        {mensagem && (
          <p className="mb-6 text-center text-green-400 bg-green-900 bg-opacity-30 border border-green-700 rounded-md p-3">
            {mensagem}
          </p>
        )}
        {erro && (
          <p className="mb-6 text-center text-red-400 bg-red-900 bg-opacity-30 border border-red-700 rounded-md p-3">
            {erro}
          </p>
        )}

        {loading ? (
          <p className="text-center text-gray-400 mt-6">Carregando situação atual...</p>
        ) : viagens.length > 0 ? (
          <div className="grid gap-6 max-h-96 overflow-y-auto pr-2">
            {viagens.map((v, i) => {
              const inicioDayjs = v.inicio ? dayjs(v.inicio) : null;
              const inicioFormatado = inicioDayjs && inicioDayjs.isValid() ? inicioDayjs.format("DD/MM/YYYY") : "Data inválida ou ausente";
              const dias = inicioDayjs && inicioDayjs.isValid() ? dayjs().diff(inicioDayjs, "day") : "N/A";

              return (
                <div 
                  key={v.placa || `situacao-${i}`}
                  className="bg-neutral-700 shadow-xl p-6 rounded-lg border-l-8 border-red-600 text-gray-100 flex flex-col md:flex-row md:justify-between md:items-center transform hover:scale-102 transition duration-300"
                >
                  <div className="mb-4 md:mb-0">
                    <p className="text-2xl font-bold text-red-400 mb-2">🚚 Placa: {v.placa || 'N/A'}</p>
                    <p className="mb-1"><strong><span className="text-red-400">Nome Caminhão:</span></strong> {v.caminhao_nome || 'N/A'}</p>
                    <p className="mb-1"><strong><span className="text-red-400">Motorista:</span></strong> <span className="text-amber-400 font-bold">{v.motorista_nome || 'N/A'}</span></p>
                    <p className="mb-1"><strong><span className="text-red-400">Cliente:</span></strong> <span className="text-blue-400 font-bold">{v.cliente_nome || 'N/A'}</span></p>
                    <p className="mb-1"><strong className="text-red-400">Rota:</strong> {v.origem || 'N/A'} <span className="text-red-400 font-bold">➔</span> {v.destino || 'N/A'}</p>
                    <p className="mb-1"><strong className="text-red-400">Início:</strong> {inicioFormatado}</p>
                    <p className="mb-1"><span className="font-semibold text-gray-300">Dias na estrada:</span> <span className="font-bold text-amber-400">{dias} dia(s)</span></p>
                    <p>
                      <span className="font-semibold text-gray-300">Status:</span>{" "}
                      <span className="text-blue-400 font-bold">🔄 Em andamento</span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          !erro && <p className="text-center text-gray-400 mt-6">Nenhum caminhão está em viagem no momento.</p>
        )}
      </div>
    </div>
  );
};

export default SituacaoAtual;
