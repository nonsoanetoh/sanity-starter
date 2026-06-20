import { revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";
import { parseBody } from "next-sanity/webhook";
import { env } from "~/env";

type WebhookPayload = {
  _id: string;
  _type: string;
  uri?: string;
  slug?: string;
};

function buildRevalidationTags(body: WebhookPayload): string[] {
  const docId = body._id.replace("drafts.", "");
  const tags = new Set<string>([body._type, `doc:${docId}`]);

  if (body.uri) {
    tags.add(body.uri);
    tags.add(`uri:${body.uri}`);
  }

  if (body.slug) {
    tags.add(`article:${body.slug}`);
  }

  return [...tags];
}

export async function POST(req: NextRequest) {
  if (!env.SANITY_REVALIDATE_SECRET) {
    return new Response("Revalidation not configured", { status: 501 });
  }

  const { isValidSignature, body } = await parseBody<WebhookPayload>(
    req,
    env.SANITY_REVALIDATE_SECRET,
  );

  if (!isValidSignature || !body?._id) {
    return new Response("Invalid signature", { status: 401 });
  }

  const tags = buildRevalidationTags(body);

  for (const tag of tags) {
    revalidateTag(tag);
  }

  return Response.json({ revalidated: true, tags });
}
