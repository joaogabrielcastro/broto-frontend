import { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

const GraficosDesempenho = () => {
  const [viagens, setViagens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    // CORREÇÃO AQUI: Rota atualizada para /viagens-finalizadas-lista
    axios.get(`${API_BASE_URL}/viagens-finalizadas-lista`)
      .then(res => {
        setViagens(res.data);
        if (res.data.length === 0) {
          setError("Nenhum dado de viagem finalizada encontrado para exibir gráficos.");
        }
      })
      .catch(err => {
        console.error("Erro ao buscar viagens finalizadas para gráficos:", err);
        setError("Erro ao carregar dados dos gráficos. Tente novamente mais tarde.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Agrupa viagens por placa e garante o formato de dados para o gráfico
  const viagensPorPlaca = viagens.reduce((acc, viagem) => {
    if (!acc[viagem.placa]) acc[viagem.placa] = [];
    acc[viagem.placa].push({
      data: viagem.fim,
      lucro: Number(viagem.lucro_total),
    });
    return acc;
  }, {});

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-900 font-inter py-8">
      <div className="max-w-6xl w-full p-8 bg-neutral-800 rounded-lg shadow-2xl border border-red-700">
        <h2 className="text-3xl font-bold mb-8 text-red-500 text-center">Desempenho por Caminhão (Gráficos)</h2>

        {loading ? (
          <p className="text-center text-gray-400 mt-6">Carregando dados dos gráficos...</p>
        ) : error ? (
          <p className="text-center text-red-400 bg-red-900 bg-opacity-30 border border-red-700 rounded-md p-3">
            {error}
          </p>
        ) : Object.keys(viagensPorPlaca).length > 0 ? (
          <div className="space-y-10">
            {Object.entries(viagensPorPlaca).map(([placa, dados]) => (
              <div key={placa} className="bg-neutral-700 rounded-lg p-6 shadow-xl border border-red-600">
                <h3 className="text-2xl font-bold mb-4 text-gray-100 text-center">Placa: <span className="text-red-400">{placa}</span></h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={dados} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#555" />
                    <XAxis dataKey="data" stroke="#ccc" tick={{ fill: '#ccc' }} />
                    <YAxis stroke="#ccc" tick={{ fill: '#ccc' }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#333', border: '1px solid #666', color: '#eee' }}
                      labelStyle={{ color: '#ccc' }}
                      itemStyle={{ color: '#eee' }}
                    />
                    <Legend wrapperStyle={{ color: '#eee' }} />
                    <ReferenceLine y={30000} stroke="#ff3333" strokeDasharray="3 3" label={{ value: "Meta Mínima R$30.000", position: "insideTopRight", fill: "#ff3333" }} />
                    <Line
                      type="monotone"
                      dataKey="lucro"
                      stroke="#fbbf24"
                      name="Lucro (R$)"
                      activeDot={{ r: 8 }}
                      dot={{ r: 4, fill: '#fbbf24' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ))}
          </div>
        ) : (
          !error && <p className="text-center text-gray-400 mt-6">Nenhum gráfico de desempenho disponível.</p>
        )}
      </div>
    </div>
  );
};

export default GraficosDesempenho;
