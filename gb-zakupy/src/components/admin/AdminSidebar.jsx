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
}){

    function NavButton({
        tab,
        icon,
        label,
        counter=0,
        subtitle,
        onClick,
    }){

        const active =
            tab && activeTab===tab;

        return(
            <button
                className={
                    active
                    ?"sidebar-button active"
                    :"sidebar-button"
                }
                onClick={
                    onClick ||
                    (()=>setActiveTab(tab))
                }
            >

                {active && (
                    <span className="menu-indicator"/>
                )}

                <div className="sidebar-button-main">

                    <strong>
                        <span className="sidebar-icon">
                            {icon}
                        </span>

                        {label}
                    </strong>

                    {subtitle && (
                        <small>
                            {subtitle}
                        </small>
                    )}

                </div>

                {counter>0 && (
                    <span className="sidebar-counter">
                        {counter}
                    </span>
                )}

            </button>
        );
    }


    return(
        <aside className="sidebar">

            <div className="sidebar-top">

                <Logo className="sidebar-logo"/>

                <h2>
                    Panel administratora
                </h2>

                <p>
                    GB Zakupy
                    <br/>
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
                    tab="kalendarz"
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
