import React, { useState, useEffect } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

const CadastroGeral = () => {
  const [activeTab, setActiveTab] = useState('caminhao'); // Estado para controlar a aba ativa

  // --- Componente de Cadastro de Caminhão ---
  const CadastroCaminhaoForm = () => {
    const [placa, setPlaca] = useState('');
    const [nomeCaminhao, setNomeCaminhao] = useState('');
    const [mensagem, setMensagem] = useState('');
    const [erro, setErro] = useState('');

    const cadastrar = async (event) => {
      event.preventDefault();
      setMensagem('');
      setErro('');
      try {
        await axios.post(`${API_BASE_URL}/caminhoes`, { placa, nome: nomeCaminhao });
        setMensagem('Caminhão cadastrado com sucesso!');
        setPlaca('');
        setNomeCaminhao('');
      } catch (error) {
        console.error('Erro ao cadastrar caminhão:', error);
        setErro(error.response?.data?.erro || 'Erro de conexão com o servidor ou ao cadastrar caminhão.');
      }
    };

    return (
      <div className="p-6 bg-neutral-800 rounded-lg shadow-md border border-red-700">
        <h3 className="text-2xl font-bold mb-4 text-red-500 text-center">Cadastrar Caminhão</h3>
        <form onSubmit={cadastrar}>
          <div className="mb-4">
            <label htmlFor="placa" className="block text-gray-200 text-sm font-semibold mb-2">Placa:</label>
            <input type="text" id="placa" className="w-full p-3 border border-red-700 rounded-md bg-neutral-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500" value={placa} onChange={(e) => setPlaca(e.target.value)} required placeholder="Ex: ABC1234"/>
          </div>
          <div className="mb-4">
            <label htmlFor="nomeCaminhao" className="block text-gray-200 text-sm font-semibold mb-2">Nome do Caminhão (opcional):</label>
            <input type="text" id="nomeCaminhao" className="w-full p-3 border border-red-700 rounded-md bg-neutral-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500" value={nomeCaminhao} onChange={(e) => setNomeCaminhao(e.target.value)} placeholder="Ex: Caminhão Rápido"/>
          </div>
          <button type="submit" className="w-full bg-red-600 text-white font-bold py-3 px-4 rounded-md shadow-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-300 transform hover:scale-105">Cadastrar Caminhão</button>
        </form>
        {mensagem && (<p className="mt-4 text-green-400 bg-green-900 bg-opacity-30 border border-green-700 rounded-md p-2">{mensagem}</p>)}
        {erro && (<p className="mt-4 text-red-400 bg-red-900 bg-opacity-30 border border-red-700 rounded-md p-2">{erro}</p>)}
      </div>
    );
  };

  // --- Componente de Cadastro de Motorista ---
  const CadastroMotoristaForm = () => {
    const [form, setForm] = useState({ nome: '', telefone: '' });
    const [mensagem, setMensagem] = useState('');
    const [erro, setErro] = useState('');

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
    const cadastrar = async (event) => {
      event.preventDefault();
      setMensagem('');
      setErro('');
      try {
        await axios.post(`${API_BASE_URL}/motoristas`, form);
        setMensagem('Motorista cadastrado com sucesso!');
        setForm({ nome: '', telefone: '' });
      } catch (error) {
        console.error('Erro ao cadastrar motorista:', error);
        setErro(error.response?.data?.erro || 'Erro de conexão com o servidor ou ao cadastrar motorista.');
      }
    };

    return (
      <div className="p-6 bg-neutral-800 rounded-lg shadow-md border border-red-700">
        <h3 className="text-2xl font-bold mb-4 text-red-500 text-center">Cadastrar Motorista</h3>
        <form onSubmit={cadastrar}>
          <div className="mb-4">
            <label htmlFor="nome" className="block text-gray-200 text-sm font-semibold mb-2">Nome Completo:</label>
            <input type="text" id="nome" name="nome" value={form.nome} onChange={handleChange} className="w-full p-3 border border-red-700 rounded-md bg-neutral-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="Ex: João da Silva" required/>
          </div>
          <div className="mb-6">
            <label htmlFor="telefone" className="block text-gray-200 text-sm font-semibold mb-2">Telefone (opcional):</label>
            <input type="text" id="telefone" name="telefone" value={form.telefone} onChange={handleChange} className="w-full p-3 border border-red-700 rounded-md bg-neutral-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="Ex: (XX) XXXXX-XXXX"/>
          </div>
          <button type="submit" className="w-full bg-red-600 text-white font-bold py-3 px-4 rounded-md shadow-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-300 transform hover:scale-105">Cadastrar Motorista</button>
        </form>
        {mensagem && (<p className="mt-4 text-green-400 bg-green-900 bg-opacity-30 border border-green-700 rounded-md p-2">{mensagem}</p>)}
        {erro && (<p className="mt-4 text-red-400 bg-red-900 bg-opacity-30 border border-red-700 rounded-md p-2">{erro}</p>)}
      </div>
    );
  };

  // --- Componente de Cadastro de Cliente ---
  const CadastroClienteForm = () => {
    const [form, setForm] = useState({ nome: '', telefone: '', email: '', endereco: '' });
    const [mensagem, setMensagem] = useState('');
    const [erro, setErro] = useState('');

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
    const cadastrar = async (event) => {
      event.preventDefault();
      setMensagem('');
      setErro('');
      try {
        await axios.post(`${API_BASE_URL}/clientes`, form);
        setMensagem('Cliente cadastrado com sucesso!');
        setForm({ nome: '', telefone: '', email: '', endereco: '' });
      } catch (error) {
        console.error('Erro ao cadastrar cliente:', error);
        setErro(error.response?.data?.erro || 'Erro de conexão com o servidor ou ao cadastrar cliente.');
      }
    };

    return (
      <div className="p-6 bg-neutral-800 rounded-lg shadow-md border border-red-700">
        <h3 className="text-2xl font-bold mb-4 text-red-500 text-center">Cadastrar Cliente</h3>
        <form onSubmit={cadastrar}>
          <div className="mb-4">
            <label htmlFor="nome" className="block text-gray-200 text-sm font-semibold mb-2">Nome Completo:</label>
            <input type="text" id="nome" name="nome" value={form.nome} onChange={handleChange} className="w-full p-3 border border-red-700 rounded-md bg-neutral-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="Ex: Cliente A Transportes" required/>
          </div>
          <div className="mb-4">
            <label htmlFor="telefone" className="block text-gray-200 text-sm font-semibold mb-2">Telefone:</label>
            <input type="text" id="telefone" name="telefone" value={form.telefone} onChange={handleChange} className="w-full p-3 border border-red-700 rounded-md bg-neutral-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="Ex: (XX) XXXXX-XXXX"/>
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-200 text-sm font-semibold mb-2">Email:</label>
            <input type="email" id="email" name="email" value={form.email} onChange={handleChange} className="w-full p-3 border border-red-700 rounded-md bg-neutral-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="Ex: cliente@email.com" required/>
          </div>
          <div className="mb-6">
            <label htmlFor="endereco" className="block text-gray-200 text-sm font-semibold mb-2">Endereço:</label>
            <input type="text" id="endereco" name="endereco" value={form.endereco} onChange={handleChange} className="w-full p-3 border border-red-700 rounded-md bg-neutral-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="Ex: Rua Exemplo, 123 - Cidade"/>
          </div>
          <button type="submit" className="w-full bg-red-600 text-white font-bold py-3 px-4 rounded-md shadow-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-300 transform hover:scale-105">Cadastrar Cliente</button>
        </form>
        {mensagem && (<p className="mt-4 text-green-400 bg-green-900 bg-opacity-30 border border-green-700 rounded-md p-2">{mensagem}</p>)}
        {erro && (<p className="mt-4 text-red-400 bg-red-900 bg-opacity-30 border border-red-700 rounded-md p-2">{erro}</p>)}
      </div>
    );
  };

  // --- Componente de Cadastro de Viagem ---
  const CadastroViagemForm = () => {
    const [placas, setPlacas] = useState([]);
    const [motoristas, setMotoristas] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [form, setForm] = useState({
      placa: "", motorista_id: "", cliente_id: "", inicio: "", fim: "",
      origem: "", destino: "", frete: "", lucro_total: "",
      status: "Em andamento", data_termino: ""
    });
    const [mensagem, setMensagem] = useState("");
    const [erro, setErro] = useState("");

    useEffect(() => {
      axios.get(`${API_BASE_URL}/caminhoes`).then(res => setPlacas(res.data)).catch((error) => { console.error("Erro ao buscar placas:", error); setErro("Erro ao carregar placas."); setPlacas([]); });
      axios.get(`${API_BASE_URL}/motoristas`).then(res => setMotoristas(res.data)).catch((error) => { console.error("Erro ao buscar motoristas:", error); setErro(prev => prev + " Erro ao carregar motoristas."); setMotoristas([]); });
      axios.get(`${API_BASE_URL}/clientes`).then(res => setClientes(res.data)).catch((error) => { console.error("Erro ao buscar clientes:", error); setErro(prev => prev + " Erro ao carregar clientes."); setClientes([]); });
    }, []);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
    const cadastrar = async (event) => {
      event.preventDefault();
      setMensagem(''); setErro('');
      try {
        await axios.post(`${API_BASE_URL}/viagens`, form);
        setMensagem("Viagem cadastrada com sucesso!");
        setForm({ placa: "", motorista_id: "", cliente_id: "", inicio: "", fim: "", origem: "", destino: "", frete: "", lucro_total: "", status: "Em andamento", data_termino: "" });
      } catch (error) {
        setErro(error.response?.data?.erro || 'Erro de conexão com o servidor ou ao cadastrar viagem.');
        console.error("Erro ao cadastrar viagem:", error);
      }
    };

    return (
      <div className="p-6 bg-neutral-800 rounded-lg shadow-md border border-red-700">
        <h3 className="text-2xl font-bold mb-4 text-red-500 text-center">Cadastrar Viagem</h3>
        <form onSubmit={cadastrar}>
          <div className="mb-4">
            <label htmlFor="placa" className="block text-gray-200 text-sm font-semibold mb-2">Placa do caminhão:</label>
            <select id="placa" name="placa" value={form.placa} onChange={handleChange} className="w-full p-3 border border-red-700 rounded-md bg-neutral-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500" required><option value="">Selecione a Placa</option>{placas.map((c) => (<option key={c.id} value={c.placa}>{c.placa}</option>))}</select>
            {placas.length === 0 && !erro && (<p className="text-sm text-yellow-500 mt-2">Nenhuma placa disponível. Cadastre caminhões primeiro.</p>)}
          </div>
          <div className="mb-4">
            <label htmlFor="motorista_id" className="block text-gray-200 text-sm font-semibold mb-2">Motorista:</label>
            <select id="motorista_id" name="motorista_id" value={form.motorista_id} onChange={handleChange} className="w-full p-3 border border-red-700 rounded-md bg-neutral-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500" required><option value="">Selecione o Motorista</option>{motoristas.map((m) => (<option key={m.id} value={m.id}>{m.nome}</option>))}</select>
            {motoristas.length === 0 && !erro && (<p className="text-sm text-yellow-500 mt-2">Nenhum motorista disponível. Cadastre motoristas primeiro.</p>)}
          </div>
          <div className="mb-4">
            <label htmlFor="cliente_id" className="block text-gray-200 text-sm font-semibold mb-2">Cliente:</label>
            <select id="cliente_id" name="cliente_id" value={form.cliente_id} onChange={handleChange} className="w-full p-3 border border-red-700 rounded-md bg-neutral-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500" required><option value="">Selecione o Cliente</option>{clientes.map((c) => (<option key={c.id} value={c.id}>{c.nome}</option>))}</select>
            {clientes.length === 0 && !erro && (<p className="text-sm text-yellow-500 mt-2">Nenhum cliente disponível. Cadastre clientes primeiro.</p>)}
          </div>
          <div className="mb-4">
            <label htmlFor="inicio" className="block text-gray-200 text-sm font-semibold mb-2">Data Início:</label>
            <input type="date" id="inicio" name="inicio" value={form.inicio} onChange={handleChange} className="w-full p-3 border border-red-700 rounded-md bg-neutral-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500" required/>
          </div>
          <div className="mb-4">
            <label htmlFor="fim" className="block text-gray-200 text-sm font-semibold mb-2">Data Fim:</label>
            <input type="date" id="fim" name="fim" value={form.fim} onChange={handleChange} className="w-full p-3 border border-red-700 rounded-md bg-neutral-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500" required/>
          </div>
          <div className="mb-4">
            <label htmlFor="origem" className="block text-gray-200 text-sm font-semibold mb-2">Origem:</label>
            <input type="text" id="origem" name="origem" value={form.origem} onChange={handleChange} className="w-full p-3 border border-red-700 rounded-md bg-neutral-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="Ex: Curitiba" required/>
          </div>
          <div className="mb-4">
            <label htmlFor="destino" className="block text-gray-200 text-sm font-semibold mb-2">Destino:</label>
            <input type="text" id="destino" name="destino" value={form.destino} onChange={handleChange} className="w-full p-3 border border-red-700 rounded-md bg-neutral-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="Ex: Acre" required/>
          </div>
          <div className="mb-4">
            <label htmlFor="frete" className="block text-gray-200 text-sm font-semibold mb-2">Valor do Frete:</label>
            <input type="number" id="frete" name="frete" value={form.frete} onChange={handleChange} className="w-full p-3 border border-red-700 rounded-md bg-neutral-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="Ex: 5000" required/>
          </div>
          <div className="mb-6">
            <label htmlFor="lucro_total" className="block text-gray-200 text-sm font-semibold mb-2">Lucro Total:</label>
            <input type="number" id="lucro_total" name="lucro_total" value={form.lucro_total} onChange={handleChange} className="w-full p-3 border border-red-700 rounded-md bg-neutral-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="Ex: 1500" required/>
          </div>
          <button type="submit" className="w-full bg-red-600 text-white font-bold py-3 px-4 rounded-md shadow-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-300 transform hover:scale-105">Cadastrar Viagem</button>
        </form>
        {mensagem && (<p className="mt-6 text-center text-green-400 bg-green-900 bg-opacity-30 border border-green-700 rounded-md p-3">{mensagem}</p>)}
        {erro && (<p className="mt-6 text-center text-red-400 bg-red-900 bg-opacity-30 border border-red-700 rounded-md p-3">{erro}</p>)}
      </div>
    );
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-900 font-inter py-8">
      <div className="max-w-xl w-full"> {/* Container sem padding/borda para as abas */}
        {/* Navegação por abas */}
        <div className="flex justify-center mb-6 space-x-2 p-2 bg-neutral-800 rounded-lg shadow-xl border border-red-700">
          <button onClick={() => setActiveTab('caminhao')} className={`px-4 py-2 rounded-md font-semibold transition duration-300 ${activeTab === 'caminhao' ? 'bg-red-700 text-white shadow-md' : 'text-gray-300 hover:text-red-400 hover:bg-neutral-700'}`}>Caminhão</button>
          <button onClick={() => setActiveTab('motorista')} className={`px-4 py-2 rounded-md font-semibold transition duration-300 ${activeTab === 'motorista' ? 'bg-red-700 text-white shadow-md' : 'text-gray-300 hover:text-red-400 hover:bg-neutral-700'}`}>Motorista</button>
          <button onClick={() => setActiveTab('cliente')} className={`px-4 py-2 rounded-md font-semibold transition duration-300 ${activeTab === 'cliente' ? 'bg-red-700 text-white shadow-md' : 'text-gray-300 hover:text-red-400 hover:bg-neutral-700'}`}>Cliente</button>
          <button onClick={() => setActiveTab('viagem')} className={`px-4 py-2 rounded-md font-semibold transition duration-300 ${activeTab === 'viagem' ? 'bg-red-700 text-white shadow-md' : 'text-gray-300 hover:text-red-400 hover:bg-neutral-700'}`}>Viagem</button>
        </div>

        {/* Conteúdo da aba ativa */}
        <div className="mt-6">
          {activeTab === 'caminhao' && <CadastroCaminhaoForm />}
          {activeTab === 'motorista' && <CadastroMotoristaForm />}
          {activeTab === 'cliente' && <CadastroClienteForm />}
          {activeTab === 'viagem' && <CadastroViagemForm />}
        </div>
      </div>
    </div>
  );
};

export default CadastroGeral;