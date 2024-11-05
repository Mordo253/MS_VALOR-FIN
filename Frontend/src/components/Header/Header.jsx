import { useState } from 'react';
import { useLocation, Link } from "react-router-dom"; // Importar useLocation y Link
import './header.css';   
import { IoIosCloseCircle } from "react-icons/io";
import { TbGridDots } from "react-icons/tb";
import imglog from "../../assets/MS5.png";
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const [active, setActive] = useState('navBar');
  
  const location = useLocation(); // Obtener la ubicación actual
  
  // Ocultar el header en las rutas que comiencen con "/admin"
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  const showNav = () => {
    setActive('navBar activeNavbar');
  };

  const removeNavbar = () => {
    setActive('navBar');
  };

  return (
    <header className='navBarSection'>
      <nav className='header flex'>
        <div className="logoDiv">
          <Link to="/" className="logo flex">
            <img src={imglog} alt="Logo MS DE VALOR" className='logoImg' />
            <h1 className='titleLog'>MS DE VALOR</h1>
          </Link>
        </div>

        <div className={active}>
          <ul className="navLists flex">
            <li className="navItem">
              <Link className='navLink' to="/">INICIO</Link>
            </li>
            <li className="navItem">
              <Link className="navLink" to="/properties">INMUEBLES</Link>
            </li>
            <li className="navItem">
              <Link className="navLink" to="/cars">VEHÍCULOS</Link>
            </li>
            <li className="navItem">
              <Link className="navLink" to="/tools">HERRAMIENTAS</Link>
            </li>
            {isAuthenticated ? (
              <>
                <li className="navItem">
                  <Link className="navLink" to="/admin/dashboard">
                    Welcome {user?.username}
                  </Link>
                </li>
                <li className="navItem">
                  <Link className="btn" to="/" onClick={logout}>Logout</Link>
                </li>
              </>
            ) : null}
          </ul>

          <div onClick={removeNavbar} className="closeNavbar">
            <IoIosCloseCircle className='icon' />
          </div>
        </div>

        <div onClick={showNav} className="toggleNavbar">
          <TbGridDots className='icon' />
        </div>
      </nav>
    </header>
  );
};

export default Header;
