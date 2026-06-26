// https://vike.dev/Head

import logoUrl from "../assets/logo.svg";
import { usePageContext } from "vike-react/usePageContext";
import { canonicalUrlForPath } from "../src/seo/seo.config";

export function Head() {
  const pageContext = usePageContext();
  const canonicalHref = canonicalUrlForPath(pageContext.urlPathname || "/");

  return (
    <>
      <link rel="icon" href={logoUrl} />
      <link rel="canonical" href={canonicalHref} />
    </>
  );
}
