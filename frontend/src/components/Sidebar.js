import Link from 'next-link';

const Sidebar = () => {
    return(
        <div className="sidebar">
            <h3>Petcare Dashboard</h3>
            <ul>
                <li><Link href="/dashboard"><a>Home</a></Link></li>
                <li><Link href="/dashboard/pets"><a>Pets</a></Link></li>
                <li><Link href="/dashboard/vacinas"><a>Vacinas</a></Link></li>
                <li><Link href="/dashboard/procedimentos"><a>Procedimentos realizados</a></Link></li>
                <li><Link href="/dashboard/medicacao"><a>Medicação administrada</a></Link></li>
            </ul>
        </div>
    );
};

export default Sidebar;