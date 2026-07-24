import { useState, useRef, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";

import "../../styles/switchers.css";

export default function ThemeSwitcher() {

    const { theme, setTheme } = useTheme();

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

        return () => {

            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );

        };

    }, []);

    const themes = [
        {
            id: "navy",
            name: "Navy",
            icon: "🌊"
        },
        {
            id: "forest",
            name: "Forest",
            icon: "🌿"
        },
        {
            id: "gold",
            name: "Gold",
            icon: "🥇"
        },
        {
            id: "crimson",
            name: "Crimson",
            icon: "❤️"
        },
        {
            id: "blossom",
            name: "Cherry Blossom",
            icon: "🌸"
        },
        {
            id: "violet",
            name: "Violet",
            icon: "💜"
        }
    ];

    return (

        <div
            className="theme-switcher"
            ref={menuRef}
        >

            <button
                className="theme-button"
                title="Choose theme"
                onClick={() => setOpen(!open)}
            >
                🎨
            </button>

            {

                open && (

                    <div className="theme-menu">

                        {

                            themes.map((item) => (

                                <button
                                    key={item.id}
                                    className={`theme-option ${theme === item.id ? "active" : ""}`}
                                    onClick={() => {

                                        setTheme(item.id);
                                        setOpen(false);

                                    }}
                                >

                                    <span>{item.icon}</span>

                                    {item.name}

                                </button>

                            ))

                        }

                    </div>

                )

            }

        </div>

    );

}
