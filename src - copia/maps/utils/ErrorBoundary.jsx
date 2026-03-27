import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error capturado en ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '1rem', backgroundColor: '#ffe0e0', borderRadius: '8px' }}>
          <h3>⚠️ Algo salió mal</h3>
          <p>Este componente tuvo un problema. Podés recargar la página o revisar la consola para más detalles.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
