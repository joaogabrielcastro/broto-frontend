import { useState } from "react";
import axios from "axios";
import dayjs from "dayjs"; // Import dayjs for date formatting
import "dayjs/locale/pt-br"; // Import locale for pt-br format

dayjs.locale("pt-br"); // Set locale

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

const ConsultaPelaPlaca = () => {
  const [placa, setPlaca] = useState("");
  const [viagens, setViagens] = useState([]);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  const buscarViagens = async () => {
    setViagens([]);
    setMensagem("");
    setErro("");
    setLoading(true);

    if (!placa) {
      setErro("Por favor, digite uma placa para buscar.");
      setLoading(false);
      return;
    }

    try {
      // Rota atualizada para /viagens-por-placa/:placa
      const res = await axios.get(`${API_BASE_URL}/viagens-por-placa/${placa}`);
      
      if (res.data && res.data.viagens && res.data.viagens.length > 0) {
        setViagens(res.data.viagens);
        setMensagem(`Viagens encontradas para a placa: ${placa}`);
      } else {
        setViagens([]);
        setMensagem("Nenhuma viagem encontrada para a placa digitada."); // Mensagem mais clara
      }
    } catch (error) {
      console.error("Erro ao buscar viagens:", error);
      if (error.response && error.response.status === 404) {
        setErro("Caminhão não encontrado. Verifique a placa digitada.");
      } else if (error.request) {
        setErro("Erro de conexão com o servidor. Verifique se o backend está rodando.");
      } else {
        setErro("Erro ao buscar viagens. Tente novamente mais tarde.");
      }
      setViagens([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-900 font-inter">
      <div className="max-w-md w-full p-8 bg-neutral-800 rounded-lg shadow-2xl border border-red-700">
        <h2 className="text-3xl font-bold mb-6 text-red-500 text-center">Consulta por Placa</h2>
        
        <div className="mb-4">
          <label htmlFor="placa" className="block text-gray-200 text-sm font-semibold mb-2">
            Digite a placa do caminhão:
          </label>
          <input
            type="text"
            id="placa"
            placeholder="Ex: ABC1234"
            value={placa}
            onChange={(e) => setPlaca(e.target.value)}
            className="w-full p-3 border border-red-700 rounded-md bg-neutral-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-300"
            required
          />
        </div>
        
        <button
          onClick={buscarViagens}
          className="w-full bg-red-600 text-white font-bold py-3 px-4 rounded-md shadow-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-neutral-800 transition duration-300 transform hover:scale-105"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Buscando...
            </span>
          ) : 'Buscar Viagens'}
        </button>

        {mensagem && (
          <p className="mt-6 text-center text-green-400 bg-green-900 bg-opacity-30 border border-green-700 rounded-md p-3">
            {mensagem}
          </p>
        )}
        {erro && (
          <p className="mt-6 text-center text-red-400 bg-red-900 bg-opacity-30 border border-red-700 rounded-md p-3">
            {erro}
          </p>
        )}

        {viagens.length > 0 && (
          <div className="mt-8 space-y-4 max-h-96 overflow-y-auto pr-2">
            {viagens.map((v) => (
              <div
                key={v.id}
                className="bg-neutral-700 border border-red-600 p-4 rounded-lg shadow-md text-gray-100"
              >
                <p className="mb-1"><strong><span className="text-red-400">Placa:</span></strong> {v.placa || 'N/A'}</p>
                <p className="mb-1"><strong><span className="text-red-400">Nome Caminhão:</span></strong> {v.caminhao_nome || 'N/A'}</p>
                <p className="mb-1"><strong><span className="text-red-400">Motorista:</span></strong> {v.motorista_nome || 'N/A'}</p>
                <p className="mb-1"><strong><span className="text-red-400">Cliente:</span></strong> {v.cliente_nome || 'N/A'}</p>
                <p className="mb-1"><strong><span className="text-red-400">Rota:</span></strong> {v.origem || 'N/A'} <span className="text-red-400 font-bold">➔</span> {v.destino || 'N/A'}</p>
                <p className="mb-1"><strong><span className="text-red-400">Início:</span></strong> {v.inicio ? dayjs(v.inicio).format("DD/MM/YYYY") : 'N/A'}</p>
                <p className="mb-1"><strong><span className="text-red-400">Fim:</span></strong> {v.fim ? dayjs(v.fim).format("DD/MM/YYYY") : 'N/A'}</p>
                <p className="mb-1"><strong><span className="text-red-400">Frete:</span></strong> R$ {parseFloat(v.frete).toFixed(2)}</p>
                <p className="mb-1"><strong><span className="text-red-400">Custos:</span></strong> R$ {parseFloat(v.custos || 0).toFixed(2)}</p>
                <p className="mb-1"><strong><span className="text-red-400">Lucro Total:</span></strong> R$ {parseFloat(v.lucro_total || 0).toFixed(2)}</p>
                <p><strong><span className="text-red-400">Status:</span></strong> {v.status}</p>
              </div>
            ))}
          </div>
        )}

        {/* Mensagem de "Nenhuma viagem encontrada" agora é gerenciada pelo estado 'mensagem' */}
        {/* {!loading && viagens.length === 0 && !erro && placa && (
          <p className="mt-6 text-center text-gray-400">Nenhuma viagem encontrada para a placa digitada.</p>
        )} */}
      </div>
    </div>
  );
};

export default ConsultaPelaPlaca;
