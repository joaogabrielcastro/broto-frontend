import { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

const ResumoFinanceiro = () => {
  const [viagens, setViagens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    // Rota atualizada para /viagens-finalizadas-lista
    axios
      .get(`${API_BASE_URL}/viagens-finalizadas-lista`)
      .then((res) => {
        const filteredViagens = res.data.filter(
          (v) => v.lucro_total !== null && v.lucro_total !== undefined
        );
        setViagens(filteredViagens);
        if (filteredViagens.length === 0) {
          setError("Nenhuma viagem com lucro/prejuízo registrado encontrada.");
        }
      })
      .catch((err) => {
        console.error("Erro ao buscar viagens para resumo financeiro:", err);
        setError(
          "Erro ao carregar dados do resumo financeiro. Tente novamente mais tarde."
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const data = {
    labels: viagens.map((v) => `${v.placa} - ${v.cliente_nome || "N/A"} - ${v.fim || "N/A"}`), // Adicionado nome do cliente
    datasets: [
      {
        label: "Lucro Total (R$)",
        data: viagens.map((v) => Number(v.lucro_total)),
        backgroundColor: viagens.map((v) =>
          Number(v.lucro_total) >= 30000 ? "#22c55e" : "#ef4444"
        ),
        borderColor: viagens.map((v) =>
          Number(v.lucro_total) >= 30000 ? "#16a34a" : "#dc2626"
        ),
        borderWidth: 1,
        borderRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          color: "#e0e0e0",
        },
      },
      tooltip: {
        backgroundColor: "#333",
        titleColor: "#e0e0e0",
        bodyColor: "#e0e0e0",
        borderColor: "#555",
        borderWidth: 1,
        callbacks: {
          label: (ctx) =>
            `R$ ${parseFloat(ctx.raw).toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`,
          title: (ctx) => { // Adiciona mais detalhes ao título do tooltip
            const data = viagens[ctx[0].dataIndex];
            return `Placa: ${data.placa || 'N/A'}\nCliente: ${data.cliente_nome || 'N/A'}\nData Fim: ${data.fim || 'N/A'}`;
          }
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#e0e0e0",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
          borderColor: "#e0e0e0",
        },
        title: {
          display: true,
          text: "Viagens (Placa - Cliente - Data Fim)", // Título do eixo X atualizado
          color: "#e0e0e0",
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: "#e0e0e0",
          callback: (value) => `R$ ${value.toLocaleString("pt-BR")}`,
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
          borderColor: "#e0e0e0",
        },
        title: {
          display: true,
          text: "Lucro (R$)",
          color: "#e0e0e0",
        },
      },
    },
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-900 font-inter py-8">
      <div className="max-w-4xl w-full p-8 bg-neutral-800 rounded-lg shadow-2xl border border-red-700">
        <h2 className="text-3xl font-bold mb-8 text-red-500 text-center">
          Resumo Financeiro (Viagens Finalizadas)
        </h2>

        {loading ? (
          <p className="text-center text-gray-400 mt-6">
            Carregando dados do resumo financeiro...
          </p>
        ) : error ? (
          <p className="mb-6 text-center text-red-400 bg-red-900 bg-opacity-30 border border-red-700 rounded-md p-3">
            {error}
          </p>
        ) : viagens.length > 0 ? (
          <div className="h-96 w-full">
            {" "}
            {/* Fixed height for chart container */}
            <Bar data={data} options={options} />
          </div>
        ) : (
          <p className="text-center text-gray-400 mt-6">
            Nenhuma viagem com lucro/prejuízo registrado para exibir o resumo
            financeiro.
          </p>
        )}
      </div>
    </div>
  );
};

export default ResumoFinanceiro;
