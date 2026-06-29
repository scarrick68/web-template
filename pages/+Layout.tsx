import "./Layout.css";
import "./tailwind.css";
import { useEffect, useState } from "react";
import { Link } from "../components/Link";
import { AppQueryProvider } from "../src/query/provider";
import { getAuthTokens } from "../src/auth/tokenStore";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isSignedIn, setIsSignedIn] = useState(false);

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

  return (
    <AppQueryProvider>
      <div className="min-h-screen bg-base-200 text-base-content">
        <header className="sticky top-0 z-10 border-b border-base-300 bg-base-100/95 backdrop-blur">
          <div className="navbar mx-auto w-full max-w-6xl px-4">
            <div className="navbar-start gap-2">
              <div className="dropdown lg:hidden">
                <button type="button" tabIndex={0} className="btn btn-ghost btn-square" aria-label="Open navigation menu">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="h-5 w-5 stroke-current">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <ul tabIndex={0} className="menu dropdown-content z-[1] mt-3 w-56 rounded-box border border-base-300 bg-base-100 p-2 shadow">
                  <li><a href="/">Home</a></li>
                  <li><a href="/about">About</a></li>
                  {isSignedIn ? (
                    <li><a href="/me">Me</a></li>
                  ) : (
                    <>
                      <li><a href="/signup">Sign up</a></li>
                      <li><a href="/signin">Sign in</a></li>
                    </>
                  )}
                </ul>
              </div>
              <a href="/" className="btn btn-ghost px-2 text-base font-semibold normal-case" aria-label="Home">
                Northline Web Template
              </a>
            </div>

            <nav className="navbar-end hidden gap-1 lg:flex" aria-label="Primary">
              <Link href="/">Home</Link>
              <Link href="/about">About</Link>
              {isSignedIn ? (
                <Link href="/me">Me</Link>
              ) : (
                <>
                  <Link href="/signup">Sign up</Link>
                  <Link href="/signin">Sign in</Link>
                </>
              )}
            </nav>
          </div>
        </header>
        <Content>{children}</Content>
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
