import { createContext, useContext, useEffect, useState } from "react";
import i18n from "../i18n";

const LanguageContext = createContext();

const DEFAULT_LANGUAGE = "pl";

const AVAILABLE_LANGUAGES = ["pl", "en", "uk"];

export function LanguageProvider({ children }) {
    const [language, setLanguageState] = useState(() => {
        const savedLanguage = localStorage.getItem("gb-language");

        if (
            savedLanguage &&
            AVAILABLE_LANGUAGES.includes(savedLanguage)
        ) {
            return savedLanguage;
        }

        return DEFAULT_LANGUAGE;
    });

    useEffect(() => {
        i18n.changeLanguage(language);
        localStorage.setItem("gb-language", language);
    }, [language]);

    useEffect(() => {
        i18n.changeLanguage(language);
    }, []);

    const setLanguage = (newLanguage) => {
        if (!AVAILABLE_LANGUAGES.includes(newLanguage)) {
            return;
        }

        if (newLanguage === language) {
            return;
        }

        setLanguageState(newLanguage);
    };

    return (
        <LanguageContext.Provider
            value={{
                language,
                setLanguage,
                languages: AVAILABLE_LANGUAGES,
            }}
        >
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);

    if (!context) {
        throw new Error(
            "useLanguage must be used inside LanguageProvider"
        );
    }

    return context;
}
