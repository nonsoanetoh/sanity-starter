import { map } from "rxjs";
import { type DocumentLocationResolver } from "sanity/presentation";

export const locate: DocumentLocationResolver = (params, context) => {
  const { type } = params;

  if (type === "homePage") {
    return { locations: [{ title: "Home", href: "/" }] };
  }

  if (type === "settings") {
    return { locations: [{ title: "All pages (settings change)", href: "/" }] };
  }

  if (type === "page") {
    return context.documentStore
      .listenQuery(
        `*[_id == $id || _id == "drafts." + $id][0]{ title, "slug": slug.current }`,
        { id: params.id },
        { perspective: "previewDrafts" },
      )
      .pipe(
        map((doc) => {
          if (!doc?.slug) return { locations: [] };
          return {
            locations: [
              {
                title: doc.title ?? doc.slug,
                href: `/${doc.slug}`,
              },
            ],
          };
        }),
      );
  }

  if (type === "post") {
    return context.documentStore
      .listenQuery(
        `*[_id == $id || _id == "drafts." + $id][0]{ title, "slug": slug.current }`,
        { id: params.id },
        { perspective: "previewDrafts" },
      )
      .pipe(
        map((doc) => {
          if (!doc?.slug) return { locations: [] };
          return {
            locations: [
              {
                title: doc.title ?? doc.slug,
                href: `/posts/${doc.slug}`,
              },
            ],
          };
        }),
      );
  }

  return null;
};
