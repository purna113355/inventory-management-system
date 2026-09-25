import "./Navbar.css";

function Navbar({ title }) {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h2>{title}</h2>
      </div>

      <div className="navbar-menu">
        <button
          onClick={() => {
            document.getElementById("dashboard-section")?.scrollIntoView({
              behavior: "smooth",
            });
          }}
        >
          Dashboard
        </button>

        <button
          onClick={() => {
            document.getElementById("products-section")?.scrollIntoView({
              behavior: "smooth",
            });
          }}
        >
          Products
        </button>
      </div>

      <div className="navbar-logout">
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;