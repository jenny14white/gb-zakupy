import Logo from "../shared/Logo";


export default function AdminSidebar({
    activeTab,
    setActiveTab,
    pendingCount,
    acceptedCount,
    completedCount,
    unreadNotificationsCount,
    goBack,
    logout,
    goToEvents,
}) {

    function NavButton({
        tab,
        icon,
        label,
        counter,
        subtitle,
        onClick,
    }) {

        const active =
            tab && activeTab === tab;

        return (

            <button
                className={active ? "active" : ""}
                onClick={
                    onClick ??
                    (() => setActiveTab(tab))
                }
            >

                <div className="sidebar-item">

                    <span>

                        {icon} {label}

                    </span>

                    {subtitle && (

                        <small>

                            {subtitle}

                        </small>

                    )}

                    {counter > 0 && (

                        <strong className="sidebar-counter">

                            {counter}

                        </strong>

                    )}

                </div>

            </button>

        );

    }

    return (

        <aside className="sidebar">

            <div className="sidebar-top">

                <Logo className="sidebar-logo" />

                <h2>

                    Panel administratora

                </h2>

            </div>

            <nav className="admin-nav">

                <NavButton
                    tab="lista"
                    icon="🛒"
                    label="Zakupy"
                    subtitle={`🟡 ${pendingCount} | 🟢 ${acceptedCount}`}
                />

                <NavButton
                    tab="powiadomienia"
                    icon="🔔"
                    label="Powiadomienia"
                    counter={unreadNotificationsCount}
                />

                <NavButton
                    tab="zrealizowane"
                    icon="✅"
                    label="Zrealizowane"
                    counter={completedCount}
                />

                <NavButton
                    tab="dziennik"
                    icon="📜"
                    label="Dziennik zdarzeń"
                />

                <NavButton
                    icon="📅"
                    label="Kalendarz firmowy"
                    onClick={goToEvents}
                />

            </nav>

            <div className="sidebar-bottom">

                <button
                    className="return-button"
                    onClick={goBack}
                >

                    ← Wróć do aplikacji

                </button>

                <button
                    className="logout-button"
                    onClick={logout}
                >

                    Wyloguj

                </button>

            </div>

        </aside>

    );

}
