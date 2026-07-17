import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

import './styles/global.css';
import './styles/publicPage.css';
import './styles/admin.css';

import './styles/calendar.css';
import './styles/calendar-desktop.css';
import './styles/calendar-mobile.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
