import App from './App';
import './index.css';
import './mocks/browser';
import 'antd-form-with/dist/index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
