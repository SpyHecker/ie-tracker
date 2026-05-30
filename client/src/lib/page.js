import { useEffect } from "react";

export function usePageStyle(href) {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    link.dataset.routeStyle = "true";
    document.head.appendChild(link);

    return () => {
      link.remove();
    };
  }, [href]);
}

export function usePageTitle(title) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}
