import {Link} from 'react-router-dom';

import Logo from '../../assets/img/logo.png';

import styles from './Navbar.module.css';

function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navbar_logo}>
        <img src={Logo} alt="Alugue Aqui" />
        <h2>Alugue Aqui</h2>
      </div>
      <ul>
        <li>
          <Link to="/">Alugar</Link>
        </li>
        <li>
          <Link to="/login">Entrar</Link>
        </li>
        <li>
          <Link to="/register">Cadastrar</Link>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar;