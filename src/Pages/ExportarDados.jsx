import { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";

dayjs.locale("pt-br");

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

const ExportarDados = () => {
  const [viagens, setViagens] = useState([]);
  const [viagemSelecionada, setViagemSelecionada] = useState(null); // NOVO ESTADO
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    axios.get(`${API_BASE_URL}/viagens-finalizadas-lista`)
      .then(res => {
        setViagens(res.data);
        if (res.data.length === 0) {
          setError("Nenhuma viagem finalizada encontrada para exportação.");
        }
      })
      .catch((err) => {
        console.error("Erro ao carregar viagens finalizadas:", err);
        setError("Erro ao carregar dados. Tente novamente mais tarde.");
        setViagens([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const exportarExcel = () => {
    if (!viagemSelecionada) {
      setError("Por favor, selecione uma viagem para exportar.");
      return;
    }
    setError("");

    try {
      const dadosParaExportar = [viagemSelecionada]; // Exporta apenas a viagem selecionada
      const ws = XLSX.utils.json_to_sheet(dadosParaExportar.map(v => ({
        Placa: v.placa,
        "Nome Caminhão": v.caminhao_nome || 'N/A',
        Motorista: v.motorista_nome || 'N/A',
        Cliente: v.cliente_nome || 'N/A',
        Origem: v.origem || 'N/A',
        Destino: v.destino || 'N/A',
        "Data Início": v.inicio ? dayjs(v.inicio).format("DD/MM/YYYY") : 'N/A',
        "Data Fim": v.fim ? dayjs(v.fim).format("DD/MM/YYYY") : 'N/A',
        Frete: parseFloat(v.frete).toFixed(2),
        Custos: parseFloat(v.custos || 0).toFixed(2),
        "Lucro Total (R$)": parseFloat(v.lucro_total || 0).toFixed(2),
        Status: v.status
      })));
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Viagens Finalizadas");

      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
      saveAs(blob, `viagem_${viagemSelecionada.placa}.xlsx`); // Nome do arquivo com a placa
      alert("Arquivo Excel exportado com sucesso!");
    } catch (e) {
      console.error("Erro ao exportar para Excel:", e);
      setError("Erro ao exportar para Excel. Verifique o console.");
    }
  };

  const exportarPDF = () => {
    if (!viagemSelecionada) {
      setError("Por favor, selecione uma viagem para exportar.");
      return;
    }
    setError("");

    try {
      const doc = new jsPDF();
      doc.setFont("helvetica", "bold");
      doc.setTextColor(255, 70, 70);
      doc.setFontSize(18);
      doc.text("Relatório de Viagem", 14, 20);

      const dadosTabela = [[
        viagemSelecionada.placa,
        viagemSelecionada.caminhao_nome || 'N/A',
        viagemSelecionada.motorista_nome || 'N/A',
        viagemSelecionada.cliente_nome || 'N/A',
        viagemSelecionada.origem || 'N/A',
        viagemSelecionada.destino || 'N/A',
        viagemSelecionada.inicio ? dayjs(viagemSelecionada.inicio).format("DD/MM/YYYY") : 'N/A',
        viagemSelecionada.fim ? dayjs(viagemSelecionada.fim).format("DD/MM/YYYY") : 'N/A',
        `R$ ${Number(viagemSelecionada.frete).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        `R$ ${Number(viagemSelecionada.custos || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        `R$ ${Number(viagemSelecionada.lucro_total || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        viagemSelecionada.status
      ]];

      autoTable(doc, {
        head: [["Placa", "Caminhão", "Motorista", "Cliente", "Origem", "Destino", "Início", "Fim", "Frete", "Custos", "Lucro", "Status"]],
        body: dadosTabela,
        startY: 30,
        headStyles: {
          fillColor: [153, 0, 0],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
        },
        alternateRowStyles: { fillColor: [34, 34, 34] },
        bodyStyles: { textColor: [200, 200, 200], fillColor: [42, 42, 42] },
        styles: {
            font: "helvetica",
            fontSize: 7,
            cellPadding: 1.5,
        },
        columnStyles: {
          0: { cellWidth: 'auto' },
          1: { cellWidth: 'auto' },
          2: { cellWidth: 'auto' },
          3: { cellWidth: 'auto' },
          4: { cellWidth: 'auto' },
          5: { cellWidth: 'auto' },
          6: { cellWidth: 'auto' },
          7: { cellWidth: 'auto' },
          8: { cellWidth: 'auto' },
          9: { cellWidth: 'auto' },
          10: { cellWidth: 'auto' },
          11: { cellWidth: 'auto' },
        }
      });

      doc.save(`relatorio_viagem_${viagemSelecionada.placa}.pdf`);
      alert("Arquivo PDF exportado com sucesso!");
    } catch (e) {
      console.error("Erro ao exportar para PDF:", e);
      setError("Erro ao exportar para PDF. Verifique o console.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-900 font-inter py-8">
      <div className="max-w-4xl w-full p-8 bg-neutral-800 rounded-lg shadow-2xl border border-red-700">
        <h2 className="text-3xl font-bold mb-8 text-red-500 text-center">Exportar Relatórios de Viagens</h2>

        {loading ? (
          <p className="text-center text-gray-400 mt-6">Carregando viagens finalizadas...</p>
        ) : error ? (
          <p className="mb-6 text-center text-red-400 bg-red-900 bg-opacity-30 border border-red-700 rounded-md p-3">
            {error}
          </p>
        ) : viagens.length > 0 ? (
          <>
            {/* NOVO: Dropdown de seleção de viagem */}
            <div className="mb-8">
              <label htmlFor="select-viagem" className="block text-gray-200 text-sm font-semibold mb-2">
                Selecione a Viagem para Exportar:
              </label>
              <select
                id="select-viagem"
                onChange={(e) => setViagemSelecionada(viagens.find(v => v.id === Number(e.target.value)))}
                className="w-full p-3 border border-red-700 rounded-md bg-neutral-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-300"
                required
              >
                <option value="">-- Selecione uma viagem --</option>
                {viagens.map(v => (
                  <option key={v.id} value={v.id}>
                    {`${v.placa} - ${v.origem || 'N/A'} ➔ ${v.destino || 'N/A'} (Lucro: R$${parseFloat(v.lucro_total).toFixed(2)})`}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center">
              <button
                onClick={exportarExcel}
                className="flex items-center justify-center bg-red-600 text-white font-bold py-3 px-6 rounded-md shadow-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-neutral-800 transition duration-300 transform hover:scale-105"
                disabled={!viagemSelecionada} // Desabilita o botão se nenhuma viagem for selecionada
              >
                Exportar Excel
              </button>
              <button
                onClick={exportarPDF}
                className="flex items-center justify-center bg-red-600 text-white font-bold py-3 px-6 rounded-md shadow-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-neutral-800 transition duration-300 transform hover:scale-105"
                disabled={!viagemSelecionada} // Desabilita o botão se nenhuma viagem for selecionada
              >
                Exportar PDF
              </button>
            </div>
            
            {/* Exibição da lista de viagens removida, já que agora temos o dropdown */}
            {/* <div className="max-h-96 overflow-y-auto pr-2">
              <ul className="space-y-3">
                {viagens.map((v) => (
                  <li key={v.id} className="bg-neutral-700 border border-red-600 p-4 rounded-lg shadow-md text-gray-100 flex justify-between items-center">
                    ...
                  </li>
                ))}
              </ul>
            </div> */}

          </>
        ) : (
          <p className="text-center text-gray-400 mt-6">Nenhuma viagem finalizada encontrada.</p>
        )}
      </div>
    </div>
  );
};

export default ExportarDados;
