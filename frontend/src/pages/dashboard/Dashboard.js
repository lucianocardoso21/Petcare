import React, { useEffect, useState } from 'react';
import { verificarAutenticacao } from '@/utils/AuthUtils';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

export default function Dashboard() {
  const [cliente, setCliente] = useState(null);
  const [pets, setPets] = useState([]);
  const [autenticado, setAutenticado] = useState(null); // Pode ser null inicialmente para saber se estamos verificando

  useEffect(() => {
    const verificarUsuario = async () => {
      const autenticado = await verificarAutenticacao();
      setAutenticado(autenticado);

      if (!autenticado) {
        console.log("Usuário não autenticado, redirecionando...");
        window.location.href = "/login"; // Redireciona para a página de login
      } else {
        fetchData();
      }
    };

    verificarUsuario();
  }, []);

  const fetchData = async () => {
    try {
      const clienteId = localStorage.getItem('clienteId');
      if (!clienteId) throw new Error('ID do cliente não encontrado');

      const clienteResponse = await fetch(`/clientes/${clienteId}`);
      if (!clienteResponse.ok) throw new Error('Erro ao buscar dados do cliente');
      const clienteData = await clienteResponse.json();
      setCliente(clienteData);

      const petsResponse = await fetch(`/api/pets?clienteId=${clienteId}`);
      if (!petsResponse.ok) throw new Error('Erro ao buscar dados dos pets');
      const petsData = await petsResponse.json();
      setPets(petsData);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    }
  };

  return (
    <div className="dashboard">
      <Header />
      <Sidebar />
      {autenticado === null ? (  // Enquanto estamos verificando a autenticação
        <p>Verificando autenticação...</p>
      ) : autenticado ? ( // Se estiver autenticado
        <>
          <div>
            <h2>Cliente: {cliente?.nome}</h2>
            <h3>Pets do Cliente:</h3>
            <ul>
              {pets.map(pet => (
                <li key={pet.id}>{pet.nome}</li>
              ))}
            </ul>
          </div>
        </>
      ) : ( // Caso não esteja autenticado
        <p>Você não está autenticado.</p>
      )}
    </div>
  );
}
