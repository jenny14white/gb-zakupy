import React from "react";
import ReactDOM from "react-dom/client";

import "./i18n";

import App from "./App.jsx";

import { ThemeProvider } from "./context/ThemeContext";
import { LanguageProvider } from "./context/LanguageContext";


/*
====================================================
 GLOBAL
====================================================
*/

import "./styles/theme.css";
import "./styles/global.css";


/*
====================================================
 COMPONENTS
====================================================
*/

import "./styles/admin.css";

import "./styles/calendar.css";
import "./styles/calendar-desktop.css";
import "./styles/calendar-mobile.css";

import "./styles/publicPage.css";

import "./styles/home.css";

import "./styles/access.css";

import "./styles/switchers.css";



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
