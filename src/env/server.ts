import z from "zod";

const schema = z.object({
  OPENAI_API_KEY: z.string().trim().min(1),
});

export const envServer = schema.parse(process.env);
