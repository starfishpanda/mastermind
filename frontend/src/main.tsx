import './index.css';
import React from 'react';
import App from './App.jsx';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const rootDiv = document.getElementById('root') as HTMLElement;
const root = createRoot(rootDiv);
console.log(rootDiv);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      <App />
    </BrowserRouter>
  </React.StrictMode>
);