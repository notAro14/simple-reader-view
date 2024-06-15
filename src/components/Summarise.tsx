"use client";
import { useState } from "react";
import { readStreamableValue } from "ai/rsc";

import toast from "react-hot-toast";
import { Text, TextField, IconButton, Button, Spinner } from "@radix-ui/themes";
import { XCircle, WandSparkles } from "lucide-react";

import z from "zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { summarise } from "src/actions/summarise";

const schema = z.object({
  url: z
    .string()
    .min(1, { message: "Can not be empty" })
    .url("Must be a valid URL"),
});
type FormDataSchema = z.infer<typeof schema>;

export function Summarise() {
  const [generation, setGeneration] = useState<string>("");
  const [isSummarizing, setIsSummarizing] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset: _reset,
  } = useForm<FormDataSchema>({ resolver: zodResolver(schema) });
  const reset = () => {
    _reset();
    setGeneration("");
  };

  const submit: SubmitHandler<FormDataSchema> = async ({ url }) => {
    if (isSummarizing) return;

    try {
      setGeneration("");
      setIsSummarizing(true);
      const res = await summarise(url);
      if (!res.ok) throw new Error(res.error);

      for await (const delta of readStreamableValue(res.data)) {
        setGeneration((currentGeneration) => `${currentGeneration}${delta}`);
      }
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "Oops, failed to get summary"
      );
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-4">
      <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-4">
        <Text as="label" htmlFor="url" className="flex flex-col gap-2">
          <span>Summarise web page content, paste the url and get a TLDR</span>
          <TextField.Root
            placeholder="https://example.com"
            id="url"
            type="url"
            size="3"
            {...register("url")}
          >
            <TextField.Slot>
              <IconButton
                onClick={() => reset()}
                type="button"
                variant="ghost"
                radius="full"
              >
                <XCircle size={"1em"} />
              </IconButton>
            </TextField.Slot>
          </TextField.Root>
          {errors.url && (
            <Text size={"1"} color="red" role="alert">
              {errors.url.message}
            </Text>
          )}
        </Text>
        <Button className="btn btn-outline w-full mt-4" type="submit">
          <Spinner loading={isSummarizing}>
            <WandSparkles size={"1em"} />
          </Spinner>
          {isSummarizing ? "🤖 bip bip..." : "TLDRify this"}
        </Button>
      </form>

      <article
        className="prose dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: generation }}
      />
    </div>
  );
}
