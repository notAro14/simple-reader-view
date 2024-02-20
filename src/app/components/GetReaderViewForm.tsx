"use client";
import { useFormState } from "react-dom";
import { getReaderView } from "@/app/actions/getReaderView";
import { SubmitButton } from "@/app/components/SubtmiButton";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { useEffect } from "react";
import toast from "react-hot-toast";

const initialState = { status: "idle" } as const;

export function GetReaderViewForm() {
  const [state, action] = useFormState(getReaderView, initialState);
  const { copy, copied } = useCopyToClipboard();
  useEffect(() => {
    copied && toast.success("Prompt copied");
  }, [copied]);
  return (
    <>
      <form className="flex flex-col gap-4" action={action}>
        <label
          htmlFor="url"
          className="input input-bordered flex items-center gap-2"
        >
          Website
          <input id="url" name="url" type="url" required className="grow" />
        </label>
        <SubmitButton>Simplify</SubmitButton>
        {state.status === "fulfilled" && state.data.prompt.length && (
          <button
            type="button"
            className="btn btn-outline w-full"
            onClick={() => copy(state.data.prompt)}
          >
            Copy prompt for summary
          </button>
        )}
      </form>
      {state.status === "fulfilled" && state.data.html.length ? (
        <article dangerouslySetInnerHTML={{ __html: state.data.html }} />
      ) : null}
      {state.status === "rejected" ||
        (state.status === "fulfilled" && state.data.html.length === 0 && (
          <div role="alert" className="alert alert-error mt-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Website&apos;s content could not be fetched.</span>
          </div>
        ))}
    </>
  );
}
