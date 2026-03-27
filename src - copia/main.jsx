import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './app.jsx'
// import App from './Appventas.jsx'

import './index.css'


document.addEventListener('touchstart', () => { console.log('touchstart') }, { passive: true });
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
