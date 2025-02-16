const Header = ({cliente})=> {
    return(
        <div className="header">
            <h1>Bem-vindo, {cliente?.nome}</h1>
            <p>{cliente?.endereco} | {cliente?.celular}</p>
        </div>
    );
};

export default Header;