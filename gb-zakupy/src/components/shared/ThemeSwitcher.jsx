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

        function handleEscape(event) {

            if (event.key === "Escape") {

                setOpen(false);

            }

        }

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        document.addEventListener(
            "keydown",
            handleEscape
        );

        return () => {

            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );

            document.removeEventListener(
                "keydown",
                handleEscape
            );

        };

    }, []);

    const themes = [

        {
            id: "navy",
            name: "Navy",
            colors: [
                "#102A43",
                "#1E4D8C",
                "#4AA3FF",
                "#D8ECFF"
            ]
        },

        {
            id: "forest",
            name: "Forest",
            colors: [
                "#163020",
                "#2E7D32",
                "#66BB6A",
                "#D8F3DC"
            ]
        },

        {
            id: "gold",
            name: "Gold",
            colors: [
                "#7A5A00",
                "#C69200",
                "#FFD54F",
                "#FFF4CC"
            ]
        },

        {
            id: "crimson",
            name: "Crimson",
            colors: [
                "#5B0A18",
                "#A61E3C",
                "#E84A5F",
                "#FFD6DE"
            ]
        },

        {
            id: "blossom",
            name: "Cherry Blossom",
            colors: [
                "#B54E74",
                "#E98DB0",
                "#FFD5E5",
                "#FFF3F8"
            ]
        },

        {
            id: "violet",
            name: "Violet",
            colors: [
                "#41205F",
                "#6F42C1",
                "#A66CFF",
                "#EFE2FF"
            ]
        }

    ];

    return (

        <div
            className="theme-switcher"
            ref={menuRef}
        >

            <button
                type="button"
                className="theme-button"
                title="Choose theme"
                aria-label="Choose theme"
                onClick={() => setOpen((value) => !value)}
            >

                <span>🎨</span>

            </button>

            {

                open && (

                    <div className="theme-menu">

                        <div className="switcher-menu-title">

                            Theme

                        </div>

                        <div className="switcher-menu-divider" />

                        {

                            themes.map((item) => (

                                <button
                                    key={item.id}
                                    type="button"
                                    className={`theme-option ${theme === item.id ? "active" : ""}`}
                                    onClick={() => {

                                        setTheme(item.id);

                                        setOpen(false);

                                    }}
                                >

                                    <div className="theme-preview">

                                        {

                                            item.colors.map((color, index) => (

                                                <span
                                                    key={index}
                                                    className="theme-dot"
                                                    style={{
                                                        backgroundColor: color
                                                    }}
                                                />

                                            ))

                                        }

                                    </div>

                                    <span className="theme-name">

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
