// /pages/pet/[id].js
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';

const PetDetails = () => {
  const router = useRouter();
  const { id } = router.query;  // Pegando o 'id' da URL

  const [pet, setPet] = useState(null);  // Estado para armazenar os dados do pet
  const [loading, setLoading] = useState(true);  // Estado para controlar o carregamento
  const [error, setError] = useState(null);  // Estado para controlar erros

  useEffect(() => {
    if (id) {
      // Fazendo a requisição à API para buscar os dados do pet
      fetch(`/api/pets/${id}`)  // Supondo que você tenha a rota da API
        .then((response) => {
          if (!response.ok) {
            throw new Error('Falha ao buscar dados do pet');
          }
          return response.json();
        })
        .then((data) => {
          setPet(data);  // Armazenando os dados do pet
          setLoading(false);  // Atualizando o estado de carregamento
        })
        .catch((err) => {
          setError(err.message);  // Atualizando o estado de erro
          setLoading(false);
        });
    }
  }, [id]);  // Só executa quando 'id' mudar

  if (loading) return <div>Carregando...</div>;  // Exibe "Carregando..." enquanto os dados estão sendo buscados
  if (error) return <div>Erro: {error}</div>;  // Exibe erro, se houver

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="content">
        <h2>Detalhes do Pet: {pet?.nome}</h2>
        <div>
          <h3>Vacinas</h3>
          <ul>
            {pet?.vacinas.map((vacina, index) => (
              <li key={index}>{vacina}</li>
            ))}
          </ul>
          <h3>Procedimentos</h3>
          <ul>
            {pet?.procedimentos.map((procedimento, index) => (
              <li key={index}>{procedimento}</li>
            ))}
          </ul>
          <h3>Medicação</h3>
          <ul>
            {pet?.medicacao.map((medicacao, index) => (
              <li key={index}>{medicacao}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PetDetails;
