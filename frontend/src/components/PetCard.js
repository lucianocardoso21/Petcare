import Link from 'next/link';

const PetCard = ({pet}) => {
    return(
        <div className="pet-card">
            <Link href={`/pet/${pet.id}`}>
                <a>
                    <h3>{pet.nome}</h3>
                    <p>Idade: {pet.idade} anos</p>
                </a>
            </Link>
        </div>
    );
};

export default PetCard;