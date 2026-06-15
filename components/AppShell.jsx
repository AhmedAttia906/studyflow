import Link from "next/link";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/profile", label: "Profile" },
  { href: "/calendar", label: "Calendar" },
  { href: "/rooms", label: "Rooms" },
  { href: "/settings", label: "Settings" },
];

export default function AppShell({ email, children }) {
  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <Link href="/dashboard" className="app-brand">
          StudyFlow
        </Link>
        <nav className="app-nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="app-nav-link">
              {item.label}
            </Link>
          ))}
        </nav>
        <p className="app-user-email">{email}</p>
      </aside>

      <header className="app-mobile-top">
        <Link href="/dashboard" className="app-brand">
          StudyFlow
        </Link>
      </header>

      <main className="app-content">{children}</main>

      <nav className="app-mobile-nav" aria-label="Mobile navigation">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} className="app-mobile-nav-link">
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
