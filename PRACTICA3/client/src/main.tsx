import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext'; // Asumiendo que esta es tu ruta
import './index.css';
import App from './App';
import { CartProvider } from './context/CarteContext';

// TypeScript necesita saber que el elemento 'root' no es nulo
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('No se encontró el elemento root. Verifica tu index.html');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>


      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);