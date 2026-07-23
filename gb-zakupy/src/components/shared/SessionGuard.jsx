import { useEffect } from "react";

import { logoutPortal } from "../../firebase/auth";

export default function SessionGuard({
    onLogout,
}) {

    useEffect(() => {

        const TIME = 10 * 60 * 1000;

        let timer = null;

        function logout() {

            sessionStorage.removeItem(
                "gbAccess"
            );

            sessionStorage.removeItem(
                "gbLastActivity"
            );

            logoutPortal()
                .catch((error) =>
                    console.error(error)
                );

            onLogout();

        }

        function refreshSession() {

            sessionStorage.setItem(
                "gbLastActivity",
                Date.now()
            );

            clearTimeout(timer);

            timer = setTimeout(() => {

                logout();

            }, TIME);

        }

        function checkExistingSession() {

            const lastActivity = Number(
                sessionStorage.getItem(
                    "gbLastActivity"
                )
            );

            if (!lastActivity) {

                refreshSession();

                return;

            }

            const inactiveTime =
                Date.now() - lastActivity;

            if (inactiveTime >= TIME) {

                logout();

            } else {

                timer = setTimeout(() => {

                    logout();

                }, TIME - inactiveTime);

            }

        }

        const events = [
            "mousemove",
            "mousedown",
            "keydown",
            "scroll",
            "touchstart",
        ];

        events.forEach((event) => {

            window.addEventListener(
                event,
                refreshSession,
                {
                    passive: true,
                }
            );

        });

        checkExistingSession();

        return () => {

            clearTimeout(timer);

            events.forEach((event) => {

                window.removeEventListener(
                    event,
                    refreshSession
                );

            });

        };

    }, [onLogout]);

    return null;

}
