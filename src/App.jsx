import { Routes, Route } from "react-router-dom";
import ConsultaPorPlaca from "./Pages/ConsultaPelaPlaca";
import SituacaoAtual from "./Pages/SituacaoAtual";
// REMOVIDOS: Imports dos componentes de cadastro individuais
// import CadastroCaminhao from "./Pages/CadastroCaminhao";
// import CadastroMotorista from "./Pages/CadastroMotorista";
// import CadastroCliente from "./Pages/CadastroCliente";
// import CadastroViagem from "./Pages/CadastroViagem";
import ResumoFinanceiro from "./Pages/ResumoFinanceiro";
import EditarViagem from "./Pages/EditarViagem";
import GraficosDesempenho from "./Pages/GraficosDesempenho";
import ExportarDados from "./Pages/ExportarDados";
import CadastroGeral from "./Pages/CadastroGeral";
import Navbar from './components/Navbar';

function App() {
  return (
    <div className="min-h-screen bg-neutral-900 font-inter">
      <Navbar />

      <main className="py-8 px-4 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<ConsultaPorPlaca />} />
          <Route path="/situacao" element={<SituacaoAtual />} />
          
          {/* NOVA ROTA ÚNICA para todos os cadastros */}
          <Route path="/cadastrar" element={<CadastroGeral />} /> 

          {/* ROTAS INDIVIDUAIS DE CADASTRO REMOVIDAS */}
          {/* <Route path="/cadastro" element={<CadastroCaminhao />} /> */}
          {/* <Route path="/cadastrar-motorista" element={<CadastroMotorista />} /> */}
          {/* <Route path="/cadastrar-cliente" element={<CadastroCliente />} /> */}
          {/* <Route path="/cadastrar-viagem" element={<CadastroViagem />} /> */}

          <Route path="/resumo" element={<ResumoFinanceiro />} />
          <Route path="/editar" element={<EditarViagem />} />
          <Route path="/graficos" element={<GraficosDesempenho />} />
          <Route path="/exportar" element={<ExportarDados />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;