import { Routes, Route } from "react-router-dom";
import ConsultaPorPlaca from "./Pages/ConsultaPelaPlaca";
import SituacaoAtual from "./Pages/SituacaoAtual";
import CadastroCaminhao from "./Pages/CadastroCaminhao";
import CadastroViagem from "./Pages/CadastroViagem";
import ResumoFinanceiro from "./Pages/ResumoFinanceiro";
import EditarViagem from "./Pages/EditarViagem";
import GraficosDesempenho from "./Pages/GraficosDesempenho";
import ExportarDados from "./Pages/ExportarDados";
import CadastroMotorista from "./Pages/CadastroMotorista";
import ListarMotoristas from "./Pages/ListarMotoristas";
import CadastroCliente from "./Pages/CadastroCliente"; // Importe o novo componente
import Navbar from './components/Navbar';

function App() {
  return (
    <div className="min-h-screen bg-neutral-900 font-inter">
      <Navbar />

      <main className="py-8 px-4 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<ConsultaPorPlaca />} />
          <Route path="/situacao" element={<SituacaoAtual />} />
          <Route path="/cadastro" element={<CadastroCaminhao />} />
          <Route path="/cadastrar-viagem" element={<CadastroViagem />} />
          <Route path="/resumo" element={<ResumoFinanceiro />} />
          <Route path="/editar" element={<EditarViagem />} />
          <Route path="/graficos" element={<GraficosDesempenho />} />
          <Route path="/exportar" element={<ExportarDados />} />
          <Route path="/cadastrar-motorista" element={<CadastroMotorista />} />
          <Route path="/cadastrar-cliente" element={<CadastroCliente />} /> {/* NOVA ROTA */}
        </Routes>
      </main>
    </div>
  );
}

export default App;
