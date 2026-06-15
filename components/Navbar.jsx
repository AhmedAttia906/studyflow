export default function Navbar({ email, onLogout }) {
  return (
    <nav className="navbar">
      <h2>StudyFlow</h2>

      <div className="navbar-right">
        <span className="navbar-email">{email}</span>
        <button onClick={onLogout} className="btn btn-danger btn-sm">
          Logout
        </button>
      </div>
    </nav>
  );
}
