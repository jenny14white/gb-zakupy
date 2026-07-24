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
        const active = tab && activeTab === tab;

        return (
            <button
                className={active ? "active" : ""}
                onClick={onClick ?? (() => setActiveTab(tab))}
            >
                {active && <div className="menu-indicator" />}

                <div>
                    <strong>
                        {icon} {label}
                    </strong>

                    {subtitle && (
                        <small>
                            {subtitle}
                        </small>
                    )}
                </div>

                {counter > 0 && (
                    <span>{counter}</span>
                )}
            </button>
        );
    }

    return (
        <aside className="sidebar">
            <div className="sidebar-top">
                <Logo className="sidebar-logo" />

                <h2>Panel administratora</h2>

                <p>
                    GB Zakupy
                    <br />
                    Management Center
                </p>
            </div>

            <nav className="admin-nav">
                <NavButton
                    tab="lista"
                    icon="🛒"
                    label="Zakupy"
                    subtitle={`🟡 ${pendingCount} • 🟢 ${acceptedCount}`}
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
                    label="Dziennik"
                />

                <NavButton
                    icon="📅"
                    label="Kalendarz"
                    onClick={goToEvents}
                />
            </nav>

            <div className="sidebar-footer">
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
