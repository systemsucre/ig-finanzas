import { useState, useEffect } from 'react';
import { NavLink, useLocation, Link } from 'react-router-dom';
import { LOCAL_URL } from '../../Auth/config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAngleDoubleDown,
  faAngleDown,
  faChevronDown,
  faPowerOff,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import useAuth from '../../Auth/useAuth';
import { NavMenu } from './nav';

const NavbarCajero = () => {
  const auth = useAuth();

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
        <NavLink
          to={LOCAL_URL + '/mivimientos'}
          className="nav-brand d-flex align-items-center"
        >
          <NavMenu />
        </NavLink>

        {/* Desktop Menu */}
        <ul className="nav-menu-desktop">
          <li>
            <NavLink to={LOCAL_URL + '/dash-1'} end className="nav-link-item">
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to={LOCAL_URL + '/movimientos'} className="nav-link-item">
              Movimientos
            </NavLink>
          </li>



          <div className="nav-item-container has-submenu nav-link-item">
            <NavLink
              to="#"
              className="nav-link-item"
              onClick={(e) => e.preventDefault()}
            >
              Ingresos <FontAwesomeIcon icon={faChevronDown} />
            </NavLink>
            <ul className="submenu-list">
              <li>
                <NavLink
                  to={LOCAL_URL + '/nueva-boleta-ingreso'}
                  className="submenu-link"
                >
                  Registrar Ingresos
                </NavLink>
              </li>
              <li>
                <NavLink to={LOCAL_URL + '/boletas-ingreso'} className="submenu-link">
                  Listar Ingresos
                </NavLink>
              </li>
            </ul>
          </div>

          <div className="nav-item-container has-submenu nav-link-item">
            <NavLink
              to="#"
              className="nav-link-item"
              onClick={(e) => e.preventDefault()}
            >
              Gastos <FontAwesomeIcon icon={faChevronDown} />
            </NavLink>
            <ul className="submenu-list">
              <li>
                <NavLink
                  to={LOCAL_URL + '/nueva-boleta'}
                  className="submenu-link"
                >
                  Nuevo Gasto
                </NavLink>
              </li>
              <li>
                <NavLink to={LOCAL_URL + '/boletas'} className="submenu-link">
                  Listar gastos
                </NavLink>
              </li>
            </ul>
          </div>





          {/* 
          <div className="nav-item-container has-submenu">
            <NavLink
              to="#"
              className="nav-link-item"
              onClick={(e) => e.preventDefault()}
            >
              Cobros<FontAwesomeIcon icon={faChevronDown} />
            </NavLink>
            <ul className="submenu-list">
              <li>
                <NavLink
                  to={LOCAL_URL + '/cajero/nuevo-ingreso-directo/'}
                  className="submenu-link"
                >
                  Registar Pago
                </NavLink>

              </li>
              <li>
                <NavLink
                  to={LOCAL_URL + '/cajero/ingresos-directos'}
                  className="submenu-link"
                >
                  Listar ingresos
                </NavLink>
              </li>
            </ul>
          </div>


          <div className="nav-item-container has-submenu">
            <NavLink
              to="#"
              className="nav-link-item"
              onClick={(e) => e.preventDefault()}
            >
              Deudas <FontAwesomeIcon icon={faChevronDown} />
            </NavLink>
            <ul className="submenu-list">
              <li>
                <NavLink
                  to={LOCAL_URL + '/cajero/nuevo-ingreso-pendiente/'}
                  className="submenu-link"
                >
                  Registrar Deuda
                </NavLink>

              </li>
              <li>
                <NavLink
                  to={LOCAL_URL + '/cajero/ingresos-pendientes'}
                  className="submenu-link"
                >
                  Ver Deudas
                </NavLink>
              </li>
            </ul>
          </div> */}


          <div className="nav-item-container has-submenu">
            <NavLink
              to="#"
              className="nav-link-item"
              onClick={(e) => e.preventDefault()}
            >
              Empleador <FontAwesomeIcon icon={faChevronDown} />
            </NavLink>
            <ul className="submenu-list">
              <li>
                <NavLink
                  to={LOCAL_URL + '/cajero/nuevo-empleador'}
                  className="submenu-link"
                >
                  Nuevo Empleador
                </NavLink>
              </li>
              <li>
                <NavLink
                  to={LOCAL_URL + '/cajero/lista-empleadores'}
                  className="submenu-link"
                >
                  Listar Empleadores
                </NavLink>
              </li>
            </ul>
          </div>
          <div className="nav-item-container has-submenu">
            <NavLink
              to="#"
              className="nav-link-item"
              onClick={(e) => e.preventDefault()}
            >
              Cajas <FontAwesomeIcon icon={faChevronDown} />
            </NavLink>
            <ul className="submenu-list">
              <li>
                <NavLink
                  to={LOCAL_URL + '/cajero/nuevo-caja'}
                  className="submenu-link"
                >
                  Aperturar Caja
                </NavLink>
              </li>
              <li>
                <NavLink
                  to={LOCAL_URL + '/cajero/lista-cajas'}
                  className="submenu-link"
                >
                  Lista de Cajas
                </NavLink>
              </li>
            </ul>
          </div>
          <div className="nav-item-container has-submenu">
            <NavLink
              to="#"
              className="nav-link-item"
              onClick={(e) => e.preventDefault()}
            >
              Reportes <FontAwesomeIcon icon={faChevronDown} />
            </NavLink>
            <ul className="submenu-list">
              <li>
                <NavLink
                  to={LOCAL_URL + '/reportes-por-caja'}
                  className="submenu-link"
                >
                  Por Caja
                </NavLink>
              </li>
              <li>
                <NavLink
                  to={LOCAL_URL + '/reportes-consolidado'}
                  className="submenu-link"
                >
                  Consolidado
                </NavLink>
              </li>
              <li>
                <NavLink
                  to={LOCAL_URL + '/reporte-por-movimientos'}
                  className="submenu-link"
                >
                  Movimientos
                </NavLink>
              </li>
            </ul>
          </div>
          <div className="nav-item-container has-submenu">
            <NavLink
              to="#"
              className="nav-link-item btn-nav-profile"
              onClick={(e) => e.preventDefault()}
            >
              <FontAwesomeIcon icon={faUser} />
            </NavLink>
            <ul className="submenu-list mt-4">
              <li>
                <NavLink
                  to={'#'}
                  className="submenu-link"
                  onClick={() => auth.logout()}
                >
                  <FontAwesomeIcon icon={faPowerOff} /> Cerrar sesion{' '}
                </NavLink>
              </li>
              <li>
                <NavLink to={LOCAL_URL + '/perfil'} className="submenu-link">
                  <FontAwesomeIcon icon={faUser} /> Perfil
                </NavLink>
              </li>
            </ul>
          </div>
        </ul>

        {window.innerWidth < 1250 ? (
          <>
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
            <div
              className={`nav-menu-mobile ${isMobileMenuOpen ? 'open' : ''}`}
            >
              <NavLink to={LOCAL_URL + '/dash-1'} end className="mobile-link">
                Dashboard
              </NavLink>

              <NavLink to={LOCAL_URL + '/movimientos'} className="mobile-link">
                Movimientos
              </NavLink>
              <div className="nav-item-container has-submenu">
                <NavLink
                  to="#"
                  className="nav-link-item"
                  onClick={(e) => e.preventDefault()}
                >
                  Ingresos <FontAwesomeIcon icon={faChevronDown} />
                </NavLink>
                <ul className="submenu-list">
                  <li>
                    <NavLink
                      to={LOCAL_URL + '/nueva-boleta-ingreso'}
                      className="submenu-link"
                    >
                      Nuevo Ingreso
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to={LOCAL_URL + '/boletas-ingreso'}
                      className="submenu-link"
                    >
                      Listar Ingresos
                    </NavLink>
                  </li>
                </ul>
              </div>
              <div className="nav-item-container has-submenu">
                <NavLink
                  to="#"
                  className="nav-link-item"
                  onClick={(e) => e.preventDefault()}
                >
                  Gastos <FontAwesomeIcon icon={faChevronDown} />
                </NavLink>
                <ul className="submenu-list">
                  <li>
                    <NavLink
                      to={LOCAL_URL + '/nueva-boleta'}
                      className="submenu-link"
                    >
                      Nuevo Gasto
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to={LOCAL_URL + '/boletas'}
                      className="submenu-link"
                    >
                      Listar gastos
                    </NavLink>
                  </li>
                </ul>
              </div>
              {/* <div className="nav-item-container has-submenu">
                <NavLink
                  to="#"
                  className="nav-link-item"
                  onClick={(e) => e.preventDefault()}
                >
                  Cobros <FontAwesomeIcon icon={faChevronDown} />
                </NavLink>
                <ul className="submenu-list">
                  <li>
                    <NavLink
                      to={LOCAL_URL + '/cajero/nuevo-ingreso-directo/'}
                      className="submenu-link"
                    >
                      Registar Pago
                    </NavLink>

                  </li>
                  <li>
                    <NavLink
                      to={LOCAL_URL + '/cajero/ingresos-directos'}
                      className="submenu-link"
                    >
                      Listar ingresos
                    </NavLink>
                  </li>
                </ul>
              </div>

              <div className="nav-item-container has-submenu">
                <NavLink
                  to="#"
                  className="nav-link-item"
                  onClick={(e) => e.preventDefault()}
                >
                  Deudas <FontAwesomeIcon icon={faChevronDown} />
                </NavLink>
                <ul className="submenu-list">
                  <li>
                    <NavLink
                      to={LOCAL_URL + '/cajero/nuevo-ingreso-pendiente/'}
                      className="submenu-link"
                    >
                      Registrar Deuda
                    </NavLink>

                  </li>
                  <li>
                    <NavLink
                      to={LOCAL_URL + '/cajero/ingresos-pendientes'}
                      className="submenu-link"
                    >
                      Ver Deudas
                    </NavLink>
                  </li>
                </ul>
              </div> */}
              <div className="nav-item-container has-submenu">
                <NavLink
                  to="#"
                  className="nav-link-item"
                  onClick={(e) => e.preventDefault()}
                >
                  Empleadores <FontAwesomeIcon icon={faChevronDown} />
                </NavLink>
                <ul className="submenu-list">
                  <li>
                    <NavLink
                      to={LOCAL_URL + '/cajero/nuevo-empleador'}
                      className="submenu-link"
                    >
                      Nuevo Empleador
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to={LOCAL_URL + '/cajero/lista-empleadores'}
                      className="submenu-link"
                    >
                      Lista Empleadores
                    </NavLink>
                  </li>
                </ul>
              </div>
              <div className="nav-item-container has-submenu">
                <NavLink
                  to="#"
                  className="nav-link-item"
                  onClick={(e) => e.preventDefault()}
                >
                  Cajas <FontAwesomeIcon icon={faChevronDown} />
                </NavLink>
                <ul className="submenu-list">
                  <li>
                    <NavLink
                      to={LOCAL_URL + '/cajero/nuevo-caja'}
                      className="submenu-link"
                    >
                      Aperturar Caja
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to={LOCAL_URL + '/cajero/lista-cajas'}
                      className="submenu-link"
                    >
                      Lista Cajas
                    </NavLink>
                  </li>
                </ul>
              </div>

              <div className="nav-item-container has-submenu">
                <NavLink
                  to="#"
                  className="nav-link-item"
                  onClick={(e) => e.preventDefault()}
                >
                  Reportes <FontAwesomeIcon icon={faChevronDown} />
                </NavLink>
                <ul className="submenu-list">
                  <li>
                    <NavLink
                      to={LOCAL_URL + '/reportes-por-caja'}
                      className="submenu-link"
                    >
                      Por Caja
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to={LOCAL_URL + '/reportes-consolidado'}
                      className="submenu-link"
                    >
                      Consolidado
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to={LOCAL_URL + '/reporte-por-movimientos'}
                      className="submenu-link"
                    >
                      Movimientos
                    </NavLink>
                  </li>

                  {/* <li><NavLink to={LOCAL_URL + "/cajero/reporte-honorarios"} className="submenu-link">Honorarios</NavLink></li> */}
                </ul>
              </div>

              <div className="nav-item-container has-submenu mt-4">
                <NavLink
                  to={'#'}
                  className="mobile-link profile"
                  onClick={(e) => e.preventDefault()}
                >
                  <FontAwesomeIcon icon={faUser} /> Mi Perfil
                </NavLink>
                <ul className="submenu-list mt-4">
                  <li>
                    <NavLink
                      to={'#'}
                      className="submenu-link"
                      onClick={() => auth.logout()}
                    >
                      {' '}
                      <FontAwesomeIcon icon={faPowerOff} /> Cerrar sesion{' '}
                    </NavLink>{' '}
                  </li>
                  <li>
                    <NavLink
                      to={LOCAL_URL + '/perfil'}
                      className="submenu-link"
                    >
                      {' '}
                      <FontAwesomeIcon icon={faUser} /> Perfil
                    </NavLink>
                  </li>
                </ul>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </nav>
  );
};

export default NavbarCajero;
