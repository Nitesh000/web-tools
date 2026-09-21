import { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Search } from "lucide-react";
import clsx from "clsx";
import { ThemeToggle } from "../common/ThemeToggle";
import { SearchModal } from "./SearchModal";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Tools", href: "/#tools" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
];

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  const openSearch = useCallback(() => setIsSearchOpen(true), []);
  const closeSearch = useCallback(() => setIsSearchOpen(false), []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700 bg-white/80 backdrop-blur-lg dark:bg-gray-900/80">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex gap-2 items-center text-xl font-bold text-gray-900 dark:text-white"
          >
            <span className="flex justify-center items-center w-8 h-8 text-white bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
              W
            </span>
            <span className="hidden sm:inline">WebTools</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden gap-1 items-center md:flex">
            {NAV_LINKS.map((link) => {
              if (link.href.includes("#")) {
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    className={clsx(
                      "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                      isActive(link.href)
                        ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white",
                    )}
                  >
                    {link.label}
                  </a>
                );
              } else {
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={clsx(
                      "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                      isActive(link.href)
                        ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white",
                    )}
                  >
                    {link.label}
                  </Link>
                );
              }
            })}
          </div>

          {/* Right side actions */}
          <div className="flex gap-3 items-center">
            {/* Search button */}
            <button
              type="button"
              onClick={openSearch}
              className="hidden gap-2 items-center py-1.5 px-3 text-sm text-gray-500 rounded-lg border border-gray-200 sm:flex dark:text-gray-400 dark:border-gray-700 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200"
              aria-label="Search tools"
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
              <kbd className="py-0.5 px-1.5 ml-2 text-gray-400 rounded border border-gray-300 dark:border-gray-600 text-[10px]">
                ⌘K
              </kbd>
            </button>
            <button
              type="button"
              onClick={openSearch}
              className="p-2 text-gray-500 rounded-lg sm:hidden dark:text-gray-400 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200"
              aria-label="Search tools"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Theme toggle */}
            {/* <ThemeToggle size="sm" /> */}

            {/* GitHub link */}
            <a
              href="https://github.com/Nitesh000/web-tools"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden p-2 text-gray-500 rounded-lg sm:block dark:text-gray-400 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200"
              aria-label="GitHub"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
              </svg>
            </a>

            {/* Mobile menu button */}
            <button
              type="button"
              className="p-2 text-gray-500 rounded-lg md:hidden dark:text-gray-400 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="py-4 border-t border-gray-200 md:hidden dark:border-gray-700">
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={clsx(
                    "rounded-lg px-4 py-3 text-base font-medium transition-colors",
                    isActive(link.href)
                      ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white",
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <SearchModal open={isSearchOpen} onClose={closeSearch} />
    </nav>
  );
}

export default Navbar;
