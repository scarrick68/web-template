// https://vike.dev/Head

import logoUrl from "../assets/logo.svg";
import { usePageContext } from "vike-react/usePageContext";
import { defaultRobotsForPath, canonicalUrlForPath } from "../src/seo/seo.config";

export function Head() {
  const pageContext = usePageContext();
  const pathname = pageContext.urlPathname || "/";
  const canonicalHref = canonicalUrlForPath(pathname);
  const robotsContent = defaultRobotsForPath(pathname);

  return (
    <>
      <link rel="icon" href={logoUrl} />
      <link rel="canonical" href={canonicalHref} />
      <meta name="robots" content={robotsContent} />
    </>
  );
}
