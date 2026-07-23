import { useState, useRef, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";

import "./ThemeSwitcher.css";

export default function ThemeSwitcher() {

    const {
        theme,
        setTheme
    } = useTheme();

    const [open, setOpen] = useState(false);

    const menuRef = useRef(null);

    useEffect(() => {

        function handleClick(e) {

            if (
                menuRef.current &&
                !menuRef.current.contains(e.target)
            ) {
                setOpen(false);
            }

        }

        document.addEventListener(
            "mousedown",
            handleClick
        );

        return () =>
            document.removeEventListener(
                "mousedown",
                handleClick
            );

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
        }

    ];

    return (

        <div
            className="theme-switcher"
            ref={menuRef}
        >

            <button

                className="theme-button"

                onClick={() =>
                    setOpen(!open)
                }

                title="Motyw"

            >

                🎨

            </button>

            {

                open && (

                    <div className="theme-menu">

                        {

                            themes.map((item)=>(

                                <button

                                    key={item.id}

                                    className={

                                        item.id === theme

                                            ? "theme-option active"

                                            : "theme-option"

                                    }

                                    onClick={()=>{

                                        setTheme(item.id);

                                        setOpen(false);

                                    }}

                                >

                                    <span>

                                        {item.icon}

                                    </span>

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
