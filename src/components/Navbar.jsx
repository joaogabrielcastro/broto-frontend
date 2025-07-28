import React from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  const linkClasses = ({ isActive }) =>
    `px-4 py-2 rounded-md transition duration-300 ease-in-out font-semibold text-lg whitespace-nowrap
     ${
       isActive
         ? "bg-red-700 text-white shadow-lg transform scale-105"
         : "text-gray-300 hover:text-red-400 hover:bg-neutral-700"
     }`;

  return (
    <nav className="bg-neutral-800 p-4 shadow-2xl border-b-4 border-red-700 font-inter sticky top-0 z-40">
      <div className="container mx-auto flex flex-wrap justify-center items-center gap-x-6 gap-y-4">
        <NavLink to="/" className={linkClasses}>
          Consulta
        </NavLink>
        <NavLink to="/situacao" className={linkClasses}>
          Situação Atual
        </NavLink>

        {/* NOVO LINK ÚNICO para todos os cadastros */}
        <NavLink to="/cadastrar" className={linkClasses}>
          Cadastrar
        </NavLink>
        <NavLink to="/editar" className={linkClasses}>
          Editar Viagens
        </NavLink>
        <NavLink to="/resumo" className={linkClasses}>
          Resumo Financeiro
        </NavLink>
        <NavLink to="/graficos" className={linkClasses}>
          Gráficos
        </NavLink>
        <NavLink to="/exportar" className={linkClasses}>
          Exportar Dados
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
