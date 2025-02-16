'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import PetCard from '@/components/Petcard';

export default function Home() {
  const [cliente, setCliente] = useState(null);
  const [pets, setPets] = useState([]);

  useEffect(() => {
    // Busca os dados do cliente e dos pets ao carregar a página
    const fetchData = async () => {
      try {
        // Busca o cliente
        const clienteResponse = await fetch('/api/cliente');
        if (!clienteResponse.ok) throw new Error('Erro ao buscar dados do cliente');
        const clienteData = await clienteResponse.json();
        setCliente(clienteData);

        // Busca os pets relacionados ao cliente
        const petsResponse = await fetch('/api/pets');
        if (!petsResponse.ok) throw new Error('Erro ao buscar dados dos pets');
        const petsData = await petsResponse.json();
        setPets(petsData);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="content">
        {cliente && <Header cliente={cliente} />}
        <div className="pet-list">
          {pets.length > 0 ? (
            pets.map((pet) => <PetCard key={pet.id} pet={pet} />)
          ) : (
            <p>Nenhum pet cadastrado.</p>
          )}
        </div>
      </div>
    </div>
  );
}
