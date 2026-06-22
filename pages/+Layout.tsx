import "./Layout.css";
import "./tailwind.css";
import { Link } from "../components/Link";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell">
      <header className="topbar">
        <a href="/" className="brand-mark" aria-label="Home">
          <span className="brand-dot" />
          <span className="brand-text">Northline Web Template</span>
        </a>
        <nav className="topnav" aria-label="Primary">
          <Link href="/">Home</Link>
          <Link href="/signup">Sign up</Link>
          <Link href="/signin">Sign in</Link>
          <Link href="/me">Me</Link>
        </nav>
      </header>
      <Content>{children}</Content>
    </div>
  );
}

function Content({ children }: { children: React.ReactNode }) {
  return (
    <main id="page-container" className="content-wrap">
      <div id="page-content" className="content-card">
        {children}
      </div>
    </main>
  );
}
