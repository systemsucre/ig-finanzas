
import AuthProvider from './Auth/authProvider';

import AppRouter from './rutas/AppRouter'

function App() {
  return (
    <AuthProvider >
      <AppRouter /> 
    </AuthProvider>
  );
}
export default App;
 