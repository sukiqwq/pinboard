import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './styles/index.css';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { BoardProvider } from './context/BoardContext'; // Import BoardProvider

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <BoardProvider>
          <App />
        </BoardProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);