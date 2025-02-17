import React from 'react';
import PropTypes from 'prop-types';
import style from '@/styles/header.module.css';
const Header = ({ cliente }) => {
    return (
        <div className={style.header}>
            <h1>Bem-vindo, {cliente?.nome}</h1>
            <p>
                {cliente?.endereco} | {cliente?.celular}
            </p>
        </div>
    );
};

Header.propTypes = {
    cliente: PropTypes.shape({
        nome: PropTypes.string,
        endereco: PropTypes.string,
        celular: PropTypes.string,
    }).isRequired,
};

export default Header;
