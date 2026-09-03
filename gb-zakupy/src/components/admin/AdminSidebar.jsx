import Logo from "../shared/Logo";

import SpotlightCard from "../shared/effects/SpotlightCard";

const ADMIN_UID =
    "kRulgEcxNed8aYacTWq3j9GgP4J2";

const SECRETARIAT_UID =
    "474lDJntS0agRKyLcnHTXfEf58n1";


export default function AdminSidebar({

    activeTab,
    setActiveTab,

    pendingCount = 0,
    acceptedCount = 0,
    completedCount = 0,
    unreadNotificationsCount = 0,

    goBack,
    logout,
    goToEvents,

    userUid,

}) {

    const isAdmin =
        userUid === ADMIN_UID;

    const isSecretariat =
        userUid === SECRETARIAT_UID;


    function NavButton({

        tab,
        icon,
        label,
        counter = 0,
        subtitle,
        onClick,

    }) {

        const active =
            tab &&
            activeTab === tab;


        return (
            <SpotlightCard
                className={`sidebar-card ${
                    active ? "active" : ""
                }`}
                spotlightColor="var(--accent)"
            >

                <button
                    type="button"
                    className={`sidebar-button ${
                        active ? "active" : ""
                    }`}
                    onClick={
                        onClick ??
                        (() => setActiveTab(tab))
                    }
                    aria-current={
                        active
                            ? "page"
                            : undefined
                    }
                >

                    {active && (
                        <span
                            className="menu-indicator"
                            aria-hidden="true"
                        />
                    )}


                    <div className="sidebar-button-main">

                        <strong>

                            <span
                                className="sidebar-icon"
                                aria-hidden="true"
                            >
                                {icon}
                            </span>

                            <span>
                                {label}
                            </span>

                        </strong>


                        {subtitle && (
                            <small>
                                {subtitle}
                            </small>
                        )}

                    </div>


                    {counter > 0 && (
                        <span
                            className={`sidebar-counter ${
                                tab === "powiadomienia"
                                    ? "notification-counter"
                                    : ""
                            }`}
                        >
                            {counter}
                        </span>
                    )}

                </button>

            </SpotlightCard>
        );
    }


    return (

        <aside className="sidebar">


            {/* HEADER */}

            <div className="sidebar-top">

                <Logo
                    className="sidebar-logo"
                />

                <h2>
                    Panel Zarządzania
                </h2>

                <p>
                   
                    <br />
                   
                </p>

            </div>


            {/* MENU */}

            <nav
                className="admin-nav"
                aria-label="Nawigacja administratora"
            >

                <NavButton
                    tab="lista"
                    icon="🛒"
                    label="Zakupy"
                    subtitle={
                        `🟡 ${pendingCount} • 🟢 ${acceptedCount}`
                    }
                />


                <NavButton
                    tab="powiadomienia"
                    icon="🔔"
                    label="Powiadomienia"
                    counter={
                        unreadNotificationsCount
                    }
                />


                <NavButton
                    tab="zrealizowane"
                    icon="✅"
                    label="Zrealizowane"
                />


                {/* TYLKO LILIANA */}

                {isAdmin && (
                    <NavButton
                        tab="dziennik"
                        icon="📜"
                        label="Dziennik"
                    />
                )}


                <NavButton
                    tab="kalendarz"
                    icon="📅"
                    label="Kalendarz"
                    onClick={goToEvents}
                />


                {/* TYLKO LILIANA */}

                {isAdmin && (
                    <NavButton
                        tab="uzytkownicy"
                        icon="👥"
                        label="Użytkownicy"
                    />
                )}

            </nav>


            {/* FOOTER */}

            <div className="sidebar-footer">

                <button
                    type="button"
                    className="return-button"
                    onClick={goBack}
                >
                    ← Wróć do aplikacji
                </button>


                <button
                    type="button"
                    className="logout-button"
                    onClick={logout}
                >
                    Wyloguj
                </button>

            </div>


        </aside>
    );
}
