"use server";

import { createStreamableValue } from "ai/rsc";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

import { envServer } from "src/env/server";
import { getPageContent } from "src/lib/getPageContent";

const TEMPLATE = `You are a world class commentator. Provide a summary of the text given by user according the followings rules:
- it should not include analogies or metaphors
- it should be written in a friendly and engaging tone
- it should be written as a list of 3 bullet points
- it should be written in the same language as the original text
- it must be 50 words long at most
- it should be written in HTML format using \`<ul>\` and \`<li>\` tags
- important keywords should be written in bold by using the \`<strong>\` tag
`;

const apiKey = envServer.OPENAI_API_KEY;

const chatModel = new ChatOpenAI({
  apiKey,
});
const prompt = ChatPromptTemplate.fromMessages([
  ["system", TEMPLATE],
  ["user", "{input}"],
]);
const outputParser = new StringOutputParser();
const llmChain = prompt.pipe(chatModel).pipe(outputParser);

export async function summarise(url: string) {
  "use server";
  const res = await getPageContent(url);
  if (res.status === "rejected")
    return { ok: false, error: res.error, data: null } as const;

  const stream = createStreamableValue("");

  const input = res.data.text;
  (async () => {
    const textStream = await llmChain.stream({ input });

    for await (const delta of textStream) {
      stream.update(delta);
    }

    stream.done();
  })();

  return { ok: true, data: stream.value, error: null } as const;
}
