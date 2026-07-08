import Logo from '../shared/Logo';

export default function AdminSidebar({
  activeTab,
  setActiveTab,
  pendingCount,
  orderedCount,
  unreadNotificationsCount,
  goBack,
  logout,
}) {
  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <Logo className="sidebar-logo" />
        <h2>Panel admina</h2>
      </div>

      <nav className="admin-nav">
        <button
          className={activeTab === 'lista' ? 'active' : ''}
          onClick={() => setActiveTab('lista')}
        >
          Lista zakupowa
          {pendingCount > 0 && <span>{pendingCount}</span>}
        </button>

        <button
          className={activeTab === 'powiadomienia' ? 'active' : ''}
          onClick={() => setActiveTab('powiadomienia')}
        >
          Powiadomienia
          {unreadNotificationsCount > 0 && (
            <span>{unreadNotificationsCount}</span>
          )}
        </button>

        <button
          className={activeTab === 'zrealizowane' ? 'active' : ''}
          onClick={() => setActiveTab('zrealizowane')}
        >
          Zrealizowane
          {orderedCount > 0 && <span>{orderedCount}</span>}
        </button>

        <button
          className={activeTab === 'dziennik' ? 'active' : ''}
          onClick={() => setActiveTab('dziennik')}
        >
          Dziennik zdarzeń
        </button>
      </nav>

      <button className="return-button" onClick={goBack}>
        Wróć do aplikacji
      </button>

      <button className="logout-button" onClick={logout}>
        Wyloguj
      </button>
    </aside>
  );
}
