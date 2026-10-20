import type { Metadata } from "next";
import { PageStub } from "@/components/sections/PageStub";

export const metadata: Metadata = { title: "Work" };

export default function WorkPage() {
  return <PageStub chip="WORK" lead="Things I’ve built" dim="and shipped." phase="Phase 3" />;
}
