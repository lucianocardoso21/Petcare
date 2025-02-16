import Link from 'next/link';

const Sidebar = () => {
  return (
    <nav>
      <ul>
        <li><Link href="/">Início</Link></li>
        <li><Link href="/pets">Pets</Link></li>
        <li><Link href="/vacinas">Vacinas</Link></li>
        <li><Link href="/procedimentos">Procedimentos</Link></li>
        <li><Link href="/medicacao">Medicação</Link></li>
      </ul>
    </nav>
  );
};

export default Sidebar;
