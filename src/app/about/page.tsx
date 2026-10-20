import type { Metadata } from "next";
import { PageStub } from "@/components/sections/PageStub";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return <PageStub chip="ABOUT" lead="I’m Niraj," dim="a full-stack developer from Pune." phase="Phase 3" />;
}
