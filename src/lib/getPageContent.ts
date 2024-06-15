import { Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";
import { sanitise } from "src/sanitise";

type GetPageContent = (url: string) => Promise<
  | {
      status: "fulfilled";
      data: {
        html: string;
        text: string;
      };
    }
  | { status: "rejected"; error: string }
>;

const ERRORS = {
  REQUEST_FAILED: "Request to page failed",
  NON_HTML_RESPONSE:
    "Failed to get page content, can not fetch non-html response",
  GET_CONTENT_FAILED: "Failed to get page content",
};

export const getPageContent: GetPageContent = async (url: string) => {
  try {
    const res = await fetch(url);
    if (!res.ok) return { status: "rejected", error: ERRORS.REQUEST_FAILED };

    const contentType = res.headers.get("Content-Type");
    if (!contentType || !contentType.includes("text/html"))
      return {
        status: "rejected",
        error: ERRORS.NON_HTML_RESPONSE,
      };

    const html = await res.text();
    const jsDom = new JSDOM(html, { url });
    const doc = jsDom.window.document;

    const reader = new Readability(doc);
    const article = reader.parse();

    const content = sanitise(article?.content ?? "");
    const text = (article?.textContent ?? "").trim();

    if (!content || !text)
      return { status: "rejected", error: ERRORS.GET_CONTENT_FAILED };

    const data = {
      html: content,
      text,
    };

    return { status: "fulfilled", data };
  } catch (e) {
    console.error(e);
    return { status: "rejected", error: ERRORS.GET_CONTENT_FAILED };
  }
};
