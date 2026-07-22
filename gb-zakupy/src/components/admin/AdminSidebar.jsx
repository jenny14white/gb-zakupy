import Logo from '../shared/Logo';

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
  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <Logo className="sidebar-logo" />

        <h2>Panel administratora</h2>
      </div>

      <nav className="admin-nav">

        <button
          className={activeTab === 'lista' ? 'active' : ''}
          onClick={() => setActiveTab('lista')}
        >
          <div className="sidebar-item">
            <span>🛒 Zakupy</span>

            <small>
              🟡 {pendingCount} &nbsp;|&nbsp; 🟢 {acceptedCount}
            </small>
          </div>
        </button>

        <button
          className={activeTab === 'powiadomienia' ? 'active' : ''}
          onClick={() => setActiveTab('powiadomienia')}
        >
          <div className="sidebar-item">
            <span>🔔 Powiadomienia</span>

            {unreadNotificationsCount > 0 && (
              <strong className="sidebar-counter">
                {unreadNotificationsCount}
              </strong>
            )}
          </div>
        </button>

        <button
          className={activeTab === 'zrealizowane' ? 'active' : ''}
          onClick={() => setActiveTab('zrealizowane')}
        >
          <div className="sidebar-item">
            <span>✅ Zrealizowane</span>

            {completedCount > 0 && (
              <strong className="sidebar-counter">
                {completedCount}
              </strong>
            )}
          </div>
        </button>

        <button
          className={activeTab === 'dziennik' ? 'active' : ''}
          onClick={() => setActiveTab('dziennik')}
        >
          <div className="sidebar-item">
            <span>📜 Dziennik zdarzeń</span>
          </div>
        </button>

        <button onClick={goToEvents}>
          <div className="sidebar-item">
            <span>📅 Kalendarz firmowy</span>
          </div>
        </button>

      </nav>

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
    </aside>
  );
}
