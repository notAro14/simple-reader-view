import DOMPurify from "dompurify";
import { JSDOM } from "jsdom";

export function sanitise(html: string): string {
  const jsDom = new JSDOM("");
  const purify = DOMPurify(jsDom.window);
  return purify.sanitize(html);
}
