
import { useState, useEffect } from 'react';
import { NavLink, useLocation, Link } from 'react-router-dom';
import { LOCAL_URL } from '../../Auth/config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPowerOff } from '@fortawesome/free-solid-svg-icons';
import useAuth from "../../Auth/useAuth";


const NavbarCajero = () => {
  const auth = useAuth()

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Efecto para cambiar el estilo al hacer scroll
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cerrar menú al cambiar de ruta
  useEffect(() => setIsMobileMenuOpen(false), [location]);

  return (
    <nav className={` nav-main ${isScrolled ? 'nav-scrolled' : ''}`}>
      <div className="nav-container">
        <NavLink to={LOCAL_URL + "/mivimientos"} className="nav-brand d-flex align-items-center">
          {/* Logo Principal */}
          {/* <span style={{ fontSize: '24px', marginRight: '8px' }}>👔</span> */}

          {/* Contenedor de Texto */}
          <div className="d-flex flex-column justify-content-start" style={{ lineHeight: '1' }}>
            <span className="brand-text fw-bold">
              KR<span className="text-primary">ESTUDIOS {`.   `}</span>
            </span>
            <div className="user-info-brand" style={{ marginTop: '-2px' }}>
              <span className="text-muted text-uppercase" style={{ fontSize: '9px', fontWeight: '700' }}>
                {localStorage.getItem('rol')}
              </span>
              <span className="text-muted" style={{ fontSize: '9px', margin: '0 3px' }}>|</span>
              <span className="text-dark" style={{ fontSize: '9px', fontWeight: '500' }}>
                {localStorage.getItem('nombre')}
              </span>
            </div>
          </div>
        </NavLink>

        {/* Desktop Menu */}
        <ul className="nav-menu-desktop">
          <li><NavLink to={LOCAL_URL + "/movimientos"} end className="nav-link-item">Movimientos</NavLink></li>

          <div className="nav-item-container has-submenu">
            <NavLink to="#" className="nav-link-item" onClick={(e) => e.preventDefault()}>
              Boletas <span className="arrow">▼</span>
            </NavLink>
            <ul className="submenu-list">
              <li><NavLink to={LOCAL_URL + "/nueva-boleta"} className="submenu-link">Crear Boleta</NavLink></li>
              <li><NavLink to={LOCAL_URL + "/boletas"} className="submenu-link">Listar Boletas</NavLink></li>
            </ul>
          </div>
          <div className="nav-item-container has-submenu">
            <NavLink to="#" className="nav-link-item" onClick={(e) => e.preventDefault()}>
              Honorarios <span className="arrow">▼</span>
            </NavLink>
            <ul className="submenu-list">
              <li><NavLink to={LOCAL_URL + "/cajero/guardar-honorario"} className="submenu-link">Registrar Honorario</NavLink></li>
              <li><NavLink to={LOCAL_URL + "/cajero/listar-honorarios"} className="submenu-link">Listar Honorarios</NavLink></li>
            </ul>
          </div>
          <div className="nav-item-container has-submenu">
            <NavLink to="#" className="nav-link-item" onClick={(e) => e.preventDefault()}>
              Clientes <span className="arrow">▼</span>
            </NavLink>
            <ul className="submenu-list">
              <li><NavLink to={LOCAL_URL + "/cajero/nuevo-cliente"} className="submenu-link">Nuevo Cliente</NavLink></li>
              <li><NavLink to={LOCAL_URL + "/cajero/lista-clientes"} className="submenu-link">Listar Clientes</NavLink></li>
            </ul>
          </div>
          <div className="nav-item-container has-submenu">
            <NavLink to="#" className="nav-link-item" onClick={(e) => e.preventDefault()}>
              Tramites <span className="arrow">▼</span>
            </NavLink>
            <ul className="submenu-list">
              <li><NavLink to={LOCAL_URL + "/cajero/nuevo-tramite"} className="submenu-link">Nuevo Trámite</NavLink></li>
              <li><NavLink to={LOCAL_URL + "/cajero/lista-tramites"} className="submenu-link">Lista Tramites</NavLink></li>
            </ul>
          </div>
          <div className="nav-item-container has-submenu">
            <NavLink to="#" className="nav-link-item" onClick={(e) => e.preventDefault()}>
              Reportes <span className="arrow">▼</span>
            </NavLink>
            <ul className="submenu-list">
              <li><NavLink to={LOCAL_URL + "/reportes-por-tramite"} className="submenu-link">Por Trámite</NavLink></li>
              <li><NavLink to={LOCAL_URL + "/reportes-consolidado"} className="submenu-link">Consolidado</NavLink></li>
              <li><NavLink to={LOCAL_URL + "/cajero/reporte-honorarios"} className="submenu-link">Honorarios</NavLink></li>

            </ul>
          </div>
          <div className="nav-item-container has-submenu">
            <NavLink to="#" className="nav-link-item btn-nav-profile" onClick={(e) => e.preventDefault()}>
              Mi Perfil
            </NavLink>
            <ul className="submenu-list mt-4">
              <li><NavLink to={"#"} className="submenu-link" onClick={() => auth.logout()}>Cerrar sesion <FontAwesomeIcon icon={faPowerOff} /></NavLink></li>
              <li><NavLink to={LOCAL_URL + "/perfil"} className="submenu-link">Perfil</NavLink></li>
            </ul>
          </div>
        </ul>



        {window.innerWidth < 1200 ? <>
          {/* Mobile Toggle */}
          <button
            className={`nav-toggle ${isMobileMenuOpen ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </button>

          {/* Mobile Overlay Menu */}
          <div className={`nav-menu-mobile ${isMobileMenuOpen ? 'open' : ''}`}>
            <NavLink to={LOCAL_URL + "/movimientos"} className="mobile-link">Movimientos</NavLink>

            <div className="nav-item-container has-submenu">
              <NavLink to="#" className="nav-link-item" onClick={(e) => e.preventDefault()}>
                Boletas <span className="arrow">▼</span>
              </NavLink>
              <ul className="submenu-list">
                <li><NavLink to={LOCAL_URL + "/nueva-boleta"} className="submenu-link">Nueva Boleta</NavLink></li>
                <li><NavLink to={LOCAL_URL + "/boletas"} className="submenu-link">Lista Boletas</NavLink></li>
              </ul>
            </div>
            <div className="nav-item-container has-submenu">
              <NavLink to="#" className="nav-link-item" onClick={(e) => e.preventDefault()}>
                Honorarios <span className="arrow">▼</span>
              </NavLink>
              <ul className="submenu-list">
                <li><NavLink to={LOCAL_URL + "/cajero/guardar-honorario"} className="submenu-link">Registrar Honorario</NavLink></li>
                <li><NavLink to={LOCAL_URL + "/cajero/listar-honorarios"} className="submenu-link">Listar Honorarios</NavLink></li>
              </ul>
            </div>
            <div className="nav-item-container has-submenu">
              <NavLink to="#" className="nav-link-item" onClick={(e) => e.preventDefault()}>
                Clientes <span className="arrow">▼</span>
              </NavLink>
              <ul className="submenu-list">
                <li><NavLink to={LOCAL_URL + "/cajero/nuevo-cliente"} className="submenu-link">Nuevo Cliente</NavLink></li>
                <li><NavLink to={LOCAL_URL + "/cajero/lista-clientes"} className="submenu-link">Lista Clientes</NavLink></li>
              </ul>
            </div>
            <div className="nav-item-container has-submenu">
              <NavLink to="#" className="nav-link-item" onClick={(e) => e.preventDefault()}>
                Tramites <span className="arrow">▼</span>
              </NavLink>
              <ul className="submenu-list">
                <li><NavLink to={LOCAL_URL + "/cajero/nuevo-tramite"} className="submenu-link">Nuevo Trámite</NavLink></li>
                <li><NavLink to={LOCAL_URL + "/cajero/lista-tramites"} className="submenu-link">Lista Tramites</NavLink></li>
              </ul>
            </div>

            <div className="nav-item-container has-submenu">
              <NavLink to="#" className="nav-link-item" onClick={(e) => e.preventDefault()}>
                Reportes <span className="arrow">▼</span>
              </NavLink>
              <ul className="submenu-list">
                <li><NavLink to={LOCAL_URL + "/reportes-por-tramite"} className="submenu-link">Por Trámite</NavLink></li>
                <li><NavLink to={LOCAL_URL + "/reporte-consolidado"} className="submenu-link">Consolidado</NavLink></li>
                <li><NavLink to={LOCAL_URL + "/cajero/reporte-honorarios"} className="submenu-link">Honorarios</NavLink></li>

              </ul>
            </div>

            <NavLink to={LOCAL_URL + "/cajero/reportes"} className="mobile-link">Reportes</NavLink>
            <div className="nav-item-container has-submenu mt-4" >
              <NavLink to={'#'} className="mobile-link profile" onClick={(e) => e.preventDefault()} >Mi Perfil</NavLink>
              <ul className="submenu-list mt-4">
                <li><NavLink to={"#"} className="submenu-link" onClick={() => auth.logout()}>Cerrar sesion <FontAwesomeIcon icon={faPowerOff} /> </NavLink> </li>
                <li><NavLink to={LOCAL_URL + "/perfil"} className="submenu-link">Perfil</NavLink></li>
              </ul>
            </div>
          </div>
        </> : null}
      </div>


    </nav>
  );
};

export default NavbarCajero;