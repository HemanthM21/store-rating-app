import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const IconDashboard = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
  </svg>
);

const IconUsers = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const IconStore = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

const IconSecurity = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const IconSignOut = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const LogoMark = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <rect x="2" y="2" width="9" height="9" rx="2" />
    <rect x="13" y="2" width="9" height="9" rx="2" />
    <rect x="2" y="13" width="9" height="9" rx="2" />
    <rect x="13" y="13" width="9" height="9" rx="2" />
  </svg>
);

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const adminLinks = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: <IconDashboard /> },
    { to: '/admin/users', label: 'Users', icon: <IconUsers /> },
    { to: '/admin/stores', label: 'Stores', icon: <IconStore /> },
    { to: '/update-password', label: 'Security', icon: <IconSecurity /> },
  ];

  const ownerLinks = [
    { to: '/owner/dashboard', label: 'My Store', icon: <IconStore /> },
    { to: '/update-password', label: 'Security', icon: <IconSecurity /> },
  ];

  const userLinks = [
    { to: '/stores', label: 'Browse Stores', icon: <IconStore /> },
    { to: '/update-password', label: 'Security', icon: <IconSecurity /> },
  ];

  const links = user?.role === 'admin' ? adminLinks
    : user?.role === 'owner' ? ownerLinks
      : userLinks;

  const roleLabels = { admin: 'Administrator', owner: 'Store Owner', user: 'Member' };

  const initials = user?.name
    ?.split(' ')
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase() || 'RS';

  const roleClass = `role-${user?.role}`;

  return (
    <aside className="sidebar">

      <div className="sidebar-brand">
        <div className="sidebar-logo-wrap">
          <div className="sidebar-logo-mark">
            <LogoMark />
          </div>
          <div>
            <div className="sidebar-brand-name">
              Rate<span>Store</span>
            </div>
            <div className="sidebar-brand-tagline">Rating Platform</div>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
          >
            <span className="sidebar-link-icon">{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className={`sidebar-avatar ${roleClass}`}>{initials}</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">
              {user?.name?.split(' ').slice(0, 2).join(' ')}
            </div>
            <div className={`sidebar-user-role ${roleClass}`}>
              {roleLabels[user?.role]}
            </div>
          </div>
        </div>

        <button
          className="btn-sidebar-logout"
          onClick={() => { logout(); navigate('/login'); }}
        >
          <IconSignOut />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Navbar;
