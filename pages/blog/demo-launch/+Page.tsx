export default function Page() {
  return (
    <article className="mx-auto max-w-3xl space-y-6">
      <header className="space-y-3">
        <p className="text-xs uppercase tracking-wide text-base-content/60">July 23, 2026</p>
        <h1>Introducing the Northline web template</h1>
        <p className="text-base-content/75">
          This is a default demo blog post included in the open-source web template. It gives teams a real post layout to
          customize immediately.
        </p>
      </header>

      <section className="rounded border border-base-300 bg-base-100 p-6 shadow-sm">
        <h2>Why this default post exists</h2>
        <p>
          Teams usually need at least one realistic page to validate typography, spacing, metadata, and navigation. A
          default post gives you that baseline without requiring CMS setup first.
        </p>
        <p>
          This page is file-routed and does not depend on optional local CMS scaffolding. If CMS is added later, you can
          keep this route, migrate it, or replace it with content-managed pages.
        </p>
      </section>

      <section className="rounded border border-base-300 bg-base-100 p-6 shadow-sm">
        <h2>What to customize first</h2>
        <ul>
          <li>Update title, excerpt, and published date.</li>
          <li>Replace content sections with your product story.</li>
          <li>Add screenshots, code examples, or architecture diagrams.</li>
          <li>Link to docs and repository resources relevant to your audience.</li>
        </ul>
      </section>

      <footer className="pt-2">
        <a href="/blog" className="btn btn-outline btn-sm normal-case">Back to blog</a>
      </footer>
    </article>
  );
}
