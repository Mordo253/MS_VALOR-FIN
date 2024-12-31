import { useState, useEffect } from 'react';
import { useLocation, Link } from "react-router-dom"; // Importar useLocation y Link
import './header.css';   
import { IoIosCloseCircle } from "react-icons/io";
import { TbGridDots } from "react-icons/tb";
import imglog from "../../assets/MS5.png";
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const [active, setActive] = useState('navBar');
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation(); // Obtener la ubicación actual

  // Manejar el scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cerrar el menú cuando cambia la ruta
  useEffect(() => {
    setActive(false);
  }, [location]);

  // Prevenir scroll cuando el menú está abierto en móvil
  useEffect(() => {
    if (active && window.innerWidth <= 768) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [active]);

  // Si estamos en una ruta "/admin", no mostramos el contenido del header
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  return isAdminRoute ? null : (
    <section className={`navBarSection ${scrolled ? 'scrolled' : ''}`}>
      <header className="header">
        <div className="logo">
          <Link to="/" className="logo flex">
            <img src={imglog} alt="Logo MS DE VALOR" className="logoImg" />
            <h1 className="titleLog">MS DE VALOR</h1>
          </Link>
        </div>

        <div className={`navBar ${active ? 'activeNavbar' : ''}`}>
          <ul className="navLists">
            <li className="navItem">
              <Link
                to="/"
                className={`navLink ${location.pathname === '/' ? 'active' : ''}`}
              >
                INICIO
              </Link>
            </li>
            <li className="navItem">
              <Link
                to="/properties"
                className={`navLink ${
                  location.pathname === '/properties' ? 'active' : ''
                }`}
              >
                INMUEBLES
              </Link>
            </li>
            <li className="navItem">
              <Link
                to="/cars"
                className={`navLink ${
                  location.pathname === '/cars' ? 'active' : ''
                }`}
              >
                VEHÍCULOS
              </Link>
            </li>
            <li className="navItem">
              <Link
                to="/tools"
                className={`navLink ${
                  location.pathname === '/tools' ? 'active' : ''
                }`}
              >
                HERRAMIENTAS
              </Link>
            </li>
            <li className="navItem">
              <Link
                to="/blog"
                className={`navLink ${
                  location.pathname === '/blog' ? 'active' : ''
                }`}
              >
              + DE MS DE VALOR 
              </Link>
            </li>
            {isAuthenticated ? (
              <>
                <li className="navItem">
                  <Link
                    className={`navLink ${
                      location.pathname === '/admin/dashboard' ? 'active' : ''
                    }`}
                    to="/admin/dashboard"
                  >
                    BIENVENIDO {user?.username}
                  </Link>
                </li>
                <li className="navItem">
                  <Link className="btn" to="/" onClick={logout}>
                    Logout
                  </Link>
                </li>
              </>
            ) : null}
          </ul>
        </div>

        <div onClick={() => setActive(!active)} className="toggleNavbar">
          {!active ? (
            <TbGridDots className="icon" />
          ) : (
            <IoIosCloseCircle className="icon" />
          )}
        </div>
      </header>
    </section>
  );
};

export default Header;


// import { useState } from 'react';
// import { useLocation, Link } from "react-router-dom"; // Importar useLocation y Link
// import './header.css';   
// import { IoIosCloseCircle } from "react-icons/io";
// import { TbGridDots } from "react-icons/tb";
// import imglog from "../../assets/MS5.png";
// import { useAuth } from '../../context/AuthContext';

// const Header = () => {
//   const { isAuthenticated, logout, user } = useAuth();
//   const [active, setActive] = useState('navBar');
  
//   const location = useLocation(); // Obtener la ubicación actual
  
//   // Ocultar el header en las rutas que comiencen con "/admin"
//   if (location.pathname.startsWith('/admin')) {
//     return null;
//   }

//   const showNav = () => {
//     setActive('navBar activeNavbar');
//   };

//   const removeNavbar = () => {
//     setActive('navBar');
//   };

//   return (
//     <header className='navBarSection'>
//       <nav className='header flex'>
//         <div className="logoDiv">
//           <Link to="/" className="logo flex">
//             <img src={imglog} alt="Logo MS DE VALOR" className='logoImg' />
//             <h1 className='titleLog'>MS DE VALOR</h1>
//           </Link>
//         </div>

//         <div className={active}>
//           <ul className="navLists flex">
//             <li className="navItem">
//               <Link className='navLink' to="/">INICIO</Link>
//             </li>
//             <li className="navItem">
//               <Link className="navLink" to="/properties">INMUEBLES</Link>
//             </li>
//             <li className="navItem">
//               <Link className="navLink" to="/cars">VEHÍCULOS</Link>
//             </li>
//             <li className="navItem">
//               <Link className="navLink" to="/tools">HERRAMIENTAS</Link>
//             </li>
//             {isAuthenticated ? (
//               <>
//                 <li className="navItem">
//                   <Link className="navLink" to="/admin/dashboard">
//                     Welcome {user?.username}
//                   </Link>
//                 </li>
//                 <li className="navItem">
//                   <Link className="btn" to="/" onClick={logout}>Logout</Link>
//                 </li>
//               </>
//             ) : null}
//           </ul>

//           <div onClick={removeNavbar} className="closeNavbar">
//             <IoIosCloseCircle className='icon' />
//           </div>
//         </div>

//         <div onClick={showNav} className="toggleNavbar">
//           <TbGridDots className='icon' />
//         </div>
//       </nav>
//     </header>
//   );
// };

// export default Header;