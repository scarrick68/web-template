import { useMemo } from "react";

export default function Page() {
  const confirmationSuccess = useMemo(() => {
    if (typeof window === "undefined") return false;
    const params = new URLSearchParams(window.location.search);
    return params.get("account_confirmation_success") === "true";
  }, []);

  return (
    <div className="mx-auto max-w-xl">
      <div className="card border border-success/30 bg-base-100 shadow-sm">
        <div className="card-body p-6 md:p-8">
          <div className="badge badge-success badge-outline">Email confirmed</div>
          <h1>{confirmationSuccess ? "Your account is confirmed" : "Confirmation complete"}</h1>
          <p className="text-base-content/80">
            Your email has been verified. You can now sign in with the account credentials you created.
          </p>
          <div className="card-actions mt-2 flex-wrap gap-2">
            <a href="/signin" className="btn btn-primary">
              Continue to sign in
            </a>
            <a href="/signup" className="btn btn-outline">
              Back to sign up
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
