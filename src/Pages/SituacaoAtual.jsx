import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";

dayjs.locale("pt-br");

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

const SituacaoAtual = () => {
  const [viagens, setViagens] = useState([]);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [modalConfirmacao, setModalConfirmacao] = useState({ aberto: false, placa: null });
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

  const handleFinalizarViagem = (placa) => {
    setModalConfirmacao({ aberto: true, placa });
  };

  const confirmarFinalizarViagem = async () => {
    const placa = modalConfirmacao.placa;
    setModalConfirmacao({ aberto: false, placa: null });
    setMensagem("");
    setErro("");

    try {
      const res = await axios.get(`${API_BASE_URL}/viagens-por-placa/${placa}`);
      const ultima = res.data.viagens.find(v => v.status === "Em andamento");

      if (!ultima || !ultima.id) {
        setErro(`Não foi encontrada uma viagem "Em andamento" para a placa ${placa}.`);
        carregarViagens();
        return;
      }

      await axios.patch(`${API_BASE_URL}/viagens/${ultima.id}/finalizar`, { custos: ultima.custos }); // Passa custos para o backend
      setMensagem(`Viagem do caminhão ${placa} finalizada com sucesso!`);
      carregarViagens();
    } catch (err) {
      console.error("Erro ao finalizar viagem:", err);
      setErro(err.response?.data?.erro || `Erro ao finalizar a viagem do caminhão ${placa}. Tente novamente.`);
    }
  };

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
              // CORREÇÃO AQUI: Formatação da data de início para DD/MM/AAAA
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
                  <button
                    onClick={() => handleFinalizarViagem(v.placa)}
                    className="bg-green-600 text-white font-bold py-3 px-6 rounded-md shadow-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-neutral-700 transition duration-300 transform hover:scale-105"
                  >
                    Finalizar Viagem
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          !erro && <p className="text-center text-gray-400 mt-6">Nenhum caminhão está em viagem no momento.</p>
        )}

        {/* Modal de confirmação de finalização */}
        {modalConfirmacao.aberto && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-neutral-800 p-8 rounded-lg shadow-2xl border border-red-700 max-w-sm w-full text-gray-100">
              <h2 className="text-2xl font-semibold mb-4 text-red-500">Finalizar Viagem</h2>
              <p className="mb-2">Insira os custos para calcular o lucro total:</p>
              <div className="mb-4">
                <label htmlFor="custos-finalizar" className="block text-gray-200 text-sm font-semibold mb-2">Custos (R$):</label>
                <input
                  type="number"
                  id="custos-finalizar"
                  name="custos"
                  placeholder="Ex: 500"
                  className="w-full p-3 border border-red-700 rounded-md bg-neutral-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-300"
                  value={modalFinalizar.custos || ''}
                  onChange={e => setModalFinalizar({ ...modalFinalizar, custos: e.target.value })}
                  required
                />
              </div>
              <p className="mb-6">Frete: R$ {parseFloat(modalFinalizar.frete || 0).toFixed(2)} - Custos: R$ {parseFloat(modalFinalizar.custos || 0).toFixed(2)} = Lucro: R$ {(parseFloat(modalFinalizar.frete || 0) - parseFloat(modalFinalizar.custos || 0)).toFixed(2)}</p>
              <div className="flex justify-end gap-4">
                <button
                  className="bg-gray-600 text-white font-bold py-2 px-4 rounded-md shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-300"
                  onClick={() => setModalConfirmacao({ aberto: false, placa: null })}
                >
                  Cancelar
                </button>
                <button
                  className="bg-green-600 text-white font-bold py-2 px-4 rounded-md shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300"
                  onClick={confirmarFinalizarViagem}
                >
                  Confirmar Finalização
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SituacaoAtual;

