import React from 'react';
import App from './App';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


// const router = createBrowserRouter([
//   {
//     path: '*',
//     element: <App />,
//   }
// ]);

const rootDiv = document.getElementById('root') as HTMLElement;
const root = createRoot(rootDiv);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      <App />
    </BrowserRouter>
  </React.StrictMode>
);