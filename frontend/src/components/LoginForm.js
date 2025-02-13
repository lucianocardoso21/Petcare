// LoginForm.js
'use client';
import { useForm } from 'react-hook-form';
import MaskedInput from 'react-text-mask';

export default function LoginForm({ onSubmit, errorMessage, isLoading }) {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();

  const cpfMask = [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-96 p-6 border rounded shadow-md form-container">
      <h1 className="font-delius text-xl text-center font-bold text-purple-800 heading">Faça seu Login</h1>
      {errorMessage && <p className="text-red-500 mb-4" aria-live="assertive">{errorMessage}</p>}
      
      <div className="mb-4 inputContainer">
        <label className='font-bold text-purple-800' htmlFor="cpf">CPF:</label>
        <MaskedInput
          mask={cpfMask}
          id="cpf"
          {...register('cpf', { required: 'CPF obrigatório' })}
          onChange={(e) => setValue('cpf', e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />
        {errors.cpf && <p className="text-red-500">{errors.cpf.message}</p>}
      </div>

      <div className="mb-4 inputContainer">
        <label className='font-bold text-purple-800' htmlFor="senha">Senha:</label>
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
        className="w-full bg-purple-700 text-white py-2 rounded"
        disabled={isLoading}
      >
        {isLoading ? 'Carregando...' : 'Entrar'}
      </button>
    </form>
  );
}
