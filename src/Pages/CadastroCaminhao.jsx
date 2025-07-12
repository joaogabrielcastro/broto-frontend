import { useState } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

const CadastroCaminhao = () => {
  const [placa, setPlaca] = useState('');
  const [nomeCaminhao, setNomeCaminhao] = useState(''); // NOVO ESTADO PARA NOME DO CAMINHÃO
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');

  const cadastrar = async (event) => {
    event.preventDefault();

    setMensagem('');
    setErro('');

    try {
      // Inclui o campo 'nome' na requisição POST
      const response = await axios.post(`${API_BASE_URL}/caminhoes`, { 
        placa, 
        nome: nomeCaminhao // Envia o nome (pode ser vazio, pois é opcional)
      });
      
      setMensagem('Caminhão cadastrado com sucesso!');
      setPlaca(''); // Limpa o campo de placa
      setNomeCaminhao(''); // Limpa o campo de nome
    } catch (error) {
      console.error('Erro de rede ou na requisição:', error);
      if (error.response) {
        setErro(error.response.data.erro || 'Erro ao cadastrar caminhão.');
      } else if (error.request) {
        setErro('Erro de conexão com o servidor. Verifique se o backend está rodando.');
      } else {
        setErro('Erro desconhecido ao tentar cadastrar caminhão.');
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-900 font-inter">
      <div className="max-w-md w-full p-8 bg-neutral-800 rounded-lg shadow-2xl border border-red-700">
        <h2 className="text-3xl font-bold mb-6 text-red-500 text-center">Cadastrar Caminhão</h2>
        <form onSubmit={cadastrar}>
          <div className="mb-4">
            <label htmlFor="placa" className="block text-gray-200 text-sm font-semibold mb-2">
              Placa:
            </label>
            <input
              type="text"
              id="placa"
              className="w-full p-3 border border-red-700 rounded-md bg-neutral-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-300"
              value={placa}
              onChange={(e) => setPlaca(e.target.value)}
              required
              placeholder="Ex: ABC1234"
            />
          </div>

          {/* NOVO CAMPO: Nome do Caminhão (Opcional) */}
          <div className="mb-4">
            <label htmlFor="nomeCaminhao" className="block text-gray-200 text-sm font-semibold mb-2">
              Nome do Caminhão (opcional):
            </label>
            <input
              type="text"
              id="nomeCaminhao"
              className="w-full p-3 border border-red-700 rounded-md bg-neutral-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-300"
              value={nomeCaminhao}
              onChange={(e) => setNomeCaminhao(e.target.value)}
              placeholder="Ex: Caminhão Rápido"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 text-white font-bold py-3 px-4 rounded-md shadow-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-neutral-800 transition duration-300 transform hover:scale-105"
          >
            Cadastrar Caminhão
          </button>
        </form>
        {mensagem && (
          <p className="mt-4 text-green-600 bg-green-100 border border-green-400 rounded p-2">
            {mensagem}
          </p>
        )}
        {erro && (
          <p className="mt-4 text-red-600 bg-red-100 border border-red-400 rounded p-2">
            {erro}
          </p>
        )}
      </div>
    </div>
  );
}

export default CadastroCaminhao;
