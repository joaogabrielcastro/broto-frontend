import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

const ListarMotoristas = () => {
  const [motoristas, setMotoristas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [mensagem, setMensagem] = useState(''); // Para mensagens de sucesso/feedback
  const [modalExcluir, setModalExcluir] = useState({ aberto: false, id: null, nome: '' }); // Estado para o modal de exclusão

  useEffect(() => {
    carregarMotoristas();
  }, []);

  const carregarMotoristas = () => {
    setLoading(true);
    setErro('');
    setMensagem('');
    axios.get(`${API_BASE_URL}/motoristas`) // Usa API_BASE_URL
      .then(res => {
        setMotoristas(res.data);
        if (res.data.length === 0) {
          setMensagem('Nenhum motorista cadastrado ainda.');
        }
      })
      .catch(error => {
        console.error('Erro ao carregar motoristas:', error);
        setErro('Erro ao carregar a lista de motoristas. Tente novamente mais tarde.');
        setMotoristas([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Lida com o clique no botão "Excluir"
  const handleExcluir = (id, nome) => {
    setModalExcluir({ aberto: true, id, nome });
  };

  // Confirma e envia a requisição de exclusão para o backend
  const confirmarExcluir = async () => {
    setModalExcluir({ aberto: false, id: null, nome: '' }); // Fecha o modal imediatamente
    setMensagem('');
    setErro('');

    try {
      await axios.delete(`${API_BASE_URL}/motoristas/${modalExcluir.id}`); // Usa API_BASE_URL
      setMensagem(`Motorista ${modalExcluir.nome} excluído com sucesso!`);
      carregarMotoristas(); // Recarrega a lista após a exclusão
    } catch (error) {
      console.error('Erro ao excluir motorista:', error);
      setErro(error.response?.data?.erro || `Erro ao excluir motorista ${modalExcluir.nome}. Tente novamente.`);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-900 font-inter py-8">
      <div className="max-w-xl w-full p-8 bg-neutral-800 rounded-lg shadow-2xl border border-red-700">
        <h2 className="text-3xl font-bold mb-8 text-red-500 text-center">Lista de Motoristas</h2>

        {mensagem && !loading && (
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
          <p className="text-center text-gray-400 mt-6">Carregando motoristas...</p>
        ) : motoristas.length > 0 ? (
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {motoristas.map(motorista => (
              <div 
                key={motorista.id} 
                className="bg-neutral-700 p-5 rounded-lg shadow-md border border-red-600 text-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center"
              >
                <div>
                  <p className="text-xl font-bold text-red-400 mb-1">{motorista.nome}</p>
                  <p className="text-sm text-gray-300">CNH: {motorista.cnh}</p>
                  {motorista.telefone && <p className="text-sm text-gray-300">Tel: {motorista.telefone}</p>}
                </div>
                <div className="mt-3 sm:mt-0 flex gap-2">
                  {/* Futuramente, aqui você pode adicionar um botão de Editar */}
                  {/* <button className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700">Editar</button> */}
                  <button 
                    onClick={() => handleExcluir(motorista.id, motorista.nome)}
                    className="bg-red-600 text-white font-bold py-2 px-4 rounded-md shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-neutral-700 transition duration-300"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          !erro && !mensagem && <p className="text-center text-gray-400 mt-6">Nenhum motorista cadastrado ainda.</p>
        )}

        {/* Modal de confirmação de exclusão */}
        {modalExcluir.aberto && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-neutral-800 p-8 rounded-lg shadow-2xl border border-red-700 max-w-sm w-full text-gray-100">
              <h2 className="text-2xl font-semibold mb-4 text-red-500">Confirmar Exclusão</h2>
              <p className="mb-6">Tem certeza que deseja excluir o motorista <span className="font-bold text-red-400">{modalExcluir.nome}</span>?</p>
              <div className="flex justify-end gap-4">
                <button
                  className="bg-gray-600 text-white font-bold py-2 px-4 rounded-md shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-300"
                  onClick={() => setModalExcluir({ aberto: false, id: null, nome: '' })}
                >
                  Cancelar
                </button>
                <button
                  className="bg-red-600 text-white font-bold py-2 px-4 rounded-md shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-300"
                  onClick={confirmarExcluir}
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListarMotoristas;
