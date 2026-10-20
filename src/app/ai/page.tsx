import type { Metadata } from "next";
import { PageStub } from "@/components/sections/PageStub";

export const metadata: Metadata = { title: "AI Era" };

export default function AiPage() {
  return <PageStub chip="AI ERA" lead="AI in my workflow," dim="every working day." phase="Phase 8" />;
}
