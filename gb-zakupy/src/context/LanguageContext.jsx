import { createContext, useContext, useEffect, useState } from "react";

const LanguageContext = createContext();

const DEFAULT_LANGUAGE = "pl";

const AVAILABLE_LANGUAGES = [
    "pl",
    "en",
    "ua"
];

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

        localStorage.setItem(
            "gb-language",
            language
        );

    }, [language]);

    function setLanguage(newLanguage) {

        if (
            !AVAILABLE_LANGUAGES.includes(newLanguage)
        ) {
            return;
        }

        setLanguageState(newLanguage);

    }

    return (

        <LanguageContext.Provider

            value={{

                language,

                setLanguage,

                languages: AVAILABLE_LANGUAGES

            }}

        >

            {children}

        </LanguageContext.Provider>

    );

}

export function useLanguage() {

    return useContext(LanguageContext);

}
