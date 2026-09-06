const posts = [
  {
    title: "Introducing the Northline web template",
    href: "/blog/demo-launch",
    date: "2026-07-23",
    excerpt:
      "A practical, conservative landing and product shell for SaaS, AI, and business apps that want speed without visual noise."
  }
];

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <section className="space-y-3">
        <h1>Blog</h1>
        <p className="text-base-content/75">
          Demo blog index for this template. This route is intentionally file-based and independent of optional CMS
          installation.
        </p>
      </section>

      <section className="space-y-4">
        {posts.map((post) => (
          <article key={post.href} className="rounded border border-base-300 bg-base-100 p-5 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-base-content/60">{post.date}</p>
            <h2 className="mt-1 text-2xl md:text-3xl">{post.title}</h2>
            <p className="mt-2 text-sm leading-6 text-base-content/75">{post.excerpt}</p>
            <a href={post.href} className="btn btn-ghost btn-sm mt-3 normal-case">Read post</a>
          </article>
        ))}
      </section>
    </div>
  );
}
