import { usePageContext } from "vike-react/usePageContext";

export default function Page() {
  const { is404 } = usePageContext();
  if (is404) {
    return (
      <div className="mx-auto max-w-xl">
        <div className="card border border-base-300 bg-base-100 shadow-sm">
          <div className="card-body p-6 md:p-8">
            <h1>Page Not Found</h1>
            <div className="alert">
              <span>This page could not be found.</span>
            </div>
            <div className="card-actions mt-2">
              <a href="/" className="btn btn-primary">Go home</a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl">
      <div className="card border border-error/30 bg-base-100 shadow-sm">
        <div className="card-body p-6 md:p-8">
          <h1>Internal Error</h1>
          <div className="alert alert-error">
            <span>Something went wrong.</span>
          </div>
          <div className="card-actions mt-2">
            <a href="/" className="btn btn-outline">Go home</a>
          </div>
        </div>
      </div>
    </div>
  );
}
