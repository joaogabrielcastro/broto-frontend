    import { useEffect, useState } from "react";
    import { Routes, Route } from "react-router-dom";
    import dayjs from "dayjs";
    import "dayjs/locale/pt-br";

    dayjs.locale("pt-br");

    import ConsultaPorPlaca from "./Pages/ConsultaPelaPlaca";
    import SituacaoAtual from "./Pages/SituacaoAtual";
    import ResumoFinanceiro from "./Pages/ResumoFinanceiro";
    import EditarViagem from "./Pages/EditarViagem";
    import GraficosDesempenho from "./Pages/GraficosDesempenho";
    import ExportarDados from "./Pages/ExportarDados";
    import CadastroGeral from "./Pages/CadastroGeral";
    import Navbar from './components/Navbar';
    import GestaoEmpresa from "./Pages/GestaoEmpresa";

    function App() {
      const [showPaymentReminder, setShowPaymentReminder] = useState(false);

      useEffect(() => {
        const today = dayjs();
        if (today.date() === 15) { 
          setShowPaymentReminder(true);
        } else {
          setShowPaymentReminder(false);
        }
      }, []);

      return (
        <div className="min-h-screen bg-neutral-900 font-inter">
          <Navbar />

          {showPaymentReminder && (
            <p className="text-center text-yellow-400 bg-yellow-900 bg-opacity-30 border border-yellow-700 rounded-md p-3 mx-auto mt-4 max-w-4xl">
              Lembrete: O pagamento pelo uso do site vence todo dia 15 do mês. Por favor, regularize!
            </p>
          )}

          <main className="py-8 px-4 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/" element={<ConsultaPorPlaca />} />
              <Route path="/situacao" element={<SituacaoAtual />} />
              <Route path="/cadastrar" element={<CadastroGeral />} />
              <Route path="/resumo" element={<ResumoFinanceiro />} />
              <Route path="/editar/:id?" element={<EditarViagem />} /> 
              <Route path="/graficos" element={<GraficosDesempenho />} />
              <Route path="/exportar" element={<ExportarDados />} />
              <Route path="/gestao" element={<GestaoEmpresa />} />
            </Routes>
          </main>
        </div>
      );
    }

    export default App;
    