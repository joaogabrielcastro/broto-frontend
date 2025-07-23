import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs"; // Import dayjs for date formatting

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

const EditarViagem = () => {
  const [viagens, setViagens] = useState([]);
  const [motoristas, setMotoristas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [edicao, setEdicao] = useState(null);
  const [modalSalvar, setModalSalvar] = useState(false);
  const [modalFinalizar, setModalFinalizar] = useState({ aberto: false, id: null, frete: null, custos: null }); // ATUALIZADO: para passar frete e custos
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarViagens();
    carregarMotoristas();
    carregarClientes();
  }, []);

  const carregarViagens = () => {
    setLoading(true);
    setMensagem("");
    setErro("");
    axios.get(`${API_BASE_URL}/viagens-ativas-lista`)
      .then(res => {
        setViagens(res.data);
        if (res.data.length === 0) {
          setMensagem("Nenhuma viagem ativa encontrada.");
        }
      })
      .catch((error) => {
        console.error("Erro ao carregar viagens ativas:", error);
        setErro("Erro ao carregar viagens ativas. Tente novamente mais tarde.");
        setViagens([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const carregarMotoristas = () => {
    axios.get(`${API_BASE_URL}/motoristas`)
      .then(res => setMotoristas(res.data))
      .catch((error) => {
        console.error("Erro ao buscar motoristas:", error);
        setErro(prev => prev ? prev + " Erro ao carregar motoristas." : "Erro ao carregar motoristas.");
        setMotoristas([]);
      });
  };

  const carregarClientes = () => {
    axios.get(`${API_BASE_URL}/clientes`)
      .then(res => setClientes(res.data))
      .catch((error) => {
        console.error("Erro ao buscar clientes:", error);
        setErro(prev => prev ? prev + " Erro ao carregar clientes." : "Erro ao carregar clientes.");
        setClientes([]);
      });
  };

  const handleEditar = (viagemSelecionada) => {
    setEdicao({
      ...viagemSelecionada,
      inicio: viagemSelecionada.inicio ? dayjs(viagemSelecionada.inicio).format('YYYY-MM-DD') : '',
      fim: viagemSelecionada.fim ? dayjs(viagemSelecionada.fim).format('YYYY-MM-DD') : '',
      motorista_id: viagemSelecionada.motorista_id || '', 
      cliente_id: viagemSelecionada.cliente_id || '',
      custos: viagemSelecionada.custos || 0, // NOVO: Carrega custos
      lucro_total: viagemSelecionada.lucro_total || 0 // Carrega lucro_total (pode ser 0 ou null)
    });
  };

  const handleSalvar = () => {
    setModalSalvar(true);
  };

  const confirmarSalvar = async () => {
    setModalSalvar(false);
    setMensagem("");
    setErro("");

    try {
      // Envia custos e lucro_total (que será calculado no backend)
      await axios.put(`${API_BASE_URL}/viagens/${edicao.id}`, edicao);
      setMensagem("Viagem atualizada com sucesso!");
      setEdicao(null);
      carregarViagens();
    } catch (error) {
      console.error("Erro ao salvar alterações da viagem:", error);
      setErro(error.response?.data?.erro || "Erro ao salvar alterações. Tente novamente.");
    }
  };

  // ATUALIZADO: handleFinalizar agora passa frete e custos para o modal
  const handleFinalizar = (viagem) => {
    setModalFinalizar({ aberto: true, id: viagem.id, frete: viagem.frete, custos: viagem.custos || 0 });
  };

  // ATUALIZADO: confirmarFinalizar agora envia custos
  const confirmarFinalizar = async () => {
    setModalFinalizar({ aberto: false, id: null, frete: null, custos: null });
    setMensagem("");
    setErro("");

    try {
      // Envia o ID da viagem e os custos para o backend
      await axios.patch(`${API_BASE_URL}/viagens/${modalFinalizar.id}/finalizar`, { custos: modalFinalizar.custos });
      setMensagem(`Viagem finalizada com sucesso!`);
      carregarViagens();
    } catch (error) {
      console.error("Erro ao finalizar viagem:", error);
      setErro(error.response?.data?.erro || "Erro ao finalizar viagem. Tente novamente.");
    }
  };

  const handleExcluir = (idViagem, placaViagem) => {
    setModalExcluir({ aberto: true, id: idViagem, placa: placaViagem });
  };

  const confirmarExcluir = async () => {
    setModalExcluir({ aberto: false, id: null, placa: '' });
    setMensagem("");
    setErro("");

    try {
      await axios.delete(`${API_BASE_URL}/viagens/${modalExcluir.id}`);
      setMensagem(`Viagem da placa ${modalExcluir.placa} excluída com sucesso!`);
      carregarViagens();
    } catch (error) {
      console.error("Erro ao excluir viagem:", error);
      setErro(error.response?.data?.erro || `Erro ao excluir a viagem da placa ${modalExcluir.placa}. Tente novamente.`);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-900 font-inter py-8">
      <div className="max-w-4xl w-full p-8 bg-neutral-800 rounded-lg shadow-2xl border border-red-700">
        <h2 className="text-3xl font-bold mb-8 text-red-500 text-center">Editar ou Concluir Viagens</h2>

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
          <p className="text-center text-gray-400 mt-6">Carregando viagens ativas...</p>
        ) : viagens.length > 0 ? (
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {viagens.map((v) => (
              <div key={v.id} className="bg-neutral-700 border border-red-600 p-4 rounded-lg shadow-md text-gray-100 flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="mb-1"><strong className="text-red-400">Placa:</strong> {v.placa}</p>
                  <p className="mb-1"><strong className="text-red-400">Nome Caminhão:</strong> {v.caminhao_nome || 'N/A'}</p>
                  <p className="mb-1"><strong className="text-red-400">Motorista:</strong> {v.motorista_nome || 'N/A'}</p>
                  <p className="mb-1"><strong className="text-red-400">Cliente:</strong> <span className="text-blue-400 font-bold">{v.cliente_nome || 'N/A'}</span></p>
                  <p className="mb-1"><strong className="text-red-400">Rota:</strong> {v.origem || 'N/A'} <span className="text-red-400 font-bold">➔</span> {v.destino || 'N/A'}</p>
                  <p className="mb-1"><strong className="text-red-400">Início:</strong> {v.inicio}</p>
                  <p className="mb-1"><strong className="text-red-400">Frete:</strong> R$ {parseFloat(v.frete).toFixed(2)}</p> {/* Exibe o frete */}
                  <p className="mb-1"><strong className="text-red-400">Custos:</strong> R$ {parseFloat(v.custos || 0).toFixed(2)}</p> {/* NOVO: Exibe custos */}
                  <p className="mb-1"><strong className="text-red-400">Lucro Total:</strong> R$ {parseFloat(v.lucro_total || 0).toFixed(2)}</p> {/* Exibe lucro total */}
                  <p><strong className="text-red-400">Status:</strong> {v.status}</p>
                </div>
                <div className="flex gap-4 mt-4 md:mt-0">
                  <button
                    onClick={() => handleEditar(v)}
                    className="bg-blue-600 text-white font-bold py-2 px-4 rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-neutral-700 transition duration-300"
                  >
                    Editar
                  </button>
                  {/* Botão Finalizar só aparece se a viagem estiver "Em andamento" */}
                  {v.status === 'Em andamento' && (
                    <button
                      onClick={() => handleFinalizar(v)} // Passa a viagem para o modal de finalização
                      className="bg-green-600 text-white font-bold py-2 px-4 rounded-md shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-neutral-700 transition duration-300"
                    >
                      Finalizar
                    </button>
                  )}
                  {/* BOTÃO EXCLUIR REMOVIDO */}
                  {/* <button
                    onClick={() => handleExcluir(v.id, v.placa)}
                    className="bg-red-600 text-white font-bold py-2 px-4 rounded-md shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-neutral-700 transition duration-300"
                  >
                    Excluir
                  </button> */}
                </div>
              </div>
            ))}
          </div>
        ) : (
          !erro && <p className="text-center text-gray-400 mt-6">Nenhuma viagem ativa encontrada.</p>
        )}

        {edicao && (
          <div className="mt-8 p-8 bg-neutral-800 rounded-lg shadow-2xl border border-red-700 text-gray-100">
            <h3 className="text-xl font-bold mb-4 text-red-500">Editando Viagem: {edicao.placa}</h3>
            
            <div className="mb-4">
              <label htmlFor="placa-edicao" className="block text-gray-200 text-sm font-semibold mb-2">Placa:</label>
              <input
                type="text"
                id="placa-edicao"
                placeholder="Placa"
                className="w-full p-3 border border-red-700 rounded-md bg-neutral-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-300"
                value={edicao.placa}
                onChange={e => setEdicao({ ...edicao, placa: e.target.value })}
                disabled
              />
            </div>

            {/* Nome do Caminhão para Edição */}
            <div className="mb-4">
              <label htmlFor="caminhao_nome-edicao" className="block text-gray-200 text-sm font-semibold mb-2">Nome do Caminhão:</label>
              <input
                type="text"
                id="caminhao_nome-edicao"
                placeholder="Nome do Caminhão"
                className="w-full p-3 border border-red-700 rounded-md bg-neutral-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-300"
                value={edicao.caminhao_nome || ''}
                onChange={e => setEdicao({ ...edicao, caminhao_nome: e.target.value })}
              />
            </div>

            {/* Motorista para Edição */}
            <div className="mb-4">
              <label htmlFor="motorista-edicao" className="block text-gray-200 text-sm font-semibold mb-2">Motorista:</label>
              <select
                id="motorista-edicao"
                name="motorista_id"
                value={edicao.motorista_id}
                onChange={e => setEdicao({ ...edicao, motorista_id: e.target.value })}
                className="w-full p-3 border border-red-700 rounded-md bg-neutral-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-300"
                required
              >
                <option value="">Selecione o Motorista</option>
                {motoristas.map((motorista) => (
                  <option key={motorista.id} value={motorista.id}>
                    {motorista.nome}
                  </option>
                ))}
              </select>
              {motoristas.length === 0 && (
                <p className="text-sm text-yellow-500 mt-2">Nenhum motorista disponível. Cadastre motoristas primeiro.</p>
              )}
            </div>

            {/* Cliente para Edição */}
            <div className="mb-4">
              <label htmlFor="cliente-edicao" className="block text-gray-200 text-sm font-semibold mb-2">Cliente:</label>
              <select
                id="cliente-edicao"
                name="cliente_id"
                value={edicao.cliente_id}
                onChange={e => setEdicao({ ...edicao, cliente_id: e.target.value })}
                className="w-full p-3 border border-red-700 rounded-md bg-neutral-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-300"
                required
              >
                <option value="">Selecione o Cliente</option>
                {clientes.map((cliente) => (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.nome}
                  </option>
                ))}
              </select>
              {clientes.length === 0 && (
                <p className="text-sm text-yellow-500 mt-2">Nenhum cliente disponível. Cadastre clientes primeiro.</p>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="inicio-edicao" className="block text-gray-200 text-sm font-semibold mb-2">Início:</label>
              <input
                type="date"
                id="inicio-edicao"
                placeholder="Início"
                className="w-full p-3 border border-red-700 rounded-md bg-neutral-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-300"
                value={edicao.inicio}
                onChange={e => setEdicao({ ...edicao, inicio: e.target.value })}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="fim-edicao" className="block text-gray-200 text-sm font-semibold mb-2">Fim:</label>
              <input
                type="date"
                id="fim-edicao"
                placeholder="Fim"
                className="w-full p-3 border border-red-700 rounded-md bg-neutral-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-300"
                value={edicao.fim}
                onChange={e => setEdicao({ ...edicao, fim: e.target.value })}
              />
            </div>

            {/* Origem para Edição */}
            <div className="mb-4">
              <label htmlFor="origem-edicao" className="block text-gray-200 text-sm font-semibold mb-2">Origem:</label>
              <input
                type="text"
                id="origem-edicao"
                placeholder="Origem"
                className="w-full p-3 border border-red-700 rounded-md bg-neutral-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-300"
                value={edicao.origem}
                onChange={e => setEdicao({ ...edicao, origem: e.target.value })}
                required
              />
            </div>

            {/* Destino para Edição */}
            <div className="mb-4">
              <label htmlFor="destino-edicao" className="block text-gray-200 text-sm font-semibold mb-2">Destino:</label>
              <input
                type="text"
                id="destino-edicao"
                placeholder="Destino"
                className="w-full p-3 border border-red-700 rounded-md bg-neutral-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-300"
                value={edicao.destino}
                onChange={e => setEdicao({ ...edicao, destino: e.target.value })}
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="frete-edicao" className="block text-gray-200 text-sm font-semibold mb-2">Frete (R$):</label>
              <input
                type="number"
                id="frete-edicao"
                placeholder="Frete (R$)"
                className="w-full p-3 border border-red-700 rounded-md bg-neutral-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-300"
                value={edicao.frete}
                onChange={e => setEdicao({ ...edicao, frete: e.target.value })}
              />
            </div>

            {/* NOVO CAMPO: Custos para Edição */}
            <div className="mb-4">
              <label htmlFor="custos-edicao" className="block text-gray-200 text-sm font-semibold mb-2">Custos (R$):</label>
              <input
                type="number"
                id="custos-edicao"
                name="custos"
                placeholder="Custos da Viagem"
                className="w-full p-3 border border-red-700 rounded-md bg-neutral-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-300"
                value={edicao.custos}
                onChange={e => setEdicao({ ...edicao, custos: e.target.value })}
              />
            </div>

            {/* Lucro Total para Edição (Apenas exibição, não input) */}
            <div className="mb-4">
              <label htmlFor="lucro_total-edicao" className="block text-gray-200 text-sm font-semibold mb-2">Lucro Total (Calculado):</label>
              <input
                type="number"
                id="lucro_total-edicao"
                className="w-full p-3 border border-red-700 rounded-md bg-neutral-700 text-gray-100 cursor-not-allowed"
                value={parseFloat(edicao.frete || 0) - parseFloat(edicao.custos || 0)} // Calcula na UI
                disabled
              />
            </div>

            <div className="mb-6">
              <label htmlFor="status-edicao" className="block text-gray-200 text-sm font-semibold mb-2">Status:</label>
              <select
                id="status-edicao"
                className="w-full p-3 border border-red-700 rounded-md bg-neutral-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-300"
                value={edicao.status}
                onChange={e => setEdicao({ ...edicao, status: e.target.value })}
              >
                <option value="Em andamento">Em andamento</option>
                <option value="Finalizada">Finalizada</option>
              </select>
            </div>
            
            <button
              onClick={handleSalvar}
              className="w-full bg-red-600 text-white font-bold py-3 px-4 rounded-md shadow-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-neutral-800 transition duration-300 transform hover:scale-105"
            >
              Salvar Alterações
            </button>
            <button
                onClick={() => setEdicao(null)} // Cancel editing
                className="w-full mt-4 bg-gray-600 text-white font-bold py-3 px-4 rounded-md shadow-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-neutral-800 transition duration-300 transform hover:scale-105"
              >
                Cancelar Edição
              </button>
          </div>
        )}

        {/* Modal de confirmação de salvar */}
        {modalSalvar && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-neutral-800 p-8 rounded-lg shadow-2xl border border-red-700 max-w-sm w-full text-gray-100">
              <h2 className="text-2xl font-semibold mb-4 text-red-500">Confirmar Edição</h2>
              <p className="mb-6">Tem certeza que deseja salvar as alterações?</p>
              <div className="flex justify-end gap-4">
                <button
                  className="bg-gray-600 text-white font-bold py-2 px-4 rounded-md shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-300"
                  onClick={() => setModalSalvar(false)}
                >
                  Cancelar
                </button>
                <button
                  className="bg-red-600 text-white font-bold py-2 px-4 rounded-md shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-300"
                  onClick={confirmarSalvar}
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de confirmação de finalização */}
        {modalFinalizar.aberto && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-neutral-800 p-8 rounded-lg shadow-2xl border border-red-700 max-w-sm w-full text-gray-100">
              <h2 className="text-2xl font-semibold mb-4 text-red-500">Finalizar Viagem</h2>
              <p className="mb-2">Insira os custos para calcular o lucro total:</p> {/* NOVO TEXTO */}
              <div className="mb-4">
                <label htmlFor="custos-finalizar" className="block text-gray-200 text-sm font-semibold mb-2">Custos (R$):</label>
                <input
                  type="number"
                  id="custos-finalizar"
                  name="custos"
                  placeholder="Ex: 500"
                  className="w-full p-3 border border-red-700 rounded-md bg-neutral-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-300"
                  value={modalFinalizar.custos || ''} // Valor do custo no modal
                  onChange={e => setModalFinalizar({ ...modalFinalizar, custos: e.target.value })}
                  required
                />
              </div>
              <p className="mb-6">Frete: R$ {parseFloat(modalFinalizar.frete || 0).toFixed(2)} - Custos: R$ {parseFloat(modalFinalizar.custos || 0).toFixed(2)} = Lucro: R$ {(parseFloat(modalFinalizar.frete || 0) - parseFloat(modalFinalizar.custos || 0)).toFixed(2)}</p> {/* CÁLCULO NO MODAL */}
              <div className="flex justify-end gap-4">
                <button
                  className="bg-gray-600 text-white font-bold py-2 px-4 rounded-md shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-300"
                  onClick={() => setModalFinalizar({ aberto: false, id: null, frete: null, custos: null })}
                >
                  Cancelar
                </button>
                <button
                  className="bg-green-600 text-white font-bold py-2 px-4 rounded-md shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300"
                  onClick={confirmarFinalizar}
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

export default EditarViagem;
