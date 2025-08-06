import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

const GestaoEmpresa = () => {
  const [motoristas, setMotoristas] = useState([]);
  const [caminhoes, setCaminhoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [mensagem, setMensagem] = useState('');

  const [modalExcluir, setModalExcluir] = useState({ aberto: false, tipo: '', id: null, nome: '' });

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = () => {
    setLoading(true);
    setErro('');
    setMensagem('');

    const promessas = [
      axios.get(`${API_BASE_URL}/motoristas`),
      axios.get(`${API_BASE_URL}/caminhoes`)
    ];

    Promise.all(promessas)
      .then(res => {
        setMotoristas(res[0].data);
        setCaminhoes(res[1].data);
        if (res[0].data.length === 0 && res[1].data.length === 0) {
          setMensagem('Nenhum motorista ou caminhão cadastrado ainda.');
        }
      })
      .catch(error => {
        console.error('Erro ao carregar dados:', error);
        setErro('Erro ao carregar os dados. Verifique o console.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleExcluir = (tipo, id, nome) => {
    setModalExcluir({ aberto: true, tipo, id, nome });
  };

  const confirmarExcluir = async () => {
    const { tipo, id, nome } = modalExcluir;
    setModalExcluir({ aberto: false, tipo: '', id: null, nome: '' });
    setMensagem('');
    setErro('');

    try {
      if (tipo === 'motorista') {
        await axios.delete(`${API_BASE_URL}/motoristas/${id}`);
        setMensagem(`Motorista ${nome} excluído com sucesso!`);
      } else if (tipo === 'caminhao') {
        await axios.delete(`${API_BASE_URL}/caminhoes/${id}`);
        setMensagem(`Caminhão ${nome} excluído com sucesso!`);
      }
      carregarDados(); // Recarrega os dados após a exclusão
    } catch (error) {
      console.error(`Erro ao excluir ${tipo}:`, error);
      setErro(error.response?.data?.erro || `Erro ao excluir ${tipo}. Verifique se não há viagens associadas.`);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-900 font-inter py-8">
      <div className="max-w-4xl w-full p-8 bg-neutral-800 rounded-lg shadow-2xl border border-red-700">
        <h2 className="text-3xl font-bold mb-8 text-red-500 text-center">Gestão da Empresa</h2>

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
          <p className="text-center text-gray-400 mt-6">Carregando dados...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Lista de Motoristas */}
            <div>
              <h3 className="text-xl font-bold text-gray-100 mb-4">Motoristas ({motoristas.length})</h3>
              <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                {motoristas.length > 0 ? (
                  motoristas.map(m => (
                    <div key={m.id} className="bg-neutral-700 p-4 rounded-lg shadow-md border border-red-600 text-gray-100 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-red-400">{m.nome}</p>
                        {m.telefone && <p className="text-sm text-gray-300">Tel: {m.telefone}</p>}
                      </div>
                      <button onClick={() => handleExcluir('motorista', m.id, m.nome)} className="bg-red-600 text-white font-bold py-1 px-3 rounded-md shadow-md hover:bg-red-700">Excluir</button>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-400">Nenhum motorista cadastrado.</p>
                )}
              </div>
            </div>

            {/* Lista de Caminhões */}
            <div>
              <h3 className="text-xl font-bold text-gray-100 mb-4">Caminhões ({caminhoes.length})</h3>
              <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                {caminhoes.length > 0 ? (
                  caminhoes.map(c => (
                    <div key={c.id} className="bg-neutral-700 p-4 rounded-lg shadow-md border border-red-600 text-gray-100 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-red-400">{c.placa}</p>
                        {c.nome && <p className="text-sm text-gray-300">Nome: {c.nome}</p>}
                      </div>
                      <button onClick={() => handleExcluir('caminhao', c.id, c.placa)} className="bg-red-600 text-white font-bold py-1 px-3 rounded-md shadow-md hover:bg-red-700">Excluir</button>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-400">Nenhum caminhão cadastrado.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Modal de confirmação de exclusão */}
        {modalExcluir.aberto && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-neutral-800 p-8 rounded-lg shadow-2xl border border-red-700 max-w-sm w-full text-gray-100">
              <h2 className="text-2xl font-semibold mb-4 text-red-500">Confirmar Exclusão</h2>
              <p className="mb-6">Tem certeza que deseja excluir "{modalExcluir.nome}"?</p>
              <div className="flex justify-end gap-4">
                <button onClick={() => setModalExcluir({ aberto: false, tipo: '', id: null, nome: '' })} className="bg-gray-600 text-white font-bold py-2 px-4 rounded-md shadow-md hover:bg-gray-700">Cancelar</button>
                <button onClick={confirmarExcluir} className="bg-red-600 text-white font-bold py-2 px-4 rounded-md shadow-md hover:bg-red-700">Excluir</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GestaoEmpresa;
