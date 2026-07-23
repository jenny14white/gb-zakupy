import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App.jsx";

/* ===============================
   CONTEXT
================================ */

import { ThemeProvider } from "./context/ThemeContext";
import { LanguageProvider } from "./context/LanguageContext";

/* ===============================
   GLOBALNE STYLE
================================ */

import "./styles/global.css";
import "./styles/theme.css";
import "./styles/switchers.css";

import "./styles/publicPage.css";
import "./styles/admin.css";

/* ===============================
   KALENDARZ
================================ */

import "./styles/calendar.css";
import "./styles/calendar-desktop.css";
import "./styles/calendar-mobile.css";

/* ===============================
   DOSTĘP + MENU
================================ */

import "./styles/access.css";
import "./styles/home.css";

ReactDOM.createRoot(
    document.getElementById("root")
).render(

    <React.StrictMode>

        <ThemeProvider>

            <LanguageProvider>

                <App />

            </LanguageProvider>

        </ThemeProvider>

    </React.StrictMode>

);
