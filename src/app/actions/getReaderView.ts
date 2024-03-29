"use server";
import { Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";
import { sanitise } from "@/sanitise";

const PROMPT = `
# Instructions
Can you provide a comprehensive summary of the given text?
The summary should cover all the key points and main ideas presented in the original text, while also condensing the information into a concise and easy-to-understand format.
Please ensure that the summary includes relevant details and examples that support the main ideas, while avoiding any unnecessary information or repetition.
The length of the summary should be roughly 1/3 of the original text or 50-100 words.
Use the text metadata to help you write the summary. Write the summary in the same language as the original text.

# Text metadata
Title : {{title}}
Sitename : {{sitename}}
Excerpt : {{excerpt}}
Lang : {{lang}}

# Text
{{content}}
`;

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

    const content = sanitise(article?.content ?? "");
    const text = (article?.textContent ?? "").trim();
    const lang = article?.lang;
    const title = article?.title;
    const sitename = article?.siteName;
    const excerpt = article?.excerpt;
    const prompt = PROMPT.replace("{{title}}", title || "Unknown")
      .replace("{{sitename}}", sitename || "Unknown")
      .replace("{{excerpt}}", excerpt || "Unknown")
      .replace("{{lang}}", lang || "Unknown")
      .replace("{{content}}", text)
      .trim();
    const data = {
      html: content,
      text,
      prompt,
    };

    return { status: "fulfilled", data };
  } catch (e) {
    console.error(e);
    return { status: "rejected", error: "Failed to get reader view" };
  }
}
