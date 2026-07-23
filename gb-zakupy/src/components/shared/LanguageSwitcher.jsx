import { useEffect, useRef, useState } from "react";

import { useLanguage } from "../../context/LanguageContext";

import "../../styles/switchers.css";

export default function LanguageSwitcher() {

    const {
        language,
        setLanguage
    } = useLanguage();

    const [open, setOpen] = useState(false);

    const menuRef = useRef(null);

    useEffect(() => {

        function handleClickOutside(event) {

            if (
                menuRef.current &&
                !menuRef.current.contains(event.target)
            ) {
                setOpen(false);
            }

        }

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () =>
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );

    }, []);

    const languages = [

        {
            id: "pl",
            name: "Polski",
            flag: "🇵🇱"
        },

        {
            id: "en",
            name: "English",
            flag: "🇬🇧"
        },

        {
            id: "uk",
            name: "Українська",
            flag: "🇺🇦"
        }

    ];

    const current =
        languages.find(
            item => item.id === language
        ) || languages[0];

    return (

        <div
            className="language-switcher"
            ref={menuRef}
        >

            <button

                type="button"

                className="language-button"

                onClick={() =>
                    setOpen(prev => !prev)
                }

            >

                <span>{current.flag}</span>

                <span>

                    {current.id === "uk"
                        ? "UA"
                        : current.id.toUpperCase()}

                </span>

                <span>▼</span>

            </button>

            {

                open && (

                    <div className="language-menu">

                        {

                            languages.map(item => (

                                <button

                                    key={item.id}

                                    type="button"

                                    className={

                                        item.id === language

                                            ? "language-option active"

                                            : "language-option"

                                    }

                                    onClick={() => {

                                        setLanguage(item.id);

                                        setOpen(false);

                                    }}

                                >

                                    <span>

                                        {item.flag}

                                    </span>

                                    <span>

                                        {item.name}

                                    </span>

                                </button>

                            ))

                        }

                    </div>

                )

            }

        </div>

    );

}
