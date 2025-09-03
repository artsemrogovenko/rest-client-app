import { StrictMode } from 'react';
import { createRoot, type Container } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

const rootElement = document.getElementById('root') as Container;
createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
