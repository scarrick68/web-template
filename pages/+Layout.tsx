import "./Layout.css";
import "./tailwind.css";
import { useEffect, useState } from "react";
import { Link } from "../components/Link";
import { AppQueryProvider } from "../src/query/provider";
import { getAuthTokens } from "../src/auth/tokenStore";

const OSS_REPO_URL = "https://github.com/scarrick68/web-template";
const OSS_DOCS_URL = "https://github.com/scarrick68/web-template/tree/main/docs";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const syncAuthState = () => {
      setIsSignedIn(Boolean(getAuthTokens()));
    };

    syncAuthState();
    window.addEventListener("storage", syncAuthState);

    return () => {
      window.removeEventListener("storage", syncAuthState);
    };
  }, []);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("site-theme");
    const nextTheme = storedTheme === "dark" ? "dark" : "light";
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    window.localStorage.setItem("site-theme", nextTheme);
  };

  return (
    <AppQueryProvider>
      <div className="min-h-screen bg-base-200 text-base-content">
        <header className="sticky top-0 z-20 border-b border-base-300 bg-base-100/95 backdrop-blur">
          <div className="navbar mx-auto w-full max-w-6xl px-4">
            <div className="navbar-start gap-2">
              <div className="dropdown lg:hidden">
                <button type="button" tabIndex={0} className="btn btn-ghost btn-square" aria-label="Open navigation menu">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="h-5 w-5 stroke-current">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <ul tabIndex={0} className="menu dropdown-content z-[1] mt-3 w-56 rounded-box border border-base-300 bg-base-100 p-2 shadow">
                  <li><a href="/#features">Features</a></li>
                  <li><a href="/pricing">Pricing</a></li>
                  <li><a href={OSS_DOCS_URL}>Documentation</a></li>
                  <li><a href="/blog">Blog</a></li>
                  <li><a href="/about">About</a></li>
                  {isSignedIn ? (
                    <li><a href="/me">Me</a></li>
                  ) : (
                    <>
                      <li><a href="/signin">Sign in</a></li>
                      <li><a href="/signup">Get started</a></li>
                    </>
                  )}
                </ul>
              </div>
              <a href="/" className="btn btn-ghost gap-2 px-2 text-base font-semibold normal-case" aria-label="Home">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded bg-primary text-xs font-bold text-primary-content">N</span>
                Northline
              </a>
            </div>

            <nav className="navbar-center hidden gap-1 lg:flex" aria-label="Primary navigation">
              <a href="/#features" className="btn btn-ghost btn-sm normal-case">Features</a>
              <a href="/pricing" className="btn btn-ghost btn-sm normal-case">Pricing</a>
              <a href={OSS_DOCS_URL} className="btn btn-ghost btn-sm normal-case">Documentation</a>
              <a href="/blog" className="btn btn-ghost btn-sm normal-case">Blog</a>
              <Link href="/about">About</Link>
            </nav>

            <div className="navbar-end hidden items-center gap-1 lg:flex">
              <button type="button" className="btn btn-ghost btn-sm" onClick={toggleTheme} aria-label="Toggle theme">
                {theme === "light" ? "Dark" : "Light"}
              </button>
              <a href={OSS_REPO_URL} className="btn btn-ghost btn-sm normal-case">GitHub</a>
              {isSignedIn ? (
                <Link href="/me">Me</Link>
              ) : (
                <Link href="/signin">Sign In</Link>
              )}
              <a href="/signup" className="btn btn-primary btn-sm normal-case">Get Started</a>
            </div>
          </div>
        </header>
        <Content>{children}</Content>
        <footer className="border-t border-base-300 bg-base-100">
          <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-10 md:grid-cols-3">
            <nav className="space-y-2">
              <h2 className="mb-1 text-base font-semibold">Project</h2>
              <a href="/" className="block text-sm text-base-content/80 hover:text-base-content">Home</a>
              <a href={OSS_DOCS_URL} className="block text-sm text-base-content/80 hover:text-base-content">Docs</a>
              <a href={OSS_REPO_URL} className="block text-sm text-base-content/80 hover:text-base-content">Changelog</a>
            </nav>
            <nav className="space-y-2">
              <h2 className="mb-1 text-base font-semibold">Community</h2>
              <a href={OSS_REPO_URL} className="block text-sm text-base-content/80 hover:text-base-content">GitHub</a>
              <a href="https://github.com/discussions" className="block text-sm text-base-content/80 hover:text-base-content">Discussions</a>
              <a href="#" className="block text-sm text-base-content/80 hover:text-base-content">Discord</a>
            </nav>
            <nav className="space-y-2">
              <h2 className="mb-1 text-base font-semibold">Legal</h2>
              <a href="#" className="block text-sm text-base-content/80 hover:text-base-content">License</a>
              <a href="#" className="block text-sm text-base-content/80 hover:text-base-content">Privacy</a>
            </nav>
          </div>
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-1 border-t border-base-300 px-4 py-4 text-xs text-base-content/70 md:flex-row md:items-center md:justify-between">
            <span>MIT License</span>
            <span>Copyright {new Date().getFullYear()} Northline</span>
          </div>
        </footer>
      </div>
    </AppQueryProvider>
  );
}

function Content({ children }: { children: React.ReactNode }) {
  return (
    <main id="page-container" className="mx-auto w-full max-w-6xl px-4 py-8 md:py-10">
      <div id="page-content" className="min-h-[calc(100vh-10rem)]">
        {children}
      </div>
    </main>
  );
}
