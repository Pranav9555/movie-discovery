import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";

const links = [
  { to: "/", label: "Home" },
  { to: "/search", label: "Search" },
  { to: "/wishlist", label: "Wishlist" },
];

const Navbar = () => {
  const { count } = useWishlist();
  const navigate = useNavigate();
  const [quickSearch, setQuickSearch] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    const query = quickSearch.trim();
    if (!query) return;
    navigate(`/search?query=${encodeURIComponent(query)}&page=1`);
    setQuickSearch("");
    setIsMenuOpen(false);
  };

  const linkClass = ({ isActive }) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
      isActive ? "bg-surfaceHover text-gold" : "text-slate-300 hover:text-white"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-edge bg-night/90 backdrop-blur">
      <div className="container-page flex h-16 items-center gap-4">
        <Link to="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
          <span className="text-gold" aria-hidden="true">
            ★
          </span>
          CineScope
        </Link>

        <nav aria-label="Main" className="ml-2 hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.to === "/"} className={linkClass}>
              {link.label}
              {link.to === "/wishlist" && count > 0 && (
                <span className="ml-1.5 rounded-full bg-gold px-1.5 py-0.5 text-xs font-bold text-night">
                  {count}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <form onSubmit={handleSubmit} className="ml-auto hidden w-64 lg:block">
          <label htmlFor="navbar-search" className="sr-only">
            Quick search
          </label>
          <input
            id="navbar-search"
            type="search"
            value={quickSearch}
            onChange={(event) => setQuickSearch(event.target.value)}
            placeholder="Quick search..."
            className="field"
          />
        </form>

        <button
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-expanded={isMenuOpen}
          aria-label="Toggle navigation menu"
          className="btn-ghost ml-auto px-3 md:hidden"
        >
          ☰
        </button>
      </div>

      {isMenuOpen && (
        <div className="border-t border-edge md:hidden">
          <nav aria-label="Mobile" className="container-page flex flex-col gap-1 py-3">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                className={linkClass}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
                {link.to === "/wishlist" && count > 0 ? ` (${count})` : ""}
              </NavLink>
            ))}
            <form onSubmit={handleSubmit} className="pt-2">
              <label htmlFor="mobile-search" className="sr-only">
                Search movies
              </label>
              <input
                id="mobile-search"
                type="search"
                value={quickSearch}
                onChange={(event) => setQuickSearch(event.target.value)}
                placeholder="Search movies..."
                className="field"
              />
            </form>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
