import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

export default function dashboard() {
    const [cliente, setCliente] = useState(null);
    const [pets, setPets] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const clienteId = localStorage.getItem('clienteId'); // ou outro método para obter o ID do cliente logado
                if (!clienteId) throw new Error('ID do cliente não encontrado');

                // Busca o cliente pelo ID
                const clienteResponse = await fetch(`/clientes/${clienteId}`);
                if (!clienteResponse.ok)
                    throw new Error('Erro ao buscar dados do cliente');
                const clienteData = await clienteResponse.json();
                setCliente(clienteData);

                // Busca os pets relacionados ao cliente
                const petsResponse = await fetch('/api/pets');
                if (!petsResponse.ok)
                    throw new Error('Erro ao buscar dados dos pets');
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
            <div className='flex flex-col flex-1'>
                <Header/>
            </div>
            <div className='flex h-screen'>
                <Sidebar />
            </div>
        </div>
    );
}
