import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, Link } from 'react-router-dom';
import { LOCAL_URL } from '../../Auth/config';
import useAuth from "../../Auth/useAuth";
import { faPowerOff } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const NavbarAuxiliar = () => {
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

  // 1. Obtenemos el valor (ej: "KRESTUDIOS" o "ABOGADOS")
  const entidadCompleta = localStorage.getItem('entidad') || 'IGFinanzas';

  // 2. Extraemos las partes
  const iniciales = entidadCompleta.substring(0, 2); // Las primeras 2 letras
  const restoNombre = entidadCompleta.substring(2); // Todo lo demás desde la posición 2

  return (
    <nav className={` nav-main ${isScrolled ? 'nav-scrolled' : ''}`}>
      <div className="nav-container">
        <NavLink to={LOCAL_URL + "/"} className="nav-brand d-flex align-items-center">
          {/* Logo Principal */}
          {/* <span style={{ fontSize: '24px', marginRight: '8px' }}>👔</span> */}

          {/* Contenedor de Texto */}
          <div className="d-flex flex-column justify-content-start" style={{ lineHeight: '1' }}>
            <span className="brand-text fw-bold text-uppercase">
              {iniciales}
              <span className="text-primary">
                {restoNombre}
                {`.   `}
              </span>
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
          <li><NavLink to={LOCAL_URL + "/auxiliar/lista-caja"} className="nav-link-item">Salidas</NavLink></li>
          <div className="nav-item-container has-submenu">
            <NavLink to="#" className="nav-link-item" onClick={(e) => e.preventDefault()}>
              Reportes <span className="arrow">▼</span>
            </NavLink>
            <ul className="submenu-list">
              <li><NavLink to={LOCAL_URL + "/auxiliar/reportes-por-caja"} className="submenu-link">Por Caja</NavLink></li>
              <li><NavLink to={LOCAL_URL + "/auxiliar/reportes-consolidado"} className="submenu-link">Consolidado</NavLink></li>
            </ul>
          </div>
          <li className="nav-action">
            <div className="nav-item-container has-submenu">
              <NavLink to="#" className="nav-link-item btn-nav-profile" onClick={(e) => e.preventDefault()}>
                Mi Perfil
              </NavLink>
              <ul className="submenu-list mt-4">
                <li><NavLink to={"#"} className="submenu-link" onClick={() => auth.logout()}>Cerrar sesion <FontAwesomeIcon icon={faPowerOff} /></NavLink></li>
                <li><NavLink to={LOCAL_URL + "/perfil"} className="submenu-link">Perfil</NavLink></li>
              </ul>
            </div>
          </li>
        </ul>



        {window.innerWidth < 993 ? <>
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
            <NavLink to={LOCAL_URL + "/auxiliar/lista-caja"} className="mobile-link">Salidas</NavLink>
            <div className="nav-item-container has-submenu">
              <NavLink to="#" className="nav-link-item" onClick={(e) => e.preventDefault()}>
                Reportes <span className="arrow">▼</span>
              </NavLink>
              <ul className="submenu-list">
                <li><NavLink to={LOCAL_URL + "/auxiliar/reportes-por-tramite"} className="submenu-link">Por Trámite</NavLink></li>
                <li><NavLink to={LOCAL_URL + "/auxiliar/reportes-consolidado"} className="submenu-link">Consolidado</NavLink></li>
              </ul>
            </div>
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

export default NavbarAuxiliar;