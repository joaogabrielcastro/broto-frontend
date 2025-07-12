import React, { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

const CadastroCliente = () => {
  const [form, setForm] = useState({
    nome: '',
    telefone: '',
    email: '',
    endereco: ''
  });
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const cadastrar = async (event) => {
    event.preventDefault(); // Evita o comportamento padrão de recarregar a página

    setMensagem(''); // Limpa mensagens anteriores
    setErro('');     // Limpa erros anteriores

    try {
      await axios.post(`${API_BASE_URL}/clientes`, form);
      setMensagem('Cliente cadastrado com sucesso!');
      setForm({ nome: '', telefone: '', email: '', endereco: '' }); // Limpa o formulário
    } catch (error) {
      console.error('Erro ao cadastrar cliente:', error);
      if (error.response) {
        setErro(error.response.data.erro || 'Erro ao cadastrar cliente.');
      } else if (error.request) {
        setErro('Erro de conexão com o servidor. Verifique se o backend está rodando.');
      } else {
        setErro('Erro desconhecido ao tentar cadastrar cliente.');
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-900 font-inter py-8">
      <div className="max-w-md w-full p-8 bg-neutral-800 rounded-lg shadow-2xl border border-red-700">
        <h2 className="text-3xl font-bold mb-6 text-red-500 text-center">Cadastrar Cliente</h2>
        
        <form onSubmit={cadastrar}>
          {/* Nome */}
          <div className="mb-4">
            <label htmlFor="nome" className="block text-gray-200 text-sm font-semibold mb-2">
              Nome Completo:
            </label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={form.nome}
              onChange={handleChange}
              className="w-full p-3 border border-red-700 rounded-md bg-neutral-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-300"
              placeholder="Ex: Cliente A Transportes"
              required
            />
          </div>

          {/* Telefone */}
          <div className="mb-4">
            <label htmlFor="telefone" className="block text-gray-200 text-sm font-semibold mb-2">
              Telefone:
            </label>
            <input
              type="text"
              id="telefone"
              name="telefone"
              value={form.telefone}
              onChange={handleChange}
              className="w-full p-3 border border-red-700 rounded-md bg-neutral-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-300"
              placeholder="Ex: (XX) XXXXX-XXXX"
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-200 text-sm font-semibold mb-2">
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full p-3 border border-red-700 rounded-md bg-neutral-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-300"
              placeholder="Ex: cliente@email.com"
              required
            />
          </div>

          {/* Endereço */}
          <div className="mb-6">
            <label htmlFor="endereco" className="block text-gray-200 text-sm font-semibold mb-2">
              Endereço:
            </label>
            <input
              type="text"
              id="endereco"
              name="endereco"
              value={form.endereco}
              onChange={handleChange}
              className="w-full p-3 border border-red-700 rounded-md bg-neutral-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-300"
              placeholder="Ex: Rua Exemplo, 123 - Cidade"
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-red-600 text-white font-bold py-3 px-4 rounded-md shadow-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-neutral-800 transition duration-300 transform hover:scale-105"
          >
            Cadastrar Cliente
          </button>
        </form>

        {mensagem && (
          <p className="mt-6 text-center text-green-400 bg-green-900 bg-opacity-30 border border-green-700 rounded-md p-3">
            {mensagem}
          </p>
        )}
        {erro && (
          <p className="mt-6 text-center text-red-400 bg-red-900 bg-opacity-30 border border-red-700 rounded-md p-3">
            {erro}
          </p>
        )}
      </div>
    </div>
  );
};

export default CadastroCliente;
