import { GetReaderViewForm } from "@/app/components/GetReaderViewForm";

export default function Page() {
  return (
    <main className="p-10 prose mx-auto">
      <h1>Simple reader view</h1>
      <p>
        Enter a URL to get a simplified and decluttered view of a page&apos;s
        content. It is great for reading blog post without ads.
      </p>
      <GetReaderViewForm />
    </main>
  );
}
