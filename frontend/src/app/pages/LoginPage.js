// LoginPage.js
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoginForm from '@/components/LoginForm';

export default function LoginPage({ className }) {
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Estado para controlar o carregamento
  const router = useRouter();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleLogin = async (data) => {
    setErrorMessage('');
    setIsLoading(true); // Ativar o estado de carregamento
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('CPF ou senha inválidos');
      }

      const result = await response.json(); // Supondo que o backend retorne um resultado
      // Aqui você pode manipular o token ou redirecionar diretamente
      router.push('/dashboard');
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false); // Desativar o carregamento
    }
  };

  return (
    <div className={`${className} shadow-2xl`}>
      <LoginForm onSubmit={handleLogin} errorMessage={errorMessage} isLoading={isLoading} />
    </div>
  );
}
