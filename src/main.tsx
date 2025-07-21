import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx' // Importa tu componente principal
// Si tienes un archivo CSS global, impórtalo aquí, por ejemplo:
// import './index.css' 

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)