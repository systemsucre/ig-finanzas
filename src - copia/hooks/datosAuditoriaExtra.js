export const datosAuditoriaExtra = {
    screen_size: `${window.screen.width}x${window.screen.height}`,
    vistas_previas: window.history.length,
    user_timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
};