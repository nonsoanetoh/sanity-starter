import type { StructureBuilder } from "sanity/structure";
import { SINGLETON_IDS } from "./constants";

function singleton(S: StructureBuilder, opts: { title: string; schemaType: string; id: string }) {
  return S.listItem()
    .title(opts.title)
    .id(opts.id)
    .child(S.document().schemaType(opts.schemaType).documentId(opts.id));
}

export function buildStructure(S: StructureBuilder) {
  return S.list()
    .title("ACTTA Studio")
    .items([
      singleton(S, { title: "Homepage", schemaType: "page", id: SINGLETON_IDS.homepage }),
      S.listItem()
        .title("Pages")
        .child(
          S.documentTypeList("page").filter(
            `_type == "page" && _id != "${SINGLETON_IDS.homepage}" && _id != "drafts.${SINGLETON_IDS.homepage}"`,
          ),
        ),
      S.divider(),
      S.listItem().title("Articles").child(S.documentTypeList("article")),
      S.listItem().title("Article Categories").child(S.documentTypeList("articleCategory")),
      S.divider(),
      S.listItem().title("Form Submissions").child(S.documentTypeList("contactFormSubmission")),
      S.divider(),
      singleton(S, { title: "Site", schemaType: "site", id: SINGLETON_IDS.site }),
    ]);
}
