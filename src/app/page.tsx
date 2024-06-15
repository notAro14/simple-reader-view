import { Heading } from "@radix-ui/themes";
import { Link } from "lucide-react";
import { Summarise } from "src/components/Summarise";

export default function Page() {
  return (
    <main className="flex flex-col gap-4">
      <Heading as="h1" className="flex items-center gap-2">
        <Link size="1em" />
        TLDRify
      </Heading>
      <Summarise />
    </main>
  );
}
