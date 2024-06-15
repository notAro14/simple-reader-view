import { GetReaderViewForm } from "src/components/GetReaderViewForm";

export default function Page() {
  return (
    <main className="p-10 prose mx-auto">
      <h1>Super Simple Summary</h1>
      <p>
        Summarise any web page content. Just paste the URL 🔗 and get a summary
      </p>
      <GetReaderViewForm />
    </main>
  );
}
