import { name } from '../../Auth/config';
export const NavMenu = () => {
    return (
        <div className="d-flex flex-column justify-content-start" style={{ lineHeight: '1' }}>
            <span className="brand-text fw-bold">
                <span className="text-primary">{name}</span>
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
        </div>)
}