import React from 'react';
import Link from 'next/link';
import styles from '@/styles/sidebar.module.css';

const Sidebar = () => {
  return (
    <div className="min-h-screen flex flex-col flex-auto flex-shrink-0 antialiased bg-gray-50 text-gray-800">
      <div className="flex flex-col top-0 left-0 w-64 bg-white h-full border-r">
        <div className="overflow-y-auto overflow-x-hidden flex-grow">
          <ul className="flex flex-col py-4 space-y-1">
            <li className="px-5">
              <div className="flex flex-row items-center h-8">
                <div className="text-sm font-light tracking-wide text-gray-500">Menu</div>
              </div>
            </li>
            <li>
              <Link href="/" className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6">
                <span className="inline-flex justify-center items-center ml-4">
                  🏠
                </span>
                <span className="ml-2 text-sm tracking-wide truncate">Home</span>
              </Link>
            </li>
            <li>
              <Link href="/profile" className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6">
                <span className="inline-flex justify-center items-center ml-4">
                  👤
                </span>
                <span className="ml-2 text-sm tracking-wide truncate">Meu Perfil</span>
              </Link>
            </li>
            <li>
              <Link href="/inbox" className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6">
                <span className="inline-flex justify-center items-center ml-4">
                🐾
                </span>
                <span className="ml-2 text-sm tracking-wide truncate">Pets</span>
              </Link>
            </li>
            <li>
              <Link href="/messages" className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6">
                <span className="inline-flex justify-center items-center ml-4">
                💉 
                </span>
                <span className="ml-2 text-sm tracking-wide truncate">Vacinas</span>
              </Link>
            </li>
            <li>
              <Link href="/notifications" className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6">
                <span className="inline-flex justify-center items-center ml-4">
                🏥 
                </span>
                <span className="ml-2 text-sm tracking-wide truncate">Procedimentos Médicos</span>
              </Link>
            </li>
            <li>
              <Link href="/tasks" className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6">
                <span className="inline-flex justify-center items-center ml-4">
                💊 
                </span>
                <span className="ml-2 text-sm tracking-wide truncate">Medicações Administradas</span>
              </Link>
            </li>
            <li>
              <Link href="/settings" className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6">
                <span className="inline-flex justify-center items-center ml-4">
                  ⚙️
                </span>
                <span className="ml-2 text-sm tracking-wide truncate">Configurações</span>
              </Link>
            </li>
            <li>
              <Link href="/logout" className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6">
                <span className="inline-flex justify-center items-center ml-4">
                  🚪
                </span>
                <span className="ml-2 text-sm tracking-wide truncate">Logout</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
