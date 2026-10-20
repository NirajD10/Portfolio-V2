import type { Metadata } from "next";
import { PageStub } from "@/components/sections/PageStub";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = { title: "Wrong turn" };

/** 404 (04 · 404). The wrong-turn ride scene arrives in Phase 9. */
export default function NotFound() {
  return (
    <PageStub chip="404" lead="Wrong turn." phase="Phase 9">
      <p className="mb-8 text-body-lg text-ink-muted">
        This road doesn’t go anywhere — but the office is this way.
      </p>
      <Button href="/">Back to home</Button>
    </PageStub>
  );
}
