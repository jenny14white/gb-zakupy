import { useRef } from "react";
import "./SpotlightCard.css";

const SpotlightCard = ({
    children,
    className = "",
    spotlightColor = "var(--accent)",
}) => {
    const divRef = useRef(null);

    const handleMouseMove = (event) => {
        if (!divRef.current) {
            return;
        }

        const rect =
            divRef.current.getBoundingClientRect();

        const x =
            event.clientX - rect.left;

        const y =
            event.clientY - rect.top;

        divRef.current.style.setProperty(
            "--mouse-x",
            `${x}px`
        );

        divRef.current.style.setProperty(
            "--mouse-y",
            `${y}px`
        );

        divRef.current.style.setProperty(
            "--spotlight-color",
            spotlightColor
        );
    };

    const handleMouseLeave = () => {
        if (!divRef.current) {
            return;
        }

        divRef.current.style.removeProperty(
            "--mouse-x"
        );

        divRef.current.style.removeProperty(
            "--mouse-y"
        );
    };

    return (
        <div
            ref={divRef}
            className={`card-spotlight ${className}`.trim()}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {children}
        </div>
    );
};

export default SpotlightCard;
