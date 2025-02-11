'use client';
import { useForm } from 'react-hook-form';

export default function LoginForm({ onSubmit, errorMessage, isLoading }) {
  const { register, handleSubmit, formState: { errors } } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-96 p-6 border rounded shadow-md">
      {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
      
      <div className="mb-4">
        <label htmlFor="cpf">CPF:</label>
        <input
          type="text"
          id="cpf"
          {...register('cpf', { required: 'CPF obrigatório' })}
          className="w-full px-3 py-2 border rounded"
        />
        {errors.cpf && <p className="text-red-500">{errors.cpf.message}</p>}
      </div>

      <div className="mb-4">
        <label htmlFor="senha">Senha:</label>
        <input
          type="password"
          id="senha"
          {...register('senha', { required: 'Senha obrigatória' })}
          className="w-full px-3 py-2 border rounded"
        />
        {errors.senha && <p className="text-red-500">{errors.senha.message}</p>}
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 rounded"
        disabled={isLoading}
      >
        {isLoading ? 'Carregando...' : 'Entrar'}
      </button>
    </form>
  );
}
