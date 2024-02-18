"use server";
import { Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";
import DOMPurify from "dompurify";

function sanitize(html: string) {
  const jsDom = new JSDOM("");
  const purify = DOMPurify(jsDom.window);
  return purify.sanitize(html);
}

export async function getReaderView(
  prevState: any,
  formData: FormData
): Promise<
  | { status: "fulfilled"; data: string }
  | { status: "rejected"; error: string }
  | { status: "idle" }
> {
  const url = formData.get("url") as string;
  try {
    const res = await fetch(url);

    if (!res.ok) {
      return { status: "rejected", error: "Request to external site failed" };
    }

    const contentType = res.headers.get("Content-Type");

    if (!contentType || !contentType.includes("text/html")) {
      return {
        status: "rejected",
        error: "Failed to get reader view, can not fetch non-html response",
      };
    }

    const html = await res.text();
    const jsDom = new JSDOM(html, { url });
    const doc = jsDom.window.document;

    const reader = new Readability(doc);
    const article = reader.parse();

    const data = sanitize(article?.content ?? "");
    return { status: "fulfilled", data };
  } catch (e) {
    console.error(e);
    return { status: "rejected", error: "Failed to get reader view" };
  }
}
