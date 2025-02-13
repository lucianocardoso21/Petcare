// components/BgLogin.js
const BgLogin = ({ className, style }) => {
    return (
      <div
        className={`relative ${className}`} 
        style={{
          backgroundImage: 'url("/images/bg-cat.png")', // Caminho da imagem
          backgroundSize: '54%', // Ajuste o tamanho da imagem
          backgroundRepeat: 'no-repeat', // Evita que a imagem se repita
          backgroundPosition: 'top center', // Centraliza a imagem no topo
          height: '100vh', // Faz o componente ocupar toda a altura da tela
          marginTop: '2.2%',
          ...style, // Permite que estilos extras sejam passados
        }}
      >
      </div>
    );
  };
  
  export default BgLogin;
  