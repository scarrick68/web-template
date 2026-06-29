import { useMemo } from "react";

export default function Page() {
  const email = useMemo(() => {
    if (typeof window === "undefined") return "";
    const params = new URLSearchParams(window.location.search);
    return params.get("email") || "";
  }, []);

  return (
    <div className="mx-auto max-w-xl">
      <div className="card border border-success/30 bg-base-100 shadow-sm">
        <div className="card-body p-6 md:p-8">
          <div className="badge badge-success badge-outline">Sign up successful</div>
          <h1>Check your email</h1>
          <p className="text-base-content/80">
            Your account was created. We sent a confirmation email{email ? ` to ${email}` : ""}.
          </p>
          <p className="text-base-content/80">
            Confirm your email before trying to sign in. After confirmation, you can use your credentials from the web
            client or call authenticated API routes.
          </p>
          <div className="card-actions mt-2 flex-wrap gap-2">
            <a href="/signup" className="btn btn-outline">
              Back to sign up
            </a>
            <a href="/signin" className="btn btn-primary">
              Continue to sign in
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
