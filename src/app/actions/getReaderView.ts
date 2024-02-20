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
  | {
      status: "fulfilled";
      data: {
        html: string;
        text: string;
        prompt: string;
      };
    }
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

    const content = sanitize(article?.content ?? "");
    const text = (article?.textContent ?? "").trim();
    const lang = article?.lang;
    const title = article?.title;
    const sitename = article?.siteName;
    const excerpt = article?.excerpt;
    const data = {
      html: content,
      text,
      prompt:
        text.length > 50
          ? `Summarize the text delimited by triple quotes in 3 key points of roughly 15 words each.\nGive 1 actionable insight from the text.\n${
              sitename && `The text is from a site named ${sitename}`
            }.\n${title && `The text title is ${title}`}.\n${
              excerpt &&
              `The text excerpt provided by the site owner is "${excerpt}"`
            }.\n${
              lang && `The text language code is "${lang}"`
            }.\nIf I did not give you the language to use, detect the text's language and output the summary in the language detected.\nIf you can't detect the language, output the summary in english. Here is the text\n\n"""${text}"""`
          : "",
    };

    return { status: "fulfilled", data };
  } catch (e) {
    console.error(e);
    return { status: "rejected", error: "Failed to get reader view" };
  }
}
